import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

@Injectable()
export class NavigatorService {
  constructor(
    private router: Router,
    private location: Location
  ) {}

  goto(destination: Array<string>): Promise<any> {
    return this.router.navigate(destination);
  }

  id(): any {
    return this.location.path().split('/').slice(-1)[0];
  }

  refresh() {
    const shouldForcePageReload = true;
    window.location.reload(shouldForcePageReload);
  }
}
