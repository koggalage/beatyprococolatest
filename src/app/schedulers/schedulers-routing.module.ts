import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SchedulerListComponent } from './scheduler-list/scheduler-list.component';


const routes: Routes = [{
  path: '',
  component: SchedulerListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class SchedulersRoutingModule { }
