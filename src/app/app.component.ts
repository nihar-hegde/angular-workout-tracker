import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InputFormComponent } from './components/input-form/input-form.component';
import { WorkoutListComponent } from './components/workout-list/workout-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, InputFormComponent, WorkoutListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Workout Tracker';
}
