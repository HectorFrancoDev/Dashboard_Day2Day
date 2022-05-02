import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { ChartConfiguration, ChartData, ChartType, Chart } from 'chart.js';

import { TimeReportService } from 'app/components/time-report/services/time-report/time-report.service';
import { ResponseTimeData } from 'app/core/interfaces/ResponseTimeData';
import { TimeData } from 'app/core/interfaces/TimeData';
import { RangeTime } from 'app/core/interfaces/TimeRange';
import { Activity } from 'app/core/interfaces/Activity';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import * as moment from 'moment';
import * as colombianHolidays from 'colombia-holidays';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';

import { animate, state, style, transition, trigger } from '@angular/animations';

export interface AuditorHours {
  auditor: string,
  hours: number
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}


const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 1,
    name: 'Hydrogen',
    weight: 1.0079,
    symbol: 'H',
    description: `Hydrogen is a chemical element with symbol H and atomic number 1. With a standard
        atomic weight of 1.008, hydrogen is the lightest element on the periodic table.`,
  },
  {
    position: 2,
    name: 'Helium',
    weight: 4.0026,
    symbol: 'He',
    description: `Helium is a chemical element with symbol He and atomic number 2. It is a
        colorless, odorless, tasteless, non-toxic, inert, monatomic gas, the first in the noble gas
        group in the periodic table. Its boiling point is the lowest among all the elements.`,
  },
  {
    position: 3,
    name: 'Lithium',
    weight: 6.941,
    symbol: 'Li',
    description: `Lithium is a chemical element with symbol Li and atomic number 3. It is a soft,
        silvery-white alkali metal. Under standard conditions, it is the lightest metal and the
        lightest solid element.`,
  },
  {
    position: 4,
    name: 'Beryllium',
    weight: 9.0122,
    symbol: 'Be',
    description: `Beryllium is a chemical element with symbol Be and atomic number 4. It is a
        relatively rare element in the universe, usually occurring as a product of the spallation of
        larger atomic nuclei that have collided with cosmic rays.`,
  },
  {
    position: 5,
    name: 'Boron',
    weight: 10.811,
    symbol: 'B',
    description: `Boron is a chemical element with symbol B and atomic number 5. Produced entirely
        by cosmic ray spallation and supernovae and not by stellar nucleosynthesis, it is a
        low-abundance element in the Solar system and in the Earth's crust.`,
  },
  {
    position: 6,
    name: 'Carbon',
    weight: 12.0107,
    symbol: 'C',
    description: `Carbon is a chemical element with symbol C and atomic number 6. It is nonmetallic
        and tetravalent—making four electrons available to form covalent chemical bonds. It belongs
        to group 14 of the periodic table.`,
  },
  {
    position: 7,
    name: 'Nitrogen',
    weight: 14.0067,
    symbol: 'N',
    description: `Nitrogen is a chemical element with symbol N and atomic number 7. It was first
        discovered and isolated by Scottish physician Daniel Rutherford in 1772.`,
  },
  {
    position: 8,
    name: 'Oxygen',
    weight: 15.9994,
    symbol: 'O',
    description: `Oxygen is a chemical element with symbol O and atomic number 8. It is a member of
         the chalcogen group on the periodic table, a highly reactive nonmetal, and an oxidizing
         agent that readily forms oxides with most elements as well as with other compounds.`,
  },
  {
    position: 9,
    name: 'Fluorine',
    weight: 18.9984,
    symbol: 'F',
    description: `Fluorine is a chemical element with symbol F and atomic number 9. It is the
        lightest halogen and exists as a highly toxic pale yellow diatomic gas at standard
        conditions.`,
  },
  {
    position: 10,
    name: 'Neon',
    weight: 20.1797,
    symbol: 'Ne',
    description: `Neon is a chemical element with symbol Ne and atomic number 10. It is a noble gas.
        Neon is a colorless, odorless, inert monatomic gas under standard conditions, with about
        two-thirds the density of air.`,
  },
];


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],

  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]

})
export class DashboardComponent implements OnInit, AfterViewInit {


