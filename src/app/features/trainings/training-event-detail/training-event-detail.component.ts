import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsTraining, LmsLearner, LmsTrainer } from '../../../core/mock-data/trainings.mock';
import { LmsModule, ModuleSchedule, ModuleStatus, ScheduleSlot } from '../../../core/mock-data/events.mock';
import { TrainingsService } from '../trainings.service';


@Component({
  selector: 'app-training-event-detail',
  templateUrl: './training-event-detail.component.html',
  styleUrls: ['./training-event-detail.component.scss'],
})
export class TrainingEventDetailComponent implements OnInit, OnDestroy {
  training: LmsTraining | null = null;
  activeTab: 'modules' | 'learners' | 'trainers' = 'modules';
  localTrainers: LmsTrainer[] = [];
  openTrainerMenuId: number | null = null;
  dropdownPosition = { top: 0, right: 0 };

  openLearnerMenuId: number | null = null;
  learnerMenuPosition = { top: 0, right: 0 };
  managePanelOpen = false;
  managingLearnerIds: number[] = [];
  manageMarks = '';
  manageRemarks = '';
  manageManualCompletion = false;
  manageCompletionStatus = 'Completed';
  completionStatusOptions = ['Completed', 'Not completed', 'In progress', 'Not started'];
  learnerGradeOverrides = new Map<number, string>();
  learnerStatusOverrides = new Map<number, string>();

  selectedModuleIndices = new Set<number>();
  selectedLearnerIds = new Set<number>();
  selectedTrainerIds = new Set<number>();

  currentTime = Date.now();
  private statusTimer: ReturnType<typeof setInterval> | null = null;

  scheduleDropdownOpen = false;

