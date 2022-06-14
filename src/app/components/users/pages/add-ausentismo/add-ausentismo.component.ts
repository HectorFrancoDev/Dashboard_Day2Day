import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeReportService } from 'app/components/time-report/services/time-report/time-report.service';
import { Activity } from 'app/core/interfaces/Activity';
import { TimeData } from 'app/core/interfaces/TimeData';

@Component({
  selector: 'app-add-ausentismo',
  templateUrl: './add-ausentismo.component.html',
  styleUrls: ['./add-ausentismo.component.scss']
})
export class AddAusentismoComponent implements OnInit {

  public activities: Activity[] = [];
  public activities_2: any[] = [];

  public today = new Date();
  public titulo: string;

  public minDate = new Date();
  public currentMonth = this.minDate.getMonth();
  public currentYear = this.minDate.getFullYear();


  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });


  constructor(
    public dialogRef: MatDialogRef<AddAusentismoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

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

        this.activities = activities.activities.filter((a) => a.category.code === 1);

        for (let i = 0; i < this.activities.length; i++) {

          if (this.activities[i].is_general && this.activities[i].category !== undefined) {

            this.activities_2.push({
              id: this.activities[i].id,
              name: this.activities[i].category.name + ' - ' + this.activities[i].name,
            });

          }
          else if (!this.activities[i].is_general && this.activities[i].category !== undefined) {
            this.activities_2.push({
              id: this.activities[i].id,
              name: this.activities[i].category.name + ' - ' + this.activities[i].name,
            });

          }

          else {

            this.activities_2.push({
              id: this.activities[i].id,
              name: this.activities[i].company.name + ' - ' + this.activities[i].name,
            });
          }
        }

      },

      (error) => console.log(error)
    );
  }

  onNoClick(): void {
    this.dialogRef.close();

  }

  filterReport() {
    console.log('HOLA')
  }

}