import { Component, OnInit, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AllSiteService } from 'src/app/all-site.service';
import { BoxsXYService } from 'src/app/boxs-xy.service';
import { Country } from '../../../country'
import { Event } from '../../../event'
// import { threadId } from 'worker_threads';
import { fromEvent, throttleTime, scan } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  
  ngOnInit(): void {

    for (let index = 0; index < this.allSite.countries.length; index++) {
      this.allSite.saveCountries[index] = this.allSite.countries[index];
      this.allSite.allFruits[index] = this.allSite.countries[index].name;
    }
    for (let i = 0; i < this.allSite.events.length; i++) {
      this.allSite.saveEvents[i] = this.allSite.events[i];
    }
    for (let i = 0; i < this.allSite.events.length; i++) {
      if (this.yearMax < this.allSite.events[i].date) {
        this.yearMax = this.allSite.events[i].date;  
      }
      if (this.yearMin > this.allSite.events[i].date) {
        this.yearMin = this.allSite.events[i].date;  
      }
    }

    this.boxXYService.addCounties.subscribe(() => {
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allSite.allFruits.slice())),
        );
      })
    this.boxXYService.addEvent.subscribe((date: number) => {
      if (date > this.MaxSlider2) {
        this.MaxSlider2 = date
        this.MinSlider1 = date;
        this.yearMax = this.MaxSlider2;
      } else if (date < this.MinSlider2) {
        this.MaxSlider1 = -date;
        this.MinSlider2 = -date;
        this.yearMin = -this.MaxSlider1;
        this.valueSliderOne = this.MaxSlider1;
      } else {
        this.yearMin = this.MinSlider2;
        this.yearMax = this.MaxSlider2;
      }
      
      

      this.showFilterCountry();
    })
    this.boxXYService.putCounties.subscribe(()=> {
      this.allSite.allFruits = []

      for (let index = 0; index < this.allSite.saveCountries.length; index++) {
        this.allSite.allFruits[index] = this.allSite.saveCountries[index].name;
      }

      this.yearMin = this.MinSlider2;
      this.yearMax = this.MaxSlider2;
      this.valueSliderOne = -this.yearMin;
      this.showFilterCountry();
    });

    this.boxXYService.deleteCounties.subscribe(()=>{
      this.allSite.countries = [];
      this.allSite.events = [];
      for (let index = 0; index < this.allSite.saveCountries.length; index++) {
        this.allSite.allFruits[index] = this.allSite.saveCountries[index].name;
        this.allSite.countries[index] = this.allSite.saveCountries[index];
      }

      for (let i = 0; i < this.allSite.saveEvents.length; i++) {
        this.allSite.events[i] = this.allSite.saveEvents[i]; 
      }
      this.MinSlider1 = -this.yearMax;
      this.MaxSlider1 = -this.yearMin;
      this.MinSlider2 = this.yearMin;
      this.MaxSlider2 = this.yearMax;
      this.valueSliderOne = this.MaxSlider1;
      
      this.allSite.searchCountry = [];
      
      this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allSite.allFruits.slice())),
      );
      this.showFilterCountry();
    })

    this.boxXYService.deleteEvent.subscribe(()=>{
      this.yearMin = this.yearMin;
      this.yearMax = this.yearMax;
      this.showFilterCountry();
    })

    this.MinSlider1 = -this.yearMax;
    this.MaxSlider1 = -this.yearMin;
    this.MinSlider2 = this.yearMin;
    this.MaxSlider2 = this.yearMax;
    this.valueSliderOne = this.MaxSlider1;
  }

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  

  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  constructor(
    public allSite: AllSiteService, 
    public boxXYService: BoxsXYService
  ) {
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allSite.allFruits.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.allSite.searchCountry.push(value);
      
    }
    event.chipInput!.clear();
    this.fruitCtrl.setValue(null);
  }
  
  remove(fruit: string): void {
    const index = this.allSite.searchCountry.indexOf(fruit);
    if (index >= 0) {
      this.allSite.searchCountry.splice(index, 1);
    }
    this.allSite.allFruits.push(fruit);
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allSite.allFruits.slice())),
    );
    this.showFilterCountry()


  }
  
  selected(event: MatAutocompleteSelectedEvent): void {
    this.allSite.searchCountry.push(event.option.viewValue);
    this.fruitInput.nativeElement.value = '';
    this.fruitCtrl.setValue(null);
    for (let i = 0; i < this.allSite.allFruits.length; i++) {
      if (this.allSite.allFruits[i] == event.option.viewValue) {
        this.allSite.allFruits.splice(i, 1)
        break;
      }
    }
    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allSite.allFruits.slice())),
    );

      this.showFilterCountry()

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allSite.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }





  showFilterCountry() {
    this.allSite.events = [];
    this.allSite.countries = [];
    if (this.allSite.searchCountry.length > 0) {
      for (let i = 0; i < this.allSite.searchCountry.length; i++) {
        for (let g = 0; g < this.allSite.saveCountries.length; g++) {
          if (this.allSite.saveCountries[g].name == this.allSite.searchCountry[i]) {
            this.allSite.countries[i] = this.allSite.saveCountries[g];        
            break
          }
        }
      }
      this.countCountries = 0;
      this.filterEvents()
    } else {
      for (let i = 0; i < this.allSite.saveCountries.length; i++) {
        this.allSite.countries[i] = this.allSite.saveCountries[i];
      }
      for (let i = 0; i < this.allSite.saveEvents.length; i++) {
        this.allSite.events[i] =  this.allSite.saveEvents[i];
      }
      this.boxXYService.resetBoxXY.emit();
    }
    
    this.boxXYService.editContry.emit();
  }
  
  countCountries: number = 0;
  filterEvents() {
    if (this.countCountries < this.allSite.countries.length) {
      for (let i = 0; i < this.allSite.saveEvents.length; i++) {
        if ((this.allSite.saveEvents[i].country == this.allSite.countries[this.countCountries].name) &&
            (this.allSite.saveEvents[i].date >= this.yearMin) && 
            (this.allSite.saveEvents[i].date <= this.yearMax)
            ) {
          this.allSite.events.push(this.allSite.saveEvents[i])          
          console.log(this.allSite.events.length);
        }
      }

      this.countCountries++;
      if (this.countCountries == this.allSite.countries.length) {
        this.boxXYService.resetBoxXY.emit();
      }
      this.filterEvents()
    }
  }
  
  yearMin: number = 0;
  yearMax: number = 0;
  MinSlider1: number = 0;
  MaxSlider1: number = 0;
  MinSlider2: number = 0;
  MaxSlider2: number = 0;
  valueSliderOne: number = 0;
  
  countFFF: number = 0;
  minInput1() {
    this.countFFF++;
    setTimeout(() => {
      this.countFFF--;
      if (this.countFFF == 0) {
        this.filterEvents();
      }
    }, 1000)
  }

  minInput() {
    
    this.countFFF++;
    
    setTimeout(() => {
      this.countFFF--;
      
      if (this.countFFF == 0) {
        
        if (this.yearMin >= this.yearMax) {
          this.yearMin = this.yearMax - 1
        }
        if (this.yearMin.toString().length > 5) {
          this.yearMin = -this.MaxSlider1;
        }
        this.valueSliderOne = -this.yearMin
        this.allSite.events = [];
        this.countCountries = 0;
        this.filterEvents();
        // this.boxXYService.resetBoxXY.emit();
        
      }
    }, 1000)
  }
  maxInput() {
    this.countFFF++;
    setTimeout(() => {
      this.countFFF--;
      if (this.countFFF == 0) {
        
        if (this.yearMax <= this.yearMin) {
          this.yearMax = this.yearMin + 1
        }
        if (this.yearMax > 0) {
          if (this.yearMax.toString().length > 4) {
            this.yearMax = this.MaxSlider2;
          }
        } else {
          if (this.yearMax.toString().length > 5) {
            this.yearMax = this.yearMin + 1;
          }
        }
        this.allSite.events = [];
        this.countCountries = 0;
        this.filterEvents();
        // this.boxXYService.resetBoxXY.emit();

      }
    }, 1000)
  }

  slider1(){
    this.yearMin = -this.valueSliderOne
    this.minInput()
  }

  slider2(){
    this.maxInput()
  }
}