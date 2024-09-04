import { Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import {complex } from '../interfaces/complexInterfaces/complex'
import { ComplexServiceService } from '../services/complexservice/complex-service.service';
import { Table } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-complex-details',
  standalone: true,
  imports: [PrimeNgModule,FormsModule],
  templateUrl: './complex-details.component.html',
  styleUrl: './complex-details.component.scss'
})
export class ComplexDetailsComponent {

  @ViewChild('dt2') dt!: any;

  value: string = '';

  complex!: complex[];

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
        console.log(err)
      }
  })
      
  }


onFilterGlobal(event: Event): void {
  const target = event.target as HTMLInputElement;
  this.value = target.value;
  this.dt.filterGlobal(this.value, 'contains');
}





}
