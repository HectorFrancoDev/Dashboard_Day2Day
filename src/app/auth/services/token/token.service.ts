import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  /**
   * Obtiene el token almacenado en el localstorage o devuelve cadena vacia si no se encuentra.
   * @returns Token de autenticación.
   */
  getToken(): string {
    const token =  localStorage.getItem('x-token');
    return token !== null ? token : '';
  }

  setToken(token: string, name: string, country: string, role: string, area: number, id: string, roleName: string, celulas: string) {
    localStorage.setItem('x-token', token);
    localStorage.setItem('user-name', name);
    localStorage.setItem('country', country);
    localStorage.setItem('role', role);
    localStorage.setItem('area', area + '');
    localStorage.setItem('idUser', id);
    localStorage.setItem('role-name', roleName);
    localStorage.setItem('celulas', celulas);
  }

  getLocalStorage() {
    return {
      'x-token': localStorage.getItem('x-token'),
      'user-name': localStorage.getItem('user-name'),
      'country': localStorage.getItem('country'),
      'role': localStorage.getItem('role'),
      'area': localStorage.getItem('area'),
      'idUser': localStorage.getItem('idUser'),
      'role-name': localStorage.getItem('role-name'),
      'celulas': localStorage.getItem('celulas')
    }
  }

  clearStorage() {
    localStorage.clear();
  }
}
