import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterModule,],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  
}
