import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { BoxsXYService } from '../../../../boxs-xy.service';
import { AllSiteService } from '../../../../all-site.service';

@Component({
  selector: 'app-map-y',
  templateUrl: './map-y.component.html',
  styleUrls: ['./map-y.component.css']
})
export class MapYComponent implements AfterViewInit {

  constructor(
    public allSite: AllSiteService, 
    public boxXYService: BoxsXYService,
    public renderer: Renderer2
    ) {  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.boxXYService.loadingBoxXY.subscribe(() => {
        this.mapY
        .nativeElement.style.height = this.boxXYService.mapXYHeight + 'px';
        this.mapYHidden
        .nativeElement.style.height = this.boxXYService.fieldHeight + 'px';
        this.boxY.nativeElement.style.height = this.boxXYService.boxXYHeight + 'px';
        this.mapYHidden.nativeElement.style.top = (-(this.boxXYService.contentY)) + 'px';
        this.PositionY = {x: 0, y: this.boxXYService.contentY};
      })
      this.boxXYService.moveBoxXY.subscribe((pointXY) => {
        this.PositionY = {x: 0, y: pointXY.y};
      })
      this.boxXYService.resetBoxXY.subscribe(() => {

        try {
          this.renderer.removeChild(this.boxY, this.renderer.selectRootElement('.divBoxY'))
        } catch  {
        }
      })
      this.boxXYService.yearsSize.subscribe(() => {
        let divBoxY = this.renderer.createElement('div');
        this.renderer.appendChild(this.boxY.nativeElement, divBoxY);
        this.renderer.addClass(divBoxY,'divBoxY');

        for (let year = 0; year < this.allSite.year.length; year++) {
          let divYear = this.renderer.createElement('div');
          let divBr = this.renderer.createElement('br')
          let textYear;
          let textEar;
          if (this.allSite.year[year] < 0) {
            textYear = this.renderer.createText(`${-1 * this.allSite.year[year]} г.`)
            textEar = this.renderer.createText(`до н.э.`)
          } else {
            textYear = this.renderer.createText(`${this.allSite.year[year]} г.`)
            textEar = this.renderer.createText(`н.э.`)
          }
          this.renderer.appendChild(divBoxY, divYear);
          this.renderer.appendChild(divYear, textYear);
          this.renderer.appendChild(divYear, divBr);
          this.renderer.appendChild(divYear, textEar);
          this.renderer.addClass(divYear,'divYear');
          this.renderer.setStyle(divYear, 'height', this.allSite.yearsSize[year] + 'px');
        }
      })
    }, 0)
  }

  @ViewChild('mapYHidden') mapYHidden: ElementRef;
  @ViewChild('mapY') mapY: ElementRef;
  @ViewChild('boxY') boxY: ElementRef;
  @ViewChild('date') date: ElementRef;

  heightXY: any = 0;
  PositionY = {x: 0, y: 0};
  PositionXY = {x: 0, y: 0};
  pointY: any;
  pointXY: any = {x: 0, y: 0};  

  eventDND_Y(e: any): void {
    this.boxXYService.PositionY = e.source.getFreeDragPosition().y;
    this.boxXYService.moveBoxY.emit(e.source.getFreeDragPosition());
  }
}