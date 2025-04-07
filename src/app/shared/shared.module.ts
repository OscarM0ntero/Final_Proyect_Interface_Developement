import { NgModule } from '@angular/core';
import { Error404PageComponent } from './pages/error404-page/error404-page.component';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    Error404PageComponent
  ],
  imports: [
    MaterialModule
  ],
  exports: [
    Error404PageComponent
  ]
})
export class SharedModule { }
