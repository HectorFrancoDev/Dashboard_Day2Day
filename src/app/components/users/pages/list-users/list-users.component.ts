import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
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

  private data: User = {
    id: 'string',
    name: 'string',
    email: 'string',
    img: 'string',
    role: { code: '', name: '' },
    area: { code: 1, name: '', country: { code: '', name: '' } },
    // Para los que son supervisados
    supervised_by: ''
  };

  userImg = 'https://firebasestorage.googleapis.com/v0/b/subasta-inversa-d6e7a.appspot.com/o/User-80_icon-icons.com_57249.png?alt=media&token=283572e2-e8d3-4149-9227-8ae3b795652e';

  public userName: string = '';
  public userCountry = localStorage.getItem('country');
  public userRole = localStorage.getItem('role');
  public userArea = localStorage.getItem('area');
  public userId = localStorage.getItem('idUser');

  public poseePermisos: boolean = false;

  displayedColumns: string[] = ['image-avatar', 'email', 'name', 'country', 'role', 'actions', 'actions-2'];
  dataSource: MatTableDataSource<GeneralUser>;
  private usersData: GeneralUser[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private userService: UsersService,
    public dialog: MatDialog,
    private notificationService: NotificationsService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource(this.usersData);

    if (this.userRole !== 'SUPERVISOR_ROLE' && this.userRole !== 'AUDITOR_ROLE')
      this.poseePermisos = true;
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

        console.log(users);

        // Si es el vicepresidente
        if (this.userRole === 'VP_ROLE')
          this.usersData = users.users.filter((u) => u.role.code !== 'VP_ROLE');

        // Si es gerente de CAM desde Colombia 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userCountry === 'CAM')
          this.usersData = users.users.filter((u) => u.area.country.code !== 'CO' && u.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Conductas especiales 
        else if (this.userRole === 'DIRECTOR_ROLE' && this.userArea === '9') //TODO: 
          this.usersData = users.users.filter((u) => u.area.code === 9 && u.role.code !== 'DIRECTOR_ROLE');

        // Si es director de Colombia
        else if (this.userRole === 'DIRECTOR_ROLE')
          this.usersData = users.users.filter((u) =>
            u.area.country.code === 'CO' &&
            u.area.code !== 9 &&
            u.role.code !== 'VP_ROLE' &&
            u.role.code !== 'DIRECTOR_ROLE');

        // Si es jefe de Colombia
        else if (this.userRole === 'LEADER_ROLE')
          this.usersData = users.users.filter((u) => u.area.code.toString() === this.userArea);

        // Si es jefe de CAM
        else if (this.userRole === 'LEADER_CAM_ROLE')
          this.usersData = users.users.filter((u) => u.area.code.toString() === this.userArea);


        // Si es supervisor con equipo fijo
        else if (this.userRole === 'SUPERVISOR_ROLE') {


          this.usersData = users.users.filter((u) => u.supervised_by === this.userId);

          console.log('105', this.usersData.length);
          // Si es supervisor normal
          if (this.usersData.length === 0)
            this.usersData = users.users.filter((u) =>
              u.area.code.toString() === this.userArea &&
              u.role.code !== 'LEADER_ROLE' && u.role.code !== 'SUPERVISOR_ROLE');

        }


        else
          console.log('No es posible filtrar a los usuarios')

        this.dataSource.data = this.usersData;
      },
      (error) => {
        console.log("Error obteniendo usuarios del backend");
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
          const user = result as GeneralUser;

          user.email = user.email.trim().toLowerCase();

          this.userService.createUser(user).subscribe(

            () => {
              this.notificationService.showNotificationError('Usuario creado con éxito');
              this.loadData();
            },
            (error) => this.notificationService.showNotificationError(error.error.error)
          );
        }
        else {
          this.notificationService.showNotificationError('Información Inválida o faltante');
        }
      }
    });
  }

  verifyUserData(userData: GeneralUser): boolean {


    if (userData.email && userData.country && userData.rol)
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

    else
      this.router.navigate(['/vicepresident/users/' + id]);

  }

  showUserPerformance(id: string) {
    if (this.userRole === 'DIRECTOR_ROLE')
      this.router.navigate(['/director/users/performance' + id]);

    else if (this.userRole === 'LEADER_ROLE')
      this.router.navigate(['/leader/users/performance' + id]);

    else if (this.userRole === 'LEADER_CAM_ROLE')
      this.router.navigate(['/leader-cam/users/performance' + id]);

    else if (this.userRole === 'SUPERVISOR_ROLE')
      this.router.navigate(['/supervisor/users/performance' + id]);

    else
      this.router.navigate(['/vicepresident/users/performance' + id]);
  }
}
