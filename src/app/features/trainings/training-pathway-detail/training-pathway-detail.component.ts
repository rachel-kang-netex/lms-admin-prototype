import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LmsTraining, PathwayStage } from '../../../core/mock-data/trainings.mock';
import { TrainingsService } from '../trainings.service';

@Component({
  selector: 'app-training-pathway-detail',
  templateUrl: './training-pathway-detail.component.html',
  styleUrls: ['./training-pathway-detail.component.scss'],
})
export class TrainingPathwayDetailComponent implements OnInit {
  training: LmsTraining | null = null;
  stages: PathwayStage[] = [];
  activeTab: 'structure' | 'enrollments' = 'structure';
  sidebarExpanded = false;
  openItemMenuIdx: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private trainingsService: TrainingsService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.training = this.trainingsService.getPathwayById(id);
    this.stages   = this.trainingsService.getPathwayStages(id);
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openItemMenuIdx = null;
  }

  goBack(): void {
    this.router.navigate(['/trainings/pathways']);
  }

  setTab(tab: 'structure' | 'enrollments'): void {
    this.activeTab = tab;
  }

  toggleSidebar(): void {
    this.sidebarExpanded = !this.sidebarExpanded;
  }

  navigateToItem(stageId: string, itemIdx: number): void {
    if (this.training) {
      this.router.navigate(['/trainings/pathways', this.training.id, 'items', stageId, itemIdx]);
    }
  }

  toggleItemMenu(e: MouseEvent, key: string): void {
    e.stopPropagation();
    this.openItemMenuIdx = this.openItemMenuIdx === key ? null : key;
  }

  getInitials(name: string): string {
    return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  }
}
