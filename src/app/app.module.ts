import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDialogModule } from '@angular/material/dialog';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
// import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips'
import { MatAutocompleteModule } from '@angular/material/autocomplete';;
import { HttpClientModule } from '@angular/common/http';
import { MatSliderModule } from '@angular/material/slider';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapComponent } from './All-app/map/map.component';
import { InstrumentsComponent } from './All-app/instruments/instruments.component';
import { AddCountryDialog } from './All-app/instruments/instruments.component';
import { AddEventDialog } from './All-app/instruments/instruments.component';
import { MapYComponent } from './All-app/map/Map123/map-y/map-y.component';
import { MapXComponent } from './All-app/map/Map123/map-x/map-x.component';
import { MapXYComponent } from './All-app/map/Map123/map-xy/map-xy.component';
import { DialogContentDialog } from './All-app/map/Map123/map-xy/map-xy.component';
import { DialogEditCountryComponent } from './All-app/instruments/dialog/dialog-edit-country/dialog-edit-country.component';
import { DialogEditEventComponent } from './All-app/instruments/dialog/dialog-edit-event/dialog-edit-event.component';
import { DialogDeleteEventComponent } from './All-app/instruments/dialog/dialog-delete-event/dialog-delete-event.component';
import { DialogDeleteCountryComponent } from '../app/All-app/instruments/dialog/dialog-delete-country/dialog-delete-country.component';
import { SearchComponent } from './All-app/instruments/search/search.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    InstrumentsComponent,
    MapYComponent,
    MapXComponent,
    MapXYComponent,
    DialogContentDialog,
    AddCountryDialog,
    AddEventDialog,
    DialogEditCountryComponent,
    DialogEditEventComponent,
    DialogDeleteEventComponent,
    DialogDeleteCountryComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DragDropModule,
    MatDialogModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    HttpClientModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSliderModule
  ],
  providers: [
  //   {
  //   provide: LocationStrategy,
  //   useClass: HashLocationStrategy
  // }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
