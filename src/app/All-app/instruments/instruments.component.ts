import { Component, OnInit, Renderer2 } from '@angular/core';
import { AllSiteService } from '../../all-site.service'
import { trigger, style, transition, state, animate } from '@angular/animations';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { BoxsXYService } from 'src/app/boxs-xy.service';
import { NgForm, FormControl, Validators, FormGroup } from '@angular/forms';

import { DialogEditCountryComponent } from './dialog/dialog-edit-country/dialog-edit-country.component'
import { DialogEditEventComponent } from './dialog/dialog-edit-event/dialog-edit-event.component'


@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.css'],
  animations: [
    trigger('openClose',[
      state('open', style({ width: 300 })),
      state('close', style({ width: 0 })),
      transition('open <=> close',[ animate('0.3s') ])
    ])
  ]
})
export class InstrumentsComponent implements OnInit {

  constructor(
    public allSite: AllSiteService,
    public dialog: MatDialog,
    public boxXYService: BoxsXYService,
    public renderer: Renderer2
    ) { }
    
    ngOnInit(): void {
      this.boxXYService.openDialogEditContry.subscribe((countryObj) => {
        this.allSite.isEditCountry = false;
        this.boxXYService.editContry.emit();
        
        this.dialog.open(DialogEditCountryComponent, {
          data: countryObj
        });
      })
      this.boxXYService.openDialogEditEvent.subscribe((eventObj) => {
        this.allSite.isEditEvent = false;
        this.boxXYService.resetBoxXY.emit();
        this.dialog.open(DialogEditEventComponent, {
          data: eventObj
        });
      })
      this.loginForm = new FormGroup({
        'email': new FormControl('', [Validators.required, Validators.email]),
        'password': new FormControl('', [Validators.required])
      })
      this.registrationForm = new FormGroup({
        'email': new FormControl('', [Validators.required, Validators.email]),
        'password': new FormControl('', [Validators.required])
      })
      this.offerForm = new FormGroup({
        'offer': new FormControl('', [Validators.required])
      })
  }

  loginForm!: FormGroup;
  registrationForm!: FormGroup;
  offerForm!: FormGroup;

  comeIn() {
    this.allSite.login(this.loginForm.value).subscribe({
      next: (status) => {
        if (status == 'admin') {
          this.allSite.hello = `admin ${this.loginForm.value.email}`
          this.allSite.isAmin = true;
          this.allSite.isUser = false;
          this.allSite.isPasserby = false;
        } else {
          this.allSite.hello = `user ${this.loginForm.value.email}`
          this.allSite.isAmin = false;
          this.allSite.isUser = true;
          this.allSite.isPasserby = false;
        }
        this.allSite.whoAreYou = this.loginForm.value.email;
      },
      error: (err) => alert(err.message)
    }) 
  }

  registration() {
    let idMax = 0
    for (let id = 0; id < this.allSite.users.length; id++) {
      if (idMax < this.allSite.users[id].id) {
        idMax = this.allSite.users[id].id        
      }
    }

    this.allSite.addUser({
      id: idMax + 1,
      Login: this.registrationForm.value.email,
      Password: this.registrationForm.value.password,
      Status: 'user'
    })

    this.allSite.hello = `user ${this.registrationForm.value.email}`

    this.allSite.isAmin = false;
    this.allSite.isUser = true;
    this.allSite.isPasserby = false;
  }

  output() {
    this.allSite.isAmin = false;
    this.allSite.isUser = false;
    this.allSite.isPasserby = true;
  }

  offerSend() {
    let maxId = 0;
    for (let i = 0; i < this.allSite.offers.length; i++) {
      if (this.allSite.events[i].id > maxId ) {
        maxId = this.allSite.events[i].id
      }
    }
    maxId++;

    this.allSite.addOffer({
      id: maxId,
      login: this.allSite.whoAreYou,
      offers: this.offerForm.value.offer,
      status: ''
    })
  }
  
