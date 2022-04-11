import { Component, AfterViewInit, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { Router } from '@angular/router';
import { Activity, SortUser } from 'app/core/interfaces/Activity';
import { ActivityService } from '../../services/activity.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { AddSpecificActivityComponent } from '../add-specific-activity/add-specific-activity.component';
import { AddGeneralActivityComponent } from '../add-general-activity/add-general-activity.component';

import * as _ from 'lodash';
import { SweetAlertService } from 'app/core/services/sweet-alert/sweet-alert.service';

@Component({
  selector: 'app-resume-project-plan',
  templateUrl: './resume-project-plan.component.html',
  styleUrls: ['./resume-project-plan.component.scss']
})
export class ResumeProjectPlanComponent implements OnInit, AfterViewInit {


  public mostrarTablas: boolean = false;

  public generalActivities: Activity[] = [];
  public specificActivities: Activity[] = [];
  public companies: string[] = [];

  public userCountry = localStorage.getItem('country');
  public userRole = localStorage.getItem('role');
  public userArea = localStorage.getItem('area');
  public userId = localStorage.getItem('idUser');

  public poseePermisos: boolean = false;
  public poseePermisosSuperior: boolean = false;

  public loader: boolean = true;

  private data: Activity = {
    name: '',
    initial_date: new Date(),
    end_date: new Date(),
    estimated_hours: 0,
    worked_hours: 0,
    open_state: true,
    is_general: false,
    company: { code: 1, name: 'Banco Davivienda', country: { code: 'CO', name: 'Colombia', img: '' } }
  };

  // Paginator
  length = this.generalActivities.length;
  pageSize = 5;
  pageSizeOptions: number[] = [5, this.generalActivities.length / 2, this.generalActivities.length];


  displayedColumnsGeneral: string[] = ['name', 'inicio-date', 'fin-date'];
  displayedColumnsSpecific: string[] = ['pais', 'empresa', 'name', 'porcentaje-avance', 'actions'];

  generalActivitiesSource: MatTableDataSource<Activity>;
  specificActivitiesSource: MatTableDataSource<Activity>;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();


  constructor(
    private activityService: ActivityService,
    public dialog: MatDialog,
    private notificationService: NotificationsService,
    private sweetAlert: SweetAlertService,
    private router: Router
  ) {

    if (this.userRole === 'VP_ROLE' || this.userRole === 'DIRECTOR_ROLE' ||
      this.userRole === 'LEADER_ROLE' || this.userRole === 'LEADER_CAM_ROLE')
      this.poseePermisos = true;

    if ((this.userRole === 'VP_ROLE' || this.userRole === 'DIRECTOR_ROLE') && this.userCountry === 'CO')
      this.poseePermisosSuperior = true;

    this.generalActivitiesSource = new MatTableDataSource(this.generalActivities);
    this.specificActivitiesSource = new MatTableDataSource(this.specificActivities);
  }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit() {
    this.specificActivitiesSource.paginator = this.paginator.toArray()[0];
    this.specificActivitiesSource.sort = this.sort.toArray()[0];

    this.generalActivitiesSource.paginator = this.paginator.toArray()[1];
    this.generalActivitiesSource.sort = this.sort.toArray()[1];

    this.loader = false;
  }

  loadData() {

    this.activityService.getActivities().subscribe(
      (activities) => {

        // Inicializa la tabla de actividades generales
        this.generalActivities = activities.activities.filter((a) => a.is_general && a.state);
        this.generalActivitiesSource.data = this.generalActivities;

        // Inicializa la tabla de actividades especificas
        // Si es el vicepresidente
        if (this.userRole === 'VP_ROLE')
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.state);

        // Si es gerente de CAM desde Colombia
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM')
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.company.country.code !== 'CO' && a.state);


        // Si es Director de conductas especiales
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userArea === '9') {
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.company.country.code === 'CO' && a.state);
          this.specificActivities = this.filterByUserAreaId(this.userArea, this.specificActivities);
        }

        // Si es director de Colombia 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CO') {
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.company.country.code === 'CO' && a.state);
        }

        // Si es director de Colombia 
        else if (this.userRole === 'APOYO_DIRECCION_ROLE' && this.userCountry === 'CO') 
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.company.country.code === 'CO' && a.state);
        
        // Si es director de Colombia 
        else if (this.userRole === 'APOYO_VP_ROLE' && this.userCountry === 'CO') 
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.state);
        

        else if (this.userRole === 'LEADER_CAM_ROLE')
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.company.country.code === this.userCountry && a.state);

        // Si es jefe Normal
        else if (this.userRole === 'LEADER_ROLE') {
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.company.country.code === this.userCountry && a.state);
          this.specificActivities = this.filterByUserAreaId(this.userArea, this.specificActivities);
        }

        this.chargeCompanies(this.specificActivities);

        this.specificActivitiesSource.data = this.specificActivities;


        this.mostrarTablas = true;

      },
      (error) => console.error(error)
    );
  }

  addGeneral() {

    this.mostrarTablas = false;

    const dialogRef = this.dialog.open(AddGeneralActivityComponent, {
      width: '70%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const checkData = this.verifyActivityData(result);
        if (checkData) {
          const activity = result as Activity;

          activity.is_general = true;

          this.activityService.createActivity(activity).subscribe(
            activity => {
              this.generalActivities.push(activity.activity);
              this.notificationService.showNotificationSuccess('Actividad agregada correctamente!');

              this.loadData();
            },
            error => {
              this.notificationService.showNotificationError(error.error);
            }
          );
        }
        else {
          this.notificationService.showNotificationError('Información inválida');
        }
      }

      this.mostrarTablas = true;
    });
  }

  addSpecific() {

    this.mostrarTablas = false;

    const dialogRef = this.dialog.open(AddSpecificActivityComponent, {
      width: '70%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {

        const checkData = this.verifyActivityData(result);

        if (checkData) {

          const activity = result as Activity;

          activity.is_general = false;

          this.activityService.createActivity(activity).subscribe(
            activity => {
              this.specificActivities.push(activity.activity);

              this.notificationService.showNotificationSuccess('Actividad agregada correctamente');

              this.loadData();

            },
            (error) => {
              this.notificationService.showNotificationError(error.error.error);
            }
          );

        } else {
          this.notificationService.showNotificationError('Información inválida');
        }
      }

      this.mostrarTablas = true;

    });
  }

  applyFilter(event: Event) {

    const filterValue = (event.target as HTMLInputElement).value;

    this.generalActivitiesSource.filter = filterValue.trim().toLowerCase();
    this.specificActivitiesSource.filter = filterValue.trim().toLowerCase();

    if (this.generalActivitiesSource.paginator)
      this.generalActivitiesSource.paginator.firstPage();

    if (this.specificActivitiesSource.paginator)
      this.specificActivitiesSource.paginator.firstPage();
  }

  selectCompany(event: any) {

    if (event.value.toLowerCase() === 'all') {
      // this.generalActivitiesSource = new MatTableDataSource(filterValue);
      this.specificActivitiesSource = new MatTableDataSource(this.specificActivities);

      this.specificActivitiesSource.paginator = this.paginator.toArray()[0];
      this.specificActivitiesSource.sort = this.sort.toArray()[0];

    } else {

      let filterValue = _.filter(this.specificActivities, (item) => {

        return item.company.name.toLowerCase() === event.value.toLowerCase().split(' - ')[1];
      });

      // this.generalActivitiesSource = new MatTableDataSource(filterValue);
      this.specificActivitiesSource = new MatTableDataSource(filterValue);

      this.specificActivitiesSource.paginator = this.paginator.toArray()[0];
      this.specificActivitiesSource.sort = this.sort.toArray()[0];
    }

  }

  verifyActivityData(activityData: Activity): boolean {
    if (activityData.name && activityData.initial_date && activityData.end_date && activityData.estimated_hours)
      return true;

    return false;
  }

  formatearPorcentajes(horasTrabajadas: number, horasEstimadas: number): string {
    return ((horasTrabajadas / horasEstimadas) * 100).toFixed(2);
  }

  showActivity(idActivity: string) {

    if (this.userRole === 'SUPERVISOR_ROLE')
      this.router.navigate(['/supervisor/project-plan/activities/' + idActivity]);

    else if (this.userRole === 'LEADER_CAM_ROLE')
      this.router.navigate(['/leader-cam/project-plan/activities/' + idActivity]);

    else if (this.userRole === 'LEADER_ROLE')
      this.router.navigate(['/leader/project-plan/activities/' + idActivity]);

    else if (this.userRole === 'DIRECTOR_ROLE')
      this.router.navigate(['/director/project-plan/activities/' + idActivity]);

    else if (this.userRole === 'APOYO_DIRECCION_ROLE')
      this.router.navigate(['/apoyo-direccion/project-plan/activities/' + idActivity]);

    else if (this.userRole === 'APOYO_VP_ROLE')
      this.router.navigate(['/apoyo-vp/project-plan/activities/' + idActivity]);

    else
      this.router.navigate(['/vicepresident/project-plan/activities/' + idActivity]);

  }

  async deleteActivity(idActivity: string) {

    const { isConfirmed } = await this.sweetAlert.presentDelete('la actividad del Project Plan');

    if (isConfirmed) {
      this.mostrarTablas = false;

      this.activityService.deleteActivity(idActivity)
        .subscribe(
          (data) => {
            this.notificationService.showNotificationSuccess('Actividad eliminada con éxito');
            this.loadData();

            this.mostrarTablas = true;

        },
          (error) => {
            this.notificationService.showNotificationError(error.error.error);
            this.mostrarTablas = true; 
          }
        );
    }
  }

  private chargeCompanies(activities: Activity[]) {

    let companiesTemp: string[] = [];

    activities.forEach((activity: Activity) => {

      let data = `${activity.company.country.name} - ${activity.company.name}`;

      if (!companiesTemp.includes(data))
        companiesTemp.push(data);

      this.companies = companiesTemp.sort();

    });
  }

  private filterByUserAreaId(area_code: string, activities: Activity[]): Activity[] {

    const newActivities = [];

    activities.forEach((activity: Activity) => {

      activity.users.forEach((user: SortUser) => {

        if (user.user.area.code.toString() === area_code)
          if (!newActivities.includes(activity))
            newActivities.push(activity);
      });

    });

    return newActivities;
  }

  resetDataRange() {
    console.log('Clickeado');
  }

}
