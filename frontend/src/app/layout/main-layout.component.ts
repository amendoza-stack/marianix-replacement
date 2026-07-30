import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header.component';
import { SidebarComponent } from './sidebar.component';
import { FooterComponent } from './footer.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="layout-wrapper" [class.sidebar-collapsed]="sidebarCollapsed()">
      <app-sidebar class="layout-sidebar"></app-sidebar>
      <div class="layout-main">
        <app-header (toggleSidebar)="sidebarCollapsed.set(!sidebarCollapsed())"></app-header>
        <main class="layout-content">
          <router-outlet></router-outlet>
        </main>
        <app-footer></app-footer>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper { display: flex; width: 100vw; height: 100vh; overflow: hidden; background: var(--bg-app); }
    .layout-sidebar { transition: margin-left 0.3s ease; }
    .sidebar-collapsed .layout-sidebar { margin-left: calc(-1 * var(--sidebar-width)); }
    .layout-main { flex: 1; display: flex; flex-direction: column; height: 100vh; overflow: hidden; }
    .layout-content { flex: 1; overflow-y: auto; padding: 20px; box-sizing: border-box; }
  `]
})
export class MainLayoutComponent {
  sidebarCollapsed = signal<boolean>(false);
}
