import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { Observable, of, throwError } from 'rxjs';
import { Event } from './event';
import { Users } from './users';
import { Offer } from './offer';
import { Country } from './country'
import { BoxsXYService } from './boxs-xy.service';


@Injectable({
  providedIn: 'root'
})
export class AllSiteService {
  constructor(
    public boxXYService: BoxsXYService,
    private http: HttpClient
  ) { }

  getCountry() {
    this.http.get<Country[]>('https://history-map-7a16d-default-rtdb.firebaseio.com/countries.json').subscribe((res) => {
      let index = 0;
      Object.keys(res).map(key => {
        this.countries[index] = res[key]
        this.saveCountries[index] = res[key]

        index++;
      })

      this.siteLoadingCountries = true;

    })

  }

  getEvents() {
    this.http.get<Event[]>('https://history-map-7a16d-default-rtdb.firebaseio.com/events.json').subscribe((res) => {

      let index = 0;
      Object.keys(res).map(key => {
        this.events[index] = res[key]
        this.saveEvents[index] = res[key]

        index++;
      })

      this.getYearOrder();
      this.siteLoadingEvents = true;
    })
  }

  getUsers() {
    this.http.get<Users[]>('https://history-map-7a16d-default-rtdb.firebaseio.com/users.json').subscribe((res) => {

      let index = 0;
      Object.keys(res).map(key => {
        this.users[index] = res[key]

        index++;
      })


    })
  }

  getOffrs() {
    this.http.get<Offer[]>('https://history-map-7a16d-default-rtdb.firebaseio.com/offer.json').subscribe((res) => {
      let index = 0;
      Object.keys(res).map(key => {
        this.offers[index] = res[key]

        index++;
      })


    })
  }

  addCountry(data: Country) {
    console.log(data);

    this.http.post<Country>('https://history-map-7a16d-default-rtdb.firebaseio.com/countries.json', data)
      .subscribe((res) => {
        console.log('второй');
        this.saveCountries.push(res)
        this.allFruits.push(res.name);
        if (this.searchCountry.length > 0) {
          this.boxXYService.addCounties.emit();
        } else {
          this.countries.push(res);
          this.boxXYService.editContry.emit();
          this.boxXYService.addCounties.emit();
        }
        this.boxXYService.activeInstrument.emit();
      })
  }

  addEvent(data: Event) {
    this.http.post<Event>('https://history-map-7a16d-default-rtdb.firebaseio.com/events.json', data)
      .subscribe((res) => {
        this.saveEvents.push(res);
        this.boxXYService.addEvent.emit(res.date);
      })
  }

  putEventMas: Event[] = [];
  thisCountry: any = {}
  putCountry(country) {
    this.thisCountry = country;
    this.http.put(`https://history-map-7a16d-default-rtdb.firebaseio.com/countries/${country.id}.json`, {
      id: country.id,
      name: country.name,
      color: country.color,
      colorText: country.colorText
    }).subscribe(() => {
      let eventId = 0;
      for (let idCountry = 0; idCountry < this.saveCountries.length; idCountry++) {
        if (this.saveCountries[idCountry].id == country.id) {
          for (let event = 0; event < this.saveEvents.length; event++) {
            if (this.saveCountries[idCountry].name == this.saveEvents[event].country) {
              this.putEventMas[eventId] = this.saveEvents[event];
              this.putEventMas[eventId].country = country.name;
              eventId++;
            }
          }
          this.saveCountries[idCountry].name = country.name;
          this.saveCountries[idCountry].color = country.color;
          this.saveCountries[idCountry].colorText = country.colorText;
          break;
        }
      }
      this.loadPutEvent()
    })
  }

  countEvent: number = 0;
  loadPutEvent() {
    if (this.countEvent < this.putEventMas.length) {
      this.putEventWithCountry(this.putEventMas[this.countEvent].id);
    }
  }

  putEventWithCountry(idEvent: number) {
    this.http.put(`https://history-map-7a16d-default-rtdb.firebaseio.com/events/${idEvent}.json`, {
      country: this.putEventMas[this.countEvent].country,
      event: this.putEventMas[this.countEvent].event,
      moreDetails: this.putEventMas[this.countEvent].moreDetails,
      date: this.putEventMas[this.countEvent].date,
      id: this.putEventMas[this.countEvent].id
    }
    )
      .subscribe(() => {
        this.countEvent++;

        setTimeout(() => {
          if (this.countEvent == this.putEventMas.length) {
            this.boxXYService.putCounties.emit();
          }
          this.loadPutEvent()
        }, 100);
      })
  }

