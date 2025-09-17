import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';

export interface ResetPasswordData {
  email: string;
  token?: string;
  resetToken?: string;
  scenario?: 'forgot' | 'authenticated';
  step?: 'request-token' | 'reset-with-token';
}

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  template: `
    <div class="reset-password-dialog">
      <h2 mat-dialog-title>Alterar Senha</h2>
      
      <mat-dialog-content>
        <div *ngIf="data.scenario === 'forgot'" class="info-message">
          📧 Reset de senha para usuários que esqueceram a senha atual.
          <br><small>Digite sua nova senha e clique em "Solicitar Token" para obter o token de reset.</small>
        </div>
        
        <div *ngIf="data.scenario === 'authenticated'" class="info-message">
          🔐 Reset de senha com usuário logado.
        </div>
        
        <form [formGroup]="resetForm" class="reset-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input
              matInput
              type="email"
              formControlName="email"
              placeholder="Digite seu email"
              [readonly]="true"
            />
            <mat-error *ngIf="resetForm.get('email')?.invalid && resetForm.get('email')?.touched">
              Email é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width" *ngIf="data.scenario === 'forgot'">
            <mat-label>Token de Reset</mat-label>
            <input
              matInput
              type="text"
              formControlName="resetToken"
              placeholder="Clique em 'Solicitar Token' para obter automaticamente"
              [readonly]="true"
            />
            <mat-error *ngIf="resetForm.get('resetToken')?.invalid && resetForm.get('resetToken')?.touched">
              Token de reset é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nova Senha</mat-label>
            <input
              matInput
              type="password"
              formControlName="newPassword"
              placeholder="Digite a nova senha"
            />
            <mat-error *ngIf="resetForm.get('newPassword')?.invalid && resetForm.get('newPassword')?.touched">
              Nova senha é obrigatória (mínimo 6 caracteres)
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Confirmar Nova Senha</mat-label>
            <input
              matInput
              type="password"
              formControlName="confirmPassword"
              placeholder="Confirme a nova senha"
            />
            <mat-error *ngIf="resetForm.get('confirmPassword')?.invalid && resetForm.get('confirmPassword')?.touched">
              Confirmação de senha é obrigatória
            </mat-error>
            <mat-error *ngIf="resetForm.hasError('passwordMismatch') && resetForm.get('confirmPassword')?.touched">
              As senhas não coincidem
            </mat-error>
          </mat-form-field>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </form>
      </mat-dialog-content>
      
      <mat-dialog-actions>
        <button
          mat-button
          (click)="onCancel()"
          [disabled]="loading"
        >
          Cancelar
        </button>
        
        <button
          mat-button
          color="accent"
          (click)="onRequestToken()"
          [disabled]="loading || !resetForm.get('email')?.valid || !resetForm.get('newPassword')?.valid"
          *ngIf="data.scenario === 'forgot' && !resetForm.get('resetToken')?.value"
        >
          <mat-spinner *ngIf="loading" diameter="20" style="margin-right: 10px;"></mat-spinner>
          {{ loading ? 'Solicitando...' : 'Solicitar Token' }}
        </button>
        
        <button
          mat-raised-button
          color="primary"
          (click)="onSubmit()"
          [disabled]="resetForm.invalid || loading"
        >
          <mat-spinner *ngIf="loading" diameter="20" style="margin-right: 10px;"></mat-spinner>
          {{ loading ? 'Alterando...' : 'Alterar Senha' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .reset-password-dialog {
      min-width: 400px;
      max-width: 500px;
    }
    
    .reset-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }
    
    .full-width {
      width: 100%;
    }
    
    .info-message {
      background-color: #d1ecf1;
      border: 1px solid #bee5eb;
      color: #0c5460;
      padding: 12px;
      border-radius: 4px;
      margin-bottom: 16px;
      font-size: 14px;
    }
    
    .error-message {
      color: #f44336;
      font-size: 14px;
      margin-top: 8px;
    }
    
    mat-dialog-actions {
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ResetPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResetPasswordData
  ) {
    this.resetForm = this.fb.group({
      email: [data.email, [Validators.required, Validators.email]],
      resetToken: [data.resetToken || '', data.scenario === 'forgot' ? [Validators.required] : []],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.resetForm.valid) {
      this.loading = true;
      this.errorMessage = '';

      const formData = this.resetForm.value;
      console.log('Dados do reset de senha:', formData);

      // Implementar fluxo baseado no cenário
      if (this.data.scenario === 'forgot') {
        console.log('🔄 CENÁRIO 1: Reset de Senha para Usuário que Esqueceu');
        
        // Reset de senha com token
        console.log('📝 Redefinindo senha com token de reset');
        const resetToken = formData.resetToken || this.data.resetToken;
        this.authService.resetPasswordWithResetToken(resetToken, formData.newPassword).subscribe({
        next: (response) => {
          console.log('✅ Reset de senha bem-sucedido:', response);
          this.loading = false;
          
          const message = response.message || 'Senha alterada com sucesso!';
          this.snackBar.open(message, 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ Erro no fluxo login + reset:', error);
          
          if (error.status === 401) {
            this.errorMessage = 'Email ou senha atual inválidos.';
          } else if (error.status === 404) {
            this.errorMessage = 'Usuário não encontrado.';
          } else if (error.status === 400) {
            this.errorMessage = 'Dados inválidos. Verifique o email e senhas.';
          } else {
            this.errorMessage = 'Erro ao alterar senha. Tente novamente.';
          }
          
          this.snackBar.open('Erro ao alterar senha. Verifique os dados.', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
      } else if (this.data.scenario === 'authenticated') {
        // CENÁRIO 2: Reset com usuário logado
        console.log('🔄 CENÁRIO 2: Reset com Usuário Logado');
        this.authService.resetPasswordAuthenticated(formData.email, formData.newPassword).subscribe({
          next: (response) => {
            console.log('✅ Reset de senha bem-sucedido:', response);
            this.loading = false;
            
            this.snackBar.open('Senha alterada com sucesso!', 'Fechar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.loading = false;
            console.error('❌ Erro no reset de senha:', error);
            
            if (error.status === 401) {
              this.errorMessage = 'Token expirado. Faça login novamente.';
            } else if (error.status === 403) {
              this.errorMessage = 'Você não tem permissão para alterar esta senha.';
            } else if (error.status === 400) {
              this.errorMessage = 'Dados inválidos. Verifique o email e senha.';
            } else {
              this.errorMessage = 'Erro ao alterar senha. Tente novamente.';
            }
            
            this.snackBar.open('Erro ao alterar senha. Verifique os dados.', 'Fechar', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        });
      }
    }
  }

  onRequestToken() {
    if (this.resetForm.get('email')?.valid && this.resetForm.get('newPassword')?.valid) {
      this.loading = true;
      this.errorMessage = '';

      const email = this.resetForm.get('email')?.value;
      console.log('📝 Solicitando token de reset para:', email);

      this.authService.forgotPassword(email).subscribe({
        next: (response) => {
          console.log('✅ Token de reset solicitado com sucesso!');
          console.log('🎫 Token recebido:', response.resetToken);
          this.loading = false;
          
          // Preencher o campo de token automaticamente
          this.resetForm.get('resetToken')?.setValue(response.resetToken);
          
          this.snackBar.open('Token de reset obtido! Agora você pode alterar a senha.', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          this.loading = false;
          console.error('❌ Erro ao solicitar token de reset:', error);
          
          if (error.status === 404) {
            this.errorMessage = 'Usuário não encontrado.';
          } else if (error.status === 400) {
            this.errorMessage = 'Email inválido.';
          } else {
            this.errorMessage = 'Erro ao solicitar token de reset. Tente novamente.';
          }
          
          this.snackBar.open('Erro ao solicitar token de reset.', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
