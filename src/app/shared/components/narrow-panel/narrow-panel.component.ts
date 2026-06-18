import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-narrow-panel',
  templateUrl: './narrow-panel.component.html',
  styleUrls: ['./narrow-panel.component.scss'],
})
export class NarrowPanelComponent {
  @Input() title = 'Panel';
  @Input() saveLabel = 'Save';
  @Input() open = false;
  @Input() saveDisabled = false;

  @Output() save = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  onSave(): void {
    this.save.emit();
  }

  onClose(): void {
    this.closed.emit();
  }
}
