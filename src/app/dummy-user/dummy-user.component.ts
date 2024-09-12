import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { FooterComponent } from '../footer/footer.component';
import { LocationService } from '../services/location/location.service';
import { FormsModule } from '@angular/forms';
import { DummyUserService } from '../services/dummyUser/dummy-user.service';

@Component({
  selector: 'app-dummy-user',
  standalone: true,
  imports: [HeaderComponent, DashboardComponent, FooterComponent, FormsModule],
  templateUrl: './dummy-user.component.html',
  styleUrls: ['./dummy-user.component.scss']
})
export class DummyUserComponent {
  isEditMode = false;

  ngOnInit(): void {
  }
  // Default data for the form
  user = {
    username: 'username',
    userId: '9988997312',
    requesttype: 'Test',
    revenuedivision: 'Division 1',
    attachment: null,
    description: 'Test description',
    propertycode: 'PROP123'
  };

  constructor(private dummyUserService: DummyUserService) {}

  // Toggle edit mode
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;

    // If turning off edit mode (saving), send data to API
    if (!this.isEditMode) {
      this.saveUserData();
    }
  }


  // Save user data to API
  saveUserData() {
    this.dummyUserService.postCR(this.user).subscribe(
      (response) => {
        console.log('Data sent successfully:', response);
      },
      (error) => {
        console.error('Error sending data:', error);
      }
    );
  }

  // Handle file selection
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.user.attachment = file; // Save file to user object
    }
  }
}
