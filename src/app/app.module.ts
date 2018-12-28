import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData, LocationStrategy, HashLocationStrategy, PathLocationStrategy, APP_BASE_HREF } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { HomeModule } from './home/home.module';
import { ProductManagementModule } from './product-management/product-management.module';
import { CommonUseModule } from './common-use/common-use.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LargeScreenDisplayComponent } from './product-management/visual-management/large-screen-display/large-screen-display.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    // LargeScreenDisplayComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
    HomeModule,
    ProductManagementModule,
    CommonUseModule,
  ],

  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    // 设置后，访问angular站点，会自动在根节点后面加一个#锚点。再次刷新便不会报404错误了。
    { provide: LocationStrategy, useClass: HashLocationStrategy, useValue: zh_CN },
    // { provide: LocationStrategy, useClass: PathLocationStrategy },
    //  { provide: APP_BASE_HREF, useValue: '/' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
