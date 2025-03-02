import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';
import { combineLatest, filter, Observable, of } from 'rxjs';

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

  getCountryNamesByCodeArray(countryCodes: string[]): Observable<Country[]> {
    if (!countryCodes || countryCodes.length === 0) return of([]);

    const countriesRequest: Observable<Country>[] = [];

    countryCodes.forEach(code => {
      const request = this.getCountryByAlphaCode(code).pipe(
        filter((country): country is Country => country !== null)
      );
      countriesRequest.push(request);
    });

    return combineLatest(countriesRequest);
  }
}
