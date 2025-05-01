import { Component, OnInit } from '@angular/core';
import { HttpService } from '../services/httpservices/http.service';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user = {
    id: localStorage.getItem('userID'),
    username: localStorage.getItem('username'),
    email: localStorage.getItem('email'),
    avatar: 'assets/default-avatar.png',
  };

  constructor(private httpService: HttpService) {
    console.log('USER: ', this.user);
  }

  ngOnInit(): void {
    // Optionally, fetch the current profile picture from backend
    this.loadProfilePicture();
  }

  loadProfilePicture() {
    if (this.user.id) {
      this.httpService
        .loadProfilePicture(this.user.id)
        .subscribe((res: Blob) => {
          // Convert blob to data URL for display
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.user.avatar = e.target.result;
          };
          reader.readAsDataURL(res);
        });
    }
  }

  changeAvatar() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file && this.user.id) {
        // Prepare FormData for file upload
        const formData = new FormData();
        formData.append('file', file);

        // Upload to backend
        this.httpService.updateProfilePicture(this.user.id, formData).subscribe(
          (res) => {
            // Update avatar in UI
            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.user.avatar = e.target.result;
            };
            reader.readAsDataURL(file);
          },
          (err) => {
            console.log('failed to upload pic: ', err);
          }
        );
      }
    };
    fileInput.click();
  }
}
