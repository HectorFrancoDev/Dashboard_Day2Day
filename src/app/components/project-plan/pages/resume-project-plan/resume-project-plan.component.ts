import { Component, AfterViewInit, OnInit, QueryList, ViewChildren } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { Router } from '@angular/router';
import { Activity } from 'app/core/interfaces/Activity';
import { ActivityService } from '../../services/activity.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { AddSpecificActivityComponent } from '../add-specific-activity/add-specific-activity.component';
import { AddGeneralActivityComponent } from '../add-general-activity/add-general-activity.component';

@Component({
  selector: 'app-resume-project-plan',
  templateUrl: './resume-project-plan.component.html',
  styleUrls: ['./resume-project-plan.component.scss']
})
export class ResumeProjectPlanComponent implements OnInit, AfterViewInit {

  countries = [
    {
      name: 'Panamá',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Flag_of_Panama.svg/200px-Flag_of_Panama.svg.png'
    },
    {
      name: 'El Salvador',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Flag_of_El_Salvador.svg/2560px-Flag_of_El_Salvador.svg.png'
    },
    {
      name: 'Honduras',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Flag_of_Honduras.svg/800px-Flag_of_Honduras.svg.png'
    },
    {
      name: 'Costa Rica',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Flag_of_Costa_Rica_%28state%29.svg/200px-Flag_of_Costa_Rica_%28state%29.svg.png'
    },
    {
      name: 'Colombia',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Colombia.svg/200px-Flag_of_Colombia.svg.png'
    }
  ]

  public generalActivities: Activity[] = [];
  public specificActivities: Activity[] = [];

  public userCountry = localStorage.getItem('country');
  public userRole = localStorage.getItem('role');
  public userArea = localStorage.getItem('area');
  public userId = localStorage.getItem('idUser');

  public poseePermisos: boolean = false;

  public loader: boolean = true;

  private data: Activity = {
    name: '',
    initial_date: new Date(),
    end_date: new Date(),
    estimated_hours: 0,
    worked_hours: 0,
    open_state: true,
    is_general: true,
    country: 'CO'
  };

  // Paginator
  length = this.generalActivities.length;
  pageSize = 5;
  pageSizeOptions: number[] = [5, this.generalActivities.length / 2, this.generalActivities.length];


  displayedColumnsGeneral: string[] = ['name', 'inicio-date', 'fin-date'];
  displayedColumnsSpecific: string[] =
    ['name', 'inicio-date', 'fin-date', 'pais', 'porcentaje-avance', 'actions'];

  generalActivitiesSource: MatTableDataSource<Activity>;
  specificActivitiesSource: MatTableDataSource<Activity>;

  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();


  constructor(
    private activityService: ActivityService,
    public dialog: MatDialog,
    private notificationService: NotificationsService,
    private router: Router
  ) {

    if (this.userRole == 'VP_ROLE' || this.userRole == 'DIRECTOR_ROLE')
      this.poseePermisos = true;

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
        this.generalActivities = activities.activities.filter(a => a.is_general);
        this.generalActivitiesSource.data = this.generalActivities;

        // Inicializa la tabla de actividades especificas
        // Si es el vicepresidente
        if (this.userRole === 'VP_ROLE')
          this.specificActivities = activities.activities.filter((a) => !a.is_general);

        // Si es gerente de CAM desde Colombia
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM') 
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.country !== 'CO');

        // Si es director de Colombia 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CO')
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.country === 'CO');

        else if (this.userRole === 'LEADER_CAM_ROLE')
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.country === this.userCountry);

        // Si es jefe Normal
        else if (this.userRole === 'LEADER_ROLE')
          this.specificActivities = activities.activities.filter((a) => !a.is_general && a.country === this.userCountry);




        this.specificActivitiesSource.data = this.specificActivities;

      },
      (error) => console.error(error)
    );
  }

  addGeneral() {
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
          activity.open_state = true;

          this.activityService.createActivity(activity).subscribe(
            activity => {
              this.generalActivities.push(activity.activity);
              this.notificationService.showNotificationSuccess('Actividad Agregada Correctamente!');

              this.loadData();
            },
            error => {
              console.log(error)
            }
          );
        }
        else {
          this.notificationService.showNotificationError('Información inválida');
        }
      }
    });
  }

  addSpecific() {
    const dialogRef = this.dialog.open(AddSpecificActivityComponent, {
      width: '70%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const checkData = this.verifyActivityData(result);
        if (checkData) {
          const activity = result as Activity;
          activity.is_general = false;
          activity.open_state = false;

          this.activityService.createActivity(activity).subscribe(
            activity => {
              this.specificActivities.push(activity.activity);

              this.notificationService.showNotificationSuccess('Actividad Agregada Correctamente!');

              this.loadData();
            },
            error => {
              console.log(error)
            }
          );
        }
        else {
          this.notificationService.showNotificationError('Información inválida');
        }
      }
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

  verifyActivityData(activityData: Activity): boolean {
    if (activityData.name && activityData.initial_date && activityData.end_date && activityData.estimated_hours)
      return true;

    return false;
  }

  formatearPorcentajes(horasTrabajadas: number, horasEstimadas: number): string {
    return ((horasTrabajadas / horasEstimadas) * 100).toFixed(2);
  }

  /**
   * Ir al detalle de la actividad en cuestión
   * @param {string} idActivity 
   */
  showActivity(idActivity: string) {

    if (this.userRole === 'SUPERVISOR_ROLE')
      this.router.navigate(['/supervisor/activities/' + idActivity]);

    else if (this.userRole === 'LEADER_CAM_ROLE')
      this.router.navigate(['/leader-cam/project-plan/activities/' + idActivity]);

    else
      this.router.navigate(['/admin/activities/' + idActivity]);

  }

}
