import { Injectable } from '@angular/core';
import { UserData, Workout } from '../models/workout.model';

@Injectable({
  providedIn: 'root',
})
export class WorkoutService {
  private readonly STORAGE_KEY = 'userData';
  constructor() {
    this.initializeData();
  }
  private initializeData(): void {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      const initialData: UserData[] = [
        {
          id: 1,
          name: 'John Doe',
          workouts: [
            { type: 'Running', minutes: 30 },
            { type: 'Cycling', minutes: 45 },
          ],
        },
        {
          id: 2,
          name: 'Jane Smith',
          workouts: [
            { type: 'Swimming', minutes: 60 },
            { type: 'Running', minutes: 20 },
          ],
        },
        {
          id: 3,
          name: 'Mike Johnson',
          workouts: [
            { type: 'Yoga', minutes: 50 },
            { type: 'Cycling', minutes: 40 },
          ],
        },
      ];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(initialData));
    }
  }

  getUserData(): UserData[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  addWorkout(name: string, workout: Workout): void {
    const userData = this.getUserData();
    const user = userData.find((u) => u.name === name);
    if (user) {
      user.workouts.push(workout);
    } else {
      userData.push({
        id: userData.length + 1,
        name,
        workouts: [workout],
      });
    }
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(userData));
  }
}
