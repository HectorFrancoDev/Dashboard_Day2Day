import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponseTimeData } from 'app/core/interfaces/ResponseTimeData';
import { RangeTime } from 'app/core/interfaces/TimeRange';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { TimeReportService } from '../time-report/services/time-report/time-report.service';
import * as Chartist from 'chartist';
import * as moment from 'moment';

import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { TimeData } from 'app/core/interfaces/TimeData';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.scss']
})
export class GraphsComponent implements OnInit {


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

  labelsLineChart: string[] = [];
  dataLineChart: number[] = [];

  constructor(
    private notificationService: NotificationsService,
    private reportService: TimeReportService
  ) { }


    // Bar graph
    public lineChartType: ChartType = 'line';

    public lineChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      backgroundColor: '#0080c0',
      borderColor: '#005d8c',
      // We use these empty structures as placeholders for dynamic theming.
      scales: {
        x: {},
        y: {
          min: 0,
          ticks: {
            stepSize: 2,
          }
        }
      }
    };
  
    public lineChartData: ChartData<'line'> = {
      labels: [''],
      datasets: [
        {
          data: [0],
          label: 'Tendencia de trabajo diaria durante el mes en curso',
          hoverBackgroundColor: '#005d8c',
          pointBackgroundColor: '#cc222b',
          pointHoverBorderColor: '#cc222b',
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.3
        }
      ]
    };

  startAnimationForLineChart(chart) {
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function (data) {
      if (data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if (data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  };

  startAnimationForBarChart(chart) {
    let seq2: any, delays2: any, durations2: any;

    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function (data) {
      if (data.type === 'bar') {
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  };

  ngOnInit() {
    /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

    const dataDailySalesChart: any = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [3, 6, 8, 8, 8, 10, 8, 12, 16],
      ]
    };

    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({ tension: 0.5 }),
      axisY: {
        type: Chartist.FixedScaleAxis,
        ticks: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20],
        low: 0,
        hight: 14
      },
      low: 0,
      high: 20, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);


    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    const dataCompletedTasksChart: any = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    const optionsCompletedTasksChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0 }
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    // start animation for the Completed Tasks Chart - Line Chart
    this.startAnimationForLineChart(completedTasksChart);



    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var datawebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionswebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0 }
    };
    var responsiveOptions: any[] = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

    //start animation for the Emails Subscription Chart
    this.startAnimationForBarChart(websiteViewsChart);


    this.getUsersReports(this.idUser);
    setTimeout(() => this.mostrar = true, 1000);

  }



  getUsersReports(id: string) {

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();

    const rangeTime: RangeTime = {
      start: new Date(currentYear, currentMonth, 1),
      end: moment(new Date()).add(1, 'days').toDate()
    };


    this.reportService.getAllTimeData(rangeTime, id)
      .subscribe((reports: ResponseTimeData) => {

        // Organizar reportes del más reciente al más antiguo
        let reportes: TimeData[] = reports.reports.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        // this.fillDetailTable(reportes);
        // Generar el Pie Chart
        // this.generatePieChart(reportes);
        // Generar el Bar Chart
        this.generateBarChart(reportes);

      },
        (error) => console.log(error)
      );
  }
  
  
  private generateBarChart(reports: TimeData[]) {

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

          // this.labelsChart = [];
          // this.dataChart = [];
          // this.backgroundColors = [];

          this.labelsLineChart = [];
          this.dataLineChart = [];

          this.horasTrabajadasEnTotal = 0;


          // Llenar tabla de detalle
          // this.fillDetailTable(reportes); 

          // Generar el Pie Chart
          // this.generatePieChart(reportes);

          // Generar el Bar Chart
          this.generateBarChart(reportes);

          this.mostrar = true;

        },
          (error) => this.notificationService.showNotificationError('Error obteniendo rango de datos!')
        )
    }


  }

}
