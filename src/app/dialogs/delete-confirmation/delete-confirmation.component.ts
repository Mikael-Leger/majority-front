import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Toast } from 'src/app/enums/toasts.enum';
import { Question } from 'src/app/interfaces/question';
import { QuestionService } from 'src/app/services/question.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationDialog implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: {question: Question, id: number}, private toast: ToastService, private questionService: QuestionService, private router: Router) {

  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  sure(): void {
    this.questionService.delete(this.data.id).subscribe(res => {
      this.dialogRef.close();
      this.toast.show(this.data.question.question_name + ' removed from Questions List', 'Questions', Toast.Success);

    });
  }

}
