import { Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import {complex } from '../interfaces/complexInterfaces/complex'
import { ComplexServiceService } from '../services/complexservice/complex-service.service';
import { Table } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SortEvent } from 'primeng/api';
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { DashboardComponent } from "../dashboard/dashboard.component";

@Component({
  selector: 'app-complex-details',
  standalone: true,
  imports: [PrimeNgModule, FormsModule, FooterComponent, HeaderComponent, DashboardComponent],
  templateUrl: './complex-details.component.html',
  styleUrl: './complex-details.component.scss'
})
export class ComplexDetailsComponent {

  @ViewChild('dt2') dt!: any;

  value: string = '';

  complex!: complex[];
  visible: boolean = false;

  initialValue!: complex[];
  loading: boolean = true;

  activityValues: number[] = [0, 100];
  constructor(private complexService: ComplexServiceService) {}

  ngOnInit() {
  this.getUserData();


  }

  getUserData(){
    this.complexService.getComplexData().subscribe({
      next:(res:any)=>{
        this.complex = [...res];
        this.loading = false
      },
      error:(err:any)=>{
        
      }
  })
      
  }


onFilterGlobal(event: Event): void {
  const target = event.target as HTMLInputElement;
  this.value = target.value;
  this.dt.filterGlobal(this.value, 'contains');
}

showDialog() {
  this.visible = true;
}





}
