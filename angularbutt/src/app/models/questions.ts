import { Option } from "./options";

export class Question {
    constructor( 
        public ID: string,
        public Type: string,
        public Text: string,
        public options: Option[],
        public Required: boolean,
        public Remarks: string,
        public hasRemarks : boolean,
        ){}
}
