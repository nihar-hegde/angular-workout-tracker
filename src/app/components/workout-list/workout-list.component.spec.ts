import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkoutListComponent } from './workout-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { WorkoutService } from '../../services/workout.service';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

describe('WorkoutListComponent', () => {
  let component: WorkoutListComponent;
  let fixture: ComponentFixture<WorkoutListComponent>;
  let mockWorkoutService: jasmine.SpyObj<WorkoutService>;

  const mockUserData = [
    {
      id: 1,
      name: 'John',
      workouts: [
        { type: 'Running', minutes: 30 },
        { type: 'Cycling', minutes: 45 },
      ],
    },
    {
      id: 2,
      name: 'Jane',
      workouts: [
        { type: 'Swimming', minutes: 60 },
        { type: 'Yoga', minutes: 40 },
      ],
    },
  ];

  beforeEach(async () => {
    mockWorkoutService = jasmine.createSpyObj('WorkoutService', [
      'getUserData',
    ]);
    mockWorkoutService.getUserData.and.returnValue(mockUserData);

    await TestBed.configureTestingModule({
      imports: [
        WorkoutListComponent,
        NoopAnimationsModule,
        FormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
      ],
      providers: [{ provide: WorkoutService, useValue: mockWorkoutService }],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkoutListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    expect(mockWorkoutService.getUserData).toHaveBeenCalled();
    expect(component.dataSource.length).toBe(2);
  });

  it('should correctly calculate workout count and total minutes', () => {
    expect(component.dataSource[0].workoutCount).toBe(2);
    expect(component.dataSource[0].totalMinutes).toBe(75);
    expect(component.dataSource[1].workoutCount).toBe(2);
    expect(component.dataSource[1].totalMinutes).toBe(100);
  });

  it('should filter data based on search term', () => {
    component.searchTerm = 'john';
    component.applyFilters();
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].username).toBe('John');
  });

  it('should filter data based on workout type', () => {
    component.selectedWorkoutType = 'Running';
    component.applyFilters();
    expect(component.filteredData.length).toBe(1);
    expect(component.filteredData[0].username).toBe('John');
  });

  it('should update page on paginator event', () => {
    const mockPageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    component.onPageChange(mockPageEvent);
    expect(component.pageIndex).toBe(1);
    expect(component.pageSize).toBe(5);
  });

  it('should have correct initial values', () => {
    expect(component.pageSize).toBe(5);
    expect(component.pageIndex).toBe(0);
    expect(component.workoutTypes).toContain('All');
    expect(component.displayedColumns.length).toBe(4);
  });
});
