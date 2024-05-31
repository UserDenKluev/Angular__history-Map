import { Component, Inject, OnInit } from '@angular/core';
import { AllSiteService } from 'src/app/all-site.service';
import { BoxsXYService } from 'src/app/boxs-xy.service';
import { NgForm, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-dialog-edit-event',
  templateUrl: './dialog-edit-event.component.html',
  styleUrls: ['./dialog-edit-event.component.css']
})
export class DialogEditEventComponent implements OnInit {

  ngOnInit(): void {
    console.log(this.data);
    
    if (this.data.date < 0) {
      this.selected = 'before'
      this.yearEvent = -1 * this.data.date;
    } else {
      this.selected = 'after'
      this.yearEvent = this.data.date;
    }

    this.contentEvent = this.data.moreDetails;
    this.titleEvent = this.data.event;
  }
  constructor(
    public allSite: AllSiteService,
    public boxXYService: BoxsXYService,
    public dialogRef: MatDialogRef<DialogEditEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data
    ) {  }
    select = this.data.country;
    CountryControl = new FormControl( '', Validators.required);
    countryEvent: string;
    yearEvent: number;
    titleEvent: string;
    contentEvent: string;
    Error: string = '';
    selected: string = 'before';

    editEventForm() {
      console.log(this.allSite.events);
      
      if (
        this.titleEvent == "" ||
        this.yearEvent  == undefined
      ) {
        this.Error = 'Введите данные правильно'
      } else {
        this.Error = ''

        let yearEra = 0;
        if ('after' == this.selected) {
          yearEra = this.yearEvent
        } else {
          yearEra = -this.yearEvent
        }

        this.allSite.putEvent({
          country: this.select,
          event: this.titleEvent,
          moreDetails: this.contentEvent,
          date: yearEra,
          id: this.data.id
        })

        
        this.boxXYService.resetBoxXY.emit();
      }
    }


}
