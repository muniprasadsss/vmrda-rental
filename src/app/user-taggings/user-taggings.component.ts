import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-taggings',
  standalone: true,
  imports: [PrimeNgModule,HeaderComponent,DashboardComponent,FooterComponent],
  templateUrl: './user-taggings.component.html',
  styleUrl: './user-taggings.component.scss'
})
export class UserTaggingsComponent {
  constructor(private toasterservice:ToastrService){}
  visible: boolean = false;

  showDialog() {
    this.visible = true;
}
onUpload() {
  this.toasterservice.success("File uploaded successfully")
}
}
