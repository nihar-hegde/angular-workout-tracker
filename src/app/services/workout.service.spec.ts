import { TestBed } from '@angular/core/testing';
import { WorkoutService } from './workout.service';
import { UserData, Workout } from '../models/workout.model';

describe('WorkoutService', () => {
  let service: WorkoutService;
  const STORAGE_KEY = 'userData';

  beforeEach(() => {
    TestBed.configureTestingModule({});
    localStorage.clear();
    service = TestBed.inject(WorkoutService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize data if localStorage is empty', () => {
    const userData = service.getUserData();
    expect(userData.length).toBe(3);
    expect(userData[0].name).toBe('John Doe');
    expect(userData[1].name).toBe('Jane Smith');
    expect(userData[2].name).toBe('Mike Johnson');
  });

  it('should not initialize data if localStorage already has data', () => {
    const mockData: UserData[] = [{ id: 1, name: 'Test User', workouts: [] }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));

    const newService = TestBed.inject(WorkoutService);
    const userData = newService.getUserData();

    expect(userData.length).toBe(1);
    expect(userData[0].name).toBe('Test User');
  });

  it('should return empty array if localStorage is empty and no initialization occurred', () => {
    localStorage.removeItem(STORAGE_KEY);
    const userData = service.getUserData();
    expect(userData).toEqual([]);
  });

  it('should add a new workout for an existing user', () => {
    const newWorkout: Workout = { type: 'Running', minutes: 30 };
    service.addWorkout('John Doe', newWorkout);

    const userData = service.getUserData();
    const user = userData.find((u) => u.name === 'John Doe');

    expect(user).toBeTruthy();
    expect(user!.workouts.length).toBe(3);
    expect(user!.workouts[2]).toEqual(newWorkout);
  });

  it('should add a new user with a workout if the user does not exist', () => {
    const newWorkout: Workout = { type: 'Swimming', minutes: 45 };
    service.addWorkout('New User', newWorkout);

    const userData = service.getUserData();
    const newUser = userData.find((u) => u.name === 'New User');

    expect(newUser).toBeTruthy();
    expect(newUser!.id).toBe(4); // As there were 3 initial users
    expect(newUser!.workouts.length).toBe(1);
    expect(newUser!.workouts[0]).toEqual(newWorkout);
  });

  it('should persist data to localStorage after adding a workout', () => {
    const newWorkout: Workout = { type: 'Yoga', minutes: 60 };
    service.addWorkout('Jane Smith', newWorkout);

    const storedData = localStorage.getItem(STORAGE_KEY);
    const parsedData: UserData[] = JSON.parse(storedData!);

    expect(parsedData).toBeTruthy();
    const user = parsedData.find((u) => u.name === 'Jane Smith');
    expect(user!.workouts.length).toBe(3);
    expect(user!.workouts[2]).toEqual(newWorkout);
  });
});
