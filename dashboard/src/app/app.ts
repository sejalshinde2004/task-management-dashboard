import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Task {
  id: number;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  due_date?: string | null;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, DatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  tasks: Task[] = [];

  totalTasks = 0;
  completedTasks = 0;
  pendingTasks = 0;
  highPriorityTasks = 0;
  completionPercentage = 0;

  isLoading = true;
  errorMessage = '';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.http.get<unknown>('http://localhost:5000/api/tasks').subscribe({
      next: (response: unknown) => {
        console.log('API response:', response);

        let taskList: unknown;

        if (Array.isArray(response)) {
          taskList = response;
        } else if (
          response !== null &&
          typeof response === 'object' &&
          'tasks' in response
        ) {
          taskList = response.tasks;
        } else {
          taskList = null;
        }

        if (!Array.isArray(taskList)) {
          this.tasks = [];
          this.updateStatistics();

          this.errorMessage =
            'The API response does not contain a valid tasks array.';

          console.error(this.errorMessage);

          this.isLoading = false;
          this.cdr.detectChanges();
          return;
        }

        this.tasks = taskList as Task[];
        this.updateStatistics();

        this.isLoading = false;

        console.log('Tasks loaded:', this.tasks);

        console.log('Values assigned to dashboard:', {
          totalTasks: this.totalTasks,
          completedTasks: this.completedTasks,
          pendingTasks: this.pendingTasks,
          highPriorityTasks: this.highPriorityTasks,
          completionPercentage: this.completionPercentage,
        });

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        console.error('Failed to load tasks:', error);

        this.tasks = [];
        this.updateStatistics();

        this.errorMessage =
          'Unable to load tasks. Please check that the backend server is running.';

        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private updateStatistics(): void {
    this.totalTasks = this.tasks.length;

    this.completedTasks = this.tasks.filter(
      (task) => task.status?.trim().toLowerCase() === 'completed'
    ).length;

    this.pendingTasks = this.tasks.filter(
      (task) => task.status?.trim().toLowerCase() === 'pending'
    ).length;

    this.highPriorityTasks = this.tasks.filter(
      (task) => task.priority?.trim().toLowerCase() === 'high'
    ).length;

    this.completionPercentage =
      this.totalTasks === 0
        ? 0
        : Math.round(
            (this.completedTasks / this.totalTasks) * 1000
          ) / 10;
  }
}