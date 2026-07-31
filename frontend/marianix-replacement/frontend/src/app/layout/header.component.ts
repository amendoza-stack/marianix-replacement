import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ThemeService } from '../core/services/theme.service';
import { AuthService } from '../core/services/auth.service';
import { BreadcrumbComponent } from './breadcrumb.component';
import { ChangePasswordDialogComponent } from './change-password-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule, MatToolbarModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatDialogModule, BreadcrumbComponent
  ],
  template: `
    <mat-toolbar class="app-header notranslate" translate="no">
      <div class="header-left">
        <button mat-icon-button (click)="toggleSidebar.emit()" title="Colapsar menú">
          <mat-icon>menu</mat-icon>
        </button>
        <app-breadcrumb></app-breadcrumb>
      </div>

      <div class="header-right">
        <!-- THEME TOGGLE -->
        <button mat-icon-button (click)="themeService.toggleTheme()" title="Cambiar Tema">
          <mat-icon>{{ themeService.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <!-- USER AVATAR & MENU -->
        <div class="user-menu-trigger" [matMenuTriggerFor]="userMenu">
          <div class="user-avatar">
            {{ getInitials() }}
          </div>
          <div class="user-details">
            <span class="user-name">{{ authService.currentUser()?.nombreCompleto || 'Ana Mendoza' }}</span>
            <span class="user-role">{{ authService.currentUser()?.role || 'SUPERADMIN' }}</span>
          </div>
          <mat-icon>expand_more</mat-icon>
        </div>

        <mat-menu #userMenu="matMenu" xPosition="before">
          <div class="menu-user-header">
            <strong>{{ authService.currentUser()?.nombreCompleto }}</strong>
            <span class="email-sub">{{ authService.currentUser()?.email }}</span>
          </div>
          <button mat-menu-item (click)="onChangePassword()">
            <mat-icon>lock_reset</mat-icon> Cambiar contraseña
          </button>
          <button mat-menu-item (click)="onLogout()">
            <mat-icon color="warn">logout</mat-icon> Salir
          </button>
        </mat-menu>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .app-header {
      height: var(--header-height);
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px;
      box-sizing: border-box;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    .user-menu-trigger { display: flex; align-items: center; gap: 10px; cursor: pointer; padding: 4px 8px; border-radius: 8px; transition: background 0.2s; }
    .user-menu-trigger:hover { background: var(--border-color); }
    .user-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: var(--brand-primary); color: white;
      font-weight: 800; font-size: 0.88rem;
      display: flex; align-items: center; justify-content: center;
    }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-size: 0.85rem; font-weight: 700; color: var(--text-main); line-height: 1.1; }
    .user-role { font-size: 0.7rem; font-weight: 700; color: var(--brand-accent); }
    .menu-user-header { padding: 12px 16px; border-bottom: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 2px; }
    .email-sub { font-size: 0.75rem; color: var(--text-muted); }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  public themeService = inject(ThemeService);
  public authService = inject(AuthService);
  private dialog = inject(MatDialog);

  getInitials(): string {
    const name = this.authService.currentUser()?.nombreCompleto || 'Ana Mendoza';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  onChangePassword(): void {
    this.dialog.open(ChangePasswordDialogComponent, { width: '400px' });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
