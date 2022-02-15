import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseGetUserById } from 'app/core/interfaces/ResponseGetUserById';
import { User } from 'app/core/interfaces/User';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { UsersService } from '../../services/users.service';


@Component({
  selector: 'app-performance-user',
  templateUrl: './performance-user.component.html',
  styleUrls: ['./performance-user.component.scss']
})
export class PerformanceUserComponent implements OnInit {

  idUser: string = localStorage.getItem('idUser');

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
        name: 'Colombia'
      }
    }
  }

  userImg = 'assets/img/user_img.png';

  constructor(
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void {

    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (id !== null) {
      this.getUserById(id);
      this.idUser = id;
    }

    else if (this.idUser !== null) {
      this.getUserById(this.idUser);
    }

    else {
      this.router.navigate(['/']);
    }

  }

  getUserById(id: string) {
    this.userService.getUserById(id).subscribe(
      (user: ResponseGetUserById) => {
        console.log(user);
        this.userImg = user.user.img;
        this.user = user.user;
      },
      (error) => this.notificationService.showNotificationError(error)
    );
  }

}
