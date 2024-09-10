import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { FormsModule,FormBuilder, FormGroup, Validators ,ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";
import { FooterComponent } from "../footer/footer.component";
import { ChangeRequestService } from '../services/changeRequest/change-request.service';
import { ChangedFields } from '../interfaces/changeRequest/changeRequest';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-request',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, HeaderComponent, DashboardComponent, FooterComponent,
    ReactiveFormsModule],
  templateUrl: './change-request.component.html',
  styleUrl: './change-request.component.scss'
})
export class ChangeRequestComponent {

  visible: boolean = false;
  isDialogVisible: boolean = false; // Renamed variable
  isApprovedClicked:boolean = true;
  isRejectClicked:boolean = false;
  isPendingClicked:boolean = false;
  activeButton: string = '';
  crData!:ChangedFields[];
  
  constructor(private router: Router,private fb: FormBuilder, private crHttp:ChangeRequestService,private toasterservice:ToastrService) {

}

      ngOnInit() {
      this.getcrInfo();
      }

    getcrInfo(){
      this.crHttp.getChangeRequestData().subscribe({
        next:(res:any)=>{
          this.crData = res;
        },
        error:(err:any)=>{
          console.log(err)
        }
      })
    }

    approveCR(value: number) {
      this.showModalDiv()
      this.crHttp.setCRequest(value).subscribe({
        next:(res:any)=>{

        },
        error:(err:any)=>{
          console.log(err)
        }
      })
      }

  setActiveButton(button: string) {
    this.activeButton = button;
  }
    

  

    showDialog() {
      this.visible = true;
    }

    navigateTo(status: string) {
      this.activeButton = status;
      this.getcrInfo();
      switch (status) {
        case 'approved':
          this.isApprovedClicked = true;
          this.isPendingClicked = false;
          this.isRejectClicked = false;
          break;
        case 'pending':
          this.isApprovedClicked = false;
          this.isPendingClicked = true;
          this.isRejectClicked = false;
          break;
        case 'rejected':
          this.isApprovedClicked = false;
          this.isPendingClicked = false;
          this.isRejectClicked = true;
          break;
      }
    }

    // Show Modal Method 

    showModalDiv() {
      this.isDialogVisible = true; // Updated reference
    }

    // Modal Hide button
  
    onHide() {
      this.isDialogVisible = false; // Updated reference
    }

    // Save Toaster message method 

    SaveToasterMessage(){
   this.toasterservice.success("Saved Successfully")
   this.onHide()
    }

    // Delete Toaster message method om modal

    DeleteToasterMessage(){
 this.toasterservice.error("Deleted Successfully")
 this.onHide()
    }

}
