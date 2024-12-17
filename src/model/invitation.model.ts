import { model, Schema } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import { IQuestioner, Question, QuestionChoice } from "../interfaces/questioner.interface";


const QuestionChoiceSchema = new Schema<QuestionChoice>({
    name: { type: String, required: true }
});

const QuestionSchema = new Schema<Question>({
    question: { type: String, required: true },
    answer: { type: Number, required: true },
    inviteeAnswer: { type: Schema.Types.Mixed, default: null }, 
    inviterAnswer: { type: Schema.Types.Mixed, default: null }, 
    choices: { type: [QuestionChoiceSchema], required: true }
});

const invitationSchema = new Schema<IQuestioner>({
    connectionId: {
        type: String,
        default: uuidv4(),
    },
    inviter: {
        type: String,
        required: true
    },
    invitee: {
        type: String,
        required: true
    },
    topic: {
        type: String,
    },
    intro: {
        type: String,
    },
    personToInviter: {
        type: String,
        required: true
    },
    inviteeEmail: {
        type: String,
        required: true
    },
    howOften: {
        type: String,
        required: true
    },
    hasAccepted: {
        type: Boolean,
        required: true,
        default: false
    },
    isInviterDone: {
        type: Boolean,
        required: true,
        default: false
    },
    isInviteeDone: {
        type: Boolean,
        required: true,
        default: false
    },
    questions: { type: [QuestionSchema], required: true, default: [] },
    summary: {
        type: [String],
        default: []
    }
})


const QuestionerModel = model<IQuestioner>("question", invitationSchema)
export default QuestionerModel