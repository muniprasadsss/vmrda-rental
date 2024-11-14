import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ComplexServiceService } from '../services/complexservice/complex-service.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ToastModule } from 'primeng/toast';
import { InputOtpModule } from 'primeng/inputotp';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SpeedDialModule } from 'primeng/speeddial';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MenuModule } from 'primeng/menu';
import { AccordionModule } from 'primeng/accordion';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';




@NgModule({
  declarations: [],
  imports: [
    CommonModule,ButtonModule,InputTextModule,TabViewModule, BadgeModule, AvatarModule,TableModule,
    TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule,
     DropdownModule,FloatLabelModule,ToastModule,InputOtpModule,SelectButtonModule,DialogModule,SplitButtonModule,ConfirmDialogModule,
     SpeedDialModule,InputTextareaModule,MenuModule,AccordionModule,FileUploadModule,TooltipModule,ProgressSpinnerModule 
  ],
  exports: [CommonModule,ButtonModule,InputTextModule,TabViewModule, BadgeModule, AvatarModule,TableModule,
    TableModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule,
     DropdownModule,FloatLabelModule,ToastModule ,InputOtpModule,SelectButtonModule,DialogModule,SplitButtonModule,ConfirmDialogModule,
     SpeedDialModule,InputTextareaModule,MenuModule,AccordionModule,FileUploadModule,TooltipModule,ProgressSpinnerModule 
   ],
  providers:[ComplexServiceService]
})
export class PrimeNgModule { }


