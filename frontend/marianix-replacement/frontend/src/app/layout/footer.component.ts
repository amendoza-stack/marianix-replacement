import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer notranslate" translate="no">
      <span>&copy; 2026 Marianix Sistema de Auditoría Médica &bull; Todos los derechos reservados</span>
      <span class="version">v2.4.0 Enterprise</span>
    </footer>
  `,
  styles: [`
    .app-footer {
      height: 36px;
      background: var(--bg-card);
      border-top: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 24px;
      font-size: 0.75rem;
      color: var(--text-muted);
      box-sizing: border-box;
    }
    .version { font-weight: 700; color: var(--brand-accent); }
  `]
})
export class FooterComponent {}
