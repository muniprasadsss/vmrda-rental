import { Component, ViewChild } from '@angular/core';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';
import {complex,Representative } from '../interfaces/complexInterfaces/complex'
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

  representatives!: Representative[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];
  constructor(private complexService: ComplexServiceService) {}

  ngOnInit() {

    this.complexService.getCustomersLarge().then((data) => {
        this.complex = data;
        this.loading = false;

        this.complex.forEach((complex) => (complex.date = new Date(<Date>complex.date)));

    });

    this.representatives = [
      { name: 'Amy Elsner', image: 'amyelsner.png' },
      { name: 'Anna Fali', image: 'annafali.png' },
      { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
      { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
      { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
      { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
      { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
      { name: 'Onyama Limba', image: 'onyamalimba.png' },
      { name: 'Stephen Shaw', image: 'stephenshaw.png' },
      { name: 'Xuxue Feng', image: 'xuxuefeng.png' }
  ];



  }




onFilterGlobal(event: Event): void {
  const target = event.target as HTMLInputElement;
  this.value = target.value;
  this.dt.filterGlobal(this.value, 'contains');
}





}
