import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginData } from 'app/auth/interfaces/LoginData';
import { LoginResponse } from 'app/auth/interfaces/LoginResponse';
import { MeResponse } from 'app/auth/interfaces/MeResponse';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { TokenService } from '../token/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  /**
   * Inicia sesión en el backend del sistema.
   * @param data Información requerida para hacer login (mail || username) && password
   */
  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${environment.API_URL}/auth/login`, data);
  }

  /**
 * Inicia sesión en el backend del sistema.
 * @param data Información requerida para hacer login (mail || username) && password
 */

  loginWithGoogle(data: any): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(`${environment.API_URL}/auth/google`, data);
  }


  /**
 * Inicia sesión en el backend del sistema.
 * @param data Información requerida para hacer login (mail || username) && password
 */
  getUserLogged(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${environment.API_URL}/auth/me`);
  }


  /**
 * Inicia sesión en el backend del sistema.
 * @param data Información requerida para hacer login (mail || username) && password
 */
  logout() {
    this.tokenService.clearStorage();
  }
}
