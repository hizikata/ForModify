import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductManagementRoutingModule } from './product-management-routing.module';
import { LargeScreenDisplayComponent } from './visual-management/large-screen-display/large-screen-display.component';
import { MouldManagementComponent } from './sop-management/mould-management/mould-management.component';
import { WorkpieceManagementComponent } from './sop-management/workpiece-management/workpiece-management.component';
import { CncProgramManagementComponent } from './sop-management/cnc-program-management/cnc-program-management.component';
import { MachineUseRatioComponent } from './visual-management/machine-use-ratio/machine-use-ratio.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { NgxEchartsModule } from 'ngx-echarts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QRCodeModule } from 'angular2-qrcode';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PlanSchedulingComponent } from './sop-management/plan-scheduling/plan-scheduling.component';

@NgModule({
  declarations: [
    LargeScreenDisplayComponent,
    MouldManagementComponent,
    WorkpieceManagementComponent,
    CncProgramManagementComponent,
    MachineUseRatioComponent,
    PlanSchedulingComponent,
  ],
  imports: [
    CommonModule,
    ProductManagementRoutingModule,
    NgZorroAntdModule,
    NgxEchartsModule,
    ReactiveFormsModule,
    FormsModule,
    PdfViewerModule,
    QRCodeModule,
    InfiniteScrollModule,
  ]
})
export class ProductManagementModule { }
