import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { Activity } from 'app/core/interfaces/Activity';
import { ActivityService } from '../../services/activity.service';
import { ResponseCompanies } from 'app/core/interfaces/ResponseCompanies';
import { Company } from 'app/core/interfaces/Company';

@Component({
  selector: 'app-add-specific-activity',
  templateUrl: './add-specific-activity.component.html',
  styleUrls: ['./add-specific-activity.component.scss']
})
export class AddSpecificActivityComponent implements OnInit {


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
    public dialogRef: MatDialogRef<AddSpecificActivityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Activity,
  ) { }

  ngOnInit(): void {

    this.getCompanies();
  }

  getCompanies() {

    this.acivityService.getCompanies().subscribe((companies: ResponseCompanies) => {


      // Si es el Vicepresidente
      if (this.userRole === 'VP_ROLE')
        this.companies = companies.companies;

      // Si es gerente de CAM desde Colombia
      else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM')
        this.companies = companies.companies.filter((c) => c.country.code !== 'CO');

      // Si es Director de Colombia 
      else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CO')
        this.companies = companies.companies.filter((c) => c.country.code === 'CO');

      // Si es líder de Centro América
      else if (this.userRole === 'LEADER_CAM_ROLE')
        this.companies = companies.companies.filter((c) => c.country.code === this.userCountry);

      // Si es Jefe Normal
      else if (this.userRole === 'LEADER_ROLE')
        this.companies = companies.companies.filter((c) => c.country.code === this.userCountry);
    

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
