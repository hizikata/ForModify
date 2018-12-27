import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiUrlsService } from './api-urls.service';
import { FormHelperService } from './form-helper.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  /**在该模块中声名通用组件 */
  providers: [ApiUrlsService, FormHelperService],
})
export class CommonUseModule { }
