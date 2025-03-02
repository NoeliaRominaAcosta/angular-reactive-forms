import { JsonPipe } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CountryService } from '../../services/country.service';
import { Country } from '../../interfaces/country.interface';
import { filter, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-country-page',
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './country-page.component.html',
})
export class CountryPageComponent {
  fb = inject(FormBuilder);

  countryService = inject(CountryService);

  regions = signal(this.countryService.regions);

  countriesByRegion = signal<Country[]>([]);
  borders = signal<Country[]>([]);

  myForm = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  });

  onFormChanged = effect((onCleanUp) => {
    const regionSubscription = this.onRegionChanged();
    const countrySubscription = this.onCountryChanged();
    onCleanUp(() => {
      regionSubscription.unsubscribe();
      countrySubscription.unsubscribe();
    });
  });
  //cambia el valor del select de paises cuando cambia la region
  onRegionChanged() {
    return this.myForm.get('region')!.valueChanges
    .pipe(
      tap((region) => this.myForm.get('country')!.setValue('')),
      tap((region) => this.myForm.get('border')!.setValue('')),
      tap(() => {
        this.borders.set([]);
        this.countriesByRegion.set([]);
      }),
      //permite transformar el observable y devolver uno diferente, tiene acceso a la region que cambia
      switchMap(region => this.countryService.getCountriesByRegion(region!))
    )
    .subscribe((countries) => {
      console.log(countries);
      this.countriesByRegion.set(countries);
    });
  }

  onCountryChanged(){
    return this.myForm.get('country')!.valueChanges
    .pipe(
      tap(() => this.myForm.get('border')!.setValue('')),
      filter(value => value!.length > 0),
      switchMap(alphaCode =>
        this.countryService.getCountryByAlphaCode(alphaCode ?? '')
      ),
      switchMap(country =>
        this.countryService.getCountryNamesByCodeArray(country!.borders)
      )
    )
    .subscribe((borders)=> {
     this.borders.set(borders);
    })
  }
}
