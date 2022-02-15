import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeadersInterceptor } from './interceptors/header.interceptos';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LayoutModule,
    HttpClientModule
  ],
  exports: [
    // HttpClient
    // SharedModule, 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor,  multi: true }
  ]
})
export class CoreModule { }
