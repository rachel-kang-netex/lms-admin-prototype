import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LmsTraining, PathwayStage, PathwayStageItem, PathwayItemSession } from '../../../core/mock-data/trainings.mock';
import { TrainingsService } from '../trainings.service';

@Component({
  selector: 'app-training-pathway-item-detail',
  templateUrl: './training-pathway-item-detail.component.html',
  styleUrls: ['./training-pathway-item-detail.component.scss'],
})
export class TrainingPathwayItemDetailComponent implements OnInit, OnDestroy {
  pathway: LmsTraining | null = null;
  stages: PathwayStage[] = [];
  stage: PathwayStage | null = null;
  item: PathwayStageItem | null = null;
  sessions: PathwayItemSession[] = [];

  stageId = '';
  itemIdx = 0;
  sidebarExpanded = false;
  private paramSub!: Subscription;
  newSessionPanelOpen = false;
  allowMultipleSessions = false;

  newSessionName = '';
  newSessionPublicTraining = false;
  newSessionEnrollmentDeadline = false;
  newSessionClosingDateValue = 14;
  newSessionClosingDateUnit = 'days';
  newSessionMaxCapacityEnabled = false;
  newSessionMaxCapacityValue: number | null = null;
  newSessionAutoSeatReservation = false;
  newSessionFeatured = false;
  newSessionCarousel = '';
  newSessionEmailNotifications = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingsService: TrainingsService,
  ) {}

  ngOnInit(): void {
    this.paramSub = this.route.paramMap.subscribe(params => {
      const pathwayId = Number(params.get('id'));
      this.stageId = params.get('stageId') ?? '';
      this.itemIdx = Number(params.get('itemIdx'));

      this.pathway = this.trainingsService.getPathwayById(pathwayId);
      this.stages = this.trainingsService.getPathwayStages(pathwayId);
      this.stage = this.stages.find(s => s.id === this.stageId) ?? null;
      this.item = this.stage?.items[this.itemIdx] ?? null;
      this.sessions = this.trainingsService.getItemSessions(pathwayId, this.stageId, this.itemIdx);
    });
  }

  ngOnDestroy(): void {
    this.paramSub?.unsubscribe();
  }

  goBack(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/trainings/pathways', id]);
  }

  navigateToItem(stageId: string, idx: number): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/trainings/pathways', id, 'items', stageId, idx]);
  }

  goToTraining(): void {
    if (this.item?.trainingId) {
      this.router.navigate(['/trainings/events', this.item.trainingId]);
    }
  }

  goToSession(sessionId: number): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.router.navigate(['/trainings/pathways', id, 'items', this.stageId, this.itemIdx, 'sessions', sessionId]);
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  openNewSessionPanel(): void {
    this.newSessionPanelOpen = true;
    this.newSessionName = this.item?.name ?? '';
  }

  closeNewSessionPanel(): void {
    this.newSessionPanelOpen = false;
    this.newSessionName = '';
    this.newSessionPublicTraining = false;
    this.newSessionEnrollmentDeadline = false;
    this.newSessionClosingDateValue = 14;
    this.newSessionClosingDateUnit = 'days';
    this.newSessionMaxCapacityEnabled = false;
    this.newSessionMaxCapacityValue = null;
    this.newSessionAutoSeatReservation = false;
    this.newSessionFeatured = false;
    this.newSessionCarousel = '';
    this.newSessionEmailNotifications = false;
  }

  saveNewSession(): void {
    const pathwayId = Number(this.route.snapshot.paramMap.get('id'));
    const newSession: PathwayItemSession = {
      id: this.trainingsService.nextSessionId(pathwayId, this.stageId, this.itemIdx),
      code: this.generateSessionCode(),
      name: this.newSessionName || (this.item?.name ?? 'New session'),
      status: 'Pending',
      scheduledModules: '0/1',
      modulesComplete: false,
      dateRange: '-',
      totalDuration: '-',
      capacity: this.newSessionMaxCapacityEnabled && this.newSessionMaxCapacityValue
        ? `0/${this.newSessionMaxCapacityValue}`
        : '0/-',
      trainer: { name: '-' },
    };
    this.trainingsService.addItemSession(pathwayId, this.stageId, this.itemIdx, newSession);
    this.sessions = this.trainingsService.getItemSessions(pathwayId, this.stageId, this.itemIdx);
    this.closeNewSessionPanel();
  }

  private generateSessionCode(): string {
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `TR-${year}-${rand}`;
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
}
