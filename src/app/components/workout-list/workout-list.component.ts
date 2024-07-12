import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { WorkoutService } from '../../services/workout.service';
import { UserData, Workout } from '../../models/workout.model';
@Component({
  selector: 'app-workout-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './workout-list.component.html',
  styleUrl: './workout-list.component.css',
})
export class WorkoutListComponent implements OnInit {
  displayedColumns: string[] = [
    'username',
    'workouts',
    'workoutCount',
    'totalMinutes',
  ];
  dataSource: any[] = [];
  filteredData: any[] = [];

  searchTerm: string = '';
  selectedWorkoutType: string = '';
  workoutTypes: string[] = ['All', 'Running', 'Cycling', 'Swimming', 'Yoga'];

  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex = 0;
  totalItems = 0;

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const userData = this.workoutService.getUserData();
    this.dataSource = userData.map((user) => ({
      username: user.name,
      workouts: user.workouts.map((w) => w.type).join(', '),
      workoutCount: user.workouts.length,
      totalMinutes: user.workouts.reduce((sum, w) => sum + w.minutes, 0),
    }));
    this.applyFilters();
  }

  applyFilters() {
    this.filteredData = this.dataSource.filter(
      (item) =>
        item.username.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
        (this.selectedWorkoutType === 'All' ||
          item.workouts.includes(this.selectedWorkoutType))
    );
    this.totalItems = this.filteredData.length;
    this.updatePage();
  }

  updatePage() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.filteredData = this.filteredData.slice(startIndex, endIndex);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.applyFilters();
  }
}
