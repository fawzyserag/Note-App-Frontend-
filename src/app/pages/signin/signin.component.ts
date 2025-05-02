import { Component, Inject, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  isLoadnig: boolean = false;

  loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern(/^\w{6,}$/)]],
  });

  loginSubmet(form: FormGroup): void {
    this.isLoadnig = true;
    this.authService.handleLogin(form.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', '3b8ny__' + res.token);
        this.router.navigate(['/notes']);
      },
      error: (err) => {
        this.isLoadnig = false;
      },
    });
  }
}
