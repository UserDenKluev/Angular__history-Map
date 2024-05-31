import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BoxsXYService {

  fieldHeight: number;
  fieldWidth: number;
  mapXYWidth: number;
  mapXYHeight: number;
  boxXYWidth: number;
  boxXYHeight: number;
  contentX: number;
  contentY: number;
  PositionX: number;
  PositionY: number;

  activeInstrument = new EventEmitter();
  yearsSize = new EventEmitter();
  clickEvent = new EventEmitter();
  loadingBoxXY = new EventEmitter();
  resetBoxXY = new EventEmitter();
  moveBoxXY = new EventEmitter();
  moveBoxX = new EventEmitter();
  moveBoxY = new EventEmitter();
  editContry = new EventEmitter();
  openDialogEditContry = new EventEmitter();
  openDialogEditEvent = new EventEmitter();

  addCounties = new EventEmitter();
  addEvent = new EventEmitter();
  putCounties = new EventEmitter();
  putEvent = new EventEmitter();
  deleteCounties = new EventEmitter();
  deleteEvent = new EventEmitter();
}