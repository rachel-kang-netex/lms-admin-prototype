import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TableColumn, RowMenuItem } from '../../../shared/components/data-table/data-table.component';
import { LmsEvent } from '../../../core/mock-data/events.mock';
import { EventsService } from '../events.service';
import { TrainingsService } from '../../trainings/trainings.service';

@Component({
  selector: 'app-events-list',
  templateUrl: './events-list.component.html',
  styleUrls: ['./events-list.component.scss'],
})
export class EventsListComponent {
  panelOpen = false;
  selectedEvent: LmsEvent | null = null;
  isEditing = false;

  trainingPanelOpen = false;
  trainingSourceEvent: LmsEvent | null = null;
  trainingForm: FormGroup = this.fb.group({ name: ['', Validators.required], eventName: [{ value: '', disabled: true }] });

  // View tabs (match Figma — not status filters)
  activeView = 'Default';
  views = ['Default', 'Custom view', 'Custom view'];

  columns: TableColumn[] = [
    { key: 'name',            label: 'Name' },
    { key: 'status',          label: 'Status',          width: '130px',  type: 'badge' },
    { key: 'catalogue',       label: 'Catalogue',       width: '160px' },
    { key: 'created',         label: 'Created',         width: '180px' },
    { key: 'createdBy',       label: 'Created by',      width: '160px' },
    { key: 'lastModified',    label: 'Last modified',   width: '180px' },
    { key: 'lastModifiedBy',  label: 'Last modified by', width: '160px' },
  ];

  form: FormGroup;
  skillInput = '';
  tagInput = '';

  completionCriteriaOptions = [
    'By attendance percentage',
    'By completion of activities',
    'By instructor approval',
  ];
  countryOptions = ['Spain', 'France', 'Germany', 'United Kingdom', 'United States'];

  constructor(private fb: FormBuilder, private router: Router, private eventsService: EventsService, private trainingsService: TrainingsService) {
    this.form = this.buildForm(null);
  }

  // All events shown in all views (prototype: views don't filter data)
  get filteredEvents(): LmsEvent[] {
    return this.eventsService.getAll();
  }

  setView(view: string): void {
    this.activeView = view;
  }

  private buildForm(event: LmsEvent | null): FormGroup {
    return this.fb.group({
      name:                 [event?.name ?? '', Validators.required],
      completionCriteria:   [event?.completionCriteria ?? 'By attendance percentage'],
      attendancePercentage: [event?.attendancePercentage ?? 100],
      evaluable:            [event?.evaluable ?? false],
      cutoffScore:          [event?.cutoffScore ?? 70],
      description:          [event?.description ?? ''],
      country:              [event?.country ?? 'Spain'],
      tags:                 [event?.tags ? [...event.tags] : []],
      skills:               [event?.skills ? [...event.skills] : []],
    });
  }

  openNewPanel(): void {
    this.selectedEvent = null;
    this.isEditing = false;
    this.form = this.buildForm(null);
    this.panelOpen = true;
  }

  openEditPanel(event: LmsEvent): void {
    this.selectedEvent = event;
    this.isEditing = true;
    this.form = this.buildForm(event);
    this.panelOpen = true;
  }

  onRowClick(row: Record<string, any>): void {
    this.router.navigate(['/events', (row as LmsEvent).id]);
  }

  onInfoClick(row: Record<string, any>): void {
    this.router.navigate(['/events', (row as LmsEvent).id]);
  }

  getMenuItems = (row: Record<string, any>): RowMenuItem[] => {
    const isPublished = (row as LmsEvent).status === 'Published';
    return [
      { label: 'Details' },
      { label: 'Open editor', action: 'open-editor', dividerBefore: true },
      isPublished
        ? { label: 'Unpublish', action: 'unpublish' }
        : { label: 'Publish', action: 'publish' },
      { label: 'Create training', action: 'create-training', dividerBefore: true, disabled: !isPublished },
      { label: 'See trainings' },
      { label: 'Duplicate', dividerBefore: true },
      { label: 'Create version' },
      isPublished
        ? { label: 'Delete', dividerBefore: true, disabled: true }
        : { label: 'Delete', dividerBefore: true, action: 'delete' },
    ];
  };

