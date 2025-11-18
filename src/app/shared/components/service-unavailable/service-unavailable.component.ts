import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroExclamationTriangle, heroArrowPath } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-service-unavailable',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  templateUrl: './service-unavailable.component.html',
  styleUrl: './service-unavailable.component.css',
  viewProviders: [provideIcons({ heroExclamationTriangle, heroArrowPath })]
})
export class ServiceUnavailableComponent {
  @Input() message: string = 'Não foi possível conectar ao servidor. Por favor, tente novamente mais tarde.';
  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}
