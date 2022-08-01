import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseTimeData } from 'app/core/interfaces/ResponseTimeData';
import { ResponseUserActivities } from 'app/core/interfaces/ResponseUserActivities';
import { TimeData } from 'app/core/interfaces/TimeData';
import { RangeTime } from 'app/core/interfaces/TimeRange';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimeReportService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Obtiene el time report del usuario.
   */
  getAllTimeData(rangeTime?: RangeTime, userId?: string): Observable<ResponseTimeData> {

    let httpOptions = {};

    if (rangeTime) {

      httpOptions = {
        params: new HttpParams()
          .set('start', rangeTime.start.toDateString())
          .set('end', rangeTime.end.toDateString())
          .set('user_id', userId || '')
      };

    }

    else if (userId !== '' && userId !== undefined) {

      httpOptions = { params: new HttpParams().set('user_id', userId || '') };
    }

    return this.http.get<ResponseTimeData>(`${environment.API_URL}/reports`, httpOptions);
  }

  getAllTimeReportsDashboard(rangeTime?: RangeTime): Observable<ResponseTimeData> {
    let httpOptions = {};

    if (rangeTime) {

      httpOptions = {
        params: new HttpParams()
          .set('start', rangeTime.start.toDateString())
          .set('end', rangeTime.end.toDateString())
      };

    }

    return this.http.get<ResponseTimeData>(`${environment.API_URL}/reports/dashboard`, httpOptions);
  }

  /**
   * crear un nuevo registro en el time report del usuario.
   * @param timeData 
   */
  createTimeData(timeData: TimeData) {
    const { edit, titleDialog, checked, ...data } = timeData;
    return this.http.post(`${environment.API_URL}/reports`, data);
  }

  /**
   * crear un nuevo registro en el time report del usuario.
   * @param timeData 
   */
  createTimeDataCelulas(timeData: TimeData) {
    const { edit, titleDialog, checked, ...data } = timeData;
    return this.http.post(`${environment.API_URL}/reports/celulas`, data);
  }

  /**
   * crear un nuevo registro en el time report del usuario.
   * @param timeData 
   */
  getActivityById(id: string) {
    // const { edit, titleDialog, checked, ...data } = timeData;
    return this.http.get(`${environment.API_URL}/activities/${id}`);
  }

  /**
   * Edita un registro del time report.
   * @param timeData 
   */
  editTimeData(timeData: TimeData) {
    const { edit, titleDialog, checked, id, ...data } = timeData;
    return this.http.put(`${environment.API_URL}/reports/${id}`, data);
  }

  /**
   * Edita un registro del time report.
   * @param timeData 
   */
  editTimeDataCelulas(timeData: TimeData) {
    const { edit, titleDialog, checked, id, ...data } = timeData;
    return this.http.put(`${environment.API_URL}/reports/celulas/${id}`, data);
  }

  /**
   * Elimina un registro del time report.
   * @param id Identificador de la información a borrar
   */
  deleteTimeData(id: string) {
    return this.http.delete(`${environment.API_URL}/reports/${id}`);
  }

  /**
   * Elimina un registro del time report.
   * @param id Identificador de la información a borrar
   */
  deleteTimeDataCelulas(id: string) {
    return this.http.delete(`${environment.API_URL}/reports/celulas/${id}`);
  }

  /**
   * "Elimina" registros masivos de reportes cambiando su 
   * estado de true a false
   * @param {TimeData[]} reports de la información a borrar
   */
  deleteReportsTimeData(reports: TimeData[]) {
    const data = JSON.stringify({ data: reports });
    return this.http.patch(`${environment.API_URL}/reports/massive`, data);
  }

  getAllActivitiesFromUserSpecific(): Observable<ResponseUserActivities> {
    return this.http.post<ResponseUserActivities>(`${environment.API_URL}/activities/specific`,{});
  }

  getAllActivitiesFromUser(): Observable<ResponseUserActivities> {
    return this.http.post<ResponseUserActivities>(`${environment.API_URL}/activities/ausentismos`,{});
  }

}
