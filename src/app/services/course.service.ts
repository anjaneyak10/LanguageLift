// src/app/course.service.ts
import { Injectable } from '@angular/core';
import { CourseModel } from '../Models/courseModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { Observable, map } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  emsUrl = `${environment.apiBaseUrl}${environment.emsPort}`;

  ccmsUrl = `${environment.apiBaseUrl}${environment.ccmsPort}`;
  private unenrolledCoursesUrl = this.emsUrl+`/getNotEnrolledCoursesByStuId`; 
  private myCoursesUrl = this.emsUrl+`/getEnrolledCoursesByStuId`; 
  private courseDetailsUrl = this.ccmsUrl+`/getCourseModuleDetails`;
  private moduleDetailsUrl = this.ccmsUrl+`/getModuleDetailsFull`;
  private httpOptions :any;

  constructor(private http: HttpClient,private localStorageService:LocalStorageService) {}

  getHttpOptionsWithToken() {
    return {headers: new HttpHeaders({
      'Authorization': this.localStorageService.get('token')
    })}
  }

  getUnenrolledCourses(): Observable<any> {
    this.httpOptions = this.getHttpOptionsWithToken();
    console.log(this.httpOptions)
    console.log(this.http.get<CourseModel[]>(this.myCoursesUrl, this.httpOptions));
    return this.http.get<any>(this.unenrolledCoursesUrl, this.httpOptions);
  }

  getMyCourses(): Observable<any> {
    this.httpOptions = this.getHttpOptionsWithToken();
    console.log(this.http.get<CourseModel[]>(this.myCoursesUrl, this.httpOptions));
    return this.http.get<any>(this.myCoursesUrl, this.httpOptions);
  }

  getCourseById(id: number) {
    this.getMyCourses().subscribe(
      (courses) => {
        console.log(courses);
        courses = courses.courseDetails;
        const courseId = courses.find((course: CourseModel) => course.id === id);
        if (courseId) {
          return courseId;
        }
        else {
          return "You are not enrolled in that course";
        }
      },
      (      error: any) => {
        console.error('Error fetching my enrolled courses:', error);
      }
    );
  }

  getCourseModuleDetails(courseId: number): Observable<any> {
    this.httpOptions = this.getHttpOptionsWithToken();
    const url = `${this.courseDetailsUrl}?courseId=${courseId}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  enrollCourse(courseId: number): Observable<any> {
    this.httpOptions = this.getHttpOptionsWithToken();
    const url = `${this.emsUrl}/enroll?courseId=${courseId}`;
    // enroll?courseId=2'
    console.log(url);
    return this.http.get<any>(url, this.httpOptions);
  }

  getCoursesByTeacherId(): Observable<any> {
    this.httpOptions = this.getHttpOptionsWithToken();
    const url = `${this.emsUrl}/getEnrolledCoursesByInstructorId`;
    return this.http.get<any>(url, this.httpOptions);
  }

  getModuleDetailsFull(moduleId: number): Observable<any> {
    this.httpOptions = this.getHttpOptionsWithToken();
    const url = `${this.moduleDetailsUrl}?courseModuleId=${moduleId}`;
    return this.http.get<any>(url, this.httpOptions);
  }

  
}
