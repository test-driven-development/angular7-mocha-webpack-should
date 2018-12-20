import {BrowseComponent} from '../../src/app/browse/index';
import {Routes} from '@angular/router';
import {EraseComponent} from '../../src/app/erase/index';
import {AccessComponent} from '../../src/app/access/index';
import {VerifyComponent} from '../../src/app/verify/index';

export const routes: Routes = [
  {path: 'erase/:id', component: EraseComponent},
  {path: 'access/:id', component: AccessComponent},
  {path: 'verify/:id', component: VerifyComponent},
  {path: '', component: BrowseComponent},
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
