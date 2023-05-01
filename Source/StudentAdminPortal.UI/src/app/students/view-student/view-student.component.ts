import { Component } from '@angular/core';
import { Student } from 'src/app/models/api-models/student.model';
import { StudentService } from '../student.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css']
})
export class ViewStudentComponent {
  studentId: string | null | undefined;

  constructor(private readonly studentService: StudentService,
    private readonly route: ActivatedRoute) {}

    ngOnInit(): void{
      console.log('view student worked!')
      this.route.paramMap.subscribe(
        (params) => {
          this.studentId = params.get('id');
        }
      );

      if(this.studentId){
        this.studentService.getStudent(this.studentId)
        .subscribe(
          (successReponse) => {
            console.log(successReponse);
          }
        )
      }
    }
}
