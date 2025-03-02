import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CountryService {

 private baseUrl = 'https://restcountries.com/v3.1';
 private http = inject(HttpClient);

 private _regions = ['africa', 'americas', 'asia', 'europe', 'oceania'];

  get regions(): string[] {
    return [...this._regions];
  }

  getCountriesByRegion(region: string): Observable<Country[]> {
    if(!region) return of([]);
    const url = `${this.baseUrl}/region/${region}?fields=cca3,name,borders`;

    return this.http.get<Country[]>(url);
  }

  getCountryByAlphaCode(alphacode: string):Observable<Country | null> {
    const url = `${this.baseUrl}/alpha/${alphacode}?fields=cca3,name,borders`;
    return this.http.get<Country>(url);
  }

  getCountryBorderByCodes (borders: string[]){

  }
}
