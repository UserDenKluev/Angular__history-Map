import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { BoxsXYService } from '../../../../boxs-xy.service'
import { AllSiteService } from '../../../../all-site.service'
import { DialogDeleteCountryComponent } from '../../../instruments/dialog/dialog-delete-country/dialog-delete-country.component'
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-map-x',
  templateUrl: './map-x.component.html',
  styleUrls: ['./map-x.component.css']
})
export class MapXComponent implements AfterViewInit {

  constructor( 
    public allSite: AllSiteService, 
    public boxXYService: BoxsXYService,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) { }

 ngAfterViewInit(): void {
  setTimeout(() => {
    this.boxXYService.loadingBoxXY.subscribe(() => {
      this.mapX.nativeElement.style.width = this.boxXYService.mapXYWidth + 'px';
      this.mapXHidden.nativeElement.style.width = this.boxXYService.fieldWidth + 'px';
      this.renderer.setStyle(this.boxX.nativeElement, 'width', this.boxXYService.boxXYWidth + 'px')
      this.mapXHidden.nativeElement.style.left = (-(this.boxXYService.contentX)) + 'px';
      this.PositionX = {x: this.boxXYService.contentX, y: 0}
    })

    this.boxXYService.moveBoxXY.subscribe((pointXY) => {
      this.PositionX = {x: pointXY.x, y: 0};
    })

    this.boxXYService.editContry.subscribe(()=>{
      this.renderer.removeChild(this.boxX, this.renderer.selectRootElement('.divBoxX'))
      this.resetBoxX();
    })
    this.resetBoxX();
  }, 0)
 }
  
  @ViewChild('mapXHidden') mapXHidden: ElementRef;
  @ViewChild('mapX') mapX: ElementRef;
  @ViewChild('boxX') boxX: ElementRef;

  widthXY: any = 0;
  PositionX = {x: 0, y: 0};

  eventDND_X(e: any): void {
    this.boxXYService.PositionX = e.source.getFreeDragPosition().x;
    this.boxXYService.moveBoxX.emit(e.source.getFreeDragPosition());
  }

  resetBoxX() {
    let divBoxX = this.renderer.createElement('div');
    this.renderer.appendChild(this.boxX.nativeElement, divBoxX);
    this.renderer.addClass(divBoxX, 'divBoxX');

    for (let i = 0; i < this.allSite.countries.length; i++) {
      let divCountry = this.renderer.createElement('div');
      let textCountry = this.renderer.createText(this.allSite.countries[i].name);
      this.renderer.appendChild(divBoxX, divCountry);
      this.renderer.addClass(divCountry, 'country');
      this.renderer.appendChild(divCountry, textCountry);
      this.renderer.setStyle(divCountry, 'background-color', this.allSite.countries[i].color)
      this.renderer.setStyle(divCountry, 'color', this.allSite.countries[i].colorText)

      if(this.allSite.isEditCountry) {
        this.renderer.addClass(divCountry, 'animateEdit');
        this.renderer.listen(divCountry,'dblclick', (event) => {
          for (let i = 0; i < this.allSite.countries.length; i++) {
            if (this.allSite.countries[i].name == event.target.innerText) {
              this.boxXYService.openDialogEditContry.emit({
                id: this.allSite.countries[i].id,
                name: this.allSite.countries[i].name,
                color: this.allSite.countries[i].color,
                colorText: this.allSite.countries[i].colorText
              });
              break;                      
            }
          }
        })
      } else if (this.allSite.isDeleteCountry) {
        this.renderer.addClass(divCountry, 'animateEdit');
        this.renderer.listen(divCountry,'dblclick', (event) => {
          for (let i = 0; i < this.allSite.countries.length; i++) {
            if (this.allSite.countries[i].name == event.target.innerText) {
              this.dialog.open(DialogDeleteCountryComponent, {
                data: this.allSite.countries[i].id
              });
              break;                      
            }
          }
          this.allSite.isDeleteCountry = false;
          this.boxXYService.editContry.emit();
        })
      }
    }
  }

}