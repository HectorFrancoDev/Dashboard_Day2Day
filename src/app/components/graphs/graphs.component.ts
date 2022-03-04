import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseTimeData } from 'app/core/interfaces/ResponseTimeData';
import { RangeTime } from 'app/core/interfaces/TimeRange';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { TimeReportService } from '../time-report/services/time-report/time-report.service';
// import * as Chartist from 'chartist';
import * as moment from 'moment';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TimeData } from 'app/core/interfaces/TimeData';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit, AfterViewInit {

  // 30 colores para las gráficas
  paletaDeColores: string[] = [
    '#21886B', '#0080C0', '#A78859', '#F5D57F', '#CA1177',
    '#7D2B8B', '#7799CF', '#9999FF', '#5E55A0', '#BA4C2E',
    '#82888F', '#CC222B', '#CB1862', '#CA0088', '#57376C',
    '#FF3366', '#D47FFF', '#33348E', '#1B467F', '#00DF00',
    '#33FFCC', '#0033FF', '#E2982F', '#00ACEC', '#699B69',
    '#8ABE6B', '#BBD147', '#D9E021', '#FCEE21', '#00ABD2',
  ];


  @Input()
  idUser: string

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  today = new Date();

  mostrar = false;

  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });


  horasTrabajadasEnTotal = 0;
  horasTrabajadasEnPromedio = 0;


  // Line Chart data
  labelsLineChart: string[] = [];
  dataLineChart: number[] = [];

  // Pie Chart data (Activities)
  labelsPieChart: string[] = [];
  dataPieChart: number[] = [];

  // Pie Chart data (Companies)
  labelsPieChartCompanies: string[] = [];
  dataPieChartCompanies: number[] = [];

  // backgroundPieColors: string[] = [];


  private timeData: TimeData[] = [];

  // Tabla de detalle
  displayedColumns: string[] = ['date', 'activity', 'hours', 'detail'];
  dataSource: MatTableDataSource<TimeData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private notificationService: NotificationsService,
    private reportService: TimeReportService
  ) {
    this.dataSource = new MatTableDataSource(this.timeData);
  }

  // Line Chart (HORAS)
  public lineChartType: ChartType = 'line';

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    backgroundColor: '#699b69',
    borderColor: '#699b69',
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {}
    }
  };

  public lineChartData: ChartData<'line'> = {
    labels: [''],
    datasets: [
      {
        data: [0],
        label: 'Horas de trabajo',
        hoverBackgroundColor: '#005d8c',
        pointBackgroundColor: '#cc222b',
        pointHoverBorderColor: '#cc222b',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 10,
        tension: 0.1
      }
    ]
  };

  // Pie Chart (ACTIVITIES)
  public pieChartType: ChartType = 'doughnut';

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Horas trabajadas por actividad'
      }
    }
  };

  public pieChartData: ChartData<'doughnut', number[], string | string[]> = {

    labels: [''],
    datasets: [
      {
        data: [0],
        backgroundColor: this.paletaDeColores,
        hoverBackgroundColor: this.paletaDeColores,
        borderWidth: 0
      }
    ]
  };


  // Pie Chart (COMAPNIES)
  public pieChartCompaniesType: ChartType = 'doughnut';

  public pieChartCompaniesOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Horas trabajadas por empresa'
      }
    }
  };

  public pieChartCompaniesData: ChartData<'doughnut', number[], string | string[]> = {

    labels: [''],
    datasets: [
      {
        data: [0],
        backgroundColor: this.paletaDeColores,
        hoverBackgroundColor: this.paletaDeColores,
        borderWidth: 0
      }
    ]
  };



  ngOnInit() {

    this.getUsersReports(this.idUser);
    setTimeout(() => this.mostrar = true, 1000);

  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getUsersReports(id: string) {

    const rangeTime: RangeTime = {
      start: this.getMonday(new Date),
      end: moment(new Date()).add(1, 'days').toDate()
    };

    this.range = new FormGroup({
      start: new FormControl(rangeTime.start, Validators.required),
      end: new FormControl(new Date(), Validators.required),
    });

    this.reportService.getAllTimeData(rangeTime, id)
      .subscribe((reports: ResponseTimeData) => {

        // Organizar reportes del más reciente al más antiguo
        let reportes: TimeData[] = reports.reports.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        this.fillDetailTable(reportes);
        // Generar el Pie Chart
        this.generatePieChart(reportes);
        // Generar el Pie Chart
        this.generatePieChartCompanies(reportes);
        // Generar el Bar Chart
        this.generateLineChart(reportes);

      },
        (error) => console.log(error)
      );
  }

  private generateLineChart(reports: TimeData[]) {

    reports.forEach((report: TimeData) => {

      if (report.state) {

        const date = moment(report.date).format('DD-MM-YYYY');

        if (!this.labelsLineChart.includes(date)) {
          this.labelsLineChart.push(date);
          this.dataLineChart.push(report.hours);
        } else {
          let report_1 = this.labelsLineChart.indexOf(date);
          this.dataLineChart[report_1] += report.hours;
        }

        this.horasTrabajadasEnTotal += report.hours;

      }
    });

    this.horasTrabajadasEnPromedio = (this.horasTrabajadasEnTotal / this.dataLineChart.length);

    this.lineChartData.labels = this.labelsLineChart;
    this.lineChartData.datasets[0].data = this.dataLineChart;

  }

  private generatePieChart(reports: TimeData[]) {


    reports.forEach((report: TimeData) => {

      if (report.state) {

        if (!this.labelsPieChart.includes(report.activity.name)) {
          this.labelsPieChart.push(report.activity.name);
          this.dataPieChart.push(report.hours);
        } else {
          let activity = this.labelsPieChart.indexOf(report.activity.name);
          this.dataPieChart[activity] += report.hours;
        }

      }

    });

    let arrayOfObj = this.labelsPieChart.map((d, i) => {

      return {
        label: d,
        data: this.dataPieChart[i] || 0
      };

    });

    let sortedArrayOfObj = arrayOfObj.sort((a, b) => b.data - a.data);

    let newArrayLabel = [];
    let newArrayData = [];

    sortedArrayOfObj.forEach((d) => {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });


    this.pieChartData.labels = newArrayLabel;
    this.pieChartData.datasets[0].data = newArrayData

    // this.generateBackgroundColors();
  }

  private generatePieChartCompanies(reports: TimeData[]) {

    reports.forEach((report: TimeData) => {

      if (report.state) {

        if (!this.labelsPieChartCompanies.includes(report.activity.company.name)) {
          this.labelsPieChartCompanies.push(report.activity.company.name);
          this.dataPieChartCompanies.push(report.hours);
        } else {
          let company = this.labelsPieChartCompanies.indexOf(report.activity.company.name);
          this.dataPieChartCompanies[company] += report.hours;
        }

      }

    });

    let arrayOfObj = this.labelsPieChartCompanies.map((d, i) => {

      return {
        label: d,
        data: this.dataPieChartCompanies[i] || 0
      };

    });

    let sortedArrayOfObj = arrayOfObj.sort((a, b) => b.data - a.data);

    let newArrayLabel = [];
    let newArrayData = [];

    sortedArrayOfObj.forEach((d) => {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });


    this.pieChartCompaniesData.labels = newArrayLabel;
    this.pieChartCompaniesData.datasets[0].data = newArrayData

    // this.generateBackgroundColors();
  }

  private fillDetailTable(responseTimeData: TimeData[]) {
    this.timeData = responseTimeData;
    this.dataSource.data = this.timeData;
  }

  public filterReport() {


    const rangeTime: RangeTime = this.range.value;
    const { start, end } = rangeTime;

    if (start && end) {

      this.mostrar = false;
      
      const endMoment = moment(end).add(1, 'days');
      rangeTime.end = endMoment.toDate();

      this.reportService.getAllTimeData(rangeTime, this.idUser)
        .subscribe((reports: ResponseTimeData) => {

          // Organizar reportes del más reciente al más antiguo
          let reportes = reports.reports.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );

          this.horasTrabajadasEnTotal = 0;
          this.horasTrabajadasEnPromedio = 0;

          this.labelsPieChart = [];
          this.dataPieChart = [];

          this.labelsPieChartCompanies = [];
          this.dataPieChartCompanies = [];

          this.labelsLineChart = [];
          this.dataLineChart = [];

          // Llenar tabla de detalle
          this.fillDetailTable(reportes);

          // Generar el Pie Chart
          this.generatePieChart(reportes);

          // Generar el Pie Chart
          this.generatePieChartCompanies(reportes);

          // Generar el Bar Chart
          this.generateLineChart(reportes);

          this.mostrar = true;

        },
          (error) => this.notificationService.showNotificationError('Error obteniendo rango de datos!')
        )
    }


  }


  getMonday(currentDate: Date) {
    // Día de la semana (0, 6)
    let day = currentDate.getDay();
    // Obtiene el día lunes de la semana en curso en número
    let diff = currentDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    // Retorna el día lunes en formato fecha
    return new Date(currentDate.setDate(diff));
  }

  resetDataRange() {
    this.mostrar = false;

    this.horasTrabajadasEnTotal = 0;
    this.horasTrabajadasEnPromedio = 0;

    this.labelsPieChart = [];
    this.dataPieChart = [];

    this.labelsLineChart = [];
    this.dataLineChart = [];


    this.getUsersReports(this.idUser);
    setTimeout(() => this.mostrar = true, 1000);
  }

}
