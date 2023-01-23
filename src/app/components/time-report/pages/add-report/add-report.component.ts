import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TokenService } from 'app/auth/services/token/token.service';
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

  public id_user = '';


  constructor(
    private tokenService: TokenService,
    public dialogRef: MatDialogRef<AddReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TimeData,

    private userTimeReportService: TimeReportService
  ) {
    this.titulo = this.data.titleDialog || 'Agregar Registro';
    this.minDate.setFullYear(this.currentYear, this.currentMonth, 1);
  }

  ngOnInit(): void {
    this.id_user = this.tokenService.getLocalStorage().idUser;
    this.loadData();
  }


  loadData() {

    this.userTimeReportService.getAllActivitiesFromUserSpecific().subscribe(

      (activities) => {

        this.activities = activities.activities.sort((a, b) => Number(a.is_general) - Number(b.is_general));

        // Obtener posisción de la axctividad antigua en caso de que se edite el registro
        if (this.data.edit)
          this.getUserPositionOldActivity(this.data.old_activity);

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


  selectUserPosition(activity_id = '') {

    let activity = null;

    for (let i = 0; i < this.activities.length; i++)
      if (this.activities[i].id == activity_id)
        activity = this.activities[i];

    this.data.position_user = activity.users.findIndex((u: any) => u.user == this.id_user);

  }


  getUserPositionOldActivity(activity_id = '') {

    let activity = null;

    for (let i = 0; i < this.activities.length; i++)
      if (this.activities[i].id == activity_id)
        activity = this.activities[i];

    this.data.position_user_old_activity = activity.users.findIndex((u: any) => u.user == this.id_user);

  }

  onNoClick(): void {
    this.dialogRef.close();

  }

}
