import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralUser } from 'app/core/interfaces/GeneralUser';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GeneralUser,
  ) 
  { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
