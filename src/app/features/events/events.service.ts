import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EVENTS_MOCK, LmsEvent } from '../../core/mock-data/events.mock';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private _events = new BehaviorSubject<LmsEvent[]>([...EVENTS_MOCK]);
  events$ = this._events.asObservable();

  getAll(): LmsEvent[] {
    return this._events.getValue();
  }

  getById(id: number): LmsEvent | null {
    return this._events.getValue().find(e => e.id === id) ?? null;
  }

  add(event: LmsEvent): void {
    this._events.next([event, ...this._events.getValue()]);
  }

  update(updated: LmsEvent): void {
    const events = this._events.getValue();
    const idx = events.findIndex(e => e.id === updated.id);
    if (idx > -1) {
      const next = [...events];
      next[idx] = updated;
      this._events.next(next);
    }
  }

  remove(id: number): void {
    this._events.next(this._events.getValue().filter(e => e.id !== id));
  }

  updateStatus(id: number, status: 'Draft' | 'Published' | 'Unpublished'): void {
    this._events.next(
      this._events.getValue().map(e => e.id === id ? { ...e, status } : e)
    );
  }

  nextId(): number {
    return Math.max(...this._events.getValue().map(e => e.id)) + 1;
  }
}
