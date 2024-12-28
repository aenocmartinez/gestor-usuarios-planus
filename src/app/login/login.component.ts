import { Component, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare const grecaptcha: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  siteKey: string = '6Lc7AqgqAAAAAL1hqz1UP3vEhJIlwx_uvwbJpOXa';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      recaptcha: ['', Validators.required],
    });
  }

  ngAfterViewInit(): void {
    this.loadCaptcha();
  }

  loadCaptcha(): void {
    grecaptcha.ready(() => {
      grecaptcha.render('g-recaptcha', {
        sitekey: this.siteKey,
        callback: (response: string) => this.onCaptchaResolved(response),
        'error-callback': () => this.onCaptchaError(),
        'expired-callback': () => this.onCaptchaExpired(),
      });
    });
  }

  onCaptchaResolved(captchaResponse: string): void {
    this.loginForm.get('recaptcha')?.setValue(captchaResponse);
    this.loginForm.get('recaptcha')?.markAsTouched();
    // console.log('Captcha Resolved:', captchaResponse);
  }

  onCaptchaError(): void {
    this.loginForm.get('recaptcha')?.setValue('');
    // console.error('Error al resolver el Captcha');
  }

  onCaptchaExpired(): void {
    this.loginForm.get('recaptcha')?.setValue('');
    // console.warn('El Captcha ha expirado. Por favor, intente nuevamente.');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password, recaptcha } = this.loginForm.value;
      this.http.post('http://172.20.23.39:9200/Autenticacion/Login', { email, password, recaptcha }).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('nombreUsuario', response.nombreUsuario);
          localStorage.setItem('idSesion', response.idSesion);

          this.router.navigate(['/users']);
        },
        (error) => {
          console.error('Error de inicio de sesión:', error);
          this.errorMessage = 'El email o la contraseña son incorrectos.';
        }
      );
    }
  }
}
