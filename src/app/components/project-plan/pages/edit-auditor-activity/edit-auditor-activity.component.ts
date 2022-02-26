import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-auditor-activity',
  templateUrl: './edit-auditor-activity.component.html',
  styleUrls: ['./edit-auditor-activity.component.scss']
})
export class EditAuditorActivityComponent implements OnInit {

  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });


  constructor(
    public dialogRef: MatDialogRef<EditAuditorActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
