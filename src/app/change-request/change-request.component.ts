import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule } from '@angular/forms';
import { ApprovedComponent } from '../approved/approved.component';

@Component({
  selector: 'app-change-request',
  standalone: true,
  imports: [PrimeNgModule,FormsModule,ApprovedComponent],
  templateUrl: './change-request.component.html',
  styleUrl: './change-request.component.scss'
})
export class ChangeRequestComponent {
  


}
