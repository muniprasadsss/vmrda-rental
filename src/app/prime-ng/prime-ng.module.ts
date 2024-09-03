import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';





@NgModule({
  declarations: [],
  imports: [
    CommonModule,ButtonModule,InputTextModule,TabViewModule, BadgeModule, AvatarModule
  ],
  exports: [CommonModule,ButtonModule,InputTextModule,TabViewModule, BadgeModule, AvatarModule ]
})
export class PrimeNgModule { }


