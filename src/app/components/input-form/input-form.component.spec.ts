import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFormComponent } from './input-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { WorkoutService } from '../../services/workout.service';

describe('InputFormComponent', () => {
  let component: InputFormComponent;
  let fixture: ComponentFixture<InputFormComponent>;
  let loader: HarnessLoader;
  let mockWorkoutService: jasmine.SpyObj<WorkoutService>;

  beforeEach(async () => {
    mockWorkoutService = jasmine.createSpyObj('WorkoutService', ['addWorkout']);

    await TestBed.configureTestingModule({
      imports: [
        InputFormComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: WorkoutService, useValue: mockWorkoutService }],
    }).compileComponents();

    fixture = TestBed.createComponent(InputFormComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.workoutForm.get('name')?.value).toBe('');
    expect(component.workoutForm.get('type')?.value).toBe('');
    expect(component.workoutForm.get('minutes')?.value).toBe('');
  });

  it('should disable submit button when form is invalid', () => {
    fixture.detectChanges();
    const submitButton = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    expect(submitButton.disabled).toBeTruthy();

    component.workoutForm.patchValue({
      name: 'John Doe',
      type: 'Running',
      minutes: 30,
    });
    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalsy();
  });

  it('should call onSubmit method when form is submitted', () => {
    spyOn(component, 'onSubmit');

    component.workoutForm.patchValue({
      name: 'John Doe',
      type: 'Running',
      minutes: 30,
    });
    fixture.detectChanges();

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should populate workout types in the select field', async () => {
    const select = await loader.getHarness(MatSelectHarness);
    await select.open();

    const options = await select.getOptions();
    expect(options.length).toBe(component.workoutTypes.length);

    for (let i = 0; i < options.length; i++) {
      expect(await options[i].getText()).toBe(component.workoutTypes[i]);
    }
  });

  it('should call workoutService.addWorkout and reset form when form is valid', () => {
    component.workoutForm.setValue({
      name: 'John Doe',
      type: 'Running',
      minutes: 30,
    });

    component.onSubmit();

    expect(mockWorkoutService.addWorkout).toHaveBeenCalledWith('John Doe', {
      type: 'Running',
      minutes: 30,
    });
    expect(component.workoutForm.value).toEqual({
      name: null,
      type: null,
      minutes: null,
    });
  });

  it('should not call workoutService.addWorkout when form is invalid', () => {
    component.workoutForm.setValue({
      name: '', // Invalid: required field is empty
      type: 'Running',
      minutes: 30,
    });

    component.onSubmit();

    expect(mockWorkoutService.addWorkout).not.toHaveBeenCalled();
  });
});
