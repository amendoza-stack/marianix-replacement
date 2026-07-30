import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { ThemeService } from '../core/services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatMenuModule],
  template: `
    <header class="header-container">
      <div class="header-left">
        <span class="header-title">Auditoría Médica y Gestión</span>
      </div>

      <div class="header-right">
        <!-- BOTÓN TOGGLE DARK / LIGHT MODE -->
        <button mat-icon-button (click)="themeService.toggleTheme()" title="Cambiar Tema">
          <mat-icon>{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <!-- USER PROFILE MENU -->
        <div class="user-profile" [matMenuTriggerFor]="userMenu">
          <div class="avatar">AM</div>
          <div class="user-info">
            <span class="user-name">Ana Mendoza</span>
            <span class="user-role">Administrador</span>
          </div>
          <mat-icon>expand_more</mat-icon>
        </div>

        <mat-menu #userMenu="matMenu">
          <button mat-menu-item><mat-icon>person</mat-icon> Mi Perfil</button>
          <button mat-menu-item><mat-icon>settings</mat-icon> Preferencias</button>
          <button mat-menu-item routerLink="/login"><mat-icon color="warn">logout</mat-icon> Cerrar Sesión</button>
        </mat-menu>
      </div>
    </header>
  `,
  styles: [`
    .header-container {
      height: var(--header-height);
      background-color: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      box-sizing: border-box;
      transition: background-color 0.3s;
    }
    .header-title { font-weight: 700; color: var(--text-main); font-size: 1rem; }
    .header-right { display: flex; align-items: center; gap: 16px; }
    .user-profile { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 4px 8px; border-radius: 8px; }
    .user-profile:hover { background-color: var(--border-color); }
    .avatar { width: 34px; height: 34px; border-radius: 50%; background-color: var(--brand-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.85rem; }
    .user-info { display: flex; flex-direction: column; }
    .user-name { font-size: 0.85rem; font-weight: 700; color: var(--text-main); line-height: 1.2; }
    .user-role { font-size: 0.72rem; color: var(--text-muted); }
  `]
})
export class HeaderComponent {
  themeService = inject(ThemeService);
}
