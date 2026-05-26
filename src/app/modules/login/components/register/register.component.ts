import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    // Si ya está autenticado, redirigir al dashboard
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
  }

  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordStrength]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  /**
   * Validador de fortaleza de contraseña
   */
  passwordStrength(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumeric = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

    if (!passwordValid) {
      return {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar
        }
      };
    }

    return null;
  }

  /**
   * Validador de coincidencia de contraseñas
   */
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get f() {
    return this.registerForm.controls;
  }

  getPasswordStrengthMessage(): string {
    const password = this.f['password'];

    if (!password.errors || !password.errors['passwordStrength']) {
      return 'La contraseña es fuerte';
    }

    const errors = password.errors['passwordStrength'];
    const missing: string[] = [];

    if (!errors.hasUpperCase) missing.push('mayúscula');
    if (!errors.hasLowerCase) missing.push('minúscula');
    if (!errors.hasNumeric) missing.push('número');

    return `Falta: ${missing.join(', ')}`;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Helpers para evaluar requisitos de contraseña desde el template
  // (los templates de Angular no permiten regex literales)
  hasMinLength(): boolean {
    const v = this.f['password'].value;
    return !!v && v.length >= 8;
  }

  hasUpperCase(): boolean {
    const v = this.f['password'].value;
    return !!v && /[A-Z]/.test(v);
  }

  hasLowerCase(): boolean {
    const v = this.f['password'].value;
    return !!v && /[a-z]/.test(v);
  }

  hasNumber(): boolean {
    const v = this.f['password'].value;
    return !!v && /[0-9]/.test(v);
  }
}
