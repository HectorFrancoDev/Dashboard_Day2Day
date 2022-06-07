import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TimeData } from 'app/core/interfaces/TimeData';
import { TimeReportService } from '../../services/time-report/time-report.service';

import { AddReportComponent } from '../add-report/add-report.component';

import * as moment from 'moment';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { RangeTime } from 'app/core/interfaces/TimeRange';
import { SweetAlertService } from 'app/core/services/sweet-alert/sweet-alert.service';

import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';


export interface ProgressBar {
  color: ThemePalette;
  mode: ProgressBarMode;
  value: number;
  bufferValue: number
}

@Component({
  selector: 'app-resume-time-report',
  templateUrl: './resume-time-report.component.html',
  styleUrls: ['./resume-time-report.component.scss']
})
export class ResumeTimeReportComponent implements OnInit {


  progressBar: ProgressBar = {
    color: 'primary',
    mode: 'buffer',
    value: 0,
    bufferValue: 0
  }

  public userName: string = '';
  public userId: string = '';

  public today = new Date();

  private data: TimeData = {
    date: new Date(),

    activity: {
      id: '',
      name: 'ABC',
      company: { code: 1, name: '', country: { code: '', name: '', img: '' } },
      open_state: true,
      initial_date: new Date(),
      end_date: new Date(),
      estimated_hours: 1,
      worked_hours: 1,
      is_general: false
    },

    user: {
      id: 'string',
      name: 'string',
      email: 'string',
      img: 'string',
      role: { code: '', name: '' },
      area: {
        code: 1, name: '', country: {
          code: '', name: '', img: ''
        }
      }
    },

    detail: '',
    hours: 0,
    current_hours: 0,
    edit: false,
    checked: false
  };

  public horasTrabajadasHoy = 0;
  public timeDataActual: TimeData[] = [];

  public horasTrabajadasOtroDia = 0;
  public fechaHorasOtroDiaStart = '';
  public fechaHorasOtroDiaEnd = '';

  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  displayedColumns: string[] = ['select', 'date', 'activity', 'detail', 'hours', 'actions-delete'];
  dataSource: MatTableDataSource<TimeData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private timeData: TimeData[] = [];
  private deleteReportsMassive: TimeData[] = [];
  registros: boolean = false;


