import { ObserversModule } from '@angular/cdk/observers';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Student } from '../models/api-models/student.model';
import { Observable } from 'rxjs';
import { UpdateStudentRequest } from '../models/api-models/update-student-request.model';
import { AddStudentRequest } from '../models/api-models/add-student-request.mode';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private baseApiUrl = 'http://localhost:5092'

  constructor(private httpClient: HttpClient) { }

  getStudents(): Observable<Student[]> {
    return this.httpClient.get<Student[]>(this.baseApiUrl + '/students');
  }

  getStudent(studentId: string): Observable<Student> {
    return this.httpClient.get<Student>(this.baseApiUrl + '/students/' + studentId);
  }

  updateStudent(studentId: string, studentRequest: Student): Observable<Student>{
    const updateStudent: UpdateStudentRequest = {
      firstName : studentRequest.firstName,
      lastName : studentRequest.lastName,
      email : studentRequest.email,
      mobile : studentRequest.mobile,
      dateOfBirth : studentRequest.dateOfBirth,
      genderId : studentRequest.genderId,
      postalAddress : studentRequest.address.postalAddress,
      physicalAddress : studentRequest.address.physicalAddress
    }

    return this.httpClient.put<Student>(this.baseApiUrl + '/students/' + studentId, updateStudent);
  }

  deleteStudent(studentId: string): Observable<Student> {
    return this.httpClient.delete<Student>(this.baseApiUrl + '/students/' + studentId);
  }

  addStudent(studentRequest: Student): Observable<Student> {
    const addStudent: AddStudentRequest = {
      firstName : studentRequest.firstName,
      lastName : studentRequest.lastName,
      email : studentRequest.email,
      mobile : studentRequest.mobile,
      dateOfBirth : studentRequest.dateOfBirth,
      genderId : studentRequest.genderId,
      postalAddress : studentRequest.address.postalAddress,
      physicalAddress : studentRequest.address.physicalAddress
    }
    return this.httpClient.post<Student>(this.baseApiUrl + '/students/add', addStudent);
  }
}
