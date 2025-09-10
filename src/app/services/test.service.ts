import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




import { EnvironmentService } from './environment.service';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private readonly API_URL: string;

  constructor(private http: HttpClient, private environmentService: EnvironmentService) {
    this.API_URL = this.environmentService.apiUrl;
  }

  testConnection(): Observable<any> {
    return this.http.get(`${this.API_URL}/users`);
  }

  testLogin(): Observable<any> {
    const loginData = {
      email: 'joao.silva@email.com',
      password: 'MinhaSenh@123'
    };
    
    return this.http.post(`${this.API_URL}/auth/login`, loginData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
