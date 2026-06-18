import { Component } from '@angular/core';

@Component({
  selector: 'app-module-form',
  templateUrl: './module-form.component.html',
  styleUrls: ['./module-form.component.scss'],
})
export class ModuleFormComponent {
  name = '';
  description = '';
  duration: number | null = null;
  completionCriteria = 'By attendance';

  completionOptions = [
    'By attendance',
    'By completion',
    'By score',
  ];

  get isValid(): boolean {
    return this.name.trim().length > 0;
  }
}
