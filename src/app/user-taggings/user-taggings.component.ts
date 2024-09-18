import { Component, OnInit } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { ToastrService } from 'ngx-toastr';
import { UserTaggingService } from '../services/userTagging/user-tagging.service';
import { usertagging } from '../interfaces/userTagging/usertagginginterface';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-user-taggings',
  standalone: true,
  imports: [PrimeNgModule, HeaderComponent, DashboardComponent, FooterComponent],
  templateUrl: './user-taggings.component.html',
  styleUrls: ['./user-taggings.component.scss'] ,
  providers: [DatePipe]

})
export class UserTaggingsComponent implements OnInit {
  visible: boolean = false;
  responseMsg: string | undefined;
  dataSource: usertagging[] = [];  // Initialized as an empty array
  userID: any;
  userRole: any;
  constructor(private toasterservice: ToastrService, private usertaggingservice: UserTaggingService,private datepipe: DatePipe) {}

  ngOnInit(): void {
    this.userRole = localStorage.getItem('role')
    this.userID = localStorage.getItem('userId')
    this.getUserTaggingDetails();
  }

  getUserTaggingDetails() {
    this.usertaggingservice.getUserTagging(this.userID,this.userRole).subscribe({
      next: (res: any) => {
        this.dataSource = res.userData;  // No need to map it if the structure is correct
        this.responseMsg = res.message;
        console.log(this.dataSource, "usertagging data...");
      },
      error: (err: any) => {
        this.responseMsg = err.error?.message || "Error";
      }
    });
  }

  showDialog() {
    this.visible = true;
  }

  onUpload() {
    this.toasterservice.success("File uploaded successfully");
  }

  formatDate(dateString: string): string {
    return this.datepipe.transform(dateString, 'yyyy-MM-dd') || '';
  }
}
