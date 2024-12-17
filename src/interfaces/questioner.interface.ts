export type QuestionChoice = {
    name: string;
};

export type Question = {
    question: string;
    answer: number;
    inviteeAnswer: number | null;
    inviterAnswer: number | null;
    choices: QuestionChoice[];
};

export interface IQuestioner {
    connectionId: string;
    inviter: string;
    invitee: string;
    topic?:string,
    intro?:string,
    personToInviter: string;
    inviteeEmail: string;
    howOften: string;
    hasAccepted?: boolean;
    questions: Question[];
    isInviterDone: boolean;
    isInviteeDone: boolean;
    summary: string[];
}