  schedulePanelOpen = false;
  schedulingModule: LmsModule | null = null;
  schedulingModuleIndex = -1;
  scheduleLocation = '';
  scheduleSlots: ScheduleSlot[] = [];
  teamsEnabled = false;
  autoVirtualRoom = false;
  virtualRoomUrl = '';
  sendReminder = false;
  reminderDays = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingsService: TrainingsService,
  ) {}

  @HostListener('document:click')
  onDocumentClick(): void {
    this.scheduleDropdownOpen = false;
    this.openTrainerMenuId = null;
    this.openLearnerMenuId = null;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.training = this.trainingsService.getById(id);
    this.localTrainers = [...(this.training?.trainers ?? [])];
    this.statusTimer = setInterval(() => { this.currentTime = Date.now(); }, 60_000);
  }

  ngOnDestroy(): void {
    if (this.statusTimer !== null) clearInterval(this.statusTimer);
  }

  goBack(): void {
    this.router.navigate(['/trainings/events']);
  }

  goToEvent(): void {
    if (this.training) {
      this.router.navigate(['/events', this.training.eventId]);
    }
  }

  openEnrollments(): void {
    if (this.training) {
      this.router.navigate(['/trainings/events', this.training.id, 'enrollments']);
    }
  }

  setTab(tab: 'modules' | 'learners' | 'trainers'): void {
    this.activeTab = tab;
    this.selectedModuleIndices.clear();
    this.selectedLearnerIds.clear();
    this.selectedTrainerIds.clear();
  }

  // ── Module selection ─────────────────────────────────────────────────────────
  get allModulesSelected(): boolean {
    return this.modules.length > 0 && this.modules.every((_, i) => this.selectedModuleIndices.has(i));
  }

  toggleModuleSelection(index: number): void {
    this.selectedModuleIndices.has(index)
      ? this.selectedModuleIndices.delete(index)
      : this.selectedModuleIndices.add(index);
  }

  toggleAllModules(): void {
    if (this.allModulesSelected) {
      this.selectedModuleIndices.clear();
    } else {
      this.modules.forEach((_, i) => this.selectedModuleIndices.add(i));
    }
  }

  selectAllModules(): void {
    this.modules.forEach((_, i) => this.selectedModuleIndices.add(i));
  }

  // ── Learner selection ────────────────────────────────────────────────────────
  get allLearnersSelected(): boolean {
    return this.learners.length > 0 && this.learners.every(l => this.selectedLearnerIds.has(l.id));
  }

  toggleLearnerSelection(id: number): void {
    this.selectedLearnerIds.has(id)
      ? this.selectedLearnerIds.delete(id)
      : this.selectedLearnerIds.add(id);
  }

  toggleAllLearners(): void {
    if (this.allLearnersSelected) {
      this.learners.forEach(l => this.selectedLearnerIds.delete(l.id));
    } else {
      this.learners.forEach(l => this.selectedLearnerIds.add(l.id));
    }
  }

  selectAllLearners(): void {
    this.learners.forEach(l => this.selectedLearnerIds.add(l.id));
  }

  // ── Trainer selection ────────────────────────────────────────────────────────
  get allTrainersSelected(): boolean {
    return this.localTrainers.length > 0 && this.localTrainers.every(t => this.selectedTrainerIds.has(t.id));
  }

  toggleTrainerSelection(id: number): void {
    this.selectedTrainerIds.has(id)
      ? this.selectedTrainerIds.delete(id)
      : this.selectedTrainerIds.add(id);
  }

  toggleAllTrainers(): void {
    if (this.allTrainersSelected) {
      this.localTrainers.forEach(t => this.selectedTrainerIds.delete(t.id));
    } else {
      this.localTrainers.forEach(t => this.selectedTrainerIds.add(t.id));
    }
  }

  selectAllTrainers(): void {
    this.localTrainers.forEach(t => this.selectedTrainerIds.add(t.id));
  }

  get modules(): LmsModule[] {
    return this.training?.modules ?? [];
  }

  get learners(): LmsLearner[] {
    return this.training?.learners ?? [];
  }

  toggleTrainerMenu(e: MouseEvent, id: number): void {
    e.stopPropagation();
    if (this.openTrainerMenuId === id) {
      this.openTrainerMenuId = null;
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      this.dropdownPosition = {
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      };
      this.openTrainerMenuId = id;
    }
  }

  toggleLearnerMenu(e: MouseEvent, id: number): void {
    e.stopPropagation();
    if (this.openLearnerMenuId === id) {
      this.openLearnerMenuId = null;
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      this.learnerMenuPosition = {
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      };
      this.openLearnerMenuId = id;
    }
  }

  openManagePanel(): void {
    const singleId = this.openLearnerMenuId;
    this.openLearnerMenuId = null;

    if (singleId !== null) {
      this.managingLearnerIds = [singleId];
      const learner = this.learners.find(l => l.id === singleId);
      if (learner) {
        this.manageMarks = this.learnerGradeOverrides.get(singleId) ?? learner.evaluationGrade ?? '';
        const statusOverride = this.learnerStatusOverrides.get(singleId);
        this.manageManualCompletion = statusOverride !== undefined;
        this.manageCompletionStatus = statusOverride ?? 'Completed';
      } else {
        this.manageMarks = '';
        this.manageManualCompletion = false;
        this.manageCompletionStatus = 'Completed';
      }
    } else {
      this.managingLearnerIds = Array.from(this.selectedLearnerIds);
      this.manageMarks = '';
      this.manageManualCompletion = false;
      this.manageCompletionStatus = 'Completed';
    }

    this.managePanelOpen = true;
  }

  closeManagePanel(): void {
    this.managePanelOpen = false;
  }

  saveManagePanel(): void {
    this.managePanelOpen = false;
  }

  onManageMarksChange(value: string): void {
    this.manageMarks = value;
    for (const id of this.managingLearnerIds) {
      if (value.trim()) {
        this.learnerGradeOverrides.set(id, value);
      } else {
        this.learnerGradeOverrides.delete(id);
      }
    }
  }

  onManageCompletionStatusChange(value: string): void {
    this.manageCompletionStatus = value;
    if (this.manageManualCompletion) {
      for (const id of this.managingLearnerIds) {
        this.learnerStatusOverrides.set(id, value);
      }
    }
  }

  onManageManualCompletionChange(value: boolean): void {
    this.manageManualCompletion = value;
    if (!value) {
      for (const id of this.managingLearnerIds) {
        this.learnerStatusOverrides.delete(id);
      }
    } else {
      for (const id of this.managingLearnerIds) {
        this.learnerStatusOverrides.set(id, this.manageCompletionStatus);
      }
    }
  }

  removeTrainer(id: number): void {
    this.localTrainers = this.localTrainers.filter(t => t.id !== id);
    this.openTrainerMenuId = null;
  }

  getDominantModuleStatus(): ModuleStatus {
    const statuses = this.modules.map(m => this.getComputedModuleStatus(m));
    if (statuses.some(s => s === 'ONGOING'))   return 'ONGOING';
    if (statuses.some(s => s === 'ENDED'))      return 'ENDED';
    if (statuses.some(s => s === 'SCHEDULED'))  return 'SCHEDULED';
    return 'PENDING';
  }

  getLearnerCompletionStatus(learner: LmsLearner): string {
    const override = this.learnerStatusOverrides.get(learner.id);
    if (override !== undefined) return override;
    const dominant = this.getDominantModuleStatus();
    if (dominant === 'ONGOING')   return 'In progress';
    if (dominant === 'ENDED')     return learner.completed ? 'Completed' : 'Not completed';
    return 'Not started';
  }

  getInitials(name: string): string {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  toggleScheduleDropdown(e: MouseEvent): void {
    e.stopPropagation();
    this.scheduleDropdownOpen = !this.scheduleDropdownOpen;
  }

  selectModuleToSchedule(mod: LmsModule): void {
    this.scheduleDropdownOpen = false;
    this.openSchedulePanel(mod);
  }

  openSchedulePanel(mod: LmsModule): void {
    this.schedulingModule = mod;
    this.schedulingModuleIndex = this.training?.modules.indexOf(mod) ?? -1;

    if (mod.schedule) {
      this.scheduleLocation = mod.schedule.location;
      this.scheduleSlots = mod.schedule.slots.map(s => ({ ...s }));
      this.teamsEnabled = mod.schedule.teamsEnabled;
      this.autoVirtualRoom = mod.schedule.autoVirtualRoom;
      this.virtualRoomUrl = mod.schedule.virtualRoomUrl;
      this.sendReminder = mod.schedule.sendReminder;
      this.reminderDays = mod.schedule.reminderDays;
    } else {
      this.scheduleLocation = '';
      this.scheduleSlots = [{ startDate: '', startTime: '', endDate: '', endTime: '' }];
      this.teamsEnabled = false;
      this.autoVirtualRoom = false;
      this.virtualRoomUrl = '';
      this.sendReminder = false;
      this.reminderDays = 10;
    }

    this.schedulePanelOpen = true;
  }

  closeSchedulePanel(): void {
    this.schedulePanelOpen = false;
    this.schedulingModule = null;
    this.schedulingModuleIndex = -1;
  }

  saveSchedule(): void {
    if (!this.training || this.schedulingModuleIndex === -1) return;

    const schedule: ModuleSchedule = {
      slots: this.scheduleSlots.map(s => ({ ...s })),
      location: this.scheduleLocation,
      teamsEnabled: this.teamsEnabled,
      autoVirtualRoom: this.autoVirtualRoom,
      virtualRoomUrl: this.virtualRoomUrl,
      sendReminder: this.sendReminder,
      reminderDays: this.reminderDays,
    };

    this.trainingsService.updateModuleSchedule(this.training.id, this.schedulingModuleIndex, schedule);
    this.training = this.trainingsService.getById(this.training.id);
    this.selectedModuleIndices.clear();
    this.schedulePanelOpen = false;
    this.schedulingModule = null;
    this.schedulingModuleIndex = -1;
  }

  addSlot(): void {
    this.scheduleSlots.push({ startDate: '', startTime: '', endDate: '', endTime: '' });
  }

  removeSlot(index: number): void {
    this.scheduleSlots.splice(index, 1);
  }

  getComputedModuleStatus(mod: LmsModule): ModuleStatus {
    const slots = mod.schedule?.slots;
    if (!slots?.length) return 'PENDING';
    const first = slots[0];
    const last = slots[slots.length - 1];
    const start = this.parseDateTime(first.startDate, first.startTime);
    const end = this.parseDateTime(last.endDate, last.endTime);
    if (start === null || end === null) return 'PENDING';
    if (this.currentTime < start) return 'SCHEDULED';
    if (this.currentTime <= end) return 'ONGOING';
    return 'ENDED';
  }

  private parseDateTime(dateStr: string, timeStr: string): number | null {
    if (!dateStr || !timeStr) return null;
    const ms = new Date(`${dateStr}T${timeStr}`).getTime();
    return isNaN(ms) ? null : ms;
  }

  formatModuleDateTime(mod: LmsModule): string {
    const slots = mod.schedule?.slots;
    if (!slots?.length) return '';
    const first = slots[0];
    const last = slots[slots.length - 1];
    const start = `${this.fmtDate(first.startDate)}, ${this.fmtTime(first.startTime)}`;
    const end = `${this.fmtDate(last.endDate)}, ${this.fmtTime(last.endTime)}`;
    return `${start} - ${end}`;
  }

  private fmtDate(dateStr: string): string {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${month}/${day}/${year}`;
  }

  private fmtTime(timeStr: string): string {
    if (!timeStr) return '';
    const [hourStr, minStr] = timeStr.split(':');
    const hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:${minStr} ${ampm}`;
  }
}
