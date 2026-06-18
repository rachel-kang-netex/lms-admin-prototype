import { Component, ElementRef, ViewChild, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-time-input',
  templateUrl: './time-input.component.html',
  styleUrls: ['./time-input.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TimeInputComponent),
    multi: true,
  }],
})
export class TimeInputComponent implements ControlValueAccessor {
  @ViewChild('mmRef') mmRef!: ElementRef<HTMLInputElement>;

  hh = '';
  mm = '';

  private onChange: (v: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(v: string): void {
    if (v && v.includes(':')) {
      const [h, m] = v.split(':');
      this.hh = h ?? '';
      this.mm = m ?? '';
    } else {
      this.hh = '';
      this.mm = '';
    }
  }

  registerOnChange(fn: (v: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  onHhInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    el.value = el.value.replace(/\D/g, '').slice(0, 2);
    this.hh = el.value;
    this.emit();
    if (this.hh.length === 2) {
      this.mmRef.nativeElement.focus();
      this.mmRef.nativeElement.select();
    }
  }

  onMmInput(event: Event): void {
    const el = event.target as HTMLInputElement;
    el.value = el.value.replace(/\D/g, '').slice(0, 2);
    this.mm = el.value;
    this.emit();
  }

  onHhBlur(): void {
    if (this.hh !== '') {
      const v = Math.min(23, Math.max(0, parseInt(this.hh, 10) || 0));
      this.hh = String(v).padStart(2, '0');
      this.emit();
    }
    this.onTouched();
  }

  onMmBlur(): void {
    if (this.mm !== '') {
      const v = Math.min(59, Math.max(0, parseInt(this.mm, 10) || 0));
      this.mm = String(v).padStart(2, '0');
      this.emit();
    }
    this.onTouched();
  }

  private emit(): void {
    const h = this.hh.padStart(2, '0');
    const m = this.mm.padStart(2, '0');
    this.onChange(this.hh || this.mm ? `${h}:${m}` : '');
  }
}
