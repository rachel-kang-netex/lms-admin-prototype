import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TrainingsRoutingModule } from './trainings-routing.module';
import { TrainingEventListComponent } from './training-event-list/training-event-list.component';
import { TrainingEventDetailComponent } from './training-event-detail/training-event-detail.component';
import { EventEnrollmentComponent } from './event-enrollment/event-enrollment.component';
import { TrainingPathwayListComponent } from './training-pathway-list/training-pathway-list.component';
import { TrainingPathwayDetailComponent } from './training-pathway-detail/training-pathway-detail.component';
import { TrainingPathwayItemDetailComponent } from './training-pathway-item-detail/training-pathway-item-detail.component';
import { TrainingPathwaySessionDetailComponent } from './training-pathway-session-detail/training-pathway-session-detail.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    TrainingEventListComponent,
    TrainingEventDetailComponent,
    EventEnrollmentComponent,
    TrainingPathwayListComponent,
    TrainingPathwayDetailComponent,
    TrainingPathwayItemDetailComponent,
    TrainingPathwaySessionDetailComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TrainingsRoutingModule,
    SharedModule,
  ],
})
export class TrainingsModule {}
