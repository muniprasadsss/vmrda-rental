import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ComplexServiceService } from '../services/complexservice/complex-service.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { InputOtpModule } from 'primeng/inputotp';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,ButtonModule,InputTextModule,TabViewModule, BadgeModule, AvatarModule,TableModule,
    TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule,
     DropdownModule, HttpClientModule,FloatLabelModule,ToastModule,InputOtpModule
  ],
  exports: [CommonModule,ButtonModule,InputTextModule,TabViewModule, BadgeModule, AvatarModule,TableModule,
    TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule,
     DropdownModule, HttpClientModule,FloatLabelModule,ToastModule ,InputOtpModule
   ],
  providers:[ComplexServiceService]
})
export class PrimeNgModule { }


