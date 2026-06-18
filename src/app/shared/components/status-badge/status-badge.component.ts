import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent {
  @Input() status = '';

  get variantClass(): string {
    return `status-badge--${this.status.toLowerCase().replace(/\s+/g, '-')}`;
  }
}
