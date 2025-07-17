import { Component } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import { ChangeRequest , RequestsService } from '../services/dept-request/dept-request.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, ReactiveFormsModule],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.scss'
})
export class RequestsComponent {

  requests: ChangeRequest[] = [];
  reviewerId: any = ''; 
  expandedRows: any[] = [];
  isDialogVisible = false;
  remarks: string = ''
  rejectID: number = 0;
  user_type:any;


  constructor(private service: RequestsService) {}

  ngOnInit(): void {
    this.load();
    this.reviewerId = localStorage.getItem('userId') || '';
    this.user_type = localStorage.getItem('role');
  }



isRowExpanded(row: any): boolean {
  return this.expandedRows?.some(r => r.id === row.id);
}


  load() {
    this.service.getPending().subscribe((data:any) => {
      this.requests = data;
    });
  }

  approve(id: number) {
    this.service.approve(id, this.reviewerId).subscribe(() => this.load());
  }

  reject(id: number) {
    this.showModalDiv();
   this.rejectID = id;
  }

    onHide() {
    this.isDialogVisible = false;
    this.remarks= ''
    this.rejectID= 0  
  }

    showModalDiv() {
    this.isDialogVisible = true;
  }

  submitChangeAction(){

     if (this.remarks !== '' ) {
      this.service.reject(this.rejectID, this.reviewerId, this.remarks).subscribe(() =>{
    this.load(),
    this.isDialogVisible = false;
      } );

    }
  }
  

}