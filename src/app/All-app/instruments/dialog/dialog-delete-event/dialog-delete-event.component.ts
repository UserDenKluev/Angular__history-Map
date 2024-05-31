import { Component, Inject, OnInit } from '@angular/core';
import { AllSiteService } from 'src/app/all-site.service';
import { BoxsXYService } from 'src/app/boxs-xy.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete-event',
  templateUrl: './dialog-delete-event.component.html',
  styleUrls: ['./dialog-delete-event.component.css']
})
export class DialogDeleteEventComponent implements OnInit {

  constructor(
    public allSite: AllSiteService,
    public boxXYService: BoxsXYService,
    public dialogRef: MatDialogRef<DialogDeleteEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data
    ) {  }

  ngOnInit(): void {
    console.log(this.data);
    
  }

  deleteEvent() {
    this.allSite.deleteEvent(this.data)
  }

}
