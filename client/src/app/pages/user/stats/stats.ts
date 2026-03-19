import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user';
import { UserDetailedStats } from '../../../core/models/index';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ChartModule } from 'primeng/chart';

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [ProgressSpinner, ChartModule],
  templateUrl: './stats.html',
  styleUrl: './stats.css',
})
export class Stats implements OnInit {
  private auth = inject(AuthService);
  private userService = inject(UserService);

  loading = signal(true);
  error = signal(false);
  stats = signal<UserDetailedStats | null>(null);

  postsPerMonthData = signal<any>(null);
  topViewsData = signal<any>(null);
  topLikesData = signal<any>(null);
  lineOptions = signal<any>(null);
  barOptions = signal<any>(null);

  ngOnInit() {
    const username = this.auth.user()?.username;
    if (!username) return;

    this.userService.getDetailedStats(username).subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.buildCharts(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }

  private buildCharts(data: UserDetailedStats) {
    const baseFont = { family: 'Inter, sans-serif', size: 13 };
    const gridColor = 'rgba(0,0,0,0.06)';

    this.lineOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: { grid: { color: gridColor }, ticks: { font: baseFont } },
        y: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: { font: baseFont, stepSize: 1, precision: 0 },
        },
      },
    });

    this.barOptions.set({
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: 'y' as const,
      plugins: {
        legend: { display: false },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: { color: gridColor },
          ticks: { font: baseFont, precision: 0 },
        },
        y: { grid: { display: false }, ticks: { font: baseFont } },
      },
    });

    // Posts per month – fill in missing months so the line is continuous
    const now = new Date();
    const monthLabels: string[] = [];
    const monthCounts: number[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthLabels.push(`${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`);
      const found = data.postsPerMonth.find(
        (m) => m.year === d.getFullYear() && m.month === d.getMonth() + 1,
      );
      monthCounts.push(found ? found.count : 0);
    }

    this.postsPerMonthData.set({
      labels: monthLabels,
      datasets: [
        {
          label: 'Posts Published',
          data: monthCounts,
          fill: true,
          borderColor: '#6366f1',
          backgroundColor: 'rgba(99,102,241,0.12)',
          pointBackgroundColor: '#6366f1',
          tension: 0.4,
          borderWidth: 2,
        },
      ],
    });

    this.topViewsData.set({
      labels: data.topPostsByViews.map((p) =>
        p.title.length > 35 ? p.title.slice(0, 35) + '…' : p.title,
      ),
      datasets: [
        {
          label: 'Views',
          data: data.topPostsByViews.map((p) => p.views),
          backgroundColor: '#6366f1',
          borderRadius: 6,
        },
      ],
    });

    this.topLikesData.set({
      labels: data.topPostsByLikes.map((p) =>
        p.title.length > 35 ? p.title.slice(0, 35) + '…' : p.title,
      ),
      datasets: [
        {
          label: 'Likes',
          data: data.topPostsByLikes.map((p) => p.likes),
          backgroundColor: '#ec4899',
          borderRadius: 6,
        },
      ],
    });
  }
}
