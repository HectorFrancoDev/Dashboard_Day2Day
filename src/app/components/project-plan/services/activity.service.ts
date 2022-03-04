import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Activity } from 'app/core/interfaces/Activity';
import { AssignActivity } from 'app/core/interfaces/AssingActivity';
import { Company } from 'app/core/interfaces/Company';
import { ResponseActivities } from 'app/core/interfaces/ResponseActivities';
import { ResponseActivity } from 'app/core/interfaces/ResponseActivity';
import { ResponseCompanies } from 'app/core/interfaces/ResponseCompanies';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private http: HttpClient
  ) { }

  createActivity(activityData: Activity): Observable<ResponseActivity> {
    return this.http.post<ResponseActivity>(`${environment.API_URL}/activities`, activityData);
  }

  getActivities(specific?: boolean): Observable<ResponseActivities> {
    const httpOptions = {
      params: new HttpParams().set('specific', specific ? true : false)
    };
    return this.http.get<ResponseActivities>(`${environment.API_URL}/activities`, httpOptions);
  }

  getActivityById(id: string): Observable<ResponseActivity> {
    const httpOptions = {
      params: new HttpParams().set('id', id)
    };

    return this.http.get<ResponseActivity>(`${environment.API_URL}/activities/${id}`, httpOptions);
  }

  assignActivity(assign: AssignActivity) {
    return this.http.patch(`${environment.API_URL}/activities/${assign.activity_id}`, assign);
  }

  deleteActivity(id: string) {
    return this.http.delete(`${environment.API_URL}/activities/${id}`);
  }

  getCompanies(): Observable<ResponseCompanies> {
    return this.http.get<ResponseCompanies>(`${environment.API_URL}/companies`);
  }

}
