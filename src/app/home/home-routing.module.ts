import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachineUseRatioComponent } from '../product-management/visual-management/machine-use-ratio/machine-use-ratio.component';
import { LargeScreenDisplayComponent } from '../product-management/visual-management/large-screen-display/large-screen-display.component';
import { MouldManagementComponent } from '../product-management/sop-management/mould-management/mould-management.component';
import { WorkpieceManagementComponent } from '../product-management/sop-management/workpiece-management/workpiece-management.component';
// tslint:disable-next-line:max-line-length
import { CncProgramManagementComponent } from '../product-management/sop-management/cnc-program-management/cnc-program-management.component';
import { PlanSchedulingComponent } from '../product-management/sop-management/plan-scheduling/plan-scheduling.component';
// tslint:disable-next-line:max-line-length
import { StaffEfficiencyDisplayComponent } from '../product-management/visual-management/staff-efficiency-display/staff-efficiency-display.component';
// tslint:disable-next-line:max-line-length
import { EquipmentMalfunctionBoardComponent } from '../product-management/visual-management/equipment-malfunction-board/equipment-malfunction-board.component';
// tslint:disable-next-line:max-line-length
import { EquipmentTerminalBoardComponent } from '../product-management/visual-management/equipment-terminal-board/equipment-terminal-board.component';

export const homeRoutes: Routes = [
  { path: 'MachineUseRatio', component: MachineUseRatioComponent },
  { path: 'MouldManagement', component: MouldManagementComponent },
  { path: 'WorkpieceManagement', component: WorkpieceManagementComponent },
  { path: 'CncProgramManagement', component: CncProgramManagementComponent },
  // 大屏展示
  { path: 'LargeScreenDisplay', component: LargeScreenDisplayComponent },
  // 计划排程
  { path: 'PlanScheduling', component: PlanSchedulingComponent },
  // 机台利用率看板
  { path: 'MachineUseRadio', component: MachineUseRatioComponent },
  // 设备终端看板
  { path: 'EquipmentTerminalBoard', component: EquipmentTerminalBoardComponent },
  // 设备故障看板
  { path: 'EquipmentMalfunctionBoard', component: EquipmentMalfunctionBoardComponent },
  // 人员效率看板组件
  { path: 'StaffEfficiency', component: StaffEfficiencyDisplayComponent }
];

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
