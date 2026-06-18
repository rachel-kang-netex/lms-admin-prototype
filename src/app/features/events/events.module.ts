import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { EventsRoutingModule } from './events-routing.module';
import { EventsListComponent } from './events-list/events-list.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { ModuleFormComponent } from './module-form/module-form.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    EventsListComponent,
    EventDetailComponent,
    ModuleFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EventsRoutingModule,
    SharedModule,
  ],
})
export class EventsModule {}
