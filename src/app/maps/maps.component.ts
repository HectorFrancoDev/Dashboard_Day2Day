import { AfterViewInit, Component, OnInit } from '@angular/core';


import * as Highcharts from 'highcharts/highmaps';
import worldMap from '@highcharts/map-collection/custom/world.geo.json';
import proj4 from 'proj4';

// declare const google: any;
declare const $: any;

interface Marker {
    lat: number;
    lng: number;
    label?: string;
    draggable?: boolean;
}
@Component({
    selector: 'app-maps',
    templateUrl: './maps.component.html',
    styleUrls: ['./maps.component.css']
})
export class MapsComponent implements OnInit, AfterViewInit {

    Highcharts: typeof Highcharts = Highcharts;
    chartConstructor = 'mapChart';

    chartOptions: Highcharts.Options = {
        chart: {
            map: worldMap,
            proj4: proj4
        },
        title: {
            text: 'Usuarios por país'
        },
        legend: {
            enabled: true,
        },
        colorAxis: {
            min: 0,
        },
        series: [
            {
                name: 'Usuarios por país',
                states: {
                    select: {
                        color: 'da55d3'
                    },
                    hover: {
                        color: '#da55d3',
                    },
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}',
                },
                allAreas: false,
                data: [

                    ['co', 100],
                    ['pa', 3],
                    ['cr', 15],
                    ['sv', 12],
                    ['hn', 15]

                ],
            } as Highcharts.SeriesMapOptions
            // {
            //     // Specify points using lat/lon
            //     type: 'mappoint',
            //     name: 'Colombia y CAM',
            //     marker: {
            //         radius: 3,
            //         fillColor: 'tomato',
            //     },
            //     data: [
            //         {
            //             name: 'Bogotá',
            //             lat: 4.786,
            //             lon: -74.063,
            //         },
            //         {
            //             name: 'Panamá City',
            //             lat: 8.983333,
            //             lon: -79.516670,
            //         },
            //         {
            //             name: 'San José',
            //             lat: 9.934739,
            //             lon: -84.087502,
            //         },
            //         {
            //             name: 'Tegucigalpa',
            //             lat: 14.081999,
            //             lon: -87.202438,
            //         },
            //         {
            //             name: 'San Salvador',
            //             lat: 13.68935,
            //             lon: -89.18718,
            //         },
            //     ],
            // },
        ],
    };

    constructor() { }

    ngAfterViewInit() {
    }

    ngOnInit() {

    }

}
