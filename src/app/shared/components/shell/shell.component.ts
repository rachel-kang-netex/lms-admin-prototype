import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

export interface NavItem {
  label: string;
  icon?: string;
  route?: string;
  children?: NavItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  constructor(private router: Router) {
    this.syncExpanded(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe((e: any) => {
      this.syncExpanded(e.urlAfterRedirects);
    });
  }

  private syncExpanded(url: string): void {
    for (const item of this.navItems) {
      if (item.children) {
        const hasActiveChild = item.children.some(c => c.route && url.startsWith(c.route));
        if (hasActiveChild) item.expanded = true;
      }
    }
  }

  navItems: NavItem[] = [
    {
      label: 'Contents',
      icon: 'contents',
      expanded: true,
      children: [
        { label: 'Courses', route: '/courses' },
        { label: 'Events', route: '/events' },
        { label: 'Pathways', route: '/pathways' },
        { label: 'Learning programs', route: '/learning-programs' },
      ],
    },
    {
      label: 'Trainings',
      icon: 'trainings',
      expanded: false,
      children: [
        { label: 'Courses', route: '/trainings/courses' },
        { label: 'Events', route: '/trainings/events' },
        { label: 'Pathways', route: '/trainings/pathways' },
        { label: 'Learning programs', route: '/trainings/learning-programs' },
      ],
    },
    { label: 'Users', icon: 'users', route: '/users' },
    {
      label: 'Reports',
      icon: 'reports',
      expanded: false,
      children: [
        { label: 'Courses', route: '/reports/courses' },
        { label: 'Pathways', route: '/reports/pathways' },
        { label: 'Users', route: '/reports/users' },
        { label: 'Report templates', route: '/reports/templates' },
        { label: 'History', route: '/reports/history' },
      ],
    },
    { label: 'Badges', icon: 'badges', route: '/badges' },
    { label: 'Gamificación', icon: 'gamification', route: '/gamification' },
    {
      label: 'Settings',
      icon: 'settings',
      expanded: false,
      children: [
        { label: 'General', route: '/settings/general' },
        { label: 'Connectors', route: '/settings/connectors' },
        { label: 'Addons', route: '/settings/addons' },
        { label: 'Labels', route: '/settings/labels' },
        { label: 'Extended fields', route: '/settings/extended-fields' },
      ],
    },
  ];

  toggle(item: NavItem): void {
    item.expanded = !item.expanded;
  }
}
