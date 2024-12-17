import Mail from "../utils/mail";
import FileHandler from "../utils/fileHandler";
import MailOptions from "../utils/mailOption";
import QuestionerModel from "../model/invitation.model";
import { InvitationDto } from "../dto/invitation.dto";
import { FRONTEND_URL, OPEN_AI_API_KEY } from "../config";
import { ChooseTopicDto } from "../dto/choose-topic.dto";
import OpenAI from "openai";
import { CheckCompatibility } from "../dto/check-compatibility.dto";
import HttpException from "../utils/exception";
import { StatusCodes } from "http-status-codes";
import { Question } from "../interfaces/questioner.interface";

export default class InvitationService {
  private questionerModel = QuestionerModel;
  private openai = new OpenAI({ apiKey: OPEN_AI_API_KEY });

  public async invite(data: InvitationDto) {
    const createQuestionerGroup = await this.questionerModel.create(data);
    if (createQuestionerGroup) {
      await this.sendMail(
        data.inviteeEmail,
        `Hello you are invited to a compatibility as a ${data.personToInviter} by ${data.inviter}`,
        {
          file: "invitation.hbs",
          links: {
            ...data,
            link: `${FRONTEND_URL}/invitation?connectionId=${createQuestionerGroup.connectionId}&name=${createQuestionerGroup.invitee}&inviter=${createQuestionerGroup.inviter}`,
          },
        }
      );
    }
    return createQuestionerGroup;
  }

  async sendMail(
    email: string,
    title: string,
    options: {
      file: string;
      links: any;
    }
  ) {
    const emailTemplate = FileHandler.templateReader(`${options.file}`, {
      ...options.links,
    });
    await Mail.sendMail(
      new MailOptions(email, `${title}`, await emailTemplate)
    );
  }

  async chooseTopic(info: ChooseTopicDto) {
    const { connectionId, topic } = info;
    const questioner = await this.questionerModel.findOne({ connectionId });
    if (questioner) {
      const generatedQuestion = await this.generateQuestion(
        topic,
        questioner.personToInviter
      );
      const convertedQuestions = JSON.parse(generatedQuestion);
      questioner.questions = convertedQuestions.questions;
      questioner.topic = topic;
      questioner.intro = convertedQuestions.intro;
      await questioner?.save();
      const questions = questioner?.questions;
      return { topic, questions, intro: convertedQuestions.intro };
    }
  }

  async generateQuestion(topic: string, personToInviter: string) {
    {
      const prompt = `
      Generate a ${personToInviter} relationship quiz questions based on ${topic} along with four choices and 4 questions. The format should be:
      {
        questions:[ {
         question: "Your generated question here",
         answer: -1, // correct or most healthy answer index
         inviteeAnswer: null, // answer index chosen by invitee
         inviterAnswer: null, // answer index chosen by inviter
         choices: [
             { name: "Choice 1" },
             { name: "Choice 2" },
             { name: "Choice 3" },
             { name: "Choice 4" },
         ],
     },
     
  ],
intro:"a little introduction to the quiz"
}
  
the only thing to be returned is a plain  json without any formatting don't add any other text apart from the JSON
and NOTE the relationship between the invitee and inviter will always change during this conversation along with the names
`;

      let retries = 3;

      for (let i = 0; i < retries; i++) {
        const completion = await this.openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        });

        if (completion.choices[0]?.message?.content) {
          const generatedQuestion =
            completion.choices[0]?.message?.content.trim();
          return generatedQuestion;
        }
      }

      throw new Error("Failed to generate question after multiple attempts.");
    }
  }

  async compatibility(details: CheckCompatibility) {
    const { connectionId } = details;
    const questioner = await this.questionerModel.findOne({ connectionId });

    if (questioner) {
      if (questioner?.summary.length > 0) return questioner;
      if (!questioner.isInviterDone || !questioner.isInviteeDone) {
        throw new HttpException(
          StatusCodes.BAD_REQUEST,
          "not done with questioner"
        );
      }
      const generatedSummary = await this.compatibilitySummary(
        questioner.inviter,
        questioner.invitee,
        questioner.questions,
      );
      const summary = JSON.parse(generatedSummary);

      const updatedQuestioner = await this.questionerModel.findOneAndUpdate(
        { connectionId },
        { $set: { summary } },
        { new: true }
      );
      return updatedQuestioner;
    }
  }

  async compatibilitySummary(
    inviter: string,
    invitee: string,
    questions: Question[]
  ) {
    const prompt = `
        ${JSON.stringify(questions)}
        the inviter name is ${inviter} and the invitee's name is ${invitee}
        based on the array above only return a plain string JSON array not in a code block format containing two paragraphs  of how compatible the invitee and inviter are (it's more like you talking to them like a person). and add one more element to the JSON array which is a percentage of how compatible both of them are, the first paragraph will be for the inviter and the second will be for the invitee.  remember, DO NOT START A STATEMENT WITH ${inviter.toUpperCase()} OR ${invitee.toUpperCase()}, I REPEAT  DO NOT START A STATEMENT WITH ${inviter.toUpperCase()} OR ${invitee.toUpperCase()} and always return only JSON array of string also including the percentage of how compatible they are as the last element of the array
        
        content of statement :"address the person and then refer to the other person"
percentage format: "only percentage number, just a string number"`;

    console.log(prompt);

    let retries = 3;

    for (let i = 0; i < retries; i++) {
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      });

      if (completion.choices[0]?.message?.content) {
        const generatedQuestion =
          completion.choices[0]?.message?.content.trim();
        return generatedQuestion;
      }
    }

    throw new Error("Failed to generate question after multiple attempts.");
  }
}
