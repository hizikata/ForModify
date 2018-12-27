import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainMenuComponent } from './home/main/main-menu/main-menu.component';
import { LargeScreenDisplayComponent } from './product-management/visual-management/large-screen-display/large-screen-display.component';
import { homeRoutes } from './home/home-routing.module';


const routes: Routes = [
  { path: 'MainMenu', component: MainMenuComponent, children: homeRoutes },
  { path: 'LargeScreenDisplay', component: LargeScreenDisplayComponent },
  { path: '', redirectTo: '/LargeScreenDisplay', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