  putEvent(event) {
    this.http.put(`https://history-map-7a16d-default-rtdb.firebaseio.com/events/${event.id}.json`, {
      country: event.country,
      event: event.event,
      moreDetails: event.moreDetails,
      date: event.date,
      id: event.id
    }).subscribe(() => {
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].id == event.id) {
          this.events[i].country = event.country;
          this.events[i].event = event.event;
          this.events[i].moreDetails = event.moreDetails;
          this.events[i].date = event.date;
        }
      }
      for (let i = 0; i < this.saveEvents.length; i++) {
        if (this.saveEvents[i].id == event.id) {
          this.saveEvents[i].country = event.country;
          this.saveEvents[i].event = event.event;
          this.saveEvents[i].moreDetails = event.moreDetails;
          this.saveEvents[i].date = event.date;
        }
      }
      this.boxXYService.resetBoxXY.emit();
    })
  }

  deleteEventMas: number[] = [];
  deleteCountry(id: number) {
    this.http.delete(`https://history-map-7a16d-default-rtdb.firebaseio.com/countries/${id}.json`)
      .subscribe(() => {
        let eventId = 0;
        for (let idCountry = 0; idCountry < this.saveCountries.length; idCountry++) {
          if (this.saveCountries[idCountry].id == id) {
            for (let event = 0; event < this.saveEvents.length; event++) {
              if (this.saveCountries[idCountry].name == this.saveEvents[event].country) {
                this.deleteEventMas[eventId] = this.saveEvents[event].id;
                eventId++
              }
            }
            this.saveCountries.splice(idCountry, 1)
            break;
          }
        }
        if (eventId == 0) {
          this.boxXYService.deleteCounties.emit();
        }
        this.loadDeleteEvent()
      })
  }

  loadDeleteEvent() {
    if (0 < this.deleteEventMas.length) {
      this.deleteEventWithCountry(this.deleteEventMas[0]);
    }
  }

  deleteEventWithCountry(idEvent: number) {
    this.http.delete(`https://history-map-7a16d-default-rtdb.firebaseio.com/events/${idEvent}.json`)
      .subscribe(() => {
        for (let i = 0; i < this.saveEvents.length; i++) {
          if (this.saveEvents[i].id == idEvent) {
            this.saveEvents.splice(i, 1)
            break
          }
        }
        this.deleteEventMas.splice(0, 1)

        if (this.deleteEventMas.length == 0) {
          this.boxXYService.deleteCounties.emit();
        }
        setTimeout(() => {
          this.loadDeleteEvent()
        }, 100);
      })
  }

  deleteEvent(idEvent: number) {
    this.http.delete(`https://history-map-7a16d-default-rtdb.firebaseio.com/events/${idEvent}.json`)
      .subscribe(() => {
        for (let i = 0; i < this.saveEvents.length; i++) {
          if (this.saveEvents[i].id == idEvent) {
            this.saveEvents.splice(i, 1)
            break
          }
        }
        for (let i = 0; i < this.events.length; i++) {
          if (this.events[i].id == idEvent) {
            this.events.splice(i, 1)
            break
          }
        }
        this.boxXYService.resetBoxXY.emit();
      })
  }

  addUser(data: Users) {
    this.http.post<Users>('https://history-map-7a16d-default-rtdb.firebaseio.com/users.json', data)
      .subscribe((res) => {
        this.whoAreYou = res.Login
        this.users.push(res);

      })
  }

  addOffer(data: Offer) {
    this.http.post<Offer>('https://history-map-7a16d-default-rtdb.firebaseio.com/offer.json', data)
      .subscribe((res) => {
        this.offers.push(res);
        this.boxXYService.resetBoxXY.emit();
      })
  }

  deleteOffer(id: number, iMas: number) {
    this.http.delete(`https://history-map-7a16d-default-rtdb.firebaseio.com/offer/${id}.json`)
      .subscribe(() => {
        this.offers.splice(iMas, 1)
      })
  }

  siteLoadingCountries: boolean = false;
  siteLoadingEvents: boolean = false;

  hello: string = '';
  whoAreYou: string = '';

  isAmin: boolean = false;
  isUser: boolean = false;
  isPasserby: boolean = true;

  isOpenInstrument: boolean = false;

  isEditCountry: boolean = false;
  isEditEvent: boolean = false;
  isDeleteCountry: boolean = false;
  isDeleteEvent: boolean = false;

  login(userInfo: { email: string, password: string }): Observable<string | boolean> {
    for (let user = 0; user < this.users.length; user++) {
      if (userInfo.email === this.users[user].Login && userInfo.password === this.users[user].Password) {
        return of(this.users[user].Status);
      }
    }
    return throwError(() => new Error('Failed Login'));
  }

  users: Users[] = []
  events: Event[] = []
  countries: Country[] = []
  offers: Offer[] = []
  searchCountry: string[] = [];
  saveEvents: Event[] = [];
  saveCountries: Country[] = [];
  allFruits: string[] = [];


  yearsSize: number[] = []

  year: number[] = [];

  getAllYear(): void {
    this.year = [];
    let a = 1;
    this.year[0] = this.newMas[0].date;
    for (let i = 1; i < this.newMas.length; i++) {
      if (this.year[a - 1] == this.newMas[i].date) {
        continue;
      }
      this.year[a] = this.newMas[i].date;
      a++;
    }
  }

  newMas: Event[] = [];
  getYearOrder(): void {
    this.newMas = [];
    this.newMas[0] = this.events[0];
    for (let i = 1; i < this.events.length; i++) {
      let iteration = 0;
      for (let j = (this.newMas.length - 1); this.events[i].date < this.newMas[j].date; j--) {
        iteration++;
        if (j == 0) {
          break;
        }
      }
      if (iteration == 0) {
        this.newMas.push(this.events[i]);
      } else {
        for (let g = 0; g < iteration + 1; g++) {
          this.newMas[this.newMas.length - g] = this.newMas[this.newMas.length - g - 1];
        }
        this.newMas[this.newMas.length - iteration - 1] = this.events[i]
      }
    }
    this.getAllYear()
  }
}