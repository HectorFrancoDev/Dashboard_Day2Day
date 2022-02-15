import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activity } from 'app/core/interfaces/Activity';
import { TimeData } from 'app/core/interfaces/TimeData';
import { TimeReportService } from '../../services/time-report/time-report.service';

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit {

  public activities: Activity[] = [];
  public today = new Date();
  public titulo: string;
  
  public minDate = new Date();
  public currentMonth = this.minDate.getMonth();
  public currentYear = this.minDate.getFullYear();


  constructor(
    public dialogRef: MatDialogRef<AddReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimeData,

    private userTimeReportService: TimeReportService
  ) {
    this.titulo = this.data.titleDialog || 'Agregar Registro';
    this.minDate.setFullYear(this.currentYear, this.currentMonth, 1); 
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {

    this.userTimeReportService.getAllActivitiesFromUser().subscribe(

      (activities) => {
        if (this.data.edit)
          this.activities = activities.activities.filter((a) => a.name == this.data.activity.name);
        else
          this.activities = activities.activities.sort((a, b) => Number(a.is_general) - Number(b.is_general));

      },
      (error) => console.log(error)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

}
