import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-razorpay',
  standalone: true,
  imports: [],
  templateUrl: './razorpay.component.html',
  styleUrl: './razorpay.component.scss'
})
export class RazorpayComponent {

  @Input() userDetails: any = '';


}
