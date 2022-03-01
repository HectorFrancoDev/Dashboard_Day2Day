import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralUser } from 'app/core/interfaces/GeneralUser';


export const ROLES = [

  // Vicepresidente
  { role: 'VP_ROLE', value: 'DIRECTOR_ROLE', name: 'Director' },
  { role: 'VP_ROLE', value: 'LEADER_ROLE', name: 'Jefe (Colombia)' },
  { role: 'VP_ROLE', value: 'LEADER_CAM_ROLE', name: 'Gerente (CAM)' },
  { role: 'VP_ROLE', value: 'SUPERVISOR_ROLE', name: 'Supervisor' },
  { role: 'VP_ROLE', value: 'AUDITOR_ROLE', name: 'Auditor' },

  // Director
  { role: 'DIRECTOR_ROLE', value: 'LEADER_ROLE', name: 'Jefe (Colombia)' },
  { role: 'DIRECTOR_ROLE', value: 'LEADER_CAM_ROLE', name: 'Gerente (CAM)' },
  { role: 'DIRECTOR_ROLE', value: 'SUPERVISOR_ROLE', name: 'Supervisor' },
  { role: 'DIRECTOR_ROLE', value: 'AUDITOR_ROLE', name: 'Auditor' },

  // Jefe (Colombia)
  { role: 'LEADER_ROLE', value: 'SUPERVISOR_ROLE', name: 'Supervisor' },
  { role: 'LEADER_ROLE', value: 'AUDITOR_ROLE', name: 'Auditor' },

  // Gerente (CAM)
  { role: 'LEADER_CAM_ROLE', value: 'SUPERVISOR_ROLE', name: 'Supervisor' },
  { role: 'LEADER_CAM_ROLE', value: 'AUDITOR_ROLE', name: 'Auditor' },

]

export const ROLES_USER: string[] = [
  'VP_ROLE',
  'DIRECTOR_ROLE',
  'LEADER_ROLE',
  'LEADER_CAM_ROLE',
  'SUPERVISOR_ROLE',
  'AUDITOR_ROLE'
];

export const AREA_USER = [

  // Vicepresidencia
  { role: 'VP_ROLE',   code: 1,   name: 'Ciberseguridad y TI' },
  { role: 'VP_ROLE',   code: 2,   name: 'Operativa y Surcursales' },
  { role: 'VP_ROLE',   code: 3,   name: 'Auditoria Continua' },
  { role: 'VP_ROLE',   code: 4,   name: 'Financiera y Fiduciaria' },
  { role: 'VP_ROLE',   code: 5,   name: 'SARES' },
  { role: 'VP_ROLE',   code: 6,   name: 'Estrategia y Corredores' },
  { role: 'VP_ROLE',   code: 7,   name: 'Metodologia y QA' },
  { role: 'VP_ROLE',   code: 8,   name: 'Dirección IA' },
  { role: 'VP_ROLE',   code: 9,   name: 'Conductas Especiales' },
  { role: 'VP_ROLE',   code: 10,  name: 'CAM' },
  { role: 'VP_ROLE',   code: 11,  name: 'Talento 4.0' },
  { role: 'VP_ROLE',   code: 12,  name: 'CAM - Panamá' },
  { role: 'VP_ROLE',   code: 13,  name: 'CAM - El Salvador' },
  { role: 'VP_ROLE',   code: 14,  name: 'CAM - Costa Rica' },
  { role: 'VP_ROLE',   code: 15,  name: 'CAM - Honduras' },
  { role: 'VP_ROLE',   code: 16,  name: 'Vicepresidencia' },

  // Directores
  { role: 'DIRECTOR_ROLE',   code: 1,   name: 'Ciberseguridad y TI' },
  { role: 'DIRECTOR_ROLE',   code: 2,   name: 'Operativa y Surcursales' },
  { role: 'DIRECTOR_ROLE',   code: 3,   name: 'Auditoria Continua' },
  { role: 'DIRECTOR_ROLE',   code: 4,   name: 'Financiera y Fiduciaria' },
  { role: 'DIRECTOR_ROLE',   code: 5,   name: 'SARES' },
  { role: 'DIRECTOR_ROLE',   code: 6,   name: 'Estrategia y Corredores' },
  { role: 'DIRECTOR_ROLE',   code: 7,   name: 'Metodologia y QA' },
  { role: 'DIRECTOR_ROLE',   code: 8,   name: 'Dirección IA' },
  { role: 'DIRECTOR_ROLE',   code: 11,  name: 'Talento 4.0' },
  { role: 'DIRECTOR_ROLE',   code: 16,  name: 'Vicepresidencia' },

  // Director Conductas
  { role: 'DIRECTOR_ROLE',   code: 9,   name: 'Conductas Especiales' },

  // Director CAM 
  { country: 'CAM', role: 'DIRECTOR_ROLE',   code: 10,  name: 'CAM' },
  { country: 'CAM', role: 'DIRECTOR_ROLE',   code: 12,  name: 'CAM - Panamá' },
  { country: 'CAM', role: 'DIRECTOR_ROLE',   code: 13,  name: 'CAM - El Salvador' },
  { country: 'CAM', role: 'DIRECTOR_ROLE',   code: 14,  name: 'CAM - Costa Rica' },
  { country: 'CAM', role: 'DIRECTOR_ROLE',   code: 15,  name: 'CAM - Honduras' }

];

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  roleUser = localStorage.getItem('role') || '';
  areaUser = localStorage.getItem('area') || '';
  countryUser = localStorage.getItem('country') || '';

  roles: any[] = [];
  areas: any[] = [];


  constructor(
    public dialogRef: MatDialogRef<CreateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: GeneralUser,
  ) 
  { }

  ngOnInit(): void {

    this.getDataBasedCreator();

  }

  getDataBasedCreator() {

    if (ROLES_USER.includes(this.roleUser))
      this.roles = ROLES.filter((role) => role.role === this.roleUser);

    if (this.roleUser === 'VP_ROLE')
      this.areas = AREA_USER.filter((area) => area.role === this.roleUser);

    else if (this.roleUser === 'DIRECTOR_ROLE' && this.countryUser === 'CAM')
      this.areas = AREA_USER.filter((area) => area.country === 'CAM');

    else if (this.roleUser === 'DIRECTOR_ROLE' && this.areaUser === '9')
      this.areas = AREA_USER.filter((area) => area.code === 9 && area.role === this.roleUser);

    else if (this.roleUser === 'DIRECTOR_ROLE')
      this.areas = AREA_USER.filter((area) => area.code !== 9 && area.country !== 'CAM' && area.role === this.roleUser);

    else if (this.roleUser === 'LEADER_ROLE' || this.roleUser === 'LEADER_CAM_ROLE')
      this.areas = AREA_USER.filter((area) => area.code === Number(this.areaUser) && area.role !== 'VP_ROLE');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
