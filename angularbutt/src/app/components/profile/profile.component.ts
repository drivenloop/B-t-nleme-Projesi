import { Component, OnInit } from '@angular/core';
import { User } from '@angular/fire/auth';
import { UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { concatMap } from 'rxjs';
import { ProfileUser } from 'src/app/models/user-profile';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { UsersService } from 'src/app/services/users.service';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user$ = this.usersService.currentUserProfile$;

  profileForm = new UntypedFormGroup({
    uid: new UntypedFormControl(''),
    displayName: new UntypedFormControl(''),
    firstName: new UntypedFormControl(''),
    lastName: new UntypedFormControl(''),
    phone: new UntypedFormControl(''),
    address: new UntypedFormControl(''),
  });

  constructor(
    private authService: AuthenticationService,
    private imageUploadService: ImageUploadService,
    private toast: HotToastService,
    private usersService: UsersService
  ) {}

  ngOnInit(): void {
    this.usersService.currentUserProfile$
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.profileForm.patchValue({ ...user });
      });
  }

  uploadImage(event: any, user: ProfileUser) {
    this.imageUploadService
      .uploadImage(event.target.files[0], `images/profile/${user.uid}`)
      .pipe(
        this.toast.observe({
          loading: 'Image is being uploaded...',
          success: 'Image uploaded!',
          error: 'There was an error in uploading',
        }),
        concatMap((photoURL) =>
          this.usersService.updateUser({ uid: user.uid, photoURL })
        )
      )
      .subscribe();
  }

  saveProfile() {
    const profileData = this.profileForm.value;
    this.usersService
      .updateUser(profileData)
      .pipe(
        this.toast.observe({
          loading: 'Updating data...',
          success: 'Data has been updated',
          error: 'There was an error in updating the data',
        })
      )
      .subscribe();
  }
}
