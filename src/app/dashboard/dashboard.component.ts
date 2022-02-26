import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as Chartist from 'chartist';

import * as moment from 'moment';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TimeReportService } from 'app/components/time-report/services/time-report/time-report.service';
import { ResponseTimeData } from 'app/core/interfaces/ResponseTimeData';
import { TimeData } from 'app/core/interfaces/TimeData';
import { RangeTime } from 'app/core/interfaces/TimeRange';
import { Activity } from 'app/core/interfaces/Activity';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import * as colombianHolidays from 'colombia-holidays';

export interface AuditorHours {
  auditor: string,
  hours: number
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {

  // 30 colores para las gráficas
  paletaDeColores: string[] = [
    '#21886B', '#0080C0', '#A78859', '#F5D57F', '#CA1177',
    '#7D2B8B', '#7799CF', '#9999FF', '#5E55A0', '#BA4C2E',
    '#82888F', '#CC222B', '#CB1862', '#CA0088', '#57376C',
    '#FF3366', '#D47FFF', '#33348E', '#1B467F', '#00DF00',
    '#33FFCC', '#0033FF', '#E2982F', '#00ACEC', '#699B69',
    '#8ABE6B', '#BBD147', '#D9E021', '#FCEE21', '#00ABD2',
  ];

  allRetriveData: TimeData[] = [];
  currentMonthData: TimeData[] = [];
  lastMonthData: TimeData[] = [];

  filtereMonthData: TimeData[] = [];

  countries: string[] = [];
  filterCountryValue: string;

  companies: string[] = [];
  filterCompanyValue: string;

  activities: string[] = [];
  filterActivityValue: string;

  areas: string[] = [];
  filterAreaValue: string;

  users: string[] = [];
  filterUsersValue: string;

  dataAuditorHoras: any[] = [];

  usersNamesHours: string[] = [];
  usersHours: number[] = [];

  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  public today = new Date();

  mostrarGraficas = false;

  // Line Chart data
  labelsLineChart: string[] = [];
  dataLineChart: number[] = [];

  // Line Chart data
  labelsLineChart2: string[] = [];
  dataLineChart2: number[] = [];

  // Pie Chart data (Activities)
  labelsPieChart: string[] = [];
  dataPieChart: number[] = [];

  // Pie Chart data (Companies)
  labelsPieChartCompanies: string[] = [];
  dataPieChartCompanies: number[] = [];

  horasTrabajadasEnTotal = 0;
  horasTrabajadasEnPromedio = 0;


  // Tabla de detalle
  displayedColumnsAuditorHours: string[] = ['auditor', 'hours'];
  dataSourceAuditorHours: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  // Line Chart (HORAS)
  public lineChartType: ChartType = 'line';

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    backgroundColor: '#699b69',
    borderColor: '#699b69',
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        ticks: {
          stepSize: 4,
        }
      }
    }
  };

  public lineChartData: ChartData<'line'> = {
    labels: [''],
    datasets: [
      {
        data: [0],
        label: 'Mes actual',
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


  // Line Chart 2
  public lineChartType2: ChartType = 'line';

  public lineChartOptions2: ChartConfiguration['options'] = {
    responsive: true,
    backgroundColor: '#D9E021',
    borderColor: '#D9E021',
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {
        min: 0,
        ticks: {
          stepSize: 4,
        }
      }
    }
  };

  public lineChartData2: ChartData<'line'> = {
    labels: [''],
    datasets: [
      {
        data: [0],
        label: 'Mes pasado',
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

  constructor(private reportService: TimeReportService) {
    this.dataSourceAuditorHours = new MatTableDataSource(this.dataAuditorHoras);
  }


  ngAfterViewInit(): void {
    this.dataSourceAuditorHours.paginator = this.paginator;
  }


  ngOnInit() {

    // console.log(colombianHolidays.getColombiaHolidaysByYear(2022));

    this.getUsersReports();

    setTimeout(() => this.mostrarGraficas = true, 10000);

  }

  getUsersReports() {

    // Mes actual
    const rangeTimeCurrentMonth: RangeTime = {
      start: this.getFirstDayMonth(new Date),
      end: moment(new Date()).add(1, 'days').toDate()
    };

    this.range = new FormGroup({
      start: new FormControl(rangeTimeCurrentMonth.start, Validators.required),
      end: new FormControl(new Date(), Validators.required),
    });


    const rangeTimeValue: RangeTime = this.range.value;
    const { start, end } = rangeTimeValue;

    // 30 días menos
    const rangeTimeLastMonth: RangeTime = {
      start: moment(start).subtract(1, 'month').toDate(),
      end: moment(end).subtract(1, 'month').toDate()
    };

    // this.reportService.getAllTimeReportsDashboard(rangeTime)
    this.reportService.getAllTimeReportsDashboard()
      .subscribe((reports: ResponseTimeData) => {

        // Organizar reportes del más reciente al más antiguo
        let reportes: TimeData[] = reports.reports.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // All Data
        this.allRetriveData = reportes

        // Current month
        this.currentMonthData = this.filterReport(rangeTimeCurrentMonth, reportes);

        this.generateLineChart(this.currentMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);

        // Last month
        this.lastMonthData = this.filterReport(rangeTimeLastMonth, reportes);
        // console.log(lastMonth);
        // this.generateLineChart(lastMonth, this.lineChartData2, this.labelsLineChart2, this.dataLineChart2);

        this.chargeCountries(this.currentMonthData);
        this.chargeCompanies(this.currentMonthData);
        this.chargeActivities(this.currentMonthData);
        this.chargeAreas(this.currentMonthData);
        this.chargeUsers(this.currentMonthData);

        this.fillAuditorHoursTable(this.currentMonthData);

        // this.fillDetailTable(reportes);
        // Generar el Pie Chart
        this.generatePieChartActivities(this.currentMonthData);
        // Generar el Pie Chart
        this.generatePieChartCompanies(this.currentMonthData);

      },
        (error) => console.log(error)
      );
  }



  filterReport(rangeTime: RangeTime, reportes: TimeData[]) {

    let filteredReports: TimeData[] = [];

    // Fecha inicio
    filteredReports = reportes.filter(({ date }) => new Date(date) <= rangeTime.end);

    // Fecha fin
    filteredReports = filteredReports.filter(({ date }) => new Date(date) >= rangeTime.start);

    return filteredReports;

  }

  filterReportData() {

  }

  getFirstDayMonth(date: Date) {

    const month = date.getMonth();
    const year = date.getFullYear();
    const day = 1;

    return new Date(year, month, day);

  }

  private generateLineChart(reports: TimeData[], lineChartData: ChartData, labelsLineChart: string[], dataLineChart: number[]) {

    reports.forEach((report: TimeData) => {

      if (report.state) {

        const date = moment(report.date).format('DD-MM-YYYY');

        if (!labelsLineChart.includes(date)) {
          labelsLineChart.push(date);
          dataLineChart.push(report.hours);
        } else {
          let report_1 = labelsLineChart.indexOf(date);
          dataLineChart[report_1] += report.hours;
        }

        this.horasTrabajadasEnTotal += report.hours;
      }
    });

    this.horasTrabajadasEnPromedio = (this.horasTrabajadasEnTotal / dataLineChart.length);

    lineChartData.labels = labelsLineChart;
    lineChartData.datasets[0].data = dataLineChart;

  }

  private generatePieChartActivities(reports: TimeData[]) {


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

  private fillAuditorHoursTable(reports: TimeData[]) {

    reports.forEach((report: TimeData) => {

      if (report.state) {

        if (!this.usersNamesHours.includes(report.user.name)) {
          this.usersNamesHours.push(report.user.name);
          this.usersHours.push(report.hours);
        } else {
          let user = this.usersNamesHours.indexOf(report.user.name);
          this.usersHours[user] += report.hours;

        }

      }
    });

    for (let i = 0; i < this.usersNamesHours.length; i++) {
      this.dataAuditorHoras.push({ name: this.usersNamesHours[i], hours: this.usersHours[i] });
    }

    this.dataSourceAuditorHours.data = this.dataAuditorHoras.sort((a, b) => b.hours - a.hours);

  }


  selectCountry(event: any) {

    if (event.value !== 'all')
      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.activity.company.country.name );
    else
      this.filtereMonthData = this.currentMonthData;

    this.filterCountryValue = event.value;

    this.chargeCompanies(this.filtereMonthData);
    this.chargeActivities(this.filtereMonthData);
    this.chargeAreas(this.filtereMonthData);
    this.chargeUsers(this.filtereMonthData);

    console.log(this.filtereMonthData);

  }

  selectCompany(event: any) {

    if (event.value !== 'all')
      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.activity.company.name);
    else
      this.filtereMonthData = this.currentMonthData;

    this.filterCompanyValue = event.value;

    this.chargeCountries(this.filtereMonthData);
    this.chargeActivities(this.filtereMonthData);
    this.chargeAreas(this.filtereMonthData);
    this.chargeUsers(this.filtereMonthData);

    console.log(this.filtereMonthData);

  }

  selectActivity(event: any) {

    if (event.value !== 'all')
      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.activity.name);
    else
      this.filtereMonthData = this.currentMonthData;

    this.filterActivityValue = event.value;

    this.chargeCountries(this.filtereMonthData);
    this.chargeCompanies(this.filtereMonthData);
    this.chargeAreas(this.filtereMonthData);
    this.chargeUsers(this.filtereMonthData);

    console.log(this.filtereMonthData);

  }

  selectArea(event: any) {

    if (event.value !== 'all')
      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.user.area.name);
    else
      this.filtereMonthData = this.currentMonthData;

    this.filterAreaValue = event.value;

    this.chargeCountries(this.filtereMonthData);
    this.chargeCompanies(this.filtereMonthData);
    this.chargeActivities(this.filtereMonthData);
    this.chargeUsers(this.filtereMonthData);

    console.log(this.filtereMonthData);

  }

  selectUser(event: any) {

    if (event.value !== 'all')
      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.user.name);
    else
      this.filtereMonthData = this.currentMonthData;

    this.filterUsersValue = event.value;

    this.chargeCountries(this.filtereMonthData);
    this.chargeCompanies(this.filtereMonthData);
    this.chargeAreas(this.filtereMonthData);
    this.chargeActivities(this.filtereMonthData);

    console.log(this.filtereMonthData);

  }



  private chargeCountries(reports: TimeData[]) {

    let countriesTemp: string[] = [];

    reports.forEach((report: TimeData) => {

      let data = `${report.activity.company.country.name}`;

      if (!countriesTemp.includes(data))
        countriesTemp.push(data);

    });

    this.countries = countriesTemp.sort();
  }

  private chargeCompanies(reports: TimeData[]) {

    this.companies = [];
    let companiesTemp: string[] = [];

    reports.forEach((report: TimeData) => {

      let data = `${report.activity.company.name}`;

      if (!companiesTemp.includes(data))
        companiesTemp.push(data);

    });

    this.companies = companiesTemp.sort();
  }

  private chargeActivities(reports: TimeData[]) {

    this.activities = [];

    let activitesTemp: string[] = [];

    reports.forEach((report: TimeData) => {

      let data = `${report.activity.name}`;

      if (!activitesTemp.includes(data))
        activitesTemp.push(data);

    });

    this.activities = activitesTemp.sort();
  }

  private chargeAreas(reports: TimeData[]) {

    this.areas = [];

    let areasTemp: string[] = [];

    reports.forEach((report: TimeData) => {

      let data = `${report.user.area.name}`;

      if (!areasTemp.includes(data))
        areasTemp.push(data);

    });

    this.areas = areasTemp.sort();
  }

  private chargeUsers(reports: TimeData[]) {

    this.users = [];

    let usersTemp: string[] = [];

    reports.forEach((report: TimeData) => {

      let data = `${report.user.name}`;

      if (!usersTemp.includes(data))
        usersTemp.push(data);

    });

    this.users = usersTemp.sort();
  }


}
