import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TrainingEventListComponent } from './training-event-list/training-event-list.component';
import { TrainingEventDetailComponent } from './training-event-detail/training-event-detail.component';
import { EventEnrollmentComponent } from './event-enrollment/event-enrollment.component';
import { TrainingPathwayListComponent } from './training-pathway-list/training-pathway-list.component';
import { TrainingPathwayDetailComponent } from './training-pathway-detail/training-pathway-detail.component';
import { TrainingPathwayItemDetailComponent } from './training-pathway-item-detail/training-pathway-item-detail.component';
import { TrainingPathwaySessionDetailComponent } from './training-pathway-session-detail/training-pathway-session-detail.component';

const routes: Routes = [
  { path: 'events', component: TrainingEventListComponent },
  { path: 'events/:id', component: TrainingEventDetailComponent },
  { path: 'events/:id/enrollments', component: EventEnrollmentComponent },
  { path: 'pathways', component: TrainingPathwayListComponent },
  { path: 'pathways/:id/items/:stageId/:itemIdx/sessions/:sessionId', component: TrainingPathwaySessionDetailComponent },
  { path: 'pathways/:id/items/:stageId/:itemIdx', component: TrainingPathwayItemDetailComponent },
  { path: 'pathways/:id', component: TrainingPathwayDetailComponent },
  { path: '', redirectTo: 'events', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TrainingsRoutingModule {}
