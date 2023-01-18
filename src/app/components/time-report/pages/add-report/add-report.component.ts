import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activity } from 'app/core/interfaces/Activity';
import { TimeData } from 'app/core/interfaces/TimeData';
import { TimeReportService } from '../../services/time-report/time-report.service';

declare var $: any;

@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss']
})
export class AddReportComponent implements OnInit {

  public activities: Activity[] = [];
  public activities_2: any[] = [];
  public categories: any[] = [];

  public today = new Date();
  public titulo: string;

  public minDate = new Date();
  public currentMonth = this.minDate.getMonth();
  public currentYear = this.minDate.getFullYear();

  public is_new_report = true;


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

    this.userTimeReportService.getAllActivitiesFromUserSpecific().subscribe(

      (activities) => {

        this.activities = activities.activities.sort((a, b) => Number(a.is_general) - Number(b.is_general));

        // Editar actividades / misiones
        if (this.data.edit) {

          // Cargar compañias (entidades auditables primero)
          for (let i = 0; i < this.activities.length; i++)
            if (!this.categories.includes(this.activities[i].company.name) && this.activities[i].category.code === 13)
              this.categories.push(this.activities[i].company.name);

          // Cargar actividades generales de segundo
          for (let i = 0; i < this.activities.length; i++)
            if (this.activities[i].category.code !== 13 && !this.categories.includes(this.activities[i].category.name))
              this.categories.push(this.activities[i].category.name);


        }

        // Agregar actividades / Misiones
        else {

          // Cargar compañias (entidades auditables primero)
          for (let i = 0; i < this.activities.length; i++)
            if (!this.categories.includes(this.activities[i].company.name) && this.activities[i].category.code === 13)
              this.categories.push(this.activities[i].company.name);


          // Cargar actividades generales de segundo
          for (let i = 0; i < this.activities.length; i++)
            if (this.activities[i].category.code !== 13 && !this.categories.includes(this.activities[i].category.name))
              this.categories.push(this.activities[i].category.name);

        }

      }, (error) => console.log(error)
    );

  }

  selecActivity(categoria = '') {

    this.activities_2 = this.activities.filter((a) => a.category.name === categoria || a.company.name === categoria);

  }


  // loadData_3() {

  //   this.userTimeReportService.getAllActivitiesFromUserSpecific().subscribe(

  //     (activities) => {

  //       if (this.data.edit) {

  //         this.is_new_report = false;

  //         $("#activity_input").removeClass("col-6").addClass("col-12");

  //         this.activities = activities.activities.filter((a) => a.name == this.data.activity.name);

  //         for (let i = 0; i < this.activities.length; i++) {

  //           if (this.activities[i].is_general && this.activities[i].category !== undefined) {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               name: this.activities[i].name,
  //             });

  //           }
  //           else if (!this.activities[i].is_general && this.activities[i].category !== undefined) {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               name: this.activities[i].name,
  //             });

  //           }

  //           else {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               name: this.activities[i].name,
  //             });
  //           }
  //         }


  //       } else {

  //         this.activities = activities.activities.sort((a, b) => Number(a.is_general) - Number(b.is_general));


  //         for (let i = 0; i < this.activities.length; i++) {

  //           if (!this.categories.includes(this.activities[i].company.name) && this.activities[i].company.name !== 'Otros Conceptos - General')
  //             this.categories.push(this.activities[i].company.name);

  //         }

  //         for (let i = 0; i < this.activities.length; i++) {

  //           if (this.activities[i].is_general && this.activities[i].category !== undefined)

  //             if (!this.categories.includes(this.activities[i].category.name))
  //               this.categories.push(this.activities[i].category.name);

  //           if (!this.activities[i].is_general && this.activities[i].category !== undefined)
  //             if (!this.categories.includes(this.activities[i].category.name))
  //               this.categories.push(this.activities[i].category.name);

  //         }

  //       }

  //     }, (error) => console.log(error)
  //   );

  // }


  // loadData_2() {

  //   this.userTimeReportService.getAllActivitiesFromUserSpecific().subscribe(

  //     (activities) => {

  //       if (this.data.edit) {

  //         this.activities = activities.activities.filter((a) => a.name == this.data.activity.name);

  //         for (let i = 0; i < this.activities.length; i++) {

  //           if (this.activities[i].is_general && this.activities[i].category !== undefined) {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               // name: this.activities[i].category.name + ' - ' + this.activities[i].name,
  //               name: this.activities[i].category.name,
  //             });

  //           }
  //           else if (!this.activities[i].is_general && this.activities[i].category !== undefined) {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               // name: this.activities[i].category.name + ' - ' + this.activities[i].name,
  //               name: this.activities[i].category.name,
  //             });

  //           }

  //           else {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               // name: this.activities[i].company.name + ' - ' + this.activities[i].name,
  //               name: this.activities[i].company.name,
  //             });
  //           }
  //         }
  //       }

  //       else {

  //         this.activities = activities.activities.sort((a, b) => Number(a.is_general) - Number(b.is_general));

  //         for (let i = 0; i < this.activities.length; i++) {

  //           if (this.activities[i].is_general && this.activities[i].category !== undefined) {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               // name: this.activities[i].category.name + ' - ' + this.activities[i].name,
  //               name: this.activities[i].category.name,
  //             });

  //           }
  //           else if (!this.activities[i].is_general && this.activities[i].category !== undefined) {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               // name: this.activities[i].category.name + ' - ' + this.activities[i].name,
  //               name: this.activities[i].category.name,
  //             });

  //           }

  //           else {

  //             this.activities_2.push({
  //               id: this.activities[i].id,
  //               // name: this.activities[i].company.name + ' - ' + this.activities[i].name,
  //               name: this.activities[i].company.name,
  //             });
  //           }
  //         }

  //       }

  //     },
  //     (error) => console.log(error)
  //   );
  // }

  onNoClick(): void {
    this.dialogRef.close();

  }

}
