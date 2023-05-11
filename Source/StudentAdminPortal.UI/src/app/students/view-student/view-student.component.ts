import { Component } from '@angular/core';
import { Student } from 'src/app/models/ui-models/student.model';
import { StudentService } from '../student.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenderService } from 'src/app/services/gender.service';
import { Gender } from 'src/app/models/api-models/gender.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent {
  studentId: string | null | undefined;
  genderList: Gender[] = [];
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
      this.studentService.getStudent(this.studentId)
        .subscribe(
          (successReponse) => {
            this.student = successReponse;
          }
        )

      this.genderService.getGenderList()
        .subscribe(
          (successResponse) => {
            this.genderList = successResponse;
          }
        )
    }
  }

  OnUpdate(): void {
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
}
