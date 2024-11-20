import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardsService } from '../services/authGuards/auth-guards.service';


@Component({
  selector: 'app-launch-video',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './lunch-video.component.html',
  styleUrl: './lunch-video.component.scss'
})
export class LunchVideoComponent implements OnInit {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;
  showButton = false;
  videoPlaying = false;
  videoEnded: boolean = false;
  constructor(private router: Router,private firstTimeService: AuthGuardsService) {}

  ngOnInit() {
    // setTimeout(() => {
    //   this.videoPlayer.nativeElement.play().catch((error: any) => {
    //     console.error('Error playing video:', error);
    //   });
    // }, 100); 
    if (this.firstTimeService.isFirstTime()) {
      this.firstTimeService.markAsVisited();
    } else {
      this.router.navigate(['/login']); // Redirect to login if not first time
    }
  }

  playVideo() {
    this.videoPlaying = true; // Hide the play button
    this.videoPlayer.nativeElement.play().catch((error: any) => {
      console.error('Error playing video:', error);
      this.videoPlaying = false; // Show the button again if playback fails
    });
  }

  private redirectToLogin() {
    localStorage.setItem('videoPlayed', 'true');
    this.router.navigate(['/login']);
  }

  onVideoEnd(): void {
    this.videoEnded = true;
    this.router.navigate(['/login']); // Redirect to login after video ends
  }
}
