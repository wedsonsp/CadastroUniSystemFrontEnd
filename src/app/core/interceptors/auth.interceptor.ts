import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('Interceptor - URL:', req.url);
  console.log('Interceptor - Token presente:', !!token);
  console.log('Interceptor - Token value:', token);

  // Não adicionar token nas rotas de autenticação quando não há token
  if (req.url.includes('/auth/authenticate') && !token) {
    console.log('Interceptor - Pulando autenticação para login:', req.url);
    console.log('Interceptor - Headers originais:', req.headers.keys());
    return next(req);
  }

  if (token) {
    console.log('Interceptor - Adicionando token para:', req.url);
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  console.log('Interceptor - Sem token para:', req.url);
  return next(req);
};

