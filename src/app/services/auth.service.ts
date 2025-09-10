import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, LoginTokenResponse, User } from '../models/user';
import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL: string;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private environmentService: EnvironmentService) {
    this.API_URL = this.environmentService.apiUrl;
    
    // Verificar se há token salvo no localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log('Enviando requisição de login para:', `${this.API_URL}/auth/authenticate`);
    console.log('Dados:', loginRequest);
    
    return this.http.post<LoginResponse>(`${this.API_URL}/auth/authenticate`, loginRequest, { 
      headers,
      context: new HttpContext()
    })
      .pipe(
        tap(response => {
          console.log('Resposta do login:', response);
          
          // Mapear isAdministrator para role
          const user = {
            ...response.user,
            role: response.user.isAdministrator ? 'Admin' : 'User'
          };
          
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }


  authenticate(): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/auth/authenticate`, {})
      .pipe(
        tap(user => {
          // Mapear isAdministrator para role
          const mappedUser = {
            ...user,
            role: user.isAdministrator ? 'Admin' : 'User'
          };
          this.currentUserSubject.next(mappedUser);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'Admin';
  }

  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    switch (permission) {
      case 'create_user':
        return user.role === 'Admin';
      case 'list_users':
      case 'view_user':
        return this.isAuthenticated();
      default:
        return false;
    }
  }
}

