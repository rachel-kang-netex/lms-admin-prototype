import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ShellComponent } from './components/shell/shell.component';
import { DataTableComponent } from './components/data-table/data-table.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { NarrowPanelComponent } from './components/narrow-panel/narrow-panel.component';
import { UiInputComponent } from './components/ui/ui-input/ui-input.component';
import { UiTextareaComponent } from './components/ui/ui-textarea/ui-textarea.component';
import { UiSelectComponent } from './components/ui/ui-select/ui-select.component';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { TimeInputComponent } from './components/time-input/time-input.component';
import { StatusBadgeComponent } from './components/status-badge/status-badge.component';

@NgModule({
  declarations: [
    ShellComponent,
    DataTableComponent,
    SidePanelComponent,
    NarrowPanelComponent,
    UiInputComponent,
    UiTextareaComponent,
    UiSelectComponent,
    DatePickerComponent,
    TimeInputComponent,
    StatusBadgeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
  ],
  exports: [
    ShellComponent,
    DataTableComponent,
    SidePanelComponent,
    NarrowPanelComponent,
    UiInputComponent,
    UiTextareaComponent,
    UiSelectComponent,
    DatePickerComponent,
    TimeInputComponent,
    StatusBadgeComponent,
  ],
})
export class SharedModule {}
