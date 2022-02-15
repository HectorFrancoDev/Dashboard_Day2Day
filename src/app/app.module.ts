import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';

import { AppComponent } from './app.component';

import { environment } from '../environments/environment';

// Google Auth
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { CoreModule } from './core/core.module';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { LayoutModule } from '@angular/cdk/layout';
import { MaterialModule } from './components/material/material.module';
import { HighchartsChartModule } from 'highcharts-angular';


@NgModule({
  imports: [

    BrowserAnimationsModule,
    // ReactiveFormsModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,

    // Login with google
    SocialLoginModule,
    CoreModule,

    // Layout Module
    LayoutModule,

    // Material Modules
    MaterialModule,

    // Maps HighCharts
    // HighchartsChartModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              environment.GOOGLE_CLIENT_ID
            )
          }
        ]
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
