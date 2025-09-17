import { Injectable } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { LoginRequest, LoginResponse, LoginTokenResponse, User } from '../models/user';
import { EnvironmentService } from './environment.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL: string;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private environmentService: EnvironmentService,
    private userService: UserService
  ) {
    this.API_URL = this.environmentService.apiUrl;
    
    // Verificar se há token salvo no localStorage
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const parsedUser = JSON.parse(user);
      // Garantir que o role está mapeado corretamente
      if (parsedUser.isAdministrator !== undefined && !parsedUser.role) {
        parsedUser.role = parsedUser.isAdministrator ? 'Admin' : 'User';
      }
      this.currentUserSubject.next(parsedUser);
    }
  }

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    console.log('Enviando requisição de login para:', `${this.API_URL}/Auth/login`);
    console.log('Dados:', loginRequest);
    
    return this.http.post<LoginResponse>(`${this.API_URL}/Auth/login`, loginRequest, { 
      headers,
      context: new HttpContext()
    })
      .pipe(
        tap(response => {
          // Salvar token primeiro
          localStorage.setItem('token', response.token);
          
          // Buscar dados atualizados do usuário do banco
          this.userService.getUserById(response.user.id).subscribe({
            next: (updatedUser) => {
              // Mapear isAdministrator para role usando dados corretos do banco
              const user = {
                ...updatedUser,
                role: updatedUser.isAdministrator ? 'Admin' : 'User'
              };
              
              localStorage.setItem('user', JSON.stringify(user));
              this.currentUserSubject.next(user);
            },
            error: (error) => {
              console.error('Erro ao buscar dados atualizados do usuário:', error);
              // Fallback: usar dados do login mesmo com erro
              const user = {
                ...response.user,
                role: response.user.isAdministrator ? 'Admin' : 'User'
              };
              localStorage.setItem('user', JSON.stringify(user));
              this.currentUserSubject.next(user);
            }
          });
        })
      );
  }


  authenticate(): Observable<User> {
    return this.http.post<User>(`${this.API_URL}/Auth/login`, {})
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

  resetPassword(email: string, newPassword: string, token?: string): Observable<any> {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Usar token passado como parâmetro ou tentar pegar do localStorage
    const authToken = token || this.getToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
      console.log('Token sendo usado para reset de senha:', authToken.substring(0, 20) + '...');
    } else {
      console.warn('Nenhum token encontrado para reset de senha - tentando sem autenticação');
    }

    const resetData = {
      email: email,
      newPassword: newPassword
    };

    // Usar sempre o endpoint existente (com ou sem token)
    const endpoint = '/Auth/reset-password';
    
    console.log('Enviando requisição de reset de senha para:', `${this.API_URL}${endpoint}`);
    console.log('Dados:', resetData);
    console.log('Token presente:', !!authToken);

    return this.http.post<any>(`${this.API_URL}${endpoint}`, resetData, { 
      headers,
      context: new HttpContext()
    });
  }

  tryLoginWithNewPasswordAndReset(email: string, newPassword: string): Observable<any> {
    console.log('🔄 Iniciando fluxo: Tentar Login com Nova Senha → Se falhar, fazer Reset');
    
    // Primeiro tentar fazer login com a nova senha
    const loginRequest = {
      email: email,
      password: newPassword
    };

    console.log('📝 Passo 1: Tentando login com a nova senha...');
    return this.login(loginRequest).pipe(
      tap(loginResponse => {
        console.log('✅ Passo 1 concluído: Login com nova senha funcionou!');
        console.log('🎫 Token obtido:', loginResponse.token.substring(0, 20) + '...');
        console.log('🎉 A senha já foi atualizada anteriormente!');
      }),
      // Se chegou aqui, significa que o login funcionou com a nova senha
      // Não precisa fazer reset, apenas retornar sucesso
      switchMap(loginResponse => {
        console.log('✅ Senha já está atualizada, não é necessário fazer reset!');
        return new Observable(observer => {
          observer.next({ message: 'Senha já está atualizada!', token: loginResponse.token });
          observer.complete();
        });
      })
    );
  }

  // CENÁRIO 1: "Esqueci minha senha" - Solicitar Reset de Senha
  forgotPassword(email: string): Observable<any> {
    console.log('🔄 CENÁRIO 1: Solicitar Reset de Senha');
    console.log('📝 Passo 1: Solicitar token de reset para:', email);
    
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const requestData = {
      email: email
    };

    console.log('Enviando requisição para:', `${this.API_URL}/Auth/forgot-password`);
    console.log('Dados:', requestData);

    return this.http.post<any>(`${this.API_URL}/Auth/forgot-password`, requestData, { 
      headers,
      context: new HttpContext()
    }).pipe(
      tap(response => {
        console.log('✅ Passo 1 concluído: Token de reset solicitado!');
        console.log('🎫 Token de reset:', response.resetToken);
        console.log('⏰ Token expira em:', response.expiresAt);
      })
    );
  }

  // CENÁRIO 1: "Esqueci minha senha" - Redefinir Senha com Token
  resetPasswordWithResetToken(resetToken: string, newPassword: string): Observable<any> {
    console.log('🔄 CENÁRIO 1: Redefinir Senha com Token');
    console.log('📝 Passo 2: Redefinir senha com token de reset');
    
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const resetData = {
      resetToken: resetToken,
      newPassword: newPassword
    };

    console.log('Enviando requisição para:', `${this.API_URL}/Auth/reset-password-with-reset-token`);
    console.log('Dados:', resetData);

    return this.http.post<any>(`${this.API_URL}/Auth/reset-password-with-reset-token`, resetData, { 
      headers,
      context: new HttpContext()
    }).pipe(
      tap(() => {
        console.log('✅ Passo 2 concluído: Senha redefinida com token!');
        console.log('🎉 Nova senha definida! Agora você pode fazer login.');
      })
    );
  }

  // CENÁRIO 2: Reset com Usuário Logado
  resetPasswordAuthenticated(email: string, newPassword: string): Observable<any> {
    console.log('🔄 CENÁRIO 2: Reset com Usuário Logado');
    console.log('📝 Usuário logado resetando senha');
    
    const token = this.getToken();
    if (!token) {
      throw new Error('Usuário não está logado');
    }

    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const resetData = {
      email: email,
      newPassword: newPassword
    };

    console.log('Enviando requisição para:', `${this.API_URL}/Auth/reset-password`);
    console.log('Dados:', resetData);
    console.log('Token presente:', true);

    return this.http.post<any>(`${this.API_URL}/Auth/reset-password`, resetData, { 
      headers,
      context: new HttpContext()
    }).pipe(
      tap(() => {
        console.log('✅ Reset de senha realizado com autenticação!');
        console.log('🎉 Senha alterada com sucesso!');
      })
    );
  }

}

