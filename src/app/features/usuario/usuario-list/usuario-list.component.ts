import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-usuario-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule,
    MatTooltipModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <span>Gerenciamento de Usuários</span>
        <span class="spacer"></span>
        <span *ngIf="getCurrentUser()" class="user-info">
          {{ getCurrentUser()?.name }} 
          <mat-chip *ngIf="isAdmin()" color="accent" selected>Admin</mat-chip>
        </span>
        <button mat-button routerLink="/usuarios/novo" *ngIf="isAdmin()">
          <mat-icon>person_add</mat-icon>
          Novo Usuário
        </button>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sair
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card>
          <mat-card-header>
            <mat-card-title>Lista de Usuários</mat-card-title>
          </mat-card-header>
          
          <mat-card-content>
            <div class="search-container">
              <mat-form-field appearance="outline" class="search-field">
                <mat-label>Buscar usuário</mat-label>
                <input
                  matInput
                  type="text"
                  [(ngModel)]="searchTerm"
                  (keyup.enter)="searchUser()"
                  placeholder="Digite ID, nome ou email"
                />
                <mat-icon matSuffix>search</mat-icon>
              </mat-form-field>
              
              <button mat-raised-button color="primary" (click)="searchUser()">
                <mat-icon>search</mat-icon>
                Buscar
              </button>
              
              <button mat-button (click)="loadUsers()">
                <mat-icon>refresh</mat-icon>
                Listar Todos
              </button>
            </div>

            <div *ngIf="loading" class="loading-container">
              <mat-spinner></mat-spinner>
              <p>Carregando usuários...</p>
            </div>

            <div *ngIf="errorMessage" class="error-container">
              <mat-icon color="warn">error</mat-icon>
              <span>{{ errorMessage }}</span>
            </div>

            <div *ngIf="!loading && !errorMessage">
              <table mat-table [dataSource]="users" class="users-table" *ngIf="users.length > 0">
                <ng-container matColumnDef="id">
                  <th mat-header-cell *matHeaderCellDef>ID</th>
                  <td mat-cell *matCellDef="let user">{{ user.id }}</td>
                </ng-container>

                <ng-container matColumnDef="name">
                  <th mat-header-cell *matHeaderCellDef>Nome</th>
                  <td mat-cell *matCellDef="let user">{{ user.name }}</td>
                </ng-container>

                <ng-container matColumnDef="email">
                  <th mat-header-cell *matHeaderCellDef>Email</th>
                  <td mat-cell *matCellDef="let user">{{ user.email }}</td>
                </ng-container>

                <ng-container matColumnDef="isActive">
                  <th mat-header-cell *matHeaderCellDef>Status</th>
                  <td mat-cell *matCellDef="let user">
                    <mat-chip [color]="user.isActive ? 'primary' : 'warn'" selected>
                      {{ user.isActive ? 'Ativo' : 'Inativo' }}
                    </mat-chip>
                  </td>
                </ng-container>

                <ng-container matColumnDef="createdAt">
                  <th mat-header-cell *matHeaderCellDef>Data Criação</th>
                  <td mat-cell *matCellDef="let user">{{ user.createdAt | date:'dd/MM/yyyy HH:mm' }}</td>
                </ng-container>

                <ng-container matColumnDef="actions">
                  <th mat-header-cell *matHeaderCellDef>Ações</th>
                  <td mat-cell *matCellDef="let user">
                    <button mat-icon-button color="primary" (click)="viewUser(user.id)" matTooltip="Ver detalhes">
                      <mat-icon>visibility</mat-icon>
                    </button>
                  </td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
                <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
              </table>

              <div *ngIf="users.length === 0" class="no-data">
                <mat-icon>person_off</mat-icon>
                <p>Nenhum usuário encontrado.</p>
              </div>
            </div>
          </mat-card-content>
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
    
    .user-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-right: 16px;
    }
    
    .content {
      padding: 20px;
    }
    
    .search-container {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    
    .search-field {
      flex: 1;
      min-width: 200px;
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
    
    .users-table {
      width: 100%;
      margin-top: 16px;
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
  `]
})
export class UsuarioListComponent implements OnInit {
  users: User[] = [];
  allUsers: User[] = []; // Armazena todos os usuários para busca local
  loading = false;
  errorMessage = '';
  searchTerm = '';
  displayedColumns: string[] = ['id', 'name', 'email', 'isActive', 'createdAt', 'actions'];

  constructor(
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
    
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.errorMessage = '';
    this.searchTerm = '';

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.allUsers = users; // Armazena todos os usuários
        this.users = users; // Exibe todos os usuários
        this.loading = false;
        this.snackBar.open(`${users.length} usuários carregados com sucesso!`, 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Erro ao carregar usuários';
        this.snackBar.open('Erro ao carregar usuários. Tente novamente.', 'Fechar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.error('Erro ao carregar usuários:', error);
      }
    });
  }

  searchUser() {
    if (!this.searchTerm || !this.searchTerm.trim()) {
      this.loadUsers();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    // Busca local por qualquer campo
    const searchTerm = this.searchTerm.toLowerCase().trim();
    const filteredUsers = this.allUsers.filter(user => 
      user.id.toString().includes(searchTerm) ||
      user.name.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );

    this.loading = false;
    this.users = filteredUsers;

    if (filteredUsers.length === 0) {
      this.errorMessage = 'Nenhum usuário encontrado';
      this.snackBar.open('Nenhum usuário encontrado com o termo de busca', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    } else {
      this.snackBar.open(`${filteredUsers.length} usuário(s) encontrado(s)!`, 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  viewUser(id: number) {
    this.router.navigate(['/usuarios', id]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Métodos públicos para acesso no template
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  isAdmin() {
    return this.authService.isAdmin();
  }
}
