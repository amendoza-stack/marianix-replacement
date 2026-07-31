import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  template: `
    <nav class="breadcrumb-container notranslate" translate="no">
      <a routerLink="/dashboard" class="crumb-link">
        <mat-icon class="crumb-icon">home</mat-icon> Inicio
      </a>
      <ng-container *ngFor="let crumb of crumbs; let last = last">
        <mat-icon class="separator">chevron_right</mat-icon>
        <span *ngIf="last" class="crumb-current">{{ crumb.label }}</span>
        <a *ngIf="!last" [routerLink]="crumb.url" class="crumb-link">{{ crumb.label }}</a>
      </ng-container>
    </nav>
  `,
  styles: [`
    .breadcrumb-container { display: flex; align-items: center; font-size: 0.85rem; color: var(--text-muted); }
    .crumb-link { color: var(--brand-accent); text-decoration: none; font-weight: 600; display: flex; align-items: center; gap: 4px; }
    .crumb-link:hover { text-decoration: underline; }
    .crumb-icon { font-size: 16px; width: 16px; height: 16px; }
    .separator { font-size: 16px; width: 16px; height: 16px; color: var(--text-muted); opacity: 0.6; }
    .crumb-current { font-weight: 700; color: var(--text-main); }
  `]
})
export class BreadcrumbComponent {
  private router = inject(Router);
  crumbs: Array<{ label: string; url: string }> = [];

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => this.buildBreadcrumb());
    this.buildBreadcrumb();
  }

  private buildBreadcrumb(): void {
    const segments = this.router.url.split('/').filter(x => x);
    this.crumbs = segments.map((seg, i) => {
      const url = '/' + segments.slice(0, i + 1).join('/');
      const label = seg.replace(/-/g, ' ').toUpperCase();
      return { label, url };
    });
  }
}
