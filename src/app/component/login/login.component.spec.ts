import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { LoginComponent } from './login.component';
import { FormGroup,ReactiveFormsModule } from '@angular/forms';
import { SignupService } from 'src/app/services/signup.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        HttpClientTestingModule, // Provide HttpClient for testing
        RouterTestingModule,     // Mocks the router
        MatDialogModule ,         // Mocks MatDialog
        ReactiveFormsModule
      ]

    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize login form on ngOnInit', () => {
    component.ngOnInit();
    expect(component.login instanceof FormGroup).toBe(true);
    expect(component.login.controls['email']).toBeDefined();
    expect(component.login.controls['password']).toBeDefined();
  });
  it('should validate email and password fields', () => {
    let email = component.login.controls['email'];
    let password = component.login.controls['password'];

    // Initially, both fields are empty, so form should be invalid
    expect(component.login.valid).toBeFalsy();

    // Fill only email, form should still be invalid
    email.setValue('test@test.com');
    expect(component.login.valid).toBeFalsy();

    // Fill both fields, form should be valid
    password.setValue('password123');
    expect(component.login.valid).toBeTruthy();
  });
  it('should call loginSubmit on form submit', () => {

    spyOn(component, 'signUpSubmit');
     let button = fixture.debugElement.nativeElement.querySelector('.btn-signup');
     button.click();
     expect(component.signUpSubmit).toHaveBeenCalled();
   }); 
 
   it('should call loginSubmit method when the form is submitted', () => {
     spyOn(component, 'loginSubmit');
     const form = fixture.nativeElement.querySelector('form');
     form.dispatchEvent(new Event('submit'));
 
     fixture.detectChanges();
     expect(component.loginSubmit).toHaveBeenCalled();
   });
   it('should redirect to the student dashboard for users with role 1', () => {
    // Mock response from the service
    const mockResponse = { message: "Successfully logged in!", jwtToken: 'dummy-token', userDetails: { id: '123', roleId: 1 } };
    
    // Obtain the injected service instance from TestBed
    const signupService = TestBed.inject(SignupService);
    spyOn(signupService, 'login').and.returnValue(of(mockResponse));
    
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  
    // Set up the form to be valid
    component.login.controls['email'].setValue('test@test.com');
    component.login.controls['password'].setValue('password123');
  
    // Call the loginSubmit which should trigger the navigation
    component.loginSubmit();
  
    // Test if the navigation has been called
    expect(router.navigateByUrl).toHaveBeenCalledWith('/student-dashboard');
  });
  
  it('should redirect to the teacher dashboard for users with a role other than 1', () => {
    // Mock response from the service
    const mockResponse = { message: "Successfully logged in!", jwtToken: 'dummy-token', userDetails: { id: '123', roleId: 2 } };
    
    // Obtain the injected service instance from TestBed
    const signupService = TestBed.inject(SignupService);
    spyOn(signupService, 'login').and.returnValue(of(mockResponse));
    
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
  
    // Set up the form to be valid
  component.login.controls['email'].setValue('test@test.com');
  component.login.controls['password'].setValue('password123');

  // Call the loginSubmit which should trigger the navigation
  component.loginSubmit();

  // Test if the navigation has been called
  expect(router.navigateByUrl).toHaveBeenCalledWith('/teacher-dashboard');
});
  
});
