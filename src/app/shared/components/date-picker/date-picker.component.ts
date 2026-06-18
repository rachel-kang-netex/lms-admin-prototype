import { Component, ElementRef, HostListener, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true,
  }],
})
export class DatePickerComponent implements ControlValueAccessor {
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target as Node)) {
      this.isOpen = false;
    }
  }

  isOpen = false;
  value = '';
  viewYear = new Date().getFullYear();
  viewMonth = new Date().getMonth();
  readonly today = new Date();

  readonly DAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  readonly MONTH_ABBREVS = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
    'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC',
  ];

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private el: ElementRef) {}

  writeValue(v: string): void {
    this.value = v ?? '';
    if (v) {
      const [year, month] = v.split('-');
      this.viewYear = +year;
      this.viewMonth = +month - 1;
    }
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  get displayValue(): string {
    if (!this.value) return '';
    const [year, month, day] = this.value.split('-');
    return `${+month}/${+day}/${year}`;
  }

  get headerLabel(): string {
    return `${this.MONTH_ABBREVS[this.viewMonth]} ${this.viewYear}`;
  }

  get shortMonthName(): string {
    return this.MONTH_ABBREVS[this.viewMonth];
  }

  get calendarRows(): (number | null)[][] {
    const firstDay = new Date(this.viewYear, this.viewMonth, 1).getDay();
    const daysInMonth = new Date(this.viewYear, this.viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const rows: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));
    return rows;
  }

  isToday(day: number | null): boolean {
    if (!day) return false;
    return day === this.today.getDate() &&
           this.viewMonth === this.today.getMonth() &&
           this.viewYear === this.today.getFullYear();
  }

  isSelected(day: number | null): boolean {
    if (!day || !this.value) return false;
    const p = this.value.split('-');
    return +p[2] === day && +p[1] - 1 === this.viewMonth && +p[0] === this.viewYear;
  }

  toggle(): void {
    this.isOpen = !this.isOpen;
    this.onTouched();
  }

  prevMonth(): void {
    if (this.viewMonth === 0) { this.viewMonth = 11; this.viewYear--; }
    else this.viewMonth--;
  }

  nextMonth(): void {
    if (this.viewMonth === 11) { this.viewMonth = 0; this.viewYear++; }
    else this.viewMonth++;
  }

  selectDay(day: number): void {
    const m = String(this.viewMonth + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    this.value = `${this.viewYear}-${m}-${d}`;
    this.onChange(this.value);
    this.isOpen = false;
  }
}
