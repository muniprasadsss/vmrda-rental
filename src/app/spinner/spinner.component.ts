import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from '../services/loading/loading.service';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent {
  isLoading!: Observable<boolean>;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.isLoading = this.loadingService.isLoading;
  }
}
