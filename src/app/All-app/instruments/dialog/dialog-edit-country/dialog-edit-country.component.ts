import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AllSiteService } from 'src/app/all-site.service';
import { BoxsXYService } from 'src/app/boxs-xy.service';

@Component({
  selector: 'app-dialog-edit-country',
  templateUrl: './dialog-edit-country.component.html',
  styleUrls: ['./dialog-edit-country.component.css']
})
export class DialogEditCountryComponent implements OnInit {

  constructor(
    public allSite: AllSiteService,
    public boxXYService: BoxsXYService,
    public dialogRef: MatDialogRef<DialogEditCountryComponent>,
    @Inject(MAT_DIALOG_DATA) public data
    ) { 
    
   }

  ngOnInit(): void {
    this.saveCountry = this.data.name;
    this.country = this.data.name;
    this.backColor = this.data.color;
    this.textColor = this.data.colorText;

  }
  saveCountry: string;
  country: string = '';
  backColor: string = '';
  textColor: string = '';
  
  EditCountryForm() {
    this.allSite.countEvent = 0;
    this.allSite.putCountry({
      id: this.data.id,
      name: this.country,
      saveCountry: this.saveCountry,
      color: this.backColor,
      colorText: this.textColor
    }) 
  }
}