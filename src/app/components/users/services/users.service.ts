import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreateUser } from 'app/core/interfaces/CreateUser';
import { GeneralUser } from 'app/core/interfaces/GeneralUser';
import { ResponseGetUsers } from 'app/core/interfaces/GetUsers';
import { ResponseGetUserById } from 'app/core/interfaces/ResponseGetUserById';
import { User } from 'app/core/interfaces/User';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {


  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<ResponseGetUsers> {
    return this.http.get<ResponseGetUsers>(`${environment.API_URL}/users`);
  }

  createUser(user: CreateUser) {
    return this.http.post(`${environment.API_URL}/users`, user);
  }

  getUserById(id: string): Observable<ResponseGetUserById> {
    return this.http.get<ResponseGetUserById>(`${environment.API_URL}/users/${id}`);
  }

  createAusentismos(data: any){
    return this.http.post(`${environment.API_URL}/reports/ausentismos`, data)
  }

}
