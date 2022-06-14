import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseGetUserById } from 'app/core/interfaces/ResponseGetUserById';
import { TimeData } from 'app/core/interfaces/TimeData';
import { User } from 'app/core/interfaces/User';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { UsersService } from '../../services/users.service';
import { AddAusentismoComponent } from '../add-ausentismo/add-ausentismo.component';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {

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
        name: 'Colombia',
        img: ''
      }
    }
  };

  userImg = 'assets/img/user_img.png';

  private data = {}

  constructor(
    private userService: UsersService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationsService,
    private router: Router,
    public dialog: MatDialog
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
        this.userImg = user.user.img;
        this.user = user.user;
      },
      (error) => this.notificationService.showNotificationError(error)
    );
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(AddAusentismoComponent, {
      width: '60%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {

        // setear el id del usuario a result.user
        result.user = this.activatedRoute.snapshot.paramMap.get('id');

        this.userService.createAusentismos(result).subscribe(
          (data) => { this.notificationService.showNotificationSuccess('Ausentismo creado correctamente!'); },
          (error) => { this.notificationService.showNotificationError('Hubo un error interno, por favor comuniquese con el administrador'); }
        );

      }

    });

  }


}
