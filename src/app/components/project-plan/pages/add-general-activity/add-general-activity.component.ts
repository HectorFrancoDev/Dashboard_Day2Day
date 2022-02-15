import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activity } from 'app/core/interfaces/Activity';

@Component({
  selector: 'app-add-general-activity',
  templateUrl: './add-general-activity.component.html',
  styleUrls: ['./add-general-activity.component.scss']
})
export class AddGeneralActivityComponent implements OnInit {

  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  constructor(
    public dialogRef: MatDialogRef<AddGeneralActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Activity,
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
