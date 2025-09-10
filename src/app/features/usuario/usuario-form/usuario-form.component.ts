import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-usuario-form',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="app-container">
      <mat-toolbar color="primary" class="app-toolbar">
        <button mat-icon-button routerLink="/usuarios">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <span>Novo Usuário</span>
        <span class="spacer"></span>
        <button mat-button (click)="logout()">
          <mat-icon>logout</mat-icon>
          Sair
        </button>
      </mat-toolbar>

      <div class="content">
        <mat-card class="form-card">
          <mat-card-header>
            <mat-card-title>Criar Novo Usuário</mat-card-title>
            <mat-card-subtitle>Preencha os dados do usuário</mat-card-subtitle>
          </mat-card-header>
          
          <mat-card-content>
            <form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="user-form">
              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Nome</mat-label>
                  <input
                    matInput
                    type="text"
                    formControlName="name"
                    placeholder="Digite o nome do usuário"
                  />
                  <mat-icon matSuffix>person</mat-icon>
                  <mat-error *ngIf="userForm.get('name')?.invalid && userForm.get('name')?.touched">
                    Nome é obrigatório
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Email</mat-label>
                  <input
                    matInput
                    type="email"
                    formControlName="email"
                    placeholder="Digite o email do usuário"
                  />
                  <mat-icon matSuffix>email</mat-icon>
                  <mat-error *ngIf="userForm.get('email')?.invalid && userForm.get('email')?.touched">
                    Email é obrigatório e deve ser válido
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Senha</mat-label>
                  <input
                    matInput
                    type="password"
                    formControlName="password"
                    placeholder="Digite a senha do usuário"
                  />
                  <mat-icon matSuffix>lock</mat-icon>
                  <mat-error *ngIf="userForm.get('password')?.invalid && userForm.get('password')?.touched">
                    Senha é obrigatória e deve ter pelo menos 6 caracteres
                  </mat-error>
                </mat-form-field>
              </div>

              <div class="form-row">
                <mat-form-field appearance="outline" class="full-width">
                  <mat-label>Confirmar Senha</mat-label>
                  <input
                    matInput
                    type="password"
                    formControlName="confirmPassword"
                    placeholder="Confirme a senha"
                  />
                  <mat-icon matSuffix>lock</mat-icon>
                  <mat-error *ngIf="userForm.get('confirmPassword')?.invalid && userForm.get('confirmPassword')?.touched">
                    Confirmação de senha é obrigatória
                  </mat-error>
                  <mat-error *ngIf="userForm.hasError('passwordMismatch') && userForm.get('confirmPassword')?.touched">
                    As senhas não coincidem
                  </mat-error>
                </mat-form-field>
              </div>

              <div *ngIf="errorMessage" class="error-message">
                <mat-icon color="warn">error</mat-icon>
                <span>{{ errorMessage }}</span>
              </div>

              <div *ngIf="successMessage" class="success-message">
                <mat-icon color="primary">check_circle</mat-icon>
                <span>{{ successMessage }}</span>
              </div>
            </form>
          </mat-card-content>
          
          <mat-card-actions class="form-actions">
            <button
              mat-raised-button
              color="primary"
              [disabled]="userForm.invalid || loading"
              (click)="onSubmit()"
            >
              <mat-spinner *ngIf="loading" diameter="20" style="margin-right: 8px;"></mat-spinner>
              <mat-icon *ngIf="!loading">person_add</mat-icon>
              {{ loading ? 'Criando...' : 'Criar Usuário' }}
            </button>
            
            <button
              mat-button
              (click)="cancel()"
              [disabled]="loading"
            >
              <mat-icon>cancel</mat-icon>
              Cancelar
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
      max-width: 600px;
      margin: 0 auto;
    }
    
    .form-card {
      margin-top: 20px;
    }
    
    .user-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .form-row {
      width: 100%;
    }
    
    .full-width {
      width: 100%;
    }
    
    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: flex-end;
      padding: 16px;
    }
    
    .error-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background-color: #ffebee;
      border-radius: 4px;
      color: #c62828;
    }
    
    .success-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background-color: #e8f5e8;
      border-radius: 4px;
      color: #2e7d32;
    }
  `]
})
export class UsuarioFormComponent implements OnInit {
  userForm: FormGroup;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.userForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    // Verificar se o usuário está autenticado e é admin
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }
    
    if (!this.authService.isAdmin()) {
      this.snackBar.open('Apenas administradores podem criar usuários', 'Fechar', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      this.router.navigate(['/usuarios']);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData = {
        name: this.userForm.value.name,
        email: this.userForm.value.email,
        password: this.userForm.value.password
      };

      this.userService.createUser(userData).subscribe({
        next: (user) => {
          this.loading = false;
          this.successMessage = 'Usuário criado com sucesso!';
          this.userForm.reset();
          
          this.snackBar.open('Usuário criado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            this.router.navigate(['/usuarios']);
          }, 2000);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Erro ao criar usuário. Verifique os dados e tente novamente.';
          this.snackBar.open('Erro ao criar usuário. Verifique os dados e tente novamente.', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          console.error('Erro ao criar usuário:', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/usuarios']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
