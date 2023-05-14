import { Component, ViewChild } from '@angular/core';
import { Student } from 'src/app/models/ui-models/student.model';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/api-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent {
  studentId: string | null | undefined;
  genderList: Gender[] = [];
  @ViewChild('studentDetailsForm') studentDetailsForm?: NgForm;
  isNewStudent: Boolean = false;
  header: string = '';
  displayProfileImageUrl: string = '';
  student: Student = {
    id: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    mobile: 0,
    genderId: '',
    profileImageUrl: '',
    gender: {
      id: '',
      description: ''
    },
    address: {
      id: '',
      physicalAddress: '',
      postalAddress: ''
    }
  }

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute,
    private readonly genderService: GenderService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
    console.log('view student worked!')
    this.route.paramMap.subscribe(
      (params) => {
        this.studentId = params.get('id');
      }
    );

    if (this.studentId) {
      if (this.studentId.toLowerCase() === 'Add'.toLowerCase()) {
        this.isNewStudent = true;
        this.header = 'Add the student';
        this.setImage();
      } else {
        this.isNewStudent = false;
        this.header = 'Edit the student';
        this.studentService.getStudent(this.studentId)
          .subscribe(
            (successReponse) => {
              this.student = successReponse;
              this.setImage();
            },
            (errorResponse) => {
              this.setImage();
            }
          )
      }

      this.genderService.getGenderList()
        .subscribe(
          (successResponse) => {
            this.genderList = successResponse;
          }
        )
    }
  }

  OnUpdate(): void {
    if(this.studentDetailsForm?.form.valid){
      this.studentService.updateStudent(this.student.id, this.student)
        .subscribe(
          (successReponse) => {
            this.snackBar.open('Student updated successfully!', undefined, {
              duration: 2000
            });
          },
          (errorReponse) => {
            console.log(errorReponse);
          }
        );
    }
  }

  OnDelete(): void {
    this.studentService.deleteStudent(this.student.id)
      .subscribe(
        (successReponse) => {
          this.snackBar.open('Student delete successfully!', undefined, {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl('/students');
          }, 2000);
        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      )
  }

  OnAdd(): void {
    if(this.studentDetailsForm?.form.valid){
    this.studentService.addStudent(this.student)
      .subscribe(
        (successReponse) => {
          this.snackBar.open('Student add successfully', undefined, {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigateByUrl('/students');
          }, 2000);
        },
        (errorResponse) => {
          console.log(errorResponse);
        }
      )
    }
  }

  uploadImage(event: any): void {
    if (this.studentId) {
      const file: File = event.target.files[0];
      this.studentService.uploadImage(this.student.id, file)
        .subscribe(
          (successResponse) => {
            this.student.profileImageUrl = successResponse;
            this.setImage();

            // Show a notification
            this.snackBar.open('Profile Image Updated', undefined, {
              duration: 2000
            });

          },
          (errorResponse) => {

          }
        );
    }
  }

  private setImage(): void {
    if (this.student.profileImageUrl) {
      this.displayProfileImageUrl = this.studentService.getImagePath(this.student.profileImageUrl);
    } else {
      this.displayProfileImageUrl = '/assets/user.png';
    }
  }
}
