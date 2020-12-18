import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getPatients(): Observable<any> {
    return this.httpClient.get(environment.queryURI + '/Patient',
      { headers: this.getHeaders() });
  }

  getPatientsBetweenDates(from, to): Observable<any> {
    return this.httpClient.get(environment.queryURI + '/Patient?from='+from+'&to='+to,
      { headers: this.getHeaders() });
  }

  private getHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/fhir+json'
    });
    return headers;
  }
}


