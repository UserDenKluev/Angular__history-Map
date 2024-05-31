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

  // PositionY = {x: 0, y: 0};
  // PositionX = {x: 0, y: 0};
  // PositionXY = {x: 0, y: 0};
  // pointY: any;
  // pointX: any;
  // pointXY = {x: 0, y: 0};  
  // heightXY: any = 0;
  // widthXY: any = 0;

  // eventDND_Y(e: any): void {
  //   this.pointY = e.source.getFreeDragPosition();
  //   this.PositionXY = {x: this.pointXY.x, y: this.pointY.y};
  //   this.pointXY.y = this.pointY.y
  // }
  // eventDND_X(e: any): void {
  //   this.pointX = e.source.getFreeDragPosition();
  //   this.PositionXY = {x: this.pointX.x, y: this.pointXY.y};
  //   this.pointXY.x = this.pointX.x;
  // }
  // eventDND_XY(e: any): void {
  //   this.pointXY = e.source.getFreeDragPosition();
  //   this.PositionY = {x: 0, y: this.pointXY.y};
  //   this.PositionX = {x: this.pointXY.x, y: 0};
  // }
  // contentY: any = 0;
  // contentX: any = 0;
  // contentHeight: any = 0;
  // contentWidth: any = 0;
  // windowHeight: any = 0;
  // windowWidth: any = 0;
  // fieldHeight: any = 0;
  // fieldWidth: any = 0;
  // mapXYWidth: any = 0;

  // ddd(e: any) {
  //   console.log(e);
  // }
}
