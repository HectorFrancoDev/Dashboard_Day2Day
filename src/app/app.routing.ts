import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { GeneralLayoutComponent } from './layouts/general-layout/general-layout.component';

const routes: Routes = [
 
  //  auth = '/'
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // vicepresident
  {
    path: 'vicepresident',
    component: GeneralLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./modules/general/general.module').then(m => m.GeneralModule)
    }]
  },

  // Director
  {
    path: 'director',
    component: GeneralLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./modules/general/general.module').then(m => m.GeneralModule)
    }]
  },

  // leader
  {
    path: 'leader',
    component: GeneralLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./modules/general/general.module').then(m => m.GeneralModule)
    }]
  },

  // leader-cam
  {
    path: 'leader-cam',
    component: GeneralLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./modules/general/general.module').then(m => m.GeneralModule)
    }]
  },

  // supervisor
  {
    path: 'supervisor',
    component: GeneralLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./modules/general/general.module').then(m => m.GeneralModule)
    }]
  },

  // auditor
  {
    path: 'auditor',
    component: GeneralLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./modules/auditor/auditor.module').then(m => m.AuditorModule)
    }]
  },

  // auditor
  {
    path: 'apoyo-direccion',
    component: GeneralLayoutComponent,
    children: [{
      path: '',
      loadChildren: () => import('./modules/general/general.module').then(m => m.GeneralModule)
    }]
  },

  // En caso de que la URL no sea niguna de las definidas
  // lo redirige a la página de login

  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }

];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
