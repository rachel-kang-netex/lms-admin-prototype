import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TRAININGS_MOCK, PATHWAY_TRAININGS_MOCK, PATHWAY_STRUCTURE_MOCK, ITEM_SESSIONS_MOCK, LmsTraining, PathwayStage, PathwayItemSession } from '../../core/mock-data/trainings.mock';
import { ModuleSchedule } from '../../core/mock-data/events.mock';

@Injectable({ providedIn: 'root' })
export class TrainingsService {
  private _trainings = new BehaviorSubject<LmsTraining[]>([...TRAININGS_MOCK]);
  private _pathwayTrainings = new BehaviorSubject<LmsTraining[]>([...PATHWAY_TRAININGS_MOCK]);
  trainings$ = this._trainings.asObservable();

  getAll(): LmsTraining[] {
    return this._trainings.getValue();
  }

  getById(id: number): LmsTraining | null {
    return this._trainings.getValue().find(t => t.id === id) ?? null;
  }

  add(training: LmsTraining): void {
    this._trainings.next([training, ...this._trainings.getValue()]);
  }

  nextId(): number {
    const trainings = this._trainings.getValue();
    if (trainings.length === 0) return 1;
    return Math.max(...trainings.map(t => t.id)) + 1;
  }

  getAllPathways(): LmsTraining[] {
    return this._pathwayTrainings.getValue();
  }

  getPathwayById(id: number): LmsTraining | null {
    return this._pathwayTrainings.getValue().find(t => t.id === id) ?? null;
  }

  getPathwayStages(trainingId: number): PathwayStage[] {
    return PATHWAY_STRUCTURE_MOCK[trainingId] ?? [];
  }

  private _itemSessions: Record<string, PathwayItemSession[]> = { ...ITEM_SESSIONS_MOCK };

  getItemSessions(pathwayId: number, stageId: string, itemIdx: number): PathwayItemSession[] {
    return this._itemSessions[`${pathwayId}_${stageId}_${itemIdx}`] ?? [];
  }

  addItemSession(pathwayId: number, stageId: string, itemIdx: number, session: PathwayItemSession): void {
    const key = `${pathwayId}_${stageId}_${itemIdx}`;
    const existing = this._itemSessions[key] ?? [];
    this._itemSessions = { ...this._itemSessions, [key]: [...existing, session] };
  }

  nextSessionId(pathwayId: number, stageId: string, itemIdx: number): number {
    const sessions = this.getItemSessions(pathwayId, stageId, itemIdx);
    if (sessions.length === 0) return 1;
    return Math.max(...sessions.map(s => s.id)) + 1;
  }

  updateModuleSchedule(trainingId: number, moduleIndex: number, schedule: ModuleSchedule): void {
    const updated = this._trainings.getValue().map(t => {
      if (t.id !== trainingId) return t;
      const modules = t.modules.map((m, i) => {
        if (i !== moduleIndex) return m;
        return { ...m, moduleStatus: 'SCHEDULED' as const, schedule };
      });
      return { ...t, modules };
    });
    this._trainings.next(updated);
  }
}
