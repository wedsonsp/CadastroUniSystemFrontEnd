import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-usuario-detail',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button routerLink="/usuarios">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Detalhes do Usuário</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sair
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card class="detail-card">
          <mat-card-header>
            <mat-card-title>Informações do Usuário</mat-card-title>
            <mat-card-subtitle>Detalhes completos do usuário selecionado</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <div *ngIf="loading" class="loading-container">
              <mat-spinner></mat-spinner>
              <p>Carregando usuário...</p>
            </div>

            <div *ngIf="errorMessage" class="error-container">
              <mat-icon color="warn">error</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <div *ngIf="!loading && !errorMessage && user" class="user-details">
              <div class="detail-section">
                <h3>Informações Básicas</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <mat-icon>fingerprint</mat-icon>
                    <div class="detail-content">
                      <label>ID</label>
                      <span>{{ user.id }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-item">
                    <mat-icon>person</mat-icon>
                    <div class="detail-content">
                      <label>Nome</label>
                      <span>{{ user.name }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-item">
                    <mat-icon>email</mat-icon>
                    <div class="detail-content">
                      <label>Email</label>
                      <span>{{ user.email }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-item">
                    <mat-icon>toggle_on</mat-icon>
                    <div class="detail-content">
                      <label>Status</label>
                      <mat-chip [color]="user.isActive ? 'primary' : 'warn'" selected>
                        {{ user.isActive ? 'Ativo' : 'Inativo' }}
                      </mat-chip>
                    </div>
                  </div>
                  
                  <div class="detail-item">
                    <mat-icon>admin_panel_settings</mat-icon>
                    <div class="detail-content">
                      <label>Tipo de Usuário</label>
                      <mat-chip [color]="user.isAdministrator ? 'accent' : 'primary'" selected>
                        {{ user.isAdministrator ? 'Administrador' : 'Usuário Comum' }}
                      </mat-chip>
                    </div>
                  </div>
                </div>
              </div>

              <div class="detail-section">
                <h3>Informações de Controle</h3>
                <div class="detail-grid">
                  <div class="detail-item">
                    <mat-icon>schedule</mat-icon>
                    <div class="detail-content">
                      <label>Criado em</label>
                      <span>{{ user.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-item" *ngIf="user.updatedAt">
                    <mat-icon>update</mat-icon>
                    <div class="detail-content">
                      <label>Atualizado em</label>
                      <span>{{ user.updatedAt | date:'dd/MM/yyyy HH:mm' }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-item" *ngIf="user.createdBy">
                    <mat-icon>person_add</mat-icon>
                    <div class="detail-content">
                      <label>Criado por</label>
                      <span>{{ user.createdBy }}</span>
                    </div>
                  </div>
                  
                  <div class="detail-item" *ngIf="user.updatedBy">
                    <mat-icon>edit</mat-icon>
                    <div class="detail-content">
                      <label>Atualizado por</label>
                      <span>{{ user.updatedBy }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div *ngIf="!loading && !errorMessage && !user" class="no-data">
              <mat-icon>person_off</mat-icon>
              <p>Usuário não encontrado.</p>
            </div>
          </mat-card-content>
          
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
              Voltar
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    
    .app-toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .content {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .detail-card {
      margin-top: 20px;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      gap: 16px;
    }
    
    .error-container {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #c62828;
    }
    
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      color: #666;
      gap: 16px;
    }
    
    .no-data mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
    }
    
    .user-details {
      margin-top: 20px;
    }
    
    .detail-section {
      margin-bottom: 32px;
    }
    
    .detail-section h3 {
      margin-bottom: 16px;
      color: #333;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 8px;
    }
    
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 16px;
    }
    
    .detail-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background-color: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #2196f3;
    }
    
    .detail-item mat-icon {
      color: #2196f3;
      font-size: 24px;
      width: 24px;
      height: 24px;
    }
    
    .detail-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    
    .detail-content label {
      font-weight: 600;
      color: #666;
      font-size: 14px;
    }
    
    .detail-content span {
      color: #333;
      font-size: 16px;
    }
  `]
})
export class UsuarioDetailComponent implements OnInit {
  user: User | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Verificar se o usuário está autenticado
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadUser(parseInt(id));
    }
  }

  loadUser(id: number) {
    this.loading = true;
    this.errorMessage = '';

    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user;
        this.loading = false;
        this.snackBar.open('Usuário carregado com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erro ao carregar usuário';
        this.snackBar.open('Erro ao carregar usuário. Tente novamente.', 'Fechar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.error('Erro ao carregar usuário:', error);
      }
    });
  }

  goBack() {
    this.router.navigate(['/usuarios']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
