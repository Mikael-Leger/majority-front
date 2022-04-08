import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from 'src/app/enums/toasts.enum';
import { Question } from 'src/app/interfaces/question';
import { AuthService } from 'src/app/services/auth.service';
import { QuestionService } from 'src/app/services/question.service';
import { ToastService } from 'src/app/services/toast.service';
import { LengthValidator } from '../../validators/length.validator';
import { TypeValidator } from '../../enums/type-validators.enum'

@Component({
  selector: 'app-edit-question',
  templateUrl: './edit-question.component.html',
  styleUrls: ['./edit-question.component.css']
})
export class EditQuestionComponent implements OnInit {
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  private formObjects = [
    {
      label: 'Question',
      name: 'question_name'
    },
    {
      label: 'Answer 1',
      name: 'question_answer1'
    },
    {
      label: 'Answer 2',
      name: 'question_answer2'
    },
    {
      label: 'Answer 3',
      name: 'question_answer3'
    }
  ];

  constructor(private toast: ToastService, private questionService: QuestionService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private fb: FormBuilder) {
    this.form = fb.group({
      question_name: ['', [Validators.required]],
      question_answer1: ['', [Validators.required]],
      question_answer2: ['', [Validators.required]],
      question_answer3: ['', [Validators.required]]
    }, {
      validator: [
        LengthValidator('question_name', TypeValidator.Question),
        LengthValidator('question_answer1', TypeValidator.Answer),
        LengthValidator('question_answer2', TypeValidator.Answer),
        LengthValidator('question_answer3', TypeValidator.Answer),
      ]
    });
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated() || this.authService.isUser()) {
      this.router.navigateByUrl('/');

    }

    const id = this.route.snapshot.paramMap.get('id');
    if (id != '0') {
      this.questionService.get(parseInt(id)).subscribe(question => {
        this.form.get('question_name').setValue(question.question_name);
        this.form.get('question_answer1').setValue(question.question_answer1);
        this.form.get('question_answer2').setValue(question.question_answer2);
        this.form.get('question_answer3').setValue(question.question_answer3);
      });
      this.edit = true;

    } else {
      this.form.get('question_name').setValue('');
      this.form.get('question_answer1').setValue('');
      this.form.get('question_answer2').setValue('');
      this.form.get('question_answer3').setValue('');
      this.edit = false;

    }
  }

  getErrorMessage(type: string): string {
    const formControl = this.form.get(type);
    if (formControl.hasError('required')) return 'Required';
    if (formControl.hasError('validator')) return formControl.getError('validator');

  }

  saveQuestion(): void {
    let errors = false;
    this.formObjects.forEach(formObject => {
      const formObjectErrors = this.form.get(formObject.name).errors;
      if (formObjectErrors) {
        if (formObjectErrors.required) {
          this.toast.show(formObject.label + ' must not be empty', 'Question', Toast.Error);

        } else if (formObjectErrors.validator) {
          this.toast.show(formObject.label + ' ' + formObjectErrors.validator, 'Question', Toast.Error);

        }
        errors = true;
      }
    });
    if (errors) return;

    const question: Question = {
      question_name: this.form.get('question_name').value,
      question_answer1: this.form.get('question_answer1').value,
      question_answer2: this.form.get('question_answer2').value,
      question_answer3: this.form.get('question_answer3').value
    }

    if (this.edit) {
      const id = this.route.snapshot.paramMap.get('id');

      this.questionService.update(parseInt(id), question).subscribe(response => {
        this.toast.show('Question updated successfully', 'Questions', Toast.Success);
        this.router.navigateByUrl('/questions');

      });
    } else {
      this.questionService.create(question).subscribe(response => {
        this.toast.show('Question created successfully', 'Questions', Toast.Success);
        this.router.navigateByUrl('/questions');

      });

    }
  }

}

