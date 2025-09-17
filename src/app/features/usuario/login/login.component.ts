import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../services/auth.service';
import { ResetPasswordComponent, ResetPasswordData } from '../reset-password/reset-password.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Login</mat-card-title>
        </mat-card-header>
        
        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input
                matInput
                type="email"
                formControlName="email"
                placeholder="Digite seu email"
              />
              <mat-error *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched">
                Email é obrigatório
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input
                matInput
                type="password"
                formControlName="password"
                placeholder="Digite sua senha"
              />
              <mat-error *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                Senha é obrigatória
              </mat-error>
            </mat-form-field>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
          </form>
        </mat-card-content>
        
        <mat-card-actions>
          <button
            mat-raised-button
            color="primary"
            class="full-width"
            [disabled]="loginForm.invalid || loading"
            (click)="onSubmit()"
          >
            <mat-spinner *ngIf="loading" diameter="20" style="margin-right: 10px;"></mat-spinner>
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
          
          <button
            mat-button
            color="accent"
            class="full-width change-password-btn"
            (click)="onChangePassword()"
          >
            Alterar Senha
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }
    
    .login-card {
      max-width: 400px;
      width: 100%;
    }
    
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .full-width {
      width: 100%;
    }
    
    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: 8px;
    }
    
    mat-card-actions {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .change-password-btn {
      margin-top: 8px;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      // Limpar token antigo antes do login
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const loginData = this.loginForm.value;
      console.log('Dados do login:', loginData);

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login bem-sucedido:', response);
          this.snackBar.open('Login realizado com sucesso!', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          
          // Navegar imediatamente pois os dados já estão carregados
          this.router.navigate(['/usuarios']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage = 'Email ou senha inválidos';
          this.snackBar.open('Erro no login. Verifique suas credenciais.', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          console.error('Erro no login:', error);
          console.error('Detalhes do erro:', error.error);
        }
      });
    }
  }

  onChangePassword() {
    const email = this.loginForm.get('email')?.value;
    
    if (!email) {
      this.snackBar.open('Digite seu email primeiro!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    // Pegar o token atual do localStorage
    const currentToken = this.authService.getToken();
    console.log('Token atual para reset de senha:', currentToken ? currentToken.substring(0, 20) + '...' : 'Nenhum token');
    
    if (!currentToken) {
      console.log('Usuário não está logado - tentando reset sem autenticação');
      console.log('IMPORTANTE: Para reset com token, faça login primeiro!');
    } else {
      console.log('Usuário logado - usando endpoint autenticado para reset de senha');
    }

    const dialogData: ResetPasswordData = {
      email: email,
      token: currentToken || undefined,
      scenario: currentToken ? 'authenticated' : 'forgot'
    };

    const dialogRef = this.dialog.open(ResetPasswordComponent, {
      width: '500px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('✅ Reset de senha realizado com sucesso!');
        this.snackBar.open('Senha redefinida com sucesso! Agora você pode fazer login.', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        // Limpar campo de senha
        this.loginForm.get('password')?.setValue('');
      }
    });
  }
}
