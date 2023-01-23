import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { Forms, Formsfire } from '../models/forms';
import { Question } from '../models/questions';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class FormsService {

constructor(
  public fs: Firestore,
    public auth: Auth,
    public storage: Storage,
) { }
//get forms
getForms(): Observable<Formsfire[]> {
  var ref = collection(this.fs, "forms");
  return collectionData(ref, { idField: 'id' }) as Observable<Formsfire[]>;
}
getQuestions(): Observable<Question[]> {
  var ref = collection(this.fs, "questions");
  return collectionData(ref, { idField: 'id' }) as Observable<Question[]>;
}
//create form
createForm(form: Forms) {
  var ref = collection(this.fs, "forms");
  return from(addDoc(ref, form));
}

//update form
updateForm(form, formId: string) {
  var ref = doc(this.fs, "forms", formId);
  return from(updateDoc(ref, form));
}
updatequestion(question, questionId: string) {
  var ref = doc(this.fs, "questions", questionId);
  return from(updateDoc(ref, question));
}

postQuestion(data: object) {
  var ref = collection(this.fs, "questions");
  return from(addDoc(ref, data));
}


//delete form
deleteForm(formId: string) {
  var ref = doc(this.fs, "forms", formId);
  return from(deleteDoc(ref));
}
QuestionListele() {
  var ref = collection(this.fs, "questions");
  return collectionData(ref, { idField: 'id' }) as Observable<Question[]>;
}

}
