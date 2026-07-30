import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatExpansionModule],
  template: `
    <aside class="sidebar-container notranslate" translate="no">
      <div class="brand-header">
        <mat-icon class="brand-logo-icon">local_pharmacy</mat-icon>
        <div class="brand-titles">
          <h1 class="brand-title">Marianix</h1>
          <span class="brand-subtitle">AUDITORÍA MÉDICA</span>
        </div>
      </div>

      <nav class="nav-menu">
        <a routerLink="/dashboard" routerLinkActive="active" class="menu-item single-item">
          <mat-icon class="icon-blue">dashboard</mat-icon>
          <span>Inicio / Dashboard</span>
        </a>

        <!-- CONFIGURACIÓN / ABMS (INICIA COMPRIMIDO) -->
        <mat-expansion-panel class="menu-panel" [expanded]="false">
          <mat-expansion-panel-header class="menu-header">
            <mat-panel-title>
              <mat-icon class="icon-orange">settings</mat-icon>
              <span>Configuración / ABMs</span>
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="submenu-list">
            <a routerLink="/configuracion/usuarios" routerLinkActive="active" class="submenu-item"><mat-icon>person</mat-icon> Usuarios</a>
            <a routerLink="/configuracion/roles" routerLinkActive="active" class="submenu-item"><mat-icon>admin_panel_settings</mat-icon> Roles y Permisos</a>
            <a routerLink="/configuracion/paises" routerLinkActive="active" class="submenu-item"><mat-icon>public</mat-icon> Países</a>
            <a routerLink="/configuracion/provincias" routerLinkActive="active" class="submenu-item"><mat-icon>map</mat-icon> Provincias</a>
            <a routerLink="/configuracion/droguerias" routerLinkActive="active" class="submenu-item"><mat-icon>local_pharmacy</mat-icon> Droguerías</a>
            <a routerLink="/configuracion/periodos" routerLinkActive="active" class="submenu-item"><mat-icon>date_range</mat-icon> Períodos</a>
            <a routerLink="/configuracion/especialidades" routerLinkActive="active" class="submenu-item"><mat-icon>school</mat-icon> Especialidades</a>
            <a routerLink="/configuracion/observaciones" routerLinkActive="active" class="submenu-item"><mat-icon>visibility</mat-icon> Observaciones</a>
            <a routerLink="/configuracion/patologias" routerLinkActive="active" class="submenu-item"><mat-icon>coronavirus</mat-icon> Patologías</a>
            <a routerLink="/configuracion/categorias" routerLinkActive="active" class="submenu-item"><mat-icon>category</mat-icon> Categorías Medicamentos</a>
            <a routerLink="/configuracion/ubicaciones" routerLinkActive="active" class="submenu-item"><mat-icon>place</mat-icon> Ubicaciones</a>
            <a routerLink="/configuracion/vinculos" routerLinkActive="active" class="submenu-item"><mat-icon>family_restroom</mat-icon> Vínculos</a>
            <a routerLink="/configuracion/zonas" routerLinkActive="active" class="submenu-item"><mat-icon>my_location</mat-icon> Zonas</a>
            <a routerLink="/configuracion/colegios" routerLinkActive="active" class="submenu-item"><mat-icon>business</mat-icon> Colegios Farmacéuticos</a>
          </div>
        </mat-expansion-panel>

        <!-- GESTIÓN MÉDICA (INICIA COMPRIMIDO) -->
        <mat-expansion-panel class="menu-panel" [expanded]="false">
          <mat-expansion-panel-header class="menu-header">
            <mat-panel-title>
              <mat-icon class="icon-cyan">medical_services</mat-icon>
              <span>Gestión Médica</span>
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="submenu-list">
            <a routerLink="/gestion-medica/afiliados" routerLinkActive="active" class="submenu-item"><mat-icon>people</mat-icon> Afiliados</a>
            <a routerLink="/gestion-medica/medicos" routerLinkActive="active" class="submenu-item"><mat-icon>health_and_safety</mat-icon> Médicos</a>
          </div>
        </mat-expansion-panel>
      </nav>
    </aside>
  `,
  styles: [`
    .sidebar-container {
      width: var(--sidebar-width);
      height: 100vh;
      background-color: var(--bg-sidebar);
      color: #F8FAFC;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 12px 8px;
      overflow-y: auto;
    }
    .brand-header { display: flex; align-items: center; gap: 10px; padding: 8px 12px 14px 12px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 8px; }
    .brand-logo-icon { font-size: 32px; width: 32px; height: 32px; color: #38BDF8; }
    .brand-title { font-size: 1.4rem; font-weight: 800; color: #FFFFFF; margin: 0; line-height: 1; }
    .brand-subtitle { font-size: 0.68rem; font-weight: 800; color: #94A3B8; letter-spacing: 1px; }
    .nav-menu { display: flex; flex-direction: column; gap: 2px; }
    .single-item { display: flex; align-items: center; gap: 10px; padding: 8px 12px; color: #E2E8F0; text-decoration: none; font-weight: 600; font-size: 0.88rem; border-radius: 6px; }
    .single-item:hover, .single-item.active { background-color: rgba(255,255,255,0.08); color: #38BDF8; }
    .menu-panel { background: transparent !important; box-shadow: none !important; color: white !important; margin: 0 !important; }
    ::ng-deep .menu-panel .mat-expansion-panel-body { padding: 0 0 4px 0 !important; }
    .menu-header { height: 36px !important; padding: 0 12px !important; border-radius: 6px; }
    ::ng-deep .mat-expansion-panel-header-title { color: #E2E8F0 !important; font-weight: 700 !important; font-size: 0.88rem !important; display: flex !important; align-items: center !important; gap: 10px !important; margin: 0 !important; }
    .submenu-list { display: flex; flex-direction: column; gap: 1px; padding-left: 8px; }
    .submenu-item { display: flex; align-items: center; gap: 8px; padding: 4px 12px; height: 30px; color: #94A3B8; text-decoration: none; font-size: 0.82rem; font-weight: 500; border-radius: 6px; }
    .submenu-item mat-icon { font-size: 18px; width: 18px; height: 18px; }
    .submenu-item:hover, .submenu-item.active { color: #38BDF8; background-color: rgba(56, 189, 248, 0.1); font-weight: 700; }
    
    .icon-blue { color: #38BDF8 !important; }
    .icon-orange { color: #FB923C !important; }
    .icon-cyan { color: #22D3EE !important; }
  `]
})
export class SidebarComponent {}
