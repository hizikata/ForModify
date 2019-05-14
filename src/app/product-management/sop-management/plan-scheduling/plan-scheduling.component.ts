import { ProcessModel } from './../../../data-models';
import { Component, OnInit } from '@angular/core';
import { WorkpieceModel, WorkpieceQueryDto, LoginUserDto, MachineModel } from 'src/app/data-models';
import { NzModalService } from 'ng-zorro-antd';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { MainDataOperationService } from '../../main-data-operation.service';
import { FormHelper } from 'src/app/common-use/form-helper';
import { MsgHelper } from 'src/app/common-use/msg-helper';
import { isNull } from 'util';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrentUserDto } from 'src/app/home/login/current-user-dto';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-plan-scheduling',
  templateUrl: './plan-scheduling.component.html',
  styleUrls: ['./plan-scheduling.component.css']
})
export class PlanSchedulingComponent implements OnInit {

  workpieceQueryForm: FormGroup;
  workpieceQueryFormData: WorkpieceQueryDto = null;

  workpieceDataSet: WorkpieceModel[] = [];
  workpieceDataLoading = false;
  sortName: string;
  sortValue: string;

  // 分配任务form 计划员相关
  isShowDistributeTaskModal = false;
  distributeTaskFormData: WorkpieceModel = null;
  distributeTaskForm: FormGroup;


  // 编辑程序单 CNC班长相关
  isShowEditWorkpieceModal = false;
  editWorkpieceFormData: WorkpieceModel = null;
  editWorkpieceForm: FormGroup = null;
  userDataSet: LoginUserDto[] = [];
  machineDataSet: MachineModel[] = [];

  /**SOP文件地址 */
  pdfSrc: string;
  isShowPdfModal: boolean;
  processListDataSet: ProcessModel[] = [];

  // ------------TAB相关----------------------
  workpieceTransmitDto: WorkpieceModel = null;
  selectedIndex = 0;

  constructor(
    public modalService: NzModalService,
    public fb: FormBuilder,
    public dataOperate: MainDataOperationService,
  ) { }

  ngOnInit() {
    this.workpieceDataLoading = true;
    this.GetUserList();
    this.getAllMachineList();
    this.getProcessList();

    this.workpieceQueryFormData = this.initWorkpieceQueryDto();
    this.createWorkpieceQueryDto(this.workpieceQueryFormData);
    this.getNotOverWorkpieceList();
  }

  getNotOverWorkpieceList(): void {
    this.dataOperate.GetNotOverWorkpieceList().subscribe(result => {
      if (result !== null && result.length !== 0) {
        result.forEach(item => {
          const date = new Date(item.PlanOverMachiningDate);
          item.PlanOverMachiningDate = date;
          if (item.MachineId === null) {
            item.MachineId = '';
          }
          if (item.OpUser === null) {
            item.OpUser = '';
          }
          if (item.State === null) {
            item.State = '';
          }
        });
        this.workpieceDataSet = result;
        this.workpieceDataLoading = false;
      } else {
        MsgHelper.ShowErrorModal(this.modalService, '获取工件列表错误，请检查后重试！');
      }
    });
  }

  initWorkpieceQueryDto(): WorkpieceQueryDto {
    return new WorkpieceQueryDto(null, null, null, null, null);
  }

  createWorkpieceQueryDto(dto: WorkpieceQueryDto): void {
    this.workpieceQueryForm = this.fb.group({
      WorkpieceId: [dto.WorkpieceId],
      MouldName: [dto.MouldName],
      MouldType: [dto.MouldType],
      State: [dto.State],
      MachineId: [dto.MachineId],
    });
  }