  onMenuAction(event: { action: string; row: Record<string, any> }): void {
    const lmsEvent = event.row as LmsEvent;
    if (event.action === 'publish') {
      this.eventsService.updateStatus(lmsEvent.id, 'Published');
    } else if (event.action === 'unpublish') {
      this.eventsService.updateStatus(lmsEvent.id, 'Unpublished');
    } else if (event.action === 'delete') {
      this.eventsService.remove(lmsEvent.id);
    } else if (event.action === 'create-training') {
      this.openTrainingPanel(lmsEvent);
    }
  }

  openTrainingPanel(event: LmsEvent): void {
    this.trainingSourceEvent = event;
    this.trainingForm.setValue({ name: event.name, eventName: event.name });
    this.trainingPanelOpen = true;
  }

  closeTrainingPanel(): void {
    this.trainingPanelOpen = false;
    this.trainingSourceEvent = null;
  }

  saveTraining(): void {
    if (this.trainingForm.invalid) return;
    const values = this.trainingForm.getRawValue();
    const now = '15/06/2026 - 10:00';
    const training = {
      id: this.trainingsService.nextId(),
      name: values.name,
      status: 'Open' as const,
      public: true,
      dates: '-',
      created: now,
      createdBy: 'Admin',
      lastModified: now,
      lastModifiedBy: 'Admin',
      eventId: this.trainingSourceEvent!.id,
      eventName: this.trainingSourceEvent!.name,
      modules: this.trainingSourceEvent?.modules?.length
        ? this.trainingSourceEvent.modules
        : [{ name: this.trainingSourceEvent!.name, description: '', duration: null, completionCriteria: 'By attendance' }],
    };
    this.trainingsService.add(training);
    this.closeTrainingPanel();
    this.router.navigate(['/trainings/events', training.id]);
  }

  closePanel(): void {
    this.panelOpen = false;
    this.selectedEvent = null;
  }

  savePanel(): void {
    if (this.form.invalid) return;
    const values = this.form.value;
    const now = '15/06/2026 - 10:00';
    if (this.isEditing && this.selectedEvent) {
      this.eventsService.update({
        ...this.selectedEvent,
        ...values,
        lastModified: now,
        lastModifiedBy: 'Admin',
      });
    } else {
      this.eventsService.add({
        id: this.eventsService.nextId(),
        status: 'Draft',
        catalogue: '-',
        created: now,
        createdBy: 'Admin',
        lastModified: now,
        lastModifiedBy: 'Admin',
        ...values,
      });
    }
    this.closePanel();
  }

  get panelTitle(): string {
    return this.isEditing ? 'Event details' : 'New event';
  }

  get tags(): string[] { return this.form.get('tags')!.value; }
  addTag(): void {
    const v = this.tagInput.trim();
    if (v && !this.tags.includes(v)) this.form.get('tags')!.setValue([...this.tags, v]);
    this.tagInput = '';
  }
  removeTag(tag: string): void {
    this.form.get('tags')!.setValue(this.tags.filter(t => t !== tag));
  }

  get skills(): { name: string; level: string }[] { return this.form.get('skills')!.value; }
  addSkill(): void {
    const v = this.skillInput.trim();
    if (v && !this.skills.find(s => s.name === v))
      this.form.get('skills')!.setValue([...this.skills, { name: v, level: 'Intermediate' }]);
    this.skillInput = '';
  }
  removeSkill(skill: { name: string; level: string }): void {
    this.form.get('skills')!.setValue(this.skills.filter(s => s.name !== skill.name));
  }

  get cutoffScore(): number { return this.form.get('cutoffScore')!.value; }
}
