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
}
