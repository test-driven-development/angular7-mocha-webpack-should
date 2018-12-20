import {NgModule} from '@angular/core';
import {NavigatorService} from './navigator.service';
import {Location} from '@angular/common';

@NgModule({
  providers: [
    NavigatorService,
    Location
  ]
})

export class NavigatorModule {}
export {NavigatorService};
