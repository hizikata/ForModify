import { CNCProgramModel, ValidationBeforeStartProgressDto, WorkpieceModel, MouldModel, LoginUserDto } from './../../../data-models';
import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MainDataOperationService } from '../../main-data-operation.service';
import { MsgHelper } from 'src/app/common-use/msg-helper';
import { NzModalService } from 'ng-zorro-antd';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cnc-program-management',
  templateUrl: './cnc-program-management.component.html',
  styleUrls: ['./cnc-program-management.component.css']
})
export class CncProgramManagementComponent implements OnInit, OnChanges {

  @Input()
  mouldModelDto: MouldModel = null;

  /**table对应的workpieceModelItem */
  @Input()
  operatingWorkpieceDto: WorkpieceModel;

  cncProgramDataSet: CNCProgramModel[] = [];

  userDataSet: LoginUserDto[] = [];


  cncDataLoading = false;

  isShowStateOperateModal = false;
  /**备刀操作的cnc模型 */
  cNCProgramMmdel: CNCProgramModel = null;

  /**开始加工前进行四步签名验证 */
  isShowValidateBeforeStartProgress = false;
  validateBeforeStartProgressForm: FormGroup;
  validateBeforeStartProgressFormData: ValidationBeforeStartProgressDto = null;



  constructor(
    private dataOperate: MainDataOperationService,
    private modalService: NzModalService,
    private fb: FormBuilder,
  ) { }

  /**
   * 监听operatingWorkpieceDto值发生变化时刷新页面
   * @param changes 变化的值
   */
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    this.cncDataLoading = true;
    this.dataOperate.GetCNCprogramList(this.operatingWorkpieceDto.WorkpieceId).subscribe(result => {
      if (result.length === 0) {
        MsgHelper.ShowInfoModal(this.modalService, '查询无结果！');
        this.cncProgramDataSet = [];
      } else {
        this.cncProgramDataSet = result;
      }
      this.cncDataLoading = false;
    }, err => {
      const msg = (err as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
      this.cncDataLoading = false;
    });
  }

  ngOnInit() {

    this.cncDataLoading = true;
    this.cNCProgramMmdel = this.initCncProgramMmdel();
    this.validateBeforeStartProgressFormData = new ValidationBeforeStartProgressDto(null, null, null, null);
    this.createValidateBeforeStartProgressForm(this.validateBeforeStartProgressFormData);

    // 如何根据程序单号获取程序单列表
    this.dataOperate.GetCNCprogramList(this.operatingWorkpieceDto.WorkpieceId).subscribe(result => {
      if (result.length === 0) {
        MsgHelper.ShowInfoModal(this.modalService, '查询无结果！');
        this.cncProgramDataSet = [];
      } else {
        this.cncProgramDataSet = result;
      }
      this.cncDataLoading = false;
    }, err => {
      const msg = (err as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
      this.cncDataLoading = false;
    });
  }

  initCncProgramMmdel(): CNCProgramModel {
    return new CNCProgramModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null);
  }

  /**
 * 设置cnc程序状态
 * @param item cnc 程序对象
 */
  stateOperate(item: CNCProgramModel): void {
    this.isShowStateOperateModal = true;
    this.cNCProgramMmdel = item;
    this.GetUserList();
  }

  handleStartOperateCancel() {
    this.isShowStateOperateModal = false;
  }

  swordComplete(): void {
    this.changeCncProgramState(this.cNCProgramMmdel, '备刀完成');
  }

  /**
   * 开始加工
   */
  startProgress(): void {
    // 开始加工前添加四步签名验证
    if (this.validateBeforeStartProgressForm.valid) {
      // tslint:disable-next-line:max-line-length
      this.operatingWorkpieceDto.OneOperationUser = ((this.validateBeforeStartProgressForm.value.StandardValidation) as string) + ',' + (this.validateBeforeStartProgressForm.value.Calibration) as string
        // tslint:disable-next-line:max-line-length
        + ', ' + (this.validateBeforeStartProgressForm.value.CoordinateAxis) as string + ', ' + (this.validateBeforeStartProgressForm.value.CheckOnceMore) as string;
      // 将验证信息写入数据库workpiecemodel
      this.dataOperate.EditWorkpiece(this.operatingWorkpieceDto).subscribe(result => {
        if (result.Success) {
          this.changeCncProgramState(this.cNCProgramMmdel, '开始加工');
        } else {
          MsgHelper.ShowErrorModal(this.modalService, '开始加工前信息写入失败');
        }
      }, err => {
        const msg = (err as HttpErrorResponse).message;
        MsgHelper.ShowErrorModal(this.modalService, `写入加工前验证信息失败！`);
      });
    } else {
      MsgHelper.ShowErrorModal(this.modalService, '开始加工前需验证！');
    }
  }

  createValidateBeforeStartProgressForm(dto: ValidationBeforeStartProgressDto): void {
    this.validateBeforeStartProgressForm = this.fb.group({
      StandardValidation: [dto.StandardValidation, [Validators.required]],
      Calibration: [dto.Calibration, [Validators.required]],
      CoordinateAxis: [dto.CoordinateAxis, [Validators.required]],
      CheckOnceMore: [dto.CheckOnceMore, [Validators.required]],
    });
  }

  resetValidateBeforeStartProgressForm(): void {
    this.validateBeforeStartProgressForm.reset();
    this.validateBeforeStartProgressFormData = null;
  }

  finishProgresss(): void {
    this.changeCncProgramState(this.cNCProgramMmdel, '加工完成');
  }

  returnProgresss(): void {
    this.changeCncProgramState(this.cNCProgramMmdel, '已还刀');
  }

  clearProgresss(): void {
    this.changeCncProgramState(this.cNCProgramMmdel, '');
  }

  changeCncProgramState(dto: CNCProgramModel, stateString: string) {
    const oldState = dto.State;
    dto.State = stateString;
    this.dataOperate.EditCncProgram(dto).subscribe(result => {
      if (result.Success) {
        MsgHelper.ShowSuccessModal(this.modalService, '状态修改成功！');
      } else {
        MsgHelper.ShowErrorModal(this.modalService, `状态修改失败:${result.ErrorMessage}`);
        dto.State = oldState;
      }
      this.isShowStateOperateModal = false;
    }, err => {
      const msg = (err as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
    });
  }

  openProgramList(dto: WorkpieceModel): void {
    console.log(dto);
    this.operatingWorkpieceDto = dto;
  }

  /**
 * 获取用户列表
 */
  GetUserList(): void {
    this.dataOperate.GetUserList().subscribe(result => {
      if (result !== null && result.length !== 0) {
        this.userDataSet = result;
      }
    }, err => {
      const msg = (err as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
    });
  }

}
