import { Component, Inject, OnInit } from '@angular/core';
import { AllSiteService } from 'src/app/all-site.service';
import { BoxsXYService } from 'src/app/boxs-xy.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-country',
  templateUrl: './dialog-delete-country.component.html',
  styleUrls: ['./dialog-delete-country.component.css']
})
export class DialogDeleteCountryComponent implements OnInit {

  constructor(
    public allSite: AllSiteService,
    public boxXYService: BoxsXYService,
    public dialogRef: MatDialogRef<DialogDeleteCountryComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
  }
  deleteCountry() {
    this.allSite.deleteCountry(this.data)
  }

}
