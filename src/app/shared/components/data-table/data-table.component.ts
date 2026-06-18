import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  width?: string;
  type?: 'text' | 'badge' | 'date';
}

export interface RowMenuItem {
  label: string;
  action?: string;
  disabled?: boolean;
  dividerBefore?: boolean;
}

export interface SelectionAction {
  label: string;
  action: string;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: Record<string, any>[] = [];
  @Input() searchPlaceholder = 'Search...';
  @Input() primaryAction = '';
  @Input() getMenuItems?: (row: Record<string, any>) => RowMenuItem[];
  @Input() selectionActions: SelectionAction[] = [];

  @Output() primaryActionClick = new EventEmitter<void>();
  @Output() rowClick = new EventEmitter<Record<string, any>>();
  @Output() infoClick = new EventEmitter<Record<string, any>>();
  @Output() menuClick = new EventEmitter<Record<string, any>>();
  @Output() menuAction = new EventEmitter<{ action: string; row: Record<string, any> }>();
  @Output() selectionAction = new EventEmitter<{ action: string; rows: Record<string, any>[] }>();

  searchTerm = '';
  openMenuRow: Record<string, any> | null = null;
  menuPosition: { top: number; right: number } | null = null;
  selectedRows = new Set<Record<string, any>>();

  get allSelected(): boolean {
    return this.data.length > 0 && this.data.every(r => this.selectedRows.has(r));
  }

  toggleRow(row: Record<string, any>): void {
    if (this.selectedRows.has(row)) {
      this.selectedRows.delete(row);
    } else {
      this.selectedRows.add(row);
    }
  }

  toggleAll(): void {
    if (this.allSelected) {
      this.data.forEach(r => this.selectedRows.delete(r));
    } else {
      this.data.forEach(r => this.selectedRows.add(r));
    }
  }

  selectAll(): void {
    this.data.forEach(r => this.selectedRows.add(r));
  }

  onSelectionAction(action: string): void {
    this.selectionAction.emit({ action, rows: [...this.selectedRows] });
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.openMenuRow = null;
    this.menuPosition = null;
  }

  get filteredData(): Record<string, any>[] {
    if (!this.searchTerm) return this.data;
    const term = this.searchTerm.toLowerCase();
    return this.data.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(term))
    );
  }

  onRowClick(row: Record<string, any>): void { this.rowClick.emit(row); }
  onInfo(e: MouseEvent, row: Record<string, any>): void { e.stopPropagation(); this.infoClick.emit(row); }

  onMenu(e: MouseEvent, row: Record<string, any>): void {
    e.stopPropagation();
    if (this.getMenuItems) {
      if (this.openMenuRow === row) {
        this.openMenuRow = null;
        this.menuPosition = null;
      } else {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        const items = this.getMenuItems(row);
        const estimatedHeight = 16
          + items.length * 48
          + items.filter(i => i.dividerBefore).length * 1;
        const spaceBelow = window.innerHeight - rect.bottom - 4;
        const top = estimatedHeight > spaceBelow
          ? rect.top - estimatedHeight - 4
          : rect.bottom + 4;
        this.menuPosition = { top, right: window.innerWidth - rect.right };
        this.openMenuRow = row;
      }
    } else {
      this.menuClick.emit(row);
    }
  }

  onMenuItemClick(action: string, row: Record<string, any>): void {
    this.menuAction.emit({ action, row });
    this.openMenuRow = null;
    this.menuPosition = null;
  }

  getItemType(item: RowMenuItem): 'disabled' | 'action' | 'label' {
    if (item.disabled) return 'disabled';
    if (item.action) return 'action';
    return 'label';
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?';
  }
}
