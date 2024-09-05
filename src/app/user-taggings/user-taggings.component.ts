import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@Component({
  selector: 'app-user-taggings',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './user-taggings.component.html',
  styleUrl: './user-taggings.component.scss'
})
export class UserTaggingsComponent {

}
