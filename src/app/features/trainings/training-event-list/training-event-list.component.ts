import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TableColumn } from '../../../shared/components/data-table/data-table.component';
import { LmsTraining } from '../../../core/mock-data/trainings.mock';
import { TrainingsService } from '../trainings.service';

@Component({
  selector: 'app-training-event-list',
  templateUrl: './training-event-list.component.html',
  styleUrls: ['./training-event-list.component.scss'],
})
export class TrainingEventListComponent {
  columns: TableColumn[] = [
    { key: 'name',           label: 'Name' },
    { key: 'status',         label: 'Status',          width: '130px', type: 'badge' },
    { key: 'publicLabel',    label: 'Public',           width: '80px' },
    { key: 'dates',          label: 'Dates',            width: '320px' },
    { key: 'created',        label: 'Created',          width: '180px' },
    { key: 'createdBy',      label: 'Created by',       width: '160px' },
    { key: 'lastModified',   label: 'Last modified',    width: '180px' },
    { key: 'lastModifiedBy', label: 'Last modified by', width: '160px' },
  ];

  activeView = 'Default';

  constructor(private router: Router, private trainingsService: TrainingsService) {}

  setView(view: string): void { this.activeView = view; }

  get tableData(): Record<string, any>[] {
    return this.trainingsService.getAll().map(t => ({
      ...t,
      publicLabel: t.public ? 'Yes' : 'No',
    }));
  }

  onRowClick(row: Record<string, any>): void {
    this.router.navigate(['/trainings/events', (row as LmsTraining).id]);
  }

  onInfoClick(row: Record<string, any>): void {
    this.router.navigate(['/trainings/events', (row as LmsTraining).id]);
  }
}
