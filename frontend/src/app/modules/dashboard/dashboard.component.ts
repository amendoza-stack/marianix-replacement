import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `<div style="padding:40px; color:white;"><h1>Bienvenido al Dashboard</h1></div>`
})
export class DashboardComponent {}
