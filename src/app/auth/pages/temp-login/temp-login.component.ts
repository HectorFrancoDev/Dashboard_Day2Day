import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginData } from 'app/auth/interfaces/LoginData';
import { AuthService } from 'app/auth/services/auth/auth.service';
import { TokenService } from 'app/auth/services/token/token.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';

@Component({
  selector: 'app-temp-login',
  templateUrl: './temp-login.component.html',
  styleUrls: ['./temp-login.component.scss']
})
export class TempLoginComponent implements OnInit {
  public loginData: LoginData = {
    email: '',
    password: '',
    remember: false
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationsService,
    private tokenService: TokenService
  ) { }

  ngOnInit(): void {
    this.verifyAuth();
  }

  verifyAuth() {
    const token = this.tokenService.getToken();
    if (token) {
      this.authService.getUserLogged().subscribe(
        (res) => {

          // Si es un administrador lo mando a la ruta /vicepresident
          try {

            if (res.user.role === null || res.user.area === null) {
              this.notificationService.showNotificationError('Error obteniendo los datos del usuario');
            }

            else {

              // Guardar en el localstorage
              this.tokenService.setToken(
                token,
                res.user.name,
                res.user.area.country.code,
                res.user.role.code,
                res.user.area.code,
                res.user.id,
                res.user.role.name
              );

              if (res.user.role.code === 'VP_ROLE')
                this.router.navigate(['/vicepresident']);

              // Si es un administrador lo mando a la ruta /admin
              else if (res.user.role.code === 'DIRECTOR_ROLE')
                this.router.navigate(['/director']);

              // Si es apoyo de dirección
              else if (res.user.role.code === 'APOYO_DIRECCION_ROLE')
                this.router.navigate(['/apoyo-direccion']);

              // Si es apoyo de dirección
              else if (res.user.role.code === 'APOYO_VP_ROLE')
                this.router.navigate(['/apoyo-vp']);

              // Si es un administrador lo mando a la ruta /admin
              else if (res.user.role.code === 'LEADER_ROLE')
                this.router.navigate(['/leader']);

              // Si es jefe de algún país de CAM
              else if (res.user.role.code === 'LEADER_CAM_ROLE')
                this.router.navigate(['/leader-cam']);

              // Si es un usuario va a la ruta /supervisor
              else if (res.user.role.code === 'SUPERVISOR_ROLE')
                this.router.navigate(['/supervisor']);

              // Si es un auditor va a la ruta /dashboard
              else if (res.user.role.code === 'AUDITOR_ROLE')
                this.router.navigate(['/auditor']);

              // Llegado el caso el auditor no tuviera rol alguno
              else
                this.notificationService.showNotificationError('No fue posible redirigirlo a su dashboard ');

            }

          } catch (error) {
            this.notificationService.showNotificationError(error);
          }
        },
        error => console.log(error)
      );
    }
  }

  login() {

    this.authService.login(this.loginData).subscribe(
      (res) => {

        // Si es un administrador lo mando a la ruta /vicepresident
        try {

          if (res.user.role === null || res.user.area === null) {
            this.notificationService.showNotificationError('Error obteniendo los datos del usuario');
          }

          else {

            // Guardar en el localstorage
            this.tokenService.setToken(
              res.token,
              res.user.name,
              res.user.area.country.code,
              res.user.role.code,
              res.user.area.code,
              res.user.id,
              res.user.role.name
            );

            if (res.user.role.code === 'VP_ROLE')
              this.router.navigate(['/vicepresident']);

            // Si es un administrador lo mando a la ruta /admin
            else if (res.user.role.code === 'DIRECTOR_ROLE')
              this.router.navigate(['/director']);

            // Si es apoyo de dirección
            else if (res.user.role.code === 'APOYO_DIRECCION_ROLE')
              this.router.navigate(['/apoyo-direccion']);

            // Si es apoyo de dirección
            else if (res.user.role.code === 'APOYO_VP_ROLE')
              this.router.navigate(['/apoyo-vp']);

            // Si es un administrador lo mando a la ruta /admin
            else if (res.user.role.code === 'LEADER_ROLE')
              this.router.navigate(['/leader']);

            // Si es jefe de algún país de CAM
            else if (res.user.role.code === 'LEADER_CAM_ROLE')
              this.router.navigate(['/leader-cam']);

            // Si es un usuario va a la ruta /supervisor
            else if (res.user.role.code === 'SUPERVISOR_ROLE')
              this.router.navigate(['/supervisor']);

            // Si es un auditor va a la ruta /dashboard
            else if (res.user.role.code === 'AUDITOR_ROLE')
              this.router.navigate(['/auditor']);

            // Llegado el caso el auditor no tuviera rol alguno
            else
              this.notificationService.showNotificationError('No fue posible redirigirlo a su dashboard');

          }

        } catch (error) {
          this.notificationService.showNotificationError(error);
        }

      },
      (error) => {
        this.notificationService.showNotificationError('Debe tener un rol asignado');
      }
    );
  }

}
