import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="profile-container">
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>Meu Perfil</mat-card-title>
          <mat-card-subtitle>Informações do usuário</mat-card-subtitle>
        </mat-card-header>
        
        <mat-card-content *ngIf="currentUser">
          <div class="user-info">
            <div class="info-item">
              <mat-icon>person</mat-icon>
              <span><strong>Nome:</strong> {{ currentUser.name }}</span>
            </div>
            
            <div class="info-item">
              <mat-icon>email</mat-icon>
              <span><strong>Email:</strong> {{ currentUser.email }}</span>
            </div>
            
            <div class="info-item">
              <mat-icon>admin_panel_settings</mat-icon>
              <span><strong>Tipo:</strong> {{ currentUser.role }}</span>
            </div>
            
            <div class="info-item">
              <mat-icon>check_circle</mat-icon>
              <span><strong>Status:</strong> {{ currentUser.isActive ? 'Ativo' : 'Inativo' }}</span>
            </div>
          </div>
        </mat-card-content>
        
        <mat-card-content *ngIf="!currentUser">
          <p>Nenhum usuário logado.</p>
        </mat-card-content>
        
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .profile-card {
      max-width: 500px;
      width: 100%;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
    }
    
    .info-item mat-icon {
      color: #3f51b5;
    }
    
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    console.log('Usuário atual no perfil:', this.currentUser);
  }

}