  submitWorkpieceQueryForm = ($event) => {
    $event.preventDefault();
    this.workpieceDataLoading = true;
    FormHelper.YGSubmitForm(this.workpieceQueryFormData, this.workpieceQueryForm, dto => {
      console.log(dto);
      this.dataOperate.GetNotOverWorkpieceList().subscribe(result => {
        if (result.length === 0) {
          MsgHelper.ShowInfoModal(this.modalService, '查询无数据！');
          this.workpieceDataSet = [];
          return;
        } else {
          this.workpieceDataSet = result;
          let dataArray = this.workpieceDataSet;
          this.workpieceDataLoading = true;
          /**程序单编号筛选 */
          if (!isNull(dto.WorkpieceId) && dto.WorkpieceId.trim() !== '') {
            dataArray = dataArray.filter(item => {
              return item.WorkpieceId.indexOf(dto.WorkpieceId) !== -1;
            });
          }
          /**模具名称筛选 */
          if (!isNull(dto.MouldName) && dto.MouldName.trim() !== '') {
            dataArray = dataArray.filter(item => {
              return item.MouldName.indexOf(dto.MouldName) !== -1;
            });
          }
          // 模具类型筛选
          if (!isNull(dto.MouldType) && dto.MouldType.trim() !== '') {
            dataArray = dataArray.filter(item => {
              return item.MouldType.indexOf(dto.MouldType) !== -1;
            });
          }
          // 机台筛选
          if (!isNull(dto.MachineId) && dto.MachineId.trim() !== '') {
            dataArray = dataArray.filter(item => {
              if (item.MachineId) {
                // return item.MachineId.indexOf(dto.MachineId) !== -1;
                return item.MachineId.trim() === dto.MachineId.trim();
              }
            });
          }
          // 当前状态筛选
          if (!isNull(dto.State) && dto.State.trim() !== '') {
            dataArray = dataArray.filter(item => {
              if (item.State !== null) {
                return (item.State !== null && item.State.indexOf(dto.State) !== -1);
              }
            });
          }
          this.workpieceDataSet = dataArray;
        }
        this.workpieceDataLoading = false;
      }, error => {
        const msg = (error as HttpErrorResponse).message;
        MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通讯失败:${msg}`);
      });
    });
  }

  resetWorkpieceQueryForm($event): void {
    $event.preventDefault();
    this.workpieceQueryFormData = this.initWorkpieceQueryDto();
    this.workpieceQueryForm.reset(this.initWorkpieceQueryDto());
    this.workpieceDataLoading = true;
    this.getNotOverWorkpieceList();
  }

  /**
  * 表格排序
  * @param $event 排序触发事件
  */
  sort(sort: { key: string, value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    this.search();
  }

  search(): void {
    const data: WorkpieceModel[] = [];
    Object.assign(data, this.workpieceDataSet);
    if (this.sortName && this.sortValue) {
      /**使用sort引用发生了变化？ */
      // tslint:disable-next-line:max-line-length
      this.workpieceDataSet = data.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) :
        (b[this.sortName] > a[this.sortName] ? 1 : -1));
      // console.log(this.workpieceDataSet);
    } else {
      this.workpieceDataSet = data;
    }
  }



  //  CNC班长操作(指定人员和机台)

  /**
   * 分配任务
   */
  distributeTask(dto: WorkpieceModel): void {
    if (!this.validateLoginUser()) {
      MsgHelper.ShowErrorModal(this.modalService, '您无权限操作该页面！');
      return;
    }
    this.distributeTaskFormData = dto;
    this.createDistributeTaskForm(this.distributeTaskFormData);
    this.isShowDistributeTaskModal = true;
  }

  createDistributeTaskForm(dto: WorkpieceModel): void {
    this.distributeTaskForm = this.fb.group({
      MachineId: [dto.MachineId, [Validators.required]],
      OpUser: [dto.OpUser, [Validators.required]],
    });
  }

  submitDistributeTaskForm($event): void {
    $event.preventDefault();
    FormHelper.YGSubmitForm(this.distributeTaskFormData, this.distributeTaskForm, dto => {
      this.dataOperate.EditWorkpiece(dto).subscribe(result => {
        if (result.Success) {
          MsgHelper.ShowSuccessModal(this.modalService, '任务分配成功！');
          this.isShowDistributeTaskModal = false;
        } else {
          MsgHelper.ShowErrorModal(this.modalService, `任务分配失败:${result.ErrorMessage}`);
        }
      }, err => {
        const msg = (err as HttpErrorResponse).message;
        MsgHelper.ShowErrorModal(this.modalService, `分配任务时与远程服务器通信失败:${msg}`);
      });
    });
  }
  resetDistributeTaskForm($event): void {
    this.isShowDistributeTaskModal = false;
    this.distributeTaskForm.reset();
  }

  /**
   * 查看SOP
   * @param dto 工件信息
   */
  OnProgramOperation(dto: WorkpieceModel): void {
    if (dto.SopFileId !== null && dto.SopFileId.trim() !== '') {
      this.pdfSrc = this.dataOperate.GetSopFileUrl() + dto.SopFileId;
      console.log(this.pdfSrc);
    }
    this.isShowPdfModal = true;
  }

  /**
   * 关闭查看SOP界面
   */
  handlePdfOk(): void {
    this.isShowPdfModal = false;
  }




  // 计划员操作(指定交期和工序编号)
  editWorkpieceDto(item: WorkpieceModel): void {
    if (!this.validateLoginUser()) {
      MsgHelper.ShowErrorModal(this.modalService, '无权限进行此操作！');
      return;
    }
    this.editWorkpieceFormData = item;
    this.createEditWorkpieceForm(this.editWorkpieceFormData);
    this.isShowEditWorkpieceModal = true;
  }

  createEditWorkpieceForm(dto: WorkpieceModel) {
    this.editWorkpieceForm = this.fb.group({
      PlanOverMachiningDate: [dto.PlanOverMachiningDate, [Validators.required]],
      // 工序编号需要验证是否存在
      MachiningProcessId: [dto.MachiningProcessId, [Validators.required]],
    });
  }

  /**验证工序编号是否存在 */
  // machineProcessIdAsynValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
  //   setTimeout(() => {
  //     const code = ((control.value) as string).trim();
  //     this.dataOperate.GetProcessByCode(code).subscribe(result => {
  //       if (result !== null && result !== '') {
  //         observer.next(null);
  //       } else {
  //         observer.next({ error: true, nullReference: true });
  //       }
  //       observer.complete();
  //     });
  //   }, 1000);
  // })


  submitEditWorkForm = ($event, value) => {
    $event.preventDefault();
    FormHelper.YGSubmitForm(this.editWorkpieceFormData, this.editWorkpieceForm, dto => {
      this.dataOperate.EditWorkpiece(dto).subscribe(result => {
        if (result.Success) {
          MsgHelper.ShowSuccessModal(this.modalService, '计划信息修改成功！');
          this.isShowEditWorkpieceModal = false;
        } else {
          MsgHelper.ShowErrorModal(this.modalService, `计划信息修改失败:${result.ErrorMessage}`);
        }
      }, err => {
        const msg = (err as HttpErrorResponse).message;
        MsgHelper.ShowErrorModal(this.modalService, `提交工件信息时与远程服务器通信失败:${msg}`);
      });
    });
  }

  resetEditWorkForm($event): void {
    this.editWorkpieceForm.reset();
    this.isShowEditWorkpieceModal = false;
  }



  /**验证用户 */
  validateLoginUser(): boolean {
    if (CurrentUserDto.CurrentUser.UserName !== '管理员') {
      return false;
    } else {
      return true;
    }
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

  /**
   * 获取机器列表
   */
  getAllMachineList(): void {
    this.dataOperate.GetAllMachineList().subscribe(result => {
      if (result !== null && result.length !== 0) {
        // console.log(result);
        this.machineDataSet = result;
      }
    }, err => {
      const msg = (err as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
    });
  }

  getProcessList(): void {
    this.dataOperate.GetProcessList().subscribe(result => {
      if (result !== null && result.length !== 0) {
        // console.log(result);
        this.processListDataSet = result;
      }
    }, err => {
      const msg = (err as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
    });
  }

  openCncTab(item: WorkpieceModel): void {
    this.workpieceTransmitDto = item;
    this.selectedIndex = 1;
  }

  closeTab(): void {
    this.selectedIndex = 0;
    this.workpieceTransmitDto = null;
  }
}