  public userCountry = localStorage.getItem('country');
  public userRole = localStorage.getItem('role');
  public userArea = localStorage.getItem('area');
  public userId = localStorage.getItem('idUser');

  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });

  public today = new Date();

  mostrarGraficas = false;

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

  // Tabla todos los usuarios
  dataAuditorHoras: any[] = [];
  usersNamesHours: string[] = [];
  usersHours: number[] = [];

  // Tabla Sobrejecutado
  dataAuditorHorasSobrejecutadas: any[] = [];
  usersNamesHoursSobreejecutadas: string[] = [];
  usersHoursSobreejecutadas: number[] = [];

  // Tabla No completado
  dataAuditorHorasNoCompletado: any[] = [];
  usersNamesHoursNoCompletado: string[] = [];
  usersHoursNoCompletado: number[] = [];

  // Tabla de detalles
  detallesReportes: TimeData[] = [];

  // Tabla de avance actividades
  avanceActividadesRealEsperado: any[] = [];

  // Line Chart data
  labelsLineChart: string[] = [];
  dataLineChart: number[] = [];

  // Line Chart data Jefatura
  labelsLineChartJefatura: string[] = [];
  dataLineChartJefatura: number[] = [];

  // Pie Chart data (Activities)
  labelsPieChart: string[] = [];
  dataPieChart: number[] = [];

  // Pie Chart data (Companies)
  labelsPieChartCompanies: string[] = [];
  dataPieChartCompanies: number[] = [];

  // Pie Chart data (Categories)
  labelsPieChartCategories: string[] = [];
  dataPieChartCategories: number[] = [];

  horasTrabajadasEnTotal = 0;
  horasTrabajadasEnPromedio = 0;

  horasTrabajadasEnPromedioArea = 0;
  dataLineChartUsers: string[] = [];

  // Actividades cerradas por fecha
  closedActivitiesNames: string[] = [];
  closedActivitiesEstimatedHours: number[] = [];
  closedActivitiesWorkedHours: number[] = [];

  auditoriasVencidasRangoFecha: number = 0;
  auditoriasVencidasMenosCien: number = 0;
  auditoriasVencidasArribaCien: number = 0;
  auditoriasVencidasEfectividad: number = 0;

  // Tabla de detalle HORAS
  displayedColumnsAuditorHours: string[] = ['auditor', 'hours'];
  dataSourceAuditorHours: MatTableDataSource<any>;
  dataSourceTopSobreEjecutados: MatTableDataSource<any>;
  dataSourceTopNoCompletados: MatTableDataSource<any>;

  // Tabla detalles actividades
  displayedColumnDetalles: string[] = ['date', 'user', 'activity', 'hours', 'detail'];
  dataSourceDetalles: MatTableDataSource<TimeData>;

  // Tabla Planeado vs Real
  // displayedColumnAvanceActividades: string[] = ['country', 'activity', 'end-date', 'estimated-hours', 'worked-hours', 'avance', 'semaforo'];
  displayedColumnAvanceActividades: string[] = ['activity', 'end-date', 'estimated-hours', 'worked-hours', 'estado-open', 'avance', 'semaforo'];
  dataSourceAvanceActividades: MatTableDataSource<any>;


  dataSource = ELEMENT_DATA;
  columnsToDisplay = ['name', 'weight', 'symbol', 'position'];
  expandedElement: any | null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  // Line Chart (HORAS)
  public lineChartType: ChartType = 'line';

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    backgroundColor: '#699b69',
    borderColor: '#699b69',
    animation: false,
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
        type: 'line',
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
      // {
      //   // type: 'bar',
      //   data: [0],
      //   label: 'Mes actual',
      //   hoverBackgroundColor: '#005d8c',
      //   pointBackgroundColor: '#cc222b',
      //   pointHoverBorderColor: '#cc222b',
      //   pointBorderWidth: 2,
      //   pointRadius: 5,
      //   pointHoverRadius: 10,
      //   tension: 0.1
      // },
    ]
  };

  // Bar chart Jefaturas
  public barChartTypeJefatura: ChartType = 'bar';

  public barChartOptionsJefatura: ChartConfiguration['options'] = {
    responsive: true,
    backgroundColor: '#699b69',
    borderColor: '#699b69',
    animation: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {},
      y: {}
    }
  };

  public barChartDataJefatura: ChartData<'bar'> = {
    labels: [''],
    datasets: [
      {
        type: 'bar',
        data: [0],
        label: 'Mes actual',
        backgroundColor: '#005d8c',
        hoverBackgroundColor: '#005d8c',

      },
      {
        type: 'bar',
        data: [0],
        label: 'Mes Pasado',
        backgroundColor: '#BBD147',
        hoverBackgroundColor: '#BBD147',
      },
    ]
  };

  // Bar chart Auditorías Cerradas por mes
  public barChartTypeAuditoriasCerradasMes: ChartType = 'bar';

  public barChartOptionsAuditoriasCerradasMes: ChartConfiguration['options'] = {
    responsive: true,
    backgroundColor: '#699b69',
    borderColor: '#699b69',
    animation: false,
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

  public barChartDataAuditoriaCerradasMes: ChartData<'bar'> = {
    labels: [''],
    datasets: [
      {
        type: 'bar',
        data: [0],
        label: 'Horas estimadas',
        backgroundColor: '#005d8c',
        hoverBackgroundColor: '#005d8c',

      },
      {
        type: 'bar',
        data: [0],
        label: 'Horas trabajadas',
        backgroundColor: '#BBD147',
        hoverBackgroundColor: '#BBD147',
      },
    ]
  };


  // Pie Chart (ACTIVITIES)
  public pieChartType: ChartType = 'doughnut';

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    animation: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Horas empleadas por actividad'
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
        text: 'Horas empleadas por empresa'
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


  // Pie Chart (COMAPNIES)
  public pieChartCategoriesType: ChartType = 'doughnut';

  public pieChartCategoriesOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Horas empleadas por categoría'
      }
    }
  };

  public pieChartCategoriesData: ChartData<'doughnut', number[], string | string[]> = {

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

  constructor(private reportService: TimeReportService, private notificationService: NotificationsService) {
    this.dataSourceAuditorHours = new MatTableDataSource(this.dataAuditorHoras);
    this.dataSourceTopSobreEjecutados = new MatTableDataSource(this.dataAuditorHorasSobrejecutadas);
    this.dataSourceTopNoCompletados = new MatTableDataSource(this.dataAuditorHorasNoCompletado);

    this.dataSourceDetalles = new MatTableDataSource(this.detallesReportes);

    this.dataSourceAvanceActividades = new MatTableDataSource(this.avanceActividadesRealEsperado);
  }

  ngAfterViewInit(): void {
    // this.dataSourceAuditorHours.paginator = this.paginator;
    // this.dataSourceTopSobreEjecutados.paginator = this.paginator;
    // this.dataSourceTopNoCompletados.paginator = this.paginator;

    // this.dataSourceDetalles.paginator = this.paginator;

    // this.dataSourceAvanceActividades.paginator = this.paginator;
  }

  ngOnInit() {
    this.getUsersReports();
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

    // this.reportService.getAllTimeReportsDashboard(rangeTimeCurrentMonth)
    this.reportService.getAllTimeReportsDashboard()
      .subscribe((reports: ResponseTimeData) => {

        // Organizar reportes del más reciente al más antiguo
        let reportes: TimeData[] = reports.reports.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // Si es el vicepresidente
        if (this.userRole === 'VP_ROLE')
          reportes = reportes.filter((r) => r.user.role.code !== 'VP_ROLE');

        // Si es gerente de CAM desde Colombia 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM')
          reportes = reportes.filter((r) => r.user.area.country.code !== 'CO' && r.user.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Conductas especiales 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userArea === '9')
          reportes = reportes.filter((r) => r.user.area.code === 9 && r.user.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Colombia
        else if (this.userRole === 'DIRECTOR_ROLE')
          reportes = reportes.filter((r) => r.user.area.country.code === 'CO' && r.user.area.code !== 9 && r.user.role.code !== 'VP_ROLE' &&
            r.user.role.code !== 'DIRECTOR_ROLE');

        // Si es Apoyo de Dirección
        else if (this.userRole === 'APOYO_DIRECCION_ROLE')
          reportes = reportes.filter((r) => r.user.area.country.code === 'CO' && r.user.area.code !== 9 && r.user.role.code !== 'APOYO_DIRECCION_ROLE');

        // Si es Apoyo de VP
        else if (this.userRole === 'APOYO_VP_ROLE')
          reportes = reportes.filter((r) => r.user.role.code !== 'VP_ROLE');

        // Jefe Nelson Gamba
        else if (this.userRole === 'LEADER_ROLE' && this.userArea === '2') {
          let tempUsersData = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);
          let tempUsersData2 = reportes.filter((r) => r.user.area.code === 3);
          reportes = tempUsersData.concat(tempUsersData2);
        }

        // Si es jefe de Colombia
        else if (this.userRole === 'LEADER_ROLE')
          reportes = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);

        // Si es jefe de CAM
        else if (this.userRole === 'LEADER_CAM_ROLE')
          reportes = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);

        // Si es supervisor con equipo fijo
        else if (this.userRole === 'SUPERVISOR_ROLE') {
          reportes = reportes.filter((r) =>
            r.user.area.code.toString() === this.userArea && r.user.role.code !== 'LEADER_ROLE' && r.user.role.code !== 'SUPERVISOR_ROLE' &&
            r.user.role.code !== 'LEADER_CAM_ROLE' && r.user.role.code !== 'VP_ROLE'
          );
        }

        else
          this.notificationService.showNotificationError('No es posible filtrar a los usuarios');



        // All retrive data
        this.allRetriveData = reportes;

        // Current month
        this.currentMonthData = this.filterReport(rangeTimeCurrentMonth, reportes);
        // Last month
        this.lastMonthData = this.filterReport(rangeTimeLastMonth, reportes);

        this.chargeCountries(this.currentMonthData);
        this.chargeCompanies(this.currentMonthData);
        this.chargeActivities(this.currentMonthData);
        this.chargeAreas(this.currentMonthData);
        this.chargeUsers(this.currentMonthData);


        this.lineChartData.labels = [];
        this.lineChartData.datasets[0].data = [];
        this.generateLineChart(this.currentMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);


        this.generateBarChartJefaturas(this.currentMonthData, this.lastMonthData, this.barChartDataJefatura, this.labelsLineChartJefatura, this.dataLineChartJefatura);

        // this.generateLineChart(lastMonth, this.lineChartData2, this.labelsLineChart2, this.dataLineChart2);

        this.generateBChartDataAuditoriaCerradasMes(this.allRetriveData);

        this.fillAuditorHoursTable(this.currentMonthData);

        this.fillAuditorHoursTableSobreEjecutados(this.currentMonthData);

        this.fillAuditorHoursTableNoCompletado(this.currentMonthData);

        this.fillDetailTable(this.currentMonthData);

        // Generar el Pie Chart
        this.generatePieChartActivities(this.currentMonthData);
        // Generar el Pie Chart
        this.generatePieChartCompanies(this.currentMonthData);
        // Generar el Pie Chart
        // this.generatePieChartCategories(this.currentMonthData);

        // setTimeout(() => this.mostrarGraficas = true, 5000);
        this.mostrarGraficas = true;

      },
        (error) => this.notificationService.showNotificationError(error)
      );
  }

  filterReport(rangeTime: RangeTime, reportes: TimeData[]) {


    let filteredReports: TimeData[] = [];

    // Fecha fin
    filteredReports = reportes.filter(({ date }) => rangeTime.end > moment(date).toDate());

    // Fecha inicio
    filteredReports = filteredReports.filter(({ date }) => rangeTime.start <= moment(date).toDate());

    return filteredReports;

  }

  getFirstDayMonth(date: Date) {

    const month = date.getMonth();
    const year = date.getFullYear();
    const day = 1;

    return new Date(year, month, day);

  }

  private generateLineChart(reports: TimeData[], lineChartData: ChartData, labelsLineChart: string[], dataLineChart: number[]) {

    this.horasTrabajadasEnTotal = 0
    this.horasTrabajadasEnPromedio = 0
    this.horasTrabajadasEnPromedioArea = 0;

    this.dataLineChartUsers = [];

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


        // Agregar usuarios por área
        if (!this.dataLineChartUsers.includes(report.user.name))
          this.dataLineChartUsers.push(report.user.name)
      }
    });

    this.horasTrabajadasEnPromedio = (this.horasTrabajadasEnTotal / dataLineChart.length);
    this.horasTrabajadasEnPromedioArea = (this.horasTrabajadasEnPromedio / this.dataLineChartUsers.length);

    lineChartData.labels = labelsLineChart;
    lineChartData.datasets[0].data = dataLineChart;

  }

  private generateBarChartJefaturas(reportsCurrentMonth: TimeData[], reportsLastMonth: TimeData[], lineChartData: ChartData, labelsLineChart: string[], dataLineChart: number[]) {


    reportsCurrentMonth.forEach((report: TimeData) => {

      if (report.state) {

        const jefatura = report.user.area.name;

        if (!labelsLineChart.includes(jefatura)) {

          labelsLineChart.push(jefatura);
          dataLineChart.push(report.hours);

        } else {

          let report_1 = labelsLineChart.indexOf(jefatura);
          dataLineChart[report_1] += report.hours;

        }
      }
    });


    lineChartData.labels = labelsLineChart;
    lineChartData.datasets[0].data = dataLineChart;


    let dataChart_2: number[] = new Array(labelsLineChart.length).fill(0);

    reportsLastMonth.forEach((report: TimeData) => {

      if (report.state) {

        const jefatura = report.user.area.name;

        if (labelsLineChart.includes(jefatura)) {

          let report_1 = labelsLineChart.indexOf(jefatura);
          dataChart_2[report_1] += report.hours;
        }

      }
    });


    lineChartData.datasets[1].data = dataChart_2;

  }

  private generatePieChartActivities(reports: TimeData[]) {

    this.labelsPieChart = [];
    this.dataPieChart = [];

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

    this.labelsPieChartCompanies = [];
    this.dataPieChartCompanies = [];

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

  private generatePieChartCategories(reports: TimeData[]) {

    this.labelsPieChartCategories = [];
    this.dataPieChartCategories = [];

    reports.forEach((report: TimeData) => {

      if (report.state) {

        if (report.activity.category !== undefined || report.activity.category !== null) {

          if (!this.labelsPieChartCategories.includes(report.activity.company.name)) {
            this.labelsPieChartCategories.push(report.activity.company.name);
            this.dataPieChartCategories.push(report.hours);
          } else {
            let category = this.labelsPieChartCategories.indexOf(report.activity.company.name);
            this.dataPieChartCategories[category] += report.hours;
          }

        }

      }

    });

    let arrayOfObj = this.labelsPieChartCategories.map((d, i) => {

      return {
        label: d,
        data: this.dataPieChartCategories[i] || 0
      };

    });

    let sortedArrayOfObj = arrayOfObj.sort((a, b) => b.data - a.data);

    let newArrayLabel = [];
    let newArrayData = [];

    sortedArrayOfObj.forEach((d) => {
      newArrayLabel.push(d.label);
      newArrayData.push(d.data);
    });


    this.pieChartCategoriesData.labels = newArrayLabel;
    this.pieChartCategoriesData.datasets[0].data = newArrayData

  }

  private fillAuditorHoursTable(reports: TimeData[]) {

    this.dataAuditorHoras = [];
    this.usersNamesHours = [];
    this.usersHours = [];

    reports.forEach((report: TimeData) => {

      if (report.state) {

        if (!this.usersNamesHours.includes(report.user.email)) {
          this.usersNamesHours.push(report.user.email);
          this.usersHours.push(report.hours);
        } else {
          let user = this.usersNamesHours.indexOf(report.user.email);
          this.usersHours[user] += report.hours;
        }
      }
    });

    for (let i = 0; i < this.usersNamesHours.length; i++) {
      this.dataAuditorHoras.push({ name: this.usersNamesHours[i], hours: this.usersHours[i] });
    }

    this.dataSourceAuditorHours.data = this.dataAuditorHoras.sort((a, b) => b.hours - a.hours);

  }

  private fillAuditorHoursTableSobreEjecutados(reports: TimeData[]) {

    this.dataAuditorHorasSobrejecutadas = [];
    this.usersNamesHoursSobreejecutadas = [];
    this.usersHoursSobreejecutadas = [];

    reports.forEach((report: TimeData) => {

      if (report.state) {

        if (!this.usersNamesHoursSobreejecutadas.includes(report.user.name)) {
          this.usersNamesHoursSobreejecutadas.push(report.user.name);
          this.usersHoursSobreejecutadas.push(report.hours);
        } else {
          let user = this.usersNamesHoursSobreejecutadas.indexOf(report.user.name);
          this.usersHoursSobreejecutadas[user] += report.hours;
        }
      }
    });

    for (let i = 0; i < this.usersNamesHoursSobreejecutadas.length; i++) {
      if (this.usersHoursSobreejecutadas[i] >= 168)
        this.dataAuditorHorasSobrejecutadas.push({ name: this.usersNamesHoursSobreejecutadas[i], hours: this.usersHoursSobreejecutadas[i] });
    }

    this.dataSourceTopSobreEjecutados.data = this.dataAuditorHorasSobrejecutadas.sort((a, b) => b.hours - a.hours);

  }

  private fillAuditorHoursTableNoCompletado(reports: TimeData[]) {

    this.dataAuditorHorasNoCompletado = [];
    this.usersNamesHoursNoCompletado = [];
    this.usersHoursNoCompletado = [];

    reports.forEach((report: TimeData) => {

      if (report.state) {

        if (!this.usersNamesHoursNoCompletado.includes(report.user.name)) {
          this.usersNamesHoursNoCompletado.push(report.user.name);
          this.usersHoursNoCompletado.push(report.hours);
        } else {
          let user = this.usersNamesHoursNoCompletado.indexOf(report.user.name);
          this.usersHoursNoCompletado[user] += report.hours;
        }
      }
    });

    for (let i = 0; i < this.usersNamesHoursNoCompletado.length; i++) {
      if (this.usersHoursNoCompletado[i] <= 152)
        this.dataAuditorHorasNoCompletado.push({ name: this.usersNamesHoursNoCompletado[i], hours: this.usersHoursNoCompletado[i] });
    }

    this.dataSourceTopNoCompletados.data = this.dataAuditorHorasNoCompletado.sort((a, b) => a.hours - b.hours);

  }

  private fillDetailTable(reports: TimeData[]) {
    this.detallesReportes = reports;
    this.dataSourceDetalles.data = this.detallesReportes;
  }

  private fillTableZeroHours(reports: TimeData[]) {

  }


  /******* GENERAR GRAFICAS DE ACTIVIDADES ************+ */

  private generateBChartDataAuditoriaCerradasMes(reports: TimeData[]) {

    let uniqueActivitiesName: string[] = [];
    let uniqueActivities: Activity[] = [];

    this.auditoriasVencidasRangoFecha = 0;
    this.auditoriasVencidasMenosCien = 0;
    this.auditoriasVencidasArribaCien = 0;
    this.auditoriasVencidasEfectividad = 0;

    reports.forEach((report) => {

      if (!report.activity.is_general)

        if (!uniqueActivitiesName.includes(report.activity.name)) {
          uniqueActivitiesName.push(report.activity.name);
          uniqueActivities.push(report.activity);
        }
    });

    const rangeTimeValue: RangeTime = this.range.value;
    const { start, end } = rangeTimeValue;

    const cerradasEsteMes: Activity[] = uniqueActivities.filter((activity) => {
      return !activity.is_general &&
        moment(activity.end_date).toDate() >= moment(start).toDate() &&
        moment(activity.end_date).toDate() < moment(end).toDate()
    });

    for (let i = 0; i < cerradasEsteMes.length; i++) {
      this.closedActivitiesNames.push(cerradasEsteMes[i].name);
      this.closedActivitiesEstimatedHours.push(cerradasEsteMes[i].estimated_hours);
      this.closedActivitiesWorkedHours.push(cerradasEsteMes[i].worked_hours);
    }

    this.auditoriasVencidasRangoFecha = cerradasEsteMes.length;
    this.auditoriasVencidasMenosCien = cerradasEsteMes.filter((a) => a.worked_hours < a.estimated_hours).length;
    this.auditoriasVencidasArribaCien = cerradasEsteMes.filter((a) => a.worked_hours >= a.estimated_hours).length;
    // this.auditoriasVencidasEfectividad = (this.auditoriasVencidasArribaCien / this.auditoriasVencidasRangoFecha) * 100;
    this.auditoriasVencidasEfectividad = (this.auditoriasVencidasArribaCien / this.auditoriasVencidasRangoFecha) * 100;


    this.barChartDataAuditoriaCerradasMes.labels = this.closedActivitiesNames;
    this.barChartDataAuditoriaCerradasMes.datasets[0].data = this.closedActivitiesEstimatedHours;
    this.barChartDataAuditoriaCerradasMes.datasets[1].data = this.closedActivitiesWorkedHours;


    // Tabla de vencidos
    this.avanceActividadesRealEsperado = [];
    this.fillAvanceActividades(cerradasEsteMes);

  }

  private fillAvanceActividades(cerradasEsteMes: Activity[]) {

    cerradasEsteMes.forEach((activity) => {

      this.avanceActividadesRealEsperado.push({
        country: activity.company.country.name,
        company: activity.company.name,
        // users: activity.users,
        name: activity.name,
        fecha_cierre: activity.end_date,
        estimated_hours: activity.estimated_hours,
        worked_hours: activity.worked_hours,
        avance_actividades: (activity.worked_hours / activity.estimated_hours) * 100,
        open_state: activity.open_state ? 'Abierto' : 'Cerrados',
        semaforo:
          (activity.worked_hours / activity.estimated_hours) >= 1 ? 'red' :
            (activity.worked_hours / activity.estimated_hours) <= 1 ? 'yellow' : 'green'
      });

    });


    console.log(this.avanceActividadesRealEsperado);

    this.dataSourceAvanceActividades.data = this.avanceActividadesRealEsperado.sort((a, b) => b.avance_actividades - a.avance_actividades);
  }

  /******************* CARGAR MAT SELECT DE FILTROS ************************+*/

  selectCountry(event: any) {

    this.filterCompanyValue = '';
    this.filterActivityValue = '';
    this.filterAreaValue = '';
    this.filterUsersValue = '';

    this.mostrarGraficas = false;

    this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.user.area.country.name);
    let filteredLastMonth = this.lastMonthData.filter((report) => event.value === report.user.area.country.name);

    this.filterCountryValue = event.value;

    this.chargeCompanies(this.filtereMonthData);
    this.chargeActivities(this.filtereMonthData);
    this.chargeAreas(this.filtereMonthData);
    this.chargeUsers(this.filtereMonthData);

    // Line Chart data
    this.labelsLineChart = [];
    this.dataLineChart = [];
    this.generateLineChart(this.filtereMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);

    // Line Chart data Jefatura
    this.labelsLineChartJefatura = [];
    this.dataLineChartJefatura = [];
    this.generateBarChartJefaturas(this.filtereMonthData, filteredLastMonth, this.barChartDataJefatura, this.labelsLineChartJefatura, this.dataLineChartJefatura);


    // Actividades cerradas por fecha
    this.closedActivitiesNames = [];
    this.closedActivitiesEstimatedHours = [];
    this.closedActivitiesWorkedHours = [];
    // this.generateBChartDataAuditoriaCerradasMes(this.allRetriveData);
    this.generateBChartDataAuditoriaCerradasMes(this.filtereMonthData);


    this.dataSourceAuditorHours.data = [];
    this.fillAuditorHoursTable(this.filtereMonthData);

    this.fillAuditorHoursTableSobreEjecutados(this.filtereMonthData);

    this.fillAuditorHoursTableNoCompletado(this.filtereMonthData);


    this.fillDetailTable(this.filtereMonthData);

    // Generar el Pie Chart
    this.generatePieChartActivities(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCompanies(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCategories(this.filtereMonthData);


    // this.mostrarGraficas = true;
    setTimeout(() => this.mostrarGraficas = true, 500);

  }

  selectCompany(event: any) {

    this.filterActivityValue = '';

    this.mostrarGraficas = false;

    if (event.value !== 'all')
      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.activity.company.name);
    else
      // this.filtereMonthData = this.currentMonthData;
      this.restartData();

    this.filterCompanyValue = event.value;

    // this.chargeCountries(this.filtereMonthData);
    this.chargeActivities(this.filtereMonthData);
    this.chargeAreas(this.filtereMonthData);
    this.chargeUsers(this.filtereMonthData);

    // Actividades cerradas por fecha
    this.closedActivitiesNames = [];
    this.closedActivitiesEstimatedHours = [];
    this.closedActivitiesWorkedHours = [];
    // this.generateBChartDataAuditoriaCerradasMes(this.allRetriveData);
    this.generateBChartDataAuditoriaCerradasMes(this.filtereMonthData);

    // Line Chart data
    this.labelsLineChart = [];
    this.dataLineChart = [];
    this.generateLineChart(this.filtereMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);

    this.dataSourceAuditorHours.data = [];
    this.fillAuditorHoursTable(this.filtereMonthData);

    this.fillAuditorHoursTableSobreEjecutados(this.filtereMonthData);

    this.fillAuditorHoursTableNoCompletado(this.filtereMonthData);

    this.fillDetailTable(this.filtereMonthData);
    // this.fillDetailTable(reportes);
    // Generar el Pie Chart
    this.generatePieChartActivities(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCompanies(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCategories(this.filtereMonthData);

    // this.mostrarGraficas = true;
    setTimeout(() => this.mostrarGraficas = true, 500);


  }

  selectActivity(event: any) {


    this.mostrarGraficas = false;

    if (event.value !== 'all')
      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.activity.name);
    else
      // this.filtereMonthData = this.currentMonthData;
      this.restartData();


    // this.chargeCountries(this.filtereMonthData);
    // this.chargeCompanies(this.filtereMonthData);
    this.chargeAreas(this.filtereMonthData);
    this.chargeUsers(this.filtereMonthData);

    this.filterActivityValue = event.value;
    // Line Chart data
    this.labelsLineChart = [];
    this.dataLineChart = [];
    this.generateLineChart(this.filtereMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);

    this.dataSourceAuditorHours.data = [];

    this.fillAuditorHoursTable(this.filtereMonthData);

    this.fillAuditorHoursTableSobreEjecutados(this.filtereMonthData);

    this.fillAuditorHoursTableNoCompletado(this.filtereMonthData);

    this.fillDetailTable(this.filtereMonthData);
    // this.fillDetailTable(reportes);
    // Generar el Pie Chart
    this.generatePieChartActivities(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCompanies(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCategories(this.filtereMonthData);

    setTimeout(() => this.mostrarGraficas = true, 500);

  }

  selectArea(event: any) {

    this.filterUsersValue = '';

    this.mostrarGraficas = false;
    let filteredLastMonth;

    if (event.value !== 'all') {

      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.user.area.name);
      filteredLastMonth = this.lastMonthData.filter((report) => event.value === report.user.area.name);
    }
    else
      // this.filtereMonthData = this.currentMonthData;
      this.restartData();

    this.filterAreaValue = event.value;

    // this.chargeCountries(this.filtereMonthData);
    this.chargeCompanies(this.filtereMonthData);
    this.chargeActivities(this.filtereMonthData);
    this.chargeUsers(this.filtereMonthData);


    // Line Chart data
    this.labelsLineChart = [];
    this.dataLineChart = [];
    this.generateLineChart(this.filtereMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);

    // Line Chart data Jefatura
    this.labelsLineChartJefatura = [];
    this.dataLineChartJefatura = [];
    this.generateBarChartJefaturas(this.filtereMonthData, filteredLastMonth, this.barChartDataJefatura, this.labelsLineChartJefatura, this.dataLineChartJefatura);


    // Actividades cerradas por fecha
    this.closedActivitiesNames = [];
    this.closedActivitiesEstimatedHours = [];
    this.closedActivitiesWorkedHours = [];
    // this.generateBChartDataAuditoriaCerradasMes(this.allRetriveData);
    this.generateBChartDataAuditoriaCerradasMes(this.filtereMonthData);


    this.dataSourceAuditorHours.data = [];
    this.fillAuditorHoursTable(this.filtereMonthData);

    this.fillAuditorHoursTableSobreEjecutados(this.filtereMonthData);

    this.fillAuditorHoursTableNoCompletado(this.filtereMonthData);

    this.fillDetailTable(this.filtereMonthData);
    // this.fillDetailTable(reportes);
    // Generar el Pie Chart
    this.generatePieChartActivities(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCompanies(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCategories(this.filtereMonthData);

    // this.mostrarGraficas = true;
    setTimeout(() => this.mostrarGraficas = true, 500);

  }

  selectUser(event: any) {

    this.mostrarGraficas = false;

    if (event.value !== 'all')
      this.filtereMonthData = this.currentMonthData.filter((report) => event.value === report.user.name);
    else
      // this.filtereMonthData = this.currentMonthData;
      this.restartData();

    this.filterUsersValue = event.value;

    // this.chargeCountries(this.filtereMonthData);
    this.chargeCompanies(this.filtereMonthData);
    // this.chargeAreas(this.filtereMonthData);
    this.chargeActivities(this.filtereMonthData);

    // Line Chart data
    this.labelsLineChart = [];
    this.dataLineChart = [];
    this.generateLineChart(this.filtereMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);

    this.dataSourceAuditorHours.data = [];
    this.fillAuditorHoursTable(this.filtereMonthData);

    this.fillDetailTable(this.filtereMonthData);
    // this.fillDetailTable(reportes);
    // Generar el Pie Chart
    this.generatePieChartActivities(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCompanies(this.filtereMonthData);
    // Generar el Pie Chart
    this.generatePieChartCategories(this.filtereMonthData);

    // this.mostrarGraficas = true;
    setTimeout(() => this.mostrarGraficas = true, 500);

  }


  private chargeCountries(reports: TimeData[]) {

    this.countries = [];
    let countriesTemp: string[] = [];

    reports.forEach((report: TimeData) => {

      let data = `${report.user.area.country.name}`;

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


  /******* FILTRO DE DATOS POR FECHA O RESETEAR EL INFORME ********/

  filterReportData() {


    const filteredRangeTime: RangeTime = this.range.value;
    const { start, end } = filteredRangeTime;

    if (start && end) {

      this.filterCountryValue = '';
      this.filterCompanyValue = '';
      this.filterActivityValue = '';
      this.filterAreaValue = '';
      this.filterUsersValue = '';

      this.mostrarGraficas = false;

      const endMoment = moment(end).add(1, 'days');
      filteredRangeTime.end = endMoment.toDate();

      // 30 días menos
      const rangeTimeLastMonth: RangeTime = {
        start: moment(start).subtract(1, 'month').toDate(),
        end: moment(endMoment).subtract(1, 'month').toDate()
      };

      this.reportService.getAllTimeReportsDashboard()
        .subscribe((reports: ResponseTimeData) => {


          // Organizar reportes del más reciente al más antiguo
          let reportes: TimeData[] = reports.reports.sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );


          // Si es el vicepresidente
          if (this.userRole === 'VP_ROLE')
            reportes = reportes.filter((r) => r.user.role.code !== 'VP_ROLE');

          // Si es gerente de CAM desde Colombia 
          else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM')
            reportes = reportes.filter((r) => r.user.area.country.code !== 'CO' && r.user.role.code !== 'DIRECTOR_ROLE');

          // Si es director de Conductas especiales 
          else if (this.userRole === 'DIRECTOR_ROLE' && this.userArea === '9')
            reportes = reportes.filter((r) => r.user.area.code === 9 && r.user.role.code !== 'DIRECTOR_ROLE');

          // Si es director de Colombia
          else if (this.userRole === 'DIRECTOR_ROLE')
            reportes = reportes.filter((r) => r.user.area.country.code === 'CO' && r.user.area.code !== 9 && r.user.role.code !== 'VP_ROLE' &&
              r.user.role.code !== 'DIRECTOR_ROLE');

          // Jefe Nelson Gamba
          else if (this.userRole === 'LEADER_ROLE' && this.userArea === '2') {
            let tempUsersData = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);
            let tempUsersData2 = reportes.filter((r) => r.user.area.code === 3);
            reportes = tempUsersData.concat(tempUsersData2);
          }

          // Si es jefe de Colombia
          else if (this.userRole === 'LEADER_ROLE')
            reportes = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);

          // Si es jefe de CAM
          else if (this.userRole === 'LEADER_CAM_ROLE')
            reportes = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);

          // Si es supervisor con equipo fijo
          else if (this.userRole === 'SUPERVISOR_ROLE') {
            reportes = reportes.filter((r) =>
              r.user.area.code.toString() === this.userArea && r.user.role.code !== 'LEADER_ROLE' && r.user.role.code !== 'SUPERVISOR_ROLE' &&
              r.user.role.code !== 'LEADER_CAM_ROLE' && r.user.role.code !== 'VP_ROLE'
            );
          }

          else
            this.notificationService.showNotificationError('No es posible filtrar a los usuarios');


          this.currentMonthData = [];
          // Current month
          this.currentMonthData = this.filterReport(filteredRangeTime, reportes);

          // Line Chart data
          this.labelsLineChart = [];
          this.dataLineChart = [];
          this.lineChartData.labels = [];
          this.lineChartData.datasets[0].data = [];
          this.generateLineChart(this.currentMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);

          this.lastMonthData = [];
          // Last month
          this.lastMonthData = this.filterReport(rangeTimeLastMonth, reportes);
          this.generateBarChartJefaturas(this.currentMonthData, this.lastMonthData, this.barChartDataJefatura, this.labelsLineChartJefatura, this.dataLineChartJefatura);

          // this.generateLineChart(lastMonth, this.lineChartData2, this.labelsLineChart2, this.dataLineChart2);

          // Actividades cerradas por fecha
          this.closedActivitiesNames = [];
          this.closedActivitiesEstimatedHours = [];
          this.closedActivitiesWorkedHours = [];
          this.generateBChartDataAuditoriaCerradasMes(this.allRetriveData);

          this.chargeCountries(this.currentMonthData);
          this.chargeCompanies(this.currentMonthData);
          this.chargeActivities(this.currentMonthData);
          this.chargeAreas(this.currentMonthData);
          this.chargeUsers(this.currentMonthData);

          this.fillAuditorHoursTable(this.currentMonthData);

          this.fillAuditorHoursTableSobreEjecutados(this.currentMonthData);

          this.fillAuditorHoursTableNoCompletado(this.currentMonthData);


          this.fillDetailTable(this.currentMonthData);
          // Generar el Pie Chart
          this.generatePieChartActivities(this.currentMonthData);
          // Generar el Pie Chart
          this.generatePieChartCompanies(this.currentMonthData);
          // Generar el Pie Chart
          this.generatePieChartCategories(this.currentMonthData);

          // setTimeout(() => this.mostrarGraficas = true, 5000);
          this.mostrarGraficas = true;

        },
          (error) => this.notificationService.showNotificationError(error)
        );

    }

  }

  restartData() {

    this.filterCountryValue = '';
    this.filterCompanyValue = '';
    this.filterActivityValue = '';
    this.filterAreaValue = '';
    this.filterUsersValue = '';

    this.mostrarGraficas = false;

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


        // Si es el vicepresidente
        if (this.userRole === 'VP_ROLE')
          reportes = reportes.filter((r) => r.user.role.code !== 'VP_ROLE');

        // Si es gerente de CAM desde Colombia 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM')
          reportes = reportes.filter((r) => r.user.area.country.code !== 'CO' && r.user.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Conductas especiales 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userArea === '9')
          reportes = reportes.filter((r) => r.user.area.code === 9 && r.user.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Colombia
        else if (this.userRole === 'DIRECTOR_ROLE')
          reportes = reportes.filter((r) => r.user.area.country.code === 'CO' && r.user.area.code !== 9 && r.user.role.code !== 'VP_ROLE' &&
            r.user.role.code !== 'DIRECTOR_ROLE');

        // Jefe Nelson Gamba
        else if (this.userRole === 'LEADER_ROLE' && this.userArea === '2') {
          let tempUsersData = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);
          let tempUsersData2 = reportes.filter((r) => r.user.area.code === 3);
          reportes = tempUsersData.concat(tempUsersData2);
        }

        // Si es jefe de Colombia
        else if (this.userRole === 'LEADER_ROLE')
          reportes = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);

        // Si es jefe de CAM
        else if (this.userRole === 'LEADER_CAM_ROLE')
          reportes = reportes.filter((r) => r.user.area.code.toString() === this.userArea && r.user.role.code !== this.userRole);

        // Si es supervisor con equipo fijo
        else if (this.userRole === 'SUPERVISOR_ROLE') {
          reportes = reportes.filter((r) =>
            r.user.area.code.toString() === this.userArea && r.user.role.code !== 'LEADER_ROLE' && r.user.role.code !== 'SUPERVISOR_ROLE' &&
            r.user.role.code !== 'LEADER_CAM_ROLE' && r.user.role.code !== 'VP_ROLE'
          );
        }

        else
          this.notificationService.showNotificationError('No es posible filtrar a los usuarios');


        // Current month
        this.currentMonthData = [];
        this.currentMonthData = this.filterReport(rangeTimeCurrentMonth, reportes);

        // Line Chart data
        this.labelsLineChart = [];
        this.dataLineChart = [];
        this.lineChartData.labels = [];
        this.lineChartData.datasets[0].data = [];

        this.generateLineChart(this.currentMonthData, this.lineChartData, this.labelsLineChart, this.dataLineChart);

        // Last month
        this.lastMonthData = this.filterReport(rangeTimeLastMonth, reportes);

        // Line Chart data Jefatura
        this.labelsLineChartJefatura = [];
        this.dataLineChartJefatura = [];

        this.generateBarChartJefaturas(this.currentMonthData, this.lastMonthData, this.barChartDataJefatura, this.labelsLineChartJefatura, this.dataLineChartJefatura);
        // console.log(lastMonth);
        // this.generateLineChart(lastMonth, this.lineChartData2, this.labelsLineChart2, this.dataLineChart2);

        // Actividades cerradas por fecha
        this.closedActivitiesNames = [];
        this.closedActivitiesEstimatedHours = [];
        this.closedActivitiesWorkedHours = [];

        this.generateBChartDataAuditoriaCerradasMes(this.allRetriveData);

        this.chargeCountries(this.currentMonthData);
        this.chargeCompanies(this.currentMonthData);
        this.chargeActivities(this.currentMonthData);
        this.chargeAreas(this.currentMonthData);
        this.chargeUsers(this.currentMonthData);



        this.dataSourceAuditorHours.data = [];
        this.fillAuditorHoursTable(this.currentMonthData);

        this.dataSourceDetalles.data = [];
        this.fillDetailTable(this.currentMonthData);
        // Generar el Pie Chart

        this.generatePieChartActivities(this.currentMonthData);
        // Generar el Pie Chart
        this.generatePieChartCompanies(this.currentMonthData);
        // Generar el Pie Chart
        this.generatePieChartCategories(this.currentMonthData);


        this.mostrarGraficas = true;

      },
        (error) => this.notificationService.showNotificationError(error)
      );


  }

}
