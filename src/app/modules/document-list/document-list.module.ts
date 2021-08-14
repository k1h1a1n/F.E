import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DocumentListPage } from './document-list.page';
import { PopoverComponent } from './popover/popover.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  entryComponents: [PopoverComponent],
  declarations: [DocumentListPage,PopoverComponent]
})
export class DocumentListPageModule {}
