// Service for interacting with People API
// Handles HTTP requests for CRUD operations

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Person } from '../models/person';


  // Base URL for the API backend
@Injectable({ providedIn: 'root' })
export class PeopleService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/api/people`;

  getPeople(): Observable<Person[]> {
    return this.http.get<Person[]>(this.base);
  }

  addPerson(person: Person): Observable<any> {
    return this.http.post<any>(this.base, person);
  }

  deletePerson(id: string): Observable<any> {
    return this.http.delete<any>(`${this.base}/${id}`);
  }
  updatePerson(id: string, person: Person): Observable<any> {
  return this.http.put<any>(`${this.base}/${id}`, person);
}

undoDelete(id: string): Observable<any> {
    return this.http.post<any>(`${this.base}/undo/${id}`, {});
  }
}

