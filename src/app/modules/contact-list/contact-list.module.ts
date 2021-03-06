import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactListPage } from './contact-list.page';

const routes: Routes = [
  {
    path: '',
    component: ContactListPage,
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [ContactListPage],
  exports: [ContactListPage]
})
export class ContactListPageModule {}