  constructor(
    private userTimeReportService: TimeReportService,
    public dialog: MatDialog,
    private sweetAlert: SweetAlertService,
    private notificationService: NotificationsService,
    private _snackBar: MatSnackBar
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.timeData);
  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user-name') || '';
    this.userId = localStorage.getItem('x-token') || '';
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    // this.dataSource.sort = this.sort;
    // to put where you want the sort to be programmatically triggered, for example inside ngOnInit
    this.sort.sort(({ id: 'date', start: 'desc' }) as MatSortable);
    this.dataSource.sort = this.sort;
  }

  loadData() {

    const rangeTime: RangeTime = {
      // start: this.getMonday(new Date),
      start: this.getFirstDayMonth(new Date),
      // start: new Date(),
      end: moment(new Date()).add(1, 'days').toDate()
    };

    this.range = new FormGroup({
      start: new FormControl(rangeTime.start, Validators.required),
      end: new FormControl(new Date(), Validators.required),
    });

    this.horasTrabajadasHoy = 0;

    this.userTimeReportService.getAllTimeData(rangeTime).subscribe(
      (responseTimeData) => {
        this.timeData = responseTimeData.reports;

        this.dataSource.data = this.timeData;

        let cDate = moment(new Date()).format('YYYY-MM-DD');

        for (let i = 0; i < this.timeData.length; i++) {

          if (cDate == moment(this.timeData[i].date).format('YYYY-MM-DD')) {
            this.timeDataActual.push(this.timeData[i])
            this.horasTrabajadasHoy += this.timeData[i].hours;

            if (this.horasTrabajadasHoy > 24)
              this.openSnackBar('Te has excedido de tus horas diarias de trabajo, revisa tus actividades de hoy para ajustar los tiempos');
          }
        }

        this.progressBar.value = Math.ceil(((this.horasTrabajadasHoy / 8) * 100));
        if (this.progressBar.value <= 34)
          this.progressBar.color = 'warn';
        else if (this.progressBar.value <= 67)
          this.progressBar.color = 'accent'
        else
          this.progressBar.color = 'primary';

      },

      error => { console.log(error) }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openDialog(timeData?: TimeData, editar?: Boolean): void {
    if (timeData) {
      this.data = timeData;
      this.data.current_hours = timeData.hours;
    }
    if (editar) {
      this.data.edit = true;
      this.data.titleDialog = 'Editar Registro';
    }
    else {
      this.data.edit = false;
      this.data.titleDialog = 'Agregar Registro'
    }

    const dialogRef = this.dialog.open(AddReportComponent, {
      width: '80%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const checkData = this.verifyTimeData(result);
        if (checkData) {
          // Si se desea agregar uno nuevo
          if (!timeData) {

            this.userTimeReportService.createTimeData(result).subscribe(
              () => {
                this.notificationService.showNotificationSuccess('Registro creado correctamente!');
                this.resetData();
                this.loadData();
              },
              (error) => this.notificationService.showNotificationError('No fue posible crear el registro, revisa los datos ingresados'),
            );
          }

          // Se desea editar un registro
          else {

            this.userTimeReportService.editTimeData(timeData).subscribe(
              () => {
                this.notificationService.showNotificationSuccess('Registro editado correctamente!');
                this.resetData();
                this.loadData();
              },
              () => {
                this.notificationService.showNotificationError('No fue posible editar el resgistro!');
              }
            );
          }
        }
        else {
          this.notificationService.showNotificationError('Información inválida');
        }
      }

      // Una vez se cerró el Dialog modal con o sin cambios
    });


  }

  async deleteReport(timeData: TimeData) {

    const { isConfirmed } = await this.sweetAlert.presentDelete('El registro de la base de datos!');

    if (isConfirmed) {
      const { id } = timeData;
      if (id) {
        this.userTimeReportService.deleteTimeData(id).subscribe(
          () => {
            this.notificationService.showNotificationSuccess('Registro eliminado correctamente!');

            this.loadData();
            // this.openSnackBar();
          },
          () =>
            this.notificationService.showNotificationError('No fue posible eliminar el registro')
        );
      }
    }
  }

  async deleteSelectedReports() {
    const { isConfirmed } = await this.sweetAlert.presentDelete('Los registros seleccionados');

    if (isConfirmed) {
      this.userTimeReportService.deleteReportsTimeData(this.deleteReportsMassive)
        .subscribe(
          (res) => {
            this.notificationService.showNotificationSuccess('Registros eliminados correctamente!');
            console.log(res);
            this.registros = false;
            this.deleteReportsMassive = [];
            this.loadData();

            // this.openSnackBar();

          },
          (error) => {
            this.notificationService.showNotificationError('No fue posible eliminar los registros!');
            console.log(error);
          }
        );
    }

  }

  verifyTimeData(timeData: TimeData): boolean {

    console.log((this.horasTrabajadasHoy - timeData.current_hours + timeData.hours));

    if ((this.horasTrabajadasHoy - timeData.current_hours + timeData.hours) > 24) {
      console.log((this.horasTrabajadasHoy - timeData.current_hours + timeData.hours));
      this.openSnackBar(`Horas diarias excedidas, más de 24 horas diarias. 
      Revisa la información ingresada de tus actividades de hoy y editalas si es necesario`);
      return false;
    }

    if (timeData.hours > 24) {
      this.openSnackBar(`Solo puedes agregar 24 horas de trabajo por acividad por día`);
      return false;
    }

    if (timeData.date && timeData.activity && timeData.detail && timeData.hours)
      if (timeData.hours > 0 && timeData.hours <= 24)
        return true;

    return false;
  }

  filterReport() {
    const rangeTime: RangeTime = this.range.value;
    const { start, end } = rangeTime;

    if (start && end) {
      const endMoment = moment(end).add(1, 'days');
      rangeTime.end = endMoment.toDate();

      this.userTimeReportService.getAllTimeData(rangeTime, '').subscribe(
        (responseTimeData) => {

          this.timeData = responseTimeData.reports;
          this.dataSource.data = this.timeData;
        },
        (error) => this.notificationService.showNotificationError('Error obteniendo los registros en el rango seleccionado!')
      );
    }

  }

  selectReport(report: TimeData) {


    if (!this.deleteReportsMassive.includes(report)) {
      this.deleteReportsMassive.push(report);
    }
    else {
      let indexReport = this.deleteReportsMassive.indexOf(report);
      if (indexReport !== -1) {
        this.deleteReportsMassive.splice(indexReport, 1);
      }
    }

    if (this.deleteReportsMassive.length > 1)
      this.registros = true;
    else
      this.registros = false;

  }

  openSnackBar(aviso?: string) {

    let message = 'Horas trabajadas el día de hoy';

    if (this.horasTrabajadasHoy > 24)
      message = `Te has excedido de las horas permitdas por día, revisa tus actividades ingresadas hoy`;
    else if (this.horasTrabajadasHoy >= 8)
      message = `Has completado tu registro de 8 horas diarias, 
      de igual manera puedes seguir agregando actividades si es el caso`;

    if (aviso != null && aviso != '' && aviso != undefined)
      message = aviso || 'a';

    this._snackBar.open(message, '', {
      duration: 5000,
      verticalPosition: 'top'
    });
  }


  getMonday(currentDate: Date) {
    // Día de la semana (0, 6)
    let day = currentDate.getDay();
    // Obtiene el día lunes de la semana en curso en número
    let diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    // Retorna el día lunes en formato fecha
    return new Date(currentDate.setDate(diff));
  }


  getFirstDayMonth(date: Date) {

    const month = date.getMonth();
    const year = date.getFullYear();
    const day = 1;

    return new Date(year, month, day);

  }


  resetData() {

    this.data = {
      date: new Date(),
      activity: {
        id: '',
        name: '',
        company: { code: 1, name: 'Banco Davivienda', country: { code: 'CO', name: 'Colombia', img: '' } },
        open_state: true,
        initial_date: new Date(),
        end_date: new Date(),
        estimated_hours: 1,
        worked_hours: 1,
        is_general: false
      },

      user: {
        id: '',
        name: '',
        email: '',
        img: '',
        role: { code: '', name: '' },
        area: {
          code: 1, name: '', country: {
            code: '', name: '', img: ''
          }
        }
      },
      
      detail: '',
      hours: 0,
      current_hours: 0,
      edit: false
    };
  }


}
