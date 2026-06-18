import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsTraining, LmsLearner, LmsEnrollmentProcess } from '../../../core/mock-data/trainings.mock';
import { TrainingsService } from '../trainings.service';

@Component({
  selector: 'app-event-enrollment',
  templateUrl: './event-enrollment.component.html',
  styleUrls: ['./event-enrollment.component.scss'],
})
export class EventEnrollmentComponent implements OnInit {
  training: LmsTraining | null = null;
  activeTab: 'learners' | 'processes' = 'learners';
  searchQuery = '';
  openMenuId: number | null = null;
  dropdownPosition = { top: 0, right: 0 };

  selectedLearnerIds = new Set<number>();
  selectedProcessIds = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingsService: TrainingsService,
  ) {}

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuId = null;
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.training = this.trainingsService.getById(id);
  }

  goBack(): void {
    if (this.training) {
      this.router.navigate(['/trainings/events', this.training.id]);
    } else {
      this.router.navigate(['/trainings/events']);
    }
  }

  get learners(): LmsLearner[] {
    return this.training?.learners ?? [];
  }

  get filteredLearners(): LmsLearner[] {
    if (!this.searchQuery.trim()) return this.learners;
    const q = this.searchQuery.toLowerCase();
    return this.learners.filter(l => l.name.toLowerCase().includes(q));
  }

  get enrollmentCount(): number {
    return this.learners.length;
  }

  get enrollmentCapacity(): number {
    return this.training?.enrollmentCapacity ?? 40;
  }

  get processes(): LmsEnrollmentProcess[] {
    return this.training?.enrollmentProcesses ?? [];
  }

  setTab(tab: 'learners' | 'processes'): void {
    this.activeTab = tab;
    this.selectedLearnerIds.clear();
    this.selectedProcessIds.clear();
  }

  // ── Learner selection ────────────────────────────────────────────────────────
  get allLearnersSelected(): boolean {
    return this.filteredLearners.length > 0 && this.filteredLearners.every(l => this.selectedLearnerIds.has(l.id));
  }

  toggleLearnerSelection(id: number): void {
    this.selectedLearnerIds.has(id)
      ? this.selectedLearnerIds.delete(id)
      : this.selectedLearnerIds.add(id);
  }

  toggleAllLearners(): void {
    if (this.allLearnersSelected) {
      this.filteredLearners.forEach(l => this.selectedLearnerIds.delete(l.id));
    } else {
      this.filteredLearners.forEach(l => this.selectedLearnerIds.add(l.id));
    }
  }

  selectAllLearners(): void {
    this.learners.forEach(l => this.selectedLearnerIds.add(l.id));
  }

  // ── Process selection ────────────────────────────────────────────────────────
  get allProcessesSelected(): boolean {
    return this.processes.length > 0 && this.processes.every(p => this.selectedProcessIds.has(p.id));
  }

  toggleProcessSelection(id: number): void {
    this.selectedProcessIds.has(id)
      ? this.selectedProcessIds.delete(id)
      : this.selectedProcessIds.add(id);
  }

  toggleAllProcesses(): void {
    if (this.allProcessesSelected) {
      this.processes.forEach(p => this.selectedProcessIds.delete(p.id));
    } else {
      this.processes.forEach(p => this.selectedProcessIds.add(p.id));
    }
  }

  selectAllProcesses(): void {
    this.processes.forEach(p => this.selectedProcessIds.add(p.id));
  }

  getInitials(name: string): string {
    return name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();
  }

  getEnrollmentTypeBadgeClass(type: string | undefined): string {
    return `enrollment-type-badge enrollment-type-badge--${(type ?? '').toLowerCase()}`;
  }

  toggleMenu(e: MouseEvent, id: number): void {
    e.stopPropagation();
    if (this.openMenuId === id) {
      this.openMenuId = null;
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      this.dropdownPosition = {
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      };
      this.openMenuId = id;
    }
  }
}
