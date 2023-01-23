import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Forms } from 'src/app/models/forms';
import { Option } from 'src/app/models/options';
import { Question } from 'src/app/models/questions';
import { FormsService } from 'src/app/services/forms.service';
import { QuestionType } from '../forms/forms.component';

@Component({
  selector: 'app-formdetail',
  templateUrl: './formdetail.component.html',
  styleUrls: ['./formdetail.component.scss']
})
export class FormdetailComponent implements OnInit {
  surveyForm!: FormGroup;
  form: any = {};
  formid: string;
  question_fire: Question[] = [];
  editMode = true;
  surveyTypes = [
    { id: 0, value: 'Training' },
    { id: 1, value: 'HR' }
  ];
  questions: QuestionType[] = [
    { value: 'Single choice', viewValue: 'Single choice' },
    { value: 'Multi choice', viewValue: 'Multi choice' },
    { value: 'Text', viewValue: 'Text' },
    { value: 'Rating', viewValue: 'Rating' }
  ];
  selectedOption = [];
  constructor(private route: ActivatedRoute, private formService: FormsService) { }

  ngOnInit() {
    this.QuestionListele();
    this.getForm()
    this.initForm();
  }
  initForm() {
    let surveyTitle = this.form.surveyTitle;
    let surveyType = this.form.surveyType;
    let surveyQuestions = new FormArray([]);
    
    this.surveyForm = new FormGroup({
      'surveyTitle': new FormControl(surveyTitle, [Validators.required]),
      'surveyType': new FormControl(surveyType, [Validators.required]),
      'surveyQuestions': surveyQuestions,
      'IsAnonymous': new FormControl(false, [Validators.required])
    });
    console.log("this.surveyForm",this.surveyForm);
    this.onAddQuestion();
  }
  
  getForm() {
    let id = this.route.snapshot.paramMap.get('id');
    this.formid = id;
    this.formService.getForms().pipe(
      tap(forms => this.form = forms.find(form => form.id == id))
      ).subscribe(() => {
        console.log("this.form",this.form);
        this.surveyForm.patchValue({
          surveyTitle: this.form.surveyTitle,
          surveyType: this.form.surveyType,
          IsAnonymous: this.form.IsAnonymous,
          surveyQuestions: this.form.surveyQuestions
      });
    }
    );
  }
    
    QuestionListele() {
      let id = this.route.snapshot.paramMap.get('id');
      this.formService.QuestionListele().subscribe(questions => {
        this.question_fire = questions.filter(question => question.ID == id);
        console.log("this.question_fire",this.question_fire);
    }
    );
  }
  onSubmit() {

    this.postSurvey();

  }
  postSurvey() {

    let formData = this.surveyForm.value;
    // console.log("formdata",formData);

    // console.log();
    let ID = this.formid;
    console.log("91-ID",ID);
    let Type = formData.surveyType;
    let Title = formData.surveyTitle;
    let IsDeleted = false;
    let IsAnonymous = formData.IsAnonymous;
    //  let Question: Question[] = [];
    let Questions: never[] = [];

    let surveyQuestions = formData.surveyQuestions;
    
    let optionArray = surveyQuestions[0].questionGroup ? (surveyQuestions[0].questionGroup.options ? surveyQuestions[0].questionGroup.options : []) : [];
    // let optionArray = formData.surveyQuestions[0].questionGroup.options[0].optionText
    let survey = new Forms(ID, Type, Title, IsDeleted, IsAnonymous, Questions);


    surveyQuestions.forEach((question: { questionType: any; questionTitle: any; questionGroup: { hasOwnProperty: (arg0: string) => any; showRemarksBox: boolean; options: any[]; }; }, index: any, array: any) => {


      let questionItem = {
        'ID': "",
        "Type": question.questionType,
        "Text": question.questionTitle,
        "options": Array<Option>(),
        "Required": false,
        "Remarks": "",
        "hasRemarks": false

      }
      if (question.questionGroup.hasOwnProperty('showRemarksBox')) {
        questionItem.hasRemarks = question.questionGroup.showRemarksBox;
      }


      if (question.questionGroup.hasOwnProperty('options')) {



        question.questionGroup.options.forEach((option: { optionText: any; }) => {
          let optionItem: Option = {
            "ID": "",
            "OptionText": option.optionText,
            "OptionColor": "",
            "hasRemarks": false

          }
          questionItem.options.push(optionItem)
        });
      }

 
      survey.Question.push(questionItem)


    });


    console.log(survey);
    console.log('posting survey');
    if (this.editMode) {
      console.log("148",formData);
      let data = Object.assign({}, formData);
      this.formService.updateForm(data,survey.ID.toString()).subscribe((response) => {
        console.log(response);
      }
      );
    }
    else {
      this.formService.createForm(formData).subscribe((response) => {
        console.log(response);
        console.log(response.id)
        survey.ID = response.id;
        let data = Object.assign({}, survey);
        this.formService.postQuestion(data).subscribe((response) => {
            console.log(response);
        });
      });
    }

  }

  onSeletQuestionType(questionType: string, index: any) {
    if (questionType === 'Single choice' || questionType === 'Multi choice') {
      this.addOptionControls(questionType, index)
    }
  }
  addOptionControls(questionType: any, index: string | number) {

    let options = new FormArray([]);
    let showRemarksBox = new FormControl(false);


    (this.surveyForm.controls['surveyQuestions']['controls'][index].controls.questionGroup).addControl('options', options);
    (this.surveyForm.controls['surveyQuestions']['controls'][index].controls.questionGroup).addControl('showRemarksBox', showRemarksBox);

    this.clearFormArray((<FormArray>this.surveyForm.controls['surveyQuestions']['controls'][index].controls.questionGroup.controls.options));

    this.addOption(index);
    this.addOption(index);
  }
  private clearFormArray(formArray: FormArray) {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  addOption(index: string | number) {
    const optionGroup = new FormGroup({
      'optionText': new FormControl('', Validators.required),
    });
    (<FormArray>this.surveyForm.controls['surveyQuestions']['controls'][index].controls.questionGroup.controls.options).push(optionGroup);
  }
  removeOption(questionIndex: string | number, itemIndex: number) {
    (<FormArray>this.surveyForm.controls['surveyQuestions']['controls'][questionIndex].controls.questionGroup.controls.options).removeAt(itemIndex);
  }
  onRemoveQuestion(index: number){
    this.surveyForm.controls['surveyQuestions']['controls'][index].controls.questionGroup = new FormGroup({});
    this.surveyForm.controls['surveyQuestions']['controls'][index].controls.questionType = new FormControl({});

    (<FormArray>this.surveyForm.get('surveyQuestions')).removeAt(index);
    this.selectedOption.splice(index,1)
    console.log(this.surveyForm);
  }
  onAddQuestion(){
    console.log(this.surveyForm);
   
    const surveyQuestionItem = new FormGroup({
      'questionTitle': new FormControl('', Validators.required),
      'questionType': new FormControl('', Validators.required),
      'questionGroup': new FormGroup({})
    });

    (<FormArray>this.surveyForm.get('surveyQuestions')).push(surveyQuestionItem);
  }

}
