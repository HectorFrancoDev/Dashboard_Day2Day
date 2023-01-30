import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CreateUser } from 'app/core/interfaces/CreateUser';
import { GeneralUser } from 'app/core/interfaces/GeneralUser';
import { User } from 'app/core/interfaces/User';
import { NotificationsService } from 'app/core/services/notifications/notifications.service';
import { UsersService } from '../../services/users.service';
import { CreateUserComponent } from '../create-user/create-user.component';


@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, AfterViewInit {

  private data: GeneralUser = {
    email: '',
    rol: '',
  };

  userImg = 'assets/img/user_img.png';

  public userName: string = '';
  public userCountry = localStorage.getItem('country');
  public userRole = localStorage.getItem('role');
  public userArea = localStorage.getItem('area');
  public userId = localStorage.getItem('idUser');

  public poseePermisos: boolean = false;
  public puedeEditar: boolean = false;

  displayedColumns: string[] = ['image-avatar', 'email', 'name', 'country', 'role', 'state', 'actions', 'actions-2', 'actions-3'];
  dataSource: MatTableDataSource<GeneralUser>;
  private usersData: GeneralUser[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UsersService,
    private dialog: MatDialog,
    private notificationService: NotificationsService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.usersData);

    if (this.userRole !== 'SUPERVISOR_ROLE' && this.userRole !== 'AUDITOR_ROLE')
      this.poseePermisos = true;


    if (this.userRole === 'LEADER_ROLE' || this.userRole === 'LEADER_CAM_ROLE')
      this.puedeEditar = true;

  }

  ngOnInit(): void {
    this.userName = localStorage.getItem('user-name') || '';
    this.loadData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadData() {

    this.userService.getAllUsers().subscribe(
      (users) => {

        // Si es el vicepresidente
        if (this.userRole === 'VP_ROLE')
          this.usersData = users.users.filter((u) => u.role.code !== 'VP_ROLE');

        // Si es gerente de CAM desde Colombia 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM')
          this.usersData = users.users.filter((u) => u.area.country.code !== 'CO' && u.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Conductas especiales 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userArea === '9')
          this.usersData = users.users.filter((u) => u.area.code === 9 && u.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Colombia
        else if (this.userRole === 'DIRECTOR_ROLE')
          this.usersData = users.users.filter((u) => u.area.country.code === 'CO' && u.area.code !== 9 && u.role.code !== 'VP_ROLE' &&
            u.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Colombia
        else if (this.userRole === 'APOYO_DIRECCION_ROLE')
          this.usersData = users.users.filter((u) => u.area.country.code === 'CO' && u.area.code !== 9 && u.role.code !== 'APOYO_DIRECCION_ROLE');

        // Si es director de Colombia
        else if (this.userRole === 'APOYO_VP_ROLE')
          this.usersData = users.users.filter((u) => u.role.code !== 'VP_ROLE');

        // Jefe Nelson Gamba
        else if (this.userRole === 'LEADER_ROLE' && this.userArea === '2') {
          let tempUsersData = users.users.filter((u) => u.area.code.toString() === this.userArea && u.role.code !== this.userRole);
          let tempUsersData2 = users.users.filter((u) => u.area.code === 3);
          this.usersData = tempUsersData.concat(tempUsersData2);
        }

        // Si es jefe de Colombia
        else if (this.userRole === 'LEADER_ROLE')
          this.usersData = users.users.filter((u) => u.area.code.toString() === this.userArea && u.role.code !== this.userRole);

        // Si es jefe de CAM
        else if (this.userRole === 'LEADER_CAM_ROLE')
          this.usersData = users.users.filter((u) => u.area.code.toString() === this.userArea && u.role.code !== this.userRole);

        // Si es supervisor con equipo fijo
        else if (this.userRole === 'SUPERVISOR_ROLE') {
          this.usersData = users.users.filter((u) =>
            u.area.code.toString() === this.userArea && u.role.code !== 'LEADER_ROLE' && u.role.code !== 'SUPERVISOR_ROLE' &&
            u.role.code !== 'LEADER_CAM_ROLE' && u.role.code !== 'VP_ROLE'
          );
        }

        else
          this.notificationService.showNotificationError('No es posible filtrar a los usuarios');

        console.log(this.usersData);
        this.dataSource.data = this.usersData.sort((a, b ) => a.area.code - b.area.code).sort((a, b) => Number(b.state) - Number(a.state)) ;
      },
      (error) => {
        this.notificationService.showNotificationError("Error obteniendo usuarios de la BD");
        console.log(error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator)
      this.dataSource.paginator.firstPage();
  }

  addUser() {
    const dialogRef = this.dialog.open(CreateUserComponent, {
      width: '70%',
      data: this.data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const checkData = this.verifyUserData(result);

        if (checkData) {
          const user = result as CreateUser;

          user.email = user.email.trim().toLowerCase();
          user.roleCode = result.rol.value;
          user.areaCode = result.area.code;

          this.userService.createUser(user).subscribe(

            () => {
              this.notificationService.showNotificationSuccess('Usuario creado con éxito');
              this.loadData();
            },
            (error) => this.notificationService.showNotificationError(error.error.error)
          );


        }
        else {
          this.notificationService.showNotificationError('Información inválida o faltante');
        }
      }
    });
  }

  verifyUserData(userData: GeneralUser): boolean {

    if (userData.email && userData.rol.value && userData.area.code)
      if (userData.email.toLowerCase().includes('@davivienda'))
        return true;

    return false;

  }

  showUser(id: string) {


    if (this.userRole === 'DIRECTOR_ROLE')
      this.router.navigate(['/director/users/' + id]);

    else if (this.userRole === 'LEADER_ROLE')
      this.router.navigate(['/leader/users/' + id]);

    else if (this.userRole === 'LEADER_CAM_ROLE')
      this.router.navigate(['/leader-cam/users/' + id]);

    else if (this.userRole === 'SUPERVISOR_ROLE')
      this.router.navigate(['/supervisor/users/' + id]);

    else if (this.userRole === 'APOYO_DIRECCION_ROLE')
      this.router.navigate(['/apoyo-direccion/users/' + id]);

    else if (this.userRole === 'APOYO_VP_ROLE')
      this.router.navigate(['/apoyo-vp/users/' + id]);

    else
      this.router.navigate(['/vicepresident/users/' + id]);

  }

  showUserPerformance(id: string) {

    if (this.userRole === 'DIRECTOR_ROLE')
      this.router.navigate(['/director/users/performance/' + id]);

    else if (this.userRole === 'LEADER_ROLE')
      this.router.navigate(['/leader/users/performance/' + id]);

    else if (this.userRole === 'LEADER_CAM_ROLE')
      this.router.navigate(['/leader-cam/users/performance/' + id]);

    else if (this.userRole === 'SUPERVISOR_ROLE')
      this.router.navigate(['/supervisor/users/performance/' + id]);

    else if (this.userRole === 'APOYO_DIRECCION_ROLE')
      this.router.navigate(['/apoyo-direccion/users/performance/' + id]);

    else if (this.userRole === 'APOYO_VP_ROLE')
      this.router.navigate(['/apoyo-vp/users/performance/' + id]);

    else
      this.router.navigate(['/vicepresident/users/performance/' + id]);
  }

  editUser(id: string) {


    if (this.userRole === 'LEADER_ROLE')
      this.router.navigate(['/leader/users/edit/' + id]);

    else if (this.userRole === 'LEADER_CAM_ROLE')
      this.router.navigate(['/leader-cam/users/edit/' + id]);

    else
      return

  }

}
