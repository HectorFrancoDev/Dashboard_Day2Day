import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Activity } from 'app/core/interfaces/Activity';
import { Company } from 'app/core/interfaces/Company';
import { ResponseCompanies } from 'app/core/interfaces/ResponseCompanies';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-add-general-activity',
  templateUrl: './add-general-activity.component.html',
  styleUrls: ['./add-general-activity.component.scss']
})
export class AddGeneralActivityComponent implements OnInit {

  userRole = localStorage.getItem('role') || '';
  userArea = localStorage.getItem('area') || '';
  userCountry = localStorage.getItem('country') || '';

  companies: Company[] = [];

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  public range = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });
  constructor(
    private acivityService: ActivityService,
    public dialogRef: MatDialogRef<AddGeneralActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Activity,
  ) { }

  ngOnInit(): void {

    this.getCompanies();
  }

  getCompanies() {

    this.acivityService.getCompanies().subscribe((companies: ResponseCompanies) => {

      if (this.userRole === 'VP_ROLE')
        this.companies = companies.companies.filter((c) => c.name.match('Otros Conceptos - General') )

      // Si es gerente de CAM desde Colombia
      else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM')
        this.companies = companies.companies.filter((c) => c.name.match('Otros Conceptos - General') &&  c.country.code !== 'CO');

      // Si es director de Colombia 
      else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CO')
        this.companies = companies.companies.filter((c) => c.name.match('Otros Conceptos - General') && c.country.code === 'CO');
      
      // Si es líde de centro américa
      else if (this.userRole === 'LEADER_CAM_ROLE')
        this.companies = companies.companies.filter((c) => c.name.match('Otros Conceptos - General') && c.country.code === this.userCountry);

      // Si es jefe Normal
      else if (this.userRole === 'LEADER_ROLE')
        this.companies = companies.companies.filter((c) => c.name.match('Otros Conceptos - General') && c.country.code === this.userCountry);

    },
      (error) => console.error(error)
    );

    if (this.userRole === 'LEADER_ROLE' || this.userRole === 'LEADER_CAM_ROLE') {
      this.disabled = true;
    }

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
