import { Component } from '@angular/core';
import { BoxsXYService } from 'src/app/boxs-xy.service';
import { AllSiteService } from '../../all-site.service';
import { HttpResponse } from '@angular/common/http'



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent {

  constructor(public allSite: AllSiteService, public boxXYService: BoxsXYService) { }

  activeInstrument():void {
    this.allSite.isOpenInstrument = !this.allSite.isOpenInstrument;
    
    if (this.allSite.isOpenInstrument) {
      setTimeout(() => { this.boxXYService.activeInstrument.emit();}
    , 300);
    } else {
      this.boxXYService.activeInstrument.emit();
    }
  }

  active() {
    this.boxXYService.activeInstrument.emit()
  }
}
