/// <reference types="vite/client" />

type QuestionChoice = {
    name: string;
  };
  
  type Question = {
    question: string;
    answer: number;
    inviteeAnswer: number;
    inviterAnswer: number;
    choices: QuestionChoice[];
  };
  
  type QuestionArray = Question[];