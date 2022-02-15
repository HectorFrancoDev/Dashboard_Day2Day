import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenService } from 'app/auth/services/token/token.service';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';

declare const $: any;

declare interface RouteInfo {
  role: string;
  path: string;
  title: string;
  icon: string;
}
export const ROUTES: RouteInfo[] = [

  // Rotas qué tiene el Vicepresidente 
  { role: 'VP_ROLE',  path: '/vicepresident/dashboard',      title: 'Resumen General',    icon: 'insights'    },
  { role: 'VP_ROLE',  path: '/vicepresident/project-plan',   title: 'Project Plan',       icon: 'dashboard'   },
  { role: 'VP_ROLE',  path: '/vicepresident/users',          title: 'Equipo de trabajo',  icon: 'people_alt'  },

  // Rotas qué tienen los  Directores
  { role: 'DIRECTOR_ROLE',  path: '/director/dashboard',      title: 'Resumen General',    icon: 'insights'    },
  { role: 'DIRECTOR_ROLE',  path: '/director/project-plan',   title: 'Project Plan',       icon: 'dashboard'   },
  { role: 'DIRECTOR_ROLE',  path: '/director/users',          title: 'Equipo de trabajo',  icon: 'people_alt'  },

  // Rotas qué tiene los Líderes (jefes) Colombia
  { role: 'LEADER_ROLE',  path: '/leader/dashboard',     title: 'Resumen General',    icon: 'insights'   },
  { role: 'LEADER_ROLE',  path: '/leader/project-plan',  title: 'Project Plan',       icon: 'dashboard'  },
  { role: 'LEADER_ROLE',  path: '/leader/users',         title: 'Equipo de trabajo',  icon: 'people_alt' },

  // Rotas qué tiene los líderes de CAM (jefes)
  { role: 'LEADER_CAM_ROLE',  path: '/leader-cam/dashboard',      title: 'Resumen General',    icon: 'insights'   },
  { role: 'LEADER_CAM_ROLE',  path: '/leader-cam/time-report',    title: 'Agregar registro',   icon: 'add_task'   },
  { role: 'LEADER_CAM_ROLE',  path: '/leader-cam/performance',    title: 'Mi reporte',         icon: 'bar_chart'  },
  { role: 'LEADER_CAM_ROLE',  path: '/leader-cam/project-plan',   title: 'Project Plan',       icon: 'dashboard'  },
  { role: 'LEADER_CAM_ROLE',  path: '/leader-cam/users',          title: 'Equipo de trabajo',  icon: 'people_alt' },

  // Rotas qué tiene los supervisores
  { role: 'SUPERVISOR_ROLE',  path: '/supervisor/dashboard',      title: 'Resumen General',    icon: 'insights'   },
  { role: 'SUPERVISOR_ROLE',  path: '/supervisor/time-report',    title: 'Agregar registro',   icon: 'add_task'   },
  { role: 'SUPERVISOR_ROLE',  path: '/supervisor/performance',    title: 'Mi reporte',         icon: 'bar_chart'  },
  { role: 'SUPERVISOR_ROLE',  path: '/supervisor/users',          title: 'Equipo de trabajo',  icon: 'people_alt' },

  // Rotas qué tiene los auditores
  { role: 'AUDITOR_ROLE',  path: '/auditor/time-report',    title: 'Agregar registro',   icon: 'add_task'   },
  { role: 'AUDITOR_ROLE',  path: '/auditor/performance',    title: 'Mi reporte',   icon: 'bar_chart'   },

];

export const ROLES = [
  'VP_ROLE',
  'DIRECTOR_ROLE',
  'LEADER_ROLE',
  'LEADER_CAM_ROLE',
  'SUPERVISOR_ROLE',
  'AUDITOR_ROLE'
]

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  menuItems: any[];
  localStorageData: any;

  userId = localStorage.getItem('idUser');

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private notificationService: NotificationsService
  ) {
    this.localStorageData = this.tokenService.getLocalStorage()
  }

  ngOnInit() {

    if (ROLES.includes(this.localStorageData.role))
      this.menuItems = ROUTES.filter((menuItem) => menuItem.role === this.localStorageData.role)
    else
      this.notificationService.showNotificationError('No fue posible enrutarlo');
  }

  isMobileMenu() {
    return ($(window).width > 900) ? false : true;
  };

  verify

  goToMyPageGraph() {
    console.log('HOLA');
    this.router.navigate([ ROUTES[20] + '/' + this.userId]);
  }


}
