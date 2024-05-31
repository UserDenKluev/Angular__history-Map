import { Component, OnInit } from '@angular/core';
import { AllSiteService } from './all-site.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'History-Map';

  constructor(
    public allSite: AllSiteService 
    ) { 
      this.allSite.getOffrs();
      this.allSite.getEvents();
      this.allSite.getCountry();
      this.allSite.getUsers();
     }
    
  ngOnInit(): void {
    
  }
}
