import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-unavailable',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './service-unavailable.component.html',
  styleUrl: './service-unavailable.component.css'
})
export class ServiceUnavailableComponent {
  @Input() message: string = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
