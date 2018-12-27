import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachineUseRatioComponent } from '../product-management/visual-management/machine-use-ratio/machine-use-ratio.component';
import { LargeScreenDisplayComponent } from '../product-management/visual-management/large-screen-display/large-screen-display.component';
import { MouldManagementComponent } from '../product-management/sop-management/mould-management/mould-management.component';
import { WorkpieceManagementComponent } from '../product-management/sop-management/workpiece-management/workpiece-management.component';
// tslint:disable-next-line:max-line-length
import { CncProgramManagementComponent } from '../product-management/sop-management/cnc-program-management/cnc-program-management.component';
import { PlanSchedulingComponent } from '../product-management/sop-management/plan-scheduling/plan-scheduling.component';

export const homeRoutes: Routes = [
  { path: 'MachineUseRatio', component: MachineUseRatioComponent },
  { path: 'MouldManagement', component: MouldManagementComponent },
  { path: 'WorkpieceManagement', component: WorkpieceManagementComponent },
  { path: 'CncProgramManagement', component: CncProgramManagementComponent },
  { path: 'LargeScreenDisplay', component: LargeScreenDisplayComponent },
  { path: 'PlanScheduling', component: PlanSchedulingComponent },
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
