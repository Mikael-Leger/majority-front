import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { QuestionService } from 'src/app/services/question.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { User } from 'src/app/interfaces/user';
import { Question } from 'src/app/interfaces/question';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ToastService } from 'src/app/services/toast.service';
import { Toast } from 'src/app/enums/toasts.enum';
import { DeleteConfirmationDialog } from 'src/app/dialogs/delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css']
})
export class QuestionsListComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  questions: any;
  currentQuestion = null;
  currentIndex = -1;
  name = '';
  nameBool = true;

  displayedColumns: string[] = ['question', 'answer1', 'answer2', 'answer3', 'edit'];
  dataSource: MatTableDataSource<Question>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(public dialog: MatDialog, private toast: ToastService, private questionService: QuestionService, private router: Router, private authService: AuthService, private fb: FormBuilder) {
    this.form = fb.group({
      question_name: new FormControl(''),
      question_answer1: new FormControl(''),
      question_answer2: new FormControl(''),
      question_answer3: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated() || this.authService.isUser()) {
      this.router.navigateByUrl('/');

    }
    this.retrieveQuestions();

  }

  retrieveQuestions(): void {
    this.questionService.getAll().subscribe(questions => {
      const questionAdd = {
        question_name: 'Question',
        question_answer1: 'Answer 1',
        question_answer2: 'Answer 2',
        question_answer3: 'Answer 3'
      };
      questions.unshift(questionAdd);
      this.questions = questions;
      this.dataSource = new MatTableDataSource(this.questions);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

    });
  }

  refreshList(): void {
    this.retrieveQuestions();
    this.currentQuestion = null;
    this.currentIndex = -1;
  }

  setActiveQuestion(question, index): void {
    this.currentQuestion = question;
    this.currentIndex = index + (this.dataSource.paginator.pageIndex * this.dataSource.paginator.pageSize);

  }

  editQuestion(id: number): void {
    this.router.navigateByUrl('/questions/edit/' + id);

  }

  saveQuestion(): void {
    const question: Question = {
      question_name: this.form.get('question_name').value,
      question_answer1: this.form.get('question_answer1').value,
      question_answer2: this.form.get('question_answer2').value,
      question_answer3: this.form.get('question_answer3').value
    }

    this.questionService.create(question).subscribe((res) => {
      this.refreshList()
      if (res) {
        this.toast.show('Question added successfully', 'Questions', Toast.Success);
        this.form.reset();

      }
    });
  }

  addQuestion(): void {
    this.router.navigateByUrl('/questions/edit/0');

  }

  deleteQuestion(id: number): void {
    this.questionService.get(id).subscribe(question => {
      const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
        width: '250px',
        data: {question, id}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.refreshList();

      });
    })
  }

  removeQuestion(id: number): void {
    this.questionService.delete(id).subscribe(response => {
      this.refreshList();

    });
  }

  searchName(): void {
    this.questionService.findByName(this.name).subscribe(data => {
      this.questions = data;

    });
  }

  showEditName(type: String): void {
    this.nameBool = (this.nameBool) ? false : true;
    if (this.nameBool) {
      const input = document.querySelector("input.input-edit-" + type);
      input.setAttribute("hidden", "true");

      const submit = document.querySelector("button.button-submit-" + type);
      submit.setAttribute("hidden", "true");

      const button = document.querySelector("button.button-edit-" + type);
      button.removeAttribute("hidden");

    } else {
      const input = document.querySelector("input.input-edit-" + type);
      input.removeAttribute("hidden");

      const submit = document.querySelector("button.button-submit-" + type);
      submit.removeAttribute("hidden");

      const button = document.querySelector("button.button-edit-" + type);
      button.setAttribute("hidden", "true");

    }
  }

  updateName(type: String): void {
    const data = {
      question_name: this.currentQuestion.question_name,
      question_answer1: this.currentQuestion.question_answer1,
      question_answer2: this.currentQuestion.question_answer2,
      question_answer3: this.currentQuestion.question_answer3
    };
    const input = (<HTMLInputElement>document.querySelector("input.input-edit-" + type));
    switch(type) {
      case 'question':
        data.question_name = input.value;
        break;
      case 'answer1':
        data.question_answer1 = input.value;
        break;
      case 'answer2':
        data.question_answer2 = input.value;
        break;
      case 'answer3':
        data.question_answer3 = input.value;
        break;
    }

    this.questionService.update(this.currentQuestion.id, data).subscribe(response => {
      this.refreshList();

    });
  }

}
