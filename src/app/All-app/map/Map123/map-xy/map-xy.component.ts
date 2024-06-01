import { AfterViewInit, Component, ElementRef, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BoxsXYService } from '../../../../boxs-xy.service';
import { AllSiteService } from '../../../../all-site.service'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event } from '../../../../event';
import { DialogDeleteEventComponent } from '../../../instruments/dialog/dialog-delete-event/dialog-delete-event.component'

@Component({
  selector: 'dialog-content-dialog',
  templateUrl: './dialog-content.component.html',
})
export class DialogContentDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogContentDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Event,
  ) { }
}

@Component({
  selector: 'app-map-xy',
  templateUrl: './map-xy.component.html',
  styleUrls: ['./map-xy.component.css']
})
export class MapXYComponent implements AfterViewInit, OnInit {

  constructor(
    public allSite: AllSiteService,
    public boxXYService: BoxsXYService,
    private renderer: Renderer2,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.sizeXY()
      this.boxXYService.moveBoxX.subscribe((pointX) => {
        this.PositionXY = { x: pointX.x, y: this.boxXYService.PositionY };
      })

      this.boxXYService.moveBoxY.subscribe((pointY) => {
        this.PositionXY = { x: this.boxXYService.PositionX, y: pointY.y };
      })

      this.boxXYService.activeInstrument.subscribe(() => {
        this.sizeXY();
      })

      this.boxXYService.resetBoxXY.subscribe(() => {
        try {
          this.renderer.removeChild(this.boxXY, this.renderer.selectRootElement('.divBoxXY'))
          this.resetBoxXy()
        } catch {
          this.resetBoxXy()
        }
      })


      this.resetBoxXy()
    }, 0)
  }

  @ViewChild('mapXY') mapXY: ElementRef;
  @ViewChild('boxXY') boxXY: ElementRef;

  PositionXY = { x: 0, y: 0 };
  pointXY = { x: 0, y: 0 };
  contentX: number;
  contentY: number;
  fieldWidth: number;
  fieldHeight: number;
  mapXYWidth: number;
  mapXYHeight: number;
  boxXYWidth: number;
  boxXYHeight: number;
  windowInnerWidth: number;
  windowInnerHeight: number;

  thisCountry: string;
  country: any = [];

  eventDND_XY(e: any): void {
    this.boxXYService.PositionY = e.source.getFreeDragPosition().y;
    this.boxXYService.PositionX = e.source.getFreeDragPosition().x;
    this.boxXYService.moveBoxXY.emit(e.source.getFreeDragPosition());
  }

  getHeightBoxXY() {
    let sizeBoxXY = 0;
    for (let year = 0; year < this.allSite.yearsSize.length; year++) {
      sizeBoxXY += this.allSite.yearsSize[year];
    }
    if (sizeBoxXY > this.mapXYHeight) {
      this.renderer.setStyle(this.boxXY.nativeElement, 'height', sizeBoxXY + 'px');
    }
  }

  windowResizing() {
    console.log(1);

    this.sizeXY();
  }

  resetBoxXy() {
    this.allSite.getYearOrder();

    let divBoxXY = this.renderer.createElement('div');
    this.renderer.appendChild(this.boxXY.nativeElement, divBoxXY);
    this.renderer.addClass(divBoxXY, 'divBoxXY');

    this.allSite.yearsSize = [];

    for (let year = 0; year < this.allSite.year.length; year++) {
      let divYear = this.renderer.createElement('div');
      this.renderer.appendChild(divBoxXY, divYear);
      this.renderer.addClass(divYear, 'divYear');

      for (let country = 0; country < this.allSite.countries.length; country++) {
        let divCountry = this.renderer.createElement('div');
        this.renderer.appendChild(divYear, divCountry);
        this.renderer.addClass(divCountry, 'divCountry');
        for (let event = 0; event < this.allSite.events.length; event++) {

          if (
            this.allSite.events[event].date == this.allSite.year[year] &&
            this.allSite.events[event].country == this.allSite.countries[country].name
          ) {
            let divEvent = this.renderer.createElement('div');
            let textEvent = this.renderer.createText(`${this.allSite.events[event].event}`);
            this.renderer.appendChild(divEvent, textEvent);
            this.renderer.appendChild(divCountry, divEvent);
            this.renderer.addClass(divEvent, 'divEvent');
            this.renderer.addClass(divEvent, `${this.allSite.events[event].id}`);
            this.renderer.setStyle(divEvent, 'background-color', this.allSite.countries[country].color);
            this.renderer.setStyle(divEvent, 'color', this.allSite.countries[country].colorText);

            if (this.allSite.isEditEvent) {
              this.renderer.addClass(divEvent, 'animateEdit');
              this.renderer.listen(divEvent, 'dblclick', (event) => {
                let id;
                for (let i = 0; i < this.allSite.events.length; i++) {
                  if (this.allSite.events[i].id == event.target.classList[1]) {
                    id = i;
                    break;
                  }
                }
                this.boxXYService.openDialogEditEvent.emit(
                  {
                    id: this.allSite.events[id].id,
                    country: this.allSite.events[id].country,
                    event: this.allSite.events[id].event,
                    moreDetails: this.allSite.events[id].moreDetails,
                    date: this.allSite.events[id].date
                  }
                );
              })
            } else if (this.allSite.isDeleteEvent) {
              this.renderer.addClass(divEvent, 'animateEdit');
              this.renderer.listen(divEvent, 'dblclick', (event) => {
                let id;
                for (let i = 0; i < this.allSite.events.length; i++) {
                  if (this.allSite.events[i].id == event.target.classList[1]) {
                    id = i;
                    break;
                  }
                }
                this.dialog.open(DialogDeleteEventComponent, {
                  data: this.allSite.events[id].id
                });
                this.allSite.isDeleteEvent = false;
                this.boxXYService.resetBoxXY.emit()
              })
            } else {
              this.renderer.listen(divEvent, 'dblclick', (event) => {
                for (let i = 0; i < this.allSite.events.length; i++) {
                  if (this.allSite.events[i].id == event.target.classList[1]) {
                    this.dialog.open(DialogContentDialog, {
                      data: this.allSite.events[i],
                    });
                    break;
                  }
                }
              })
            }
          }
        }
      }

      this.allSite.yearsSize[year] = divYear.offsetHeight;
    }

    this.sizeXY()
    this.boxXYService.yearsSize.emit();
  }



  sizeXY() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.windowInnerWidth = window.outerWidth;
      this.windowInnerHeight = window.outerHeight;
    } else {
      this.windowInnerWidth = window.innerWidth;
      this.windowInnerHeight = window.innerHeight;
    }

    this.mapXYWidth = (this.allSite.isOpenInstrument) ?
      (this.windowInnerWidth - 370) :
      (this.windowInnerWidth - 70);

    this.mapXYHeight = this.windowInnerHeight - 70;

    this.renderer.setStyle(this.boxXY.nativeElement, 'height', this.mapXYHeight + 'px');

    this.getHeightBoxXY();

    if (this.mapXYWidth > ((this.allSite.countries.length) * 200)) {
      this.renderer.setStyle(this.boxXY.nativeElement, 'width', (this.mapXYWidth) + 'px');
    }
    else {
      this.renderer.setStyle(this.boxXY.nativeElement, 'width', (this.allSite.countries.length * 200) + 'px');
    }

    this.renderer.setStyle(this.boxXY.nativeElement, 'background-color', 'black')

    this.boxXYWidth = this.boxXY.nativeElement.offsetWidth;
    this.boxXYHeight = this.boxXY.nativeElement.offsetHeight;

    this.contentX = this.boxXYWidth - this.mapXYWidth;
    this.contentY = this.boxXYHeight - this.mapXYHeight;

    this.PositionXY = { x: this.contentX, y: this.contentY };

    this.fieldWidth = this.mapXYWidth + (this.contentX * 2);
    this.fieldHeight = this.mapXYHeight + (this.contentY * 2);

    this.boxXYService.fieldWidth = this.fieldWidth;
    this.boxXYService.fieldHeight = this.fieldHeight;
    this.boxXYService.mapXYWidth = this.mapXYWidth;
    this.boxXYService.mapXYHeight = this.mapXYHeight;
    this.boxXYService.boxXYWidth = this.boxXYWidth;
    this.boxXYService.boxXYHeight = this.boxXYHeight;
    this.boxXYService.contentX = this.contentX;
    this.boxXYService.contentY = this.contentY;

    this.boxXYService.PositionX = this.contentX;
    this.boxXYService.PositionY = this.contentY;

    this.boxXYService.loadingBoxXY.emit();
  }
}