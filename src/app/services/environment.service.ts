import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private readonly config = environment;

  constructor() { }

  get apiUrl(): string {
    return this.config.apiUrl;
  }

  get isProduction(): boolean {
    return this.config.production;
  }

  get environmentName(): string {
    return this.config.environmentName;
  }

  get isDevelopment(): boolean {
    return !this.config.production;
  }

  get isLocal(): boolean {
    return this.config.environmentName === 'local';
  }

  get isDynamic(): boolean {
    return this.config.environmentName === 'dynamic';
  }

  get backendPort(): string {
    // Extrai a porta da URL da API
    const url = new URL(this.config.apiUrl);
    return url.port || '7201';
  }

  get backendHost(): string {
    // Extrai o host da URL da API
    const url = new URL(this.config.apiUrl);
    return url.hostname;
  }
}
