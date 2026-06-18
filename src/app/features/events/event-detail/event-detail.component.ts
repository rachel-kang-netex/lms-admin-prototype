import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModuleFormComponent } from '../module-form/module-form.component';
import { LmsEvent, LmsModule } from '../../../core/mock-data/events.mock';
import { EventsService } from '../events.service';
import { RowMenuItem } from '../../../shared/components/data-table/data-table.component';
import { TrainingsService } from '../../trainings/trainings.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit {
  @ViewChild(ModuleFormComponent) moduleForm?: ModuleFormComponent;

  event: LmsEvent | null = null;
  isPublished = false;
  activeTab: 'modules' | 'resources' = 'modules';
  modulesPanelOpen = false;
  modulePanelMode: 'add' | 'edit' = 'add';
  editingModuleIndex: number | null = null;
  modules: LmsModule[] = [];

  openMenuIndex: number | null = null;
  headerMenuOpen = false;
  headerMenuPosition: { top: number; right: number } | null = null;

  trainingPanelOpen = false;
  trainingForm: FormGroup;

  get headerMenuItems(): RowMenuItem[] {
    return [
      { label: 'Details' },
      { label: 'Open editor', action: 'open-editor', dividerBefore: true },
      { label: 'Create training', action: 'create-training', dividerBefore: true, disabled: !this.isPublished },
      { label: 'See trainings' },
      { label: 'Duplicate', dividerBefore: true },
      { label: 'Create version' },
      { label: 'Delete', dividerBefore: true, disabled: this.isPublished },
    ];
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.headerMenuOpen = false;
    this.headerMenuPosition = null;
  }

  get moduleSaveDisabled(): boolean {
    return !(this.moduleForm?.isValid ?? false);
  }

  get modulePanelTitle(): string {
    return this.modulePanelMode === 'edit' ? 'Edit module' : 'Add module';
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private fb: FormBuilder,
    private trainingsService: TrainingsService,
  ) {
    this.trainingForm = this.fb.group({ name: ['', Validators.required], eventName: [{ value: '', disabled: true }] });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.event = this.eventsService.getById(id);
    if (this.event) {
      this.isPublished = this.event.status === 'Published';
      this.modules = this.event.modules?.length
        ? [...this.event.modules]
        : [{ name: this.event.name, description: '', duration: null, completionCriteria: 'By attendance' }];
      this.trainingForm.setValue({ name: this.event.name, eventName: this.event.name });
    }
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }

  togglePublish(): void {
    if (!this.event) return;
    this.isPublished = !this.isPublished;
    const newStatus = this.isPublished ? 'Published' : 'Unpublished';
    this.event = { ...this.event, status: newStatus };
    this.eventsService.update(this.event);
  }

  setTab(tab: 'modules' | 'resources'): void {
    this.activeTab = tab;
  }

  toggleMenu(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openMenuIndex = this.openMenuIndex === index ? null : index;
  }

  closeMenu(): void {
    this.openMenuIndex = null;
  }

  toggleHeaderMenu(e: MouseEvent): void {
    e.stopPropagation();
    if (this.headerMenuOpen) {
      this.headerMenuOpen = false;
      this.headerMenuPosition = null;
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const items = this.headerMenuItems;
      const estimatedHeight = 16
        + items.length * 48
        + items.filter(i => i.dividerBefore).length * 1;
      const spaceBelow = window.innerHeight - rect.bottom - 4;
      const top = estimatedHeight > spaceBelow
        ? rect.top - estimatedHeight - 4
        : rect.bottom + 4;
      this.headerMenuPosition = { top, right: window.innerWidth - rect.right };
      this.headerMenuOpen = true;
    }
  }

  getHeaderMenuItemType(item: RowMenuItem): 'disabled' | 'action' | 'label' {
    if (item.disabled) return 'disabled';
    if (item.action) return 'action';
    return 'label';
  }

  openTrainingPanel(): void {
    this.headerMenuOpen = false;
    this.headerMenuPosition = null;
    this.trainingPanelOpen = true;
  }

  closeTrainingPanel(): void {
    this.trainingPanelOpen = false;
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
      eventId: this.event!.id,
      eventName: this.event!.name,
      modules: this.modules,
    };
    this.trainingsService.add(training);
    this.closeTrainingPanel();
    this.router.navigate(['/trainings/events', training.id]);
  }

  openModulesPanel(): void {
    this.modulePanelMode = 'add';
    this.editingModuleIndex = null;
    if (this.moduleForm) {
      this.moduleForm.name = '';
      this.moduleForm.description = '';
      this.moduleForm.duration = null;
      this.moduleForm.completionCriteria = 'By attendance';
    }
    this.modulesPanelOpen = true;
  }

  editModule(index: number): void {
    this.openMenuIndex = null;
    this.modulePanelMode = 'edit';
    this.editingModuleIndex = index;
    const m = this.modules[index];
    if (this.moduleForm) {
      this.moduleForm.name = m.name;
      this.moduleForm.description = m.description;
      this.moduleForm.duration = m.duration;
      this.moduleForm.completionCriteria = m.completionCriteria;
    }
    this.modulesPanelOpen = true;
  }

  deleteModule(index: number): void {
    if (this.modules.length <= 1) return;
    this.openMenuIndex = null;
    this.modules = this.modules.filter((_, i) => i !== index);
    this.persistModules();
  }

  closeModulesPanel(): void {
    this.modulesPanelOpen = false;
  }

  saveModule(): void {
    if (!this.moduleForm?.isValid) return;
    const updated: LmsModule = {
      name: this.moduleForm.name,
      description: this.moduleForm.description,
      duration: this.moduleForm.duration,
      completionCriteria: this.moduleForm.completionCriteria,
    };
    if (this.modulePanelMode === 'edit' && this.editingModuleIndex !== null) {
      this.modules = this.modules.map((m, i) => i === this.editingModuleIndex ? updated : m);
    } else {
      this.modules = [...this.modules, updated];
    }
    this.persistModules();
    this.modulesPanelOpen = false;
  }

  private persistModules(): void {
    if (!this.event) return;
    this.eventsService.update({ ...this.event, modules: this.modules });
  }
}
