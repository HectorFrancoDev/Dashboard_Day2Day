import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'app/components/users/services/users.service';
import { Activity, SortUser } from 'app/core/interfaces/Activity';
import { ResponseGetUsers } from 'app/core/interfaces/GetUsers';
import { ResponseActivities } from 'app/core/interfaces/ResponseActivities';
import { ResponseActivity } from 'app/core/interfaces/ResponseActivity';
import { ResponseGetUserById } from 'app/core/interfaces/ResponseGetUserById';
import { RangeTime } from 'app/core/interfaces/TimeRange';
import { User } from 'app/core/interfaces/User';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { ActivityService } from '../../services/activity.service';
import { EditAuditorActivityComponent } from '../edit-auditor-activity/edit-auditor-activity.component';

@Component({
  selector: 'app-show-activity',
  templateUrl: './show-activity.component.html',
  styleUrls: ['./show-activity.component.scss']
})
export class ShowActivityComponent implements OnInit, AfterViewInit {

  public activity: Activity = {
    codigo_open: '',
    id: '',
    name: '',
    open_state: true,
    initial_date: new Date(),
    end_date: new Date(),
    estimated_hours: 1,
    worked_hours: 0,
    is_general: false,
    state: true,
    company: {
      code: 1, name: '',
      country: { code: '', name: '', img: '' }
    }
  };

  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  public users: User[] = [];

  userImg = 'assets/img/user_img.png';

  public dataSource: MatTableDataSource<SortUser>;
  public usersData: SortUser[] = [];
  // public displayedColumns: string[] = ['name', 'email', 'estimated-hours', 'worked-hours', 'porcentaje-avance', 'is-active', 'actions'];
  public displayedColumns: string[] = ['image-avatar', 'name', 'estimated-hours', 'worked-hours', 'porcentaje-avance', 'is-active', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor
    (private userService: UsersService,
      private activatedRoute: ActivatedRoute,
      private notificationService: NotificationsService,
      private router: Router,
      private activityService: ActivityService,
      private dialog: MatDialog
    ) { }

  ngOnInit(): void {

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    
    if (id)
      this.getActivityById(id);
    else
      this.router.navigate(['/']);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }


  getActivityById(id: string) {

    this.activityService.getActivityById(id).subscribe(
      (activity: ResponseActivity) => {

        this.activity = activity.activity;
        this.usersData = activity.activity.users;
        this.dataSource = new MatTableDataSource(this.usersData);

        this.range = new FormGroup({
          start: new FormControl(activity.activity.initial_date, Validators.required),
          end: new FormControl(activity.activity.end_date, Validators.required),
        });
      },
      (error) => console.error(error)
    );

  }

  getUsers() {
    this.userService.getAllUsers().subscribe(
      (users: ResponseGetUsers) => {
        this.users = users.users;
      },
      (error) => console.error(error)
    );
  }

  showUser(user: any) {

    const dialogRef = this.dialog.open(EditAuditorActivityComponent, {
      width: '75%',
      data: user
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {

        const assign = {
          activity_id: this.activity.id || '',
          user_id: user.user._id,
          user_name: result.user.name,
          user_state_activity: result.is_active,
          user_estimated_hours_activity: result.estimated_hours,
          user_worked_hours_activity: result.worked_hours,
          user_log_description_activity: result.description_event
        }


        this.activityService.assignActivity(assign).subscribe(
          (user) => this.notificationService.showNotificationSuccess('Usuario modificado con éxito'),
          (error) => {
            console.error(error);
            this.notificationService.showNotificationError('Error retriving user info');
          }
        );

      }
    });

  }

  verifyActivityData(user: SortUser): boolean {
    if
      (
      user.estimated_hours > 0
    )
      return true;

    return false;
  }

  formatearPorcentajes(horasTrabajadas: number, horasEstimadas: number): string {
    return ((horasTrabajadas / horasEstimadas) * 100).toFixed(2);
  }

  filterReport() {
    console.log('algo');
  }

}
