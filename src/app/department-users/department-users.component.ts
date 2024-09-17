import { Component, ViewChild } from '@angular/core';
import { UserServiceService } from '../services/userService/user-service.service';
import { departmentusers } from '../interfaces/departmentUserInterfaces/departmentuserinterfaces';
import { PrimeNgModule } from '../prime-ng/prime-ng.module';

@Component({
  selector: 'app-department-users',
  standalone: true,
  imports: [PrimeNgModule],
  templateUrl: './department-users.component.html',
  styleUrl: './department-users.component.scss'
})
export class DepartmentUsersComponent {
  @ViewChild('dt2') dt!: any;
  value: string = '';
  dataSource!: departmentusers[];
  responseMsg: string | undefined;
  visible: boolean = false;

  constructor(private userdetailsservice:UserServiceService){}

  ngOnInit(): void {
    this.getuserdetails()
  }
    // getuserdetails() {
    //   this.userdetailsservice.getUserDetails().subscribe({
    //     next: (res: any) => {
    //       this.dataSource = Object.keys(res).map(key => ({ ...res[key] }));
    //       this.responseMsg = res.message;
    //       console.log(this.dataSource,"department users data heck...");
    //     },
    //     error: (err: any) => {
    //       if (err.error?.message) {
    //         this.responseMsg = err.error?.message;
    //       } else {
    //         this.responseMsg = "error";
    //       }
    //     }
    //   });
    // }

    getuserdetails() {
      this.userdetailsservice.getUserDetails().subscribe({
        next: (res: any) => {
          // Filter out records where user_type is 'USER'
          this.dataSource = Object.keys(res)
            .map(key => ({ ...res[key] }))
            .filter(user => user.user_type !== 'USER'); // Filter condition
          this.responseMsg = res.message;
          console.log(this.dataSource, "Filtered department users data...");
        },
        error: (err: any) => {
          if (err.error?.message) {
            this.responseMsg = err.error?.message;
          } else {
            this.responseMsg = "error";
          }
        }
      });
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
