import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from 'app/components/project-plan/services/activity.service';
import { Activity } from 'app/core/interfaces/Activity';
import { AssignActivity } from 'app/core/interfaces/AssingActivity';
import { User } from 'app/core/interfaces/User';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-asign-activity-user',
  templateUrl: './asign-activity-user.component.html',
  styleUrls: ['./asign-activity-user.component.scss']
})
export class AsignActivityUserComponent implements OnInit {

  public user: User = {
    id: '',
    email: '',
    name: '',
    role: {
      code: 'AUDITOR_ROLE',
      name: 'AUDITOR'
    },
    img: '',
    area: {
      code: 1,
      name: 'Ciberseguirdad y TI',
      country: {
        code: 'CO',
        name: 'Colombia',
        img: ''
      }
    },
  };

  idUser: string;

  userImg = 'assets/img/user_img.png';

  public activities: Activity[] = [];

  constructor(
    private userService: UsersService,
    private activityService: ActivityService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationsService,
    private router: Router
  ) {
    
    this.idUser = '';
  }

  ngOnInit(): void {
    this.loadData();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.getUserById(id)
      this.idUser = id;
    }
    else {
      this.notificationService.showNotificationError('Error');
      this.router.navigate(['/']);
    }
  }

  getUserById(id: string) {
    this.userService.getUserById(id)
      .subscribe(
        (user) => {
          this.user = user.user;
        },
        (error) => console.error(error)
      );
  }

  verifyUser(index: number) {

    if (this.activities[index]) {

      const users = this.activities[index].users;

      const search = users.findIndex((user) => user.user._id === this.user.id && user.is_active === true);

      if (search !== -1)
        return true;

      // return (this.activities[index]?.users[index]?.user === this.user.id) || false;
    }

    return false;
  }

  loadData() {
    this.activityService.getActivities(true).subscribe(
      (activities) => {
        this.activities = activities.activities.filter(a => a.state && a.company.country.code === this.user.area.country.code);
      },
      (error) => console.error(error)
    );
  }

  assignActivity(activity: Activity) {

    const assign: AssignActivity = {
      activity_id: activity.id || '',
      user_id: this.user.id,
      user_name: 'Auditor de prueba',
      user_state_activity: true,
      user_estimated_hours_activity: 1,
      user_worked_hours_activity: 0,
      user_log_description_activity: 'Probanding algo GTM -5',
    }

    this.activityService.assignActivity(assign).subscribe(
      (activity) => console.log(activity),
      (error) => console.error(error)
    );
  }

}
