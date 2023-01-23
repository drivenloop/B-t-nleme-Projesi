import { Question } from "./questions";

export class Forms {
    constructor( 
        public ID: string,
        public Type : string,
        public Title: string,
        public IsDeleted: boolean,
        public IsAnonymous : boolean,
        public Question: Question[]
       
        ){}
}
export class Formsfire {
    id: string;
    IsAnonymous: boolean;
    surveyType: string;
    surveyTitle: string;
    surveyQuestions: Question[];
}