  addCountry(): void {
    this.dialog.open(AddCountryDialog);
  };
  addEvent() {
    this.dialog.open(AddEventDialog);
  };
  editContry() {
    this.allSite.isEditEvent = false;
    this.allSite.isDeleteEvent = false;
    this.allSite.isDeleteCountry = false;

    this.allSite.isEditCountry = !this.allSite.isEditCountry;
    this.boxXYService.editContry.emit();
    this.boxXYService.resetBoxXY.emit();
  }
  editEvent() {
    this.allSite.isEditCountry = false;
    this.allSite.isDeleteEvent = false;
    this.allSite.isDeleteCountry = false;
    
    this.allSite.isEditEvent = !this.allSite.isEditEvent;
    this.boxXYService.editContry.emit();
    this.boxXYService.resetBoxXY.emit();
  }
  deleteContry() {
    this.allSite.isEditCountry = false;
    this.allSite.isDeleteEvent = false;
    this.allSite.isEditEvent = false;

    this.allSite.isDeleteCountry = !this.allSite.isDeleteCountry;
    this.boxXYService.editContry.emit();
    this.boxXYService.resetBoxXY.emit();
  }
  deleteEvent() {
    this.allSite.isEditCountry = false;
    this.allSite.isDeleteCountry = false;
    this.allSite.isEditEvent = false;

    this.allSite.isDeleteEvent = !this.allSite.isDeleteEvent;
    this.boxXYService.editContry.emit();
    this.boxXYService.resetBoxXY.emit();
  }
}

@Component({
  selector: 'addCountry',
  templateUrl: './dialog/addCountry.component.html',
  styles: [`
  input {
    box-sizing: border-box;
    width: 200px;
  }
  .example {
    border: 1px solid black;
    box-sizing: border-box;
    width: 200px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  button {
    width: 100%;
  }
  `],
})
export class AddCountryDialog {
  constructor(
    public allSite: AllSiteService,
    public boxXYService: BoxsXYService
  ) {}

  
    country: string = 'Название страны';
    backColor: string = '#dc1818';
    textColor: string = '#ffffff';
    addCountryForm( form: NgForm) {
      let maxId = 0;

      for (let i = 0; i < this.allSite.saveCountries.length; i++) {
        if (this.allSite.saveCountries[i].id > maxId ) {
          maxId = this.allSite.saveCountries[i].id
        }
      }
      maxId++;
      console.log(maxId);
      
      this.allSite.addCountry({
        id: maxId,
        name: this.country, 
        color: this.backColor, 
        colorText: this.textColor
      })
    }
}

@Component({
  selector: 'addEvent',
  templateUrl: './dialog/addEvent.component.html',
  styles: [`
  input {
    box-sizing: border-box;
    width: 100%;
  }
  .example {
    border: 1px solid black;
    box-sizing: border-box;
    width: 200px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  button {
    width: 100%;
  }
   .mat-form-field {
     width: 100%;
   }
   h2 {
    text-align: center;
    width: 200px;
    margin: auto;
    color: red;
   }
   .title {
    box-sizing: border-box;
    width: 100%;
    min-height: 100px;
    max-height: 100px;
   }
   .text {
    box-sizing: border-box;
    width: 100%;
    min-height: 100px;
    max-height: 440px;
   }
  `],
})
export class AddEventDialog {
  constructor(
    public allSite: AllSiteService,
    public boxXYService: BoxsXYService
  ) {}
    CountryControl = new FormControl('', Validators.required);
    // eraControl = new FormControl('', Validators.required);
    countryEvent: string = '';
    yearEvent: number;
    titleEvent: string = '';
    contentEvent: string = '';
    Error: string = ''
    selected: string = 'after';
    addEventForm() {
      if (
        this.CountryControl.value.name == undefined || 
        this.titleEvent == "" ||
        this.yearEvent  == undefined
      ) {
        this.Error = 'Введите данные правильно'
      } else {
        this.Error = '';

        let maxId = 0;

        for (let i = 0; i < this.allSite.saveEvents.length; i++) {
          if (this.allSite.saveEvents[i].id > maxId ) {
            maxId = this.allSite.saveEvents[i].id
          }
        }
        maxId++;

        let yearEra = 0;
        if ('after' == this.selected) {
          yearEra = this.yearEvent
        } else {
          yearEra = -this.yearEvent
        }

        this.allSite.addEvent({
          id: maxId,
          country: this.CountryControl.value.name,
          event: this.titleEvent,
          moreDetails: this.contentEvent,
          date: yearEra
        })
      }
    }
}
