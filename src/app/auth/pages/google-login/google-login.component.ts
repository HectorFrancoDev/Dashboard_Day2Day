import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/auth/services/auth/auth.service';
import { TokenService } from 'app/auth/services/token/token.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';

import { SocialAuthService, GoogleLoginProvider, SocialUser } from 'angularx-social-login';

@Component({
  selector: 'app-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss']
})
export class GoogleLoginComponent implements OnInit {

  constructor(

    private authService: AuthService,
    private socialAuthService: SocialAuthService,
    private router: Router,
    private notificationService: NotificationsService,
    private tokenService: TokenService

  ) { }

  ngOnInit(): void {

    this.verifyAuth();
    // let message = 'Error de inicio de sesión';
    // this.notificationService.showNotificationError(message);
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

  async loginWithGoogle(): Promise<void> {
    const data = await this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);

    this.authService.loginWithGoogle(data).subscribe(
      (res) => {


        console.log(res);

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
              this.notificationService.showNotificationError('No fue posible redirigirlo a su dashboard ');

          }

        } catch (error) {
          this.notificationService.showNotificationError(error);
        }

      },

      (error) => this.notificationService.showNotificationError(error.error.error)
    );

  }
}
