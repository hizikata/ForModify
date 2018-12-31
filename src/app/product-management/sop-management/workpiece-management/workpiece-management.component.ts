import { Component, OnInit, Input } from '@angular/core';
import { HttpErrorResponse, HttpResponse, HttpRequest, HttpClient } from '@angular/common/http';
import { MsgHelper } from 'src/app/common-use/msg-helper';
// tslint:disable-next-line:max-line-length
import { CNCProgramModel, ValidationBeforeStartProgressDto, WorkpieceModel, AddProgramListDto, LoginUserDto, MouldModel, MachineModel } from 'src/app/data-models';
import { Validators, FormGroup, FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { OpResult } from 'src/app/common-use/op-result';
import { UploadFile, NzModalService, isTemplateRef } from 'ng-zorro-antd';
import { FormHelper } from 'src/app/common-use/form-helper';
import { CurrentUserDto } from 'src/app/home/login/current-user-dto';
import { ActivatedRoute } from '@angular/router';
import { MainDataOperationService } from '../../main-data-operation.service';
import { filter } from 'rxjs/operators';
import { Observable, Observer, Subscription } from 'rxjs';

@Component({
  selector: 'app-workpiece-management',
  templateUrl: './workpiece-management.component.html',
  styleUrls: ['./workpiece-management.component.css']
})
export class WorkpieceManagementComponent implements OnInit {

  selectedIndex = 0;
  /**用于父组件传入数据 */
  /**模具模型FormData */

  @Input()
  mouldModelDto: MouldModel = null;


  /**用户列表 */
  userDataSet: LoginUserDto[] = [];
  /**机器列表 */
  machineDataSet: MachineModel[] = [];

  workPieceForm: FormGroup;
  // /**模具模型FormData */
  // workPieceDto: MouldModel = null;

  /**工件模型列表 */
  programInfoDataSet: WorkpieceModel[] = [];
  isProgramInfoDataSetLoading = false;

  /**二维码显示内容 */
  qrcodeContent: string = null;

  /**跟二维码显示在一起 */
  workpieceFromFbDataSet: WorkpieceModel[] = [];



  /**是否显示Pdf */
  isShowPdfModal = false;
  pdfSrc: string = null;
  /**是否显示添加程序单界面 */
  isShowOperateProgramlistModal = false;






  uploadData: object;
  loadFileName: string;

  // 添加程序单
  addProgramListForm: FormGroup;
  addProgramListFormData: AddProgramListDto;

  cncProgramUploadDataSet: CNCProgramModel[] = [];
  cncProgramUploadDataLoading = false;

  // 编辑程序单
  // isShowEditWorkpieceModal = false;
  // editWorkpieceFormData: WorkpieceModel = null;
  // editWorkpieceForm: FormGroup = null;



  // ------TAB2-------
  cncProgramDataSet: CNCProgramModel[] = [];
  /**传输到tab 2的workpiece模型 */
  workpieceTransmitDto: WorkpieceModel = null;
  // cncDataLoading = false;
  /**上传程序单后是否显示程序清单列表 */
  isShowProgramList = false;
  /**添加程序单是的最初工件编号，用于判定员工修改后的工件编号是否符合要求 */
  addWorkpieceId: string;

  constructor(private http: HttpClient,
    private fb: FormBuilder,
    private modalService: NzModalService,
    private dataOperate: MainDataOperationService,
    private _activatedRoute: ActivatedRoute,
  ) { }

  uploading = false;
  fileList: UploadFile[] = [];



  // 分配任务form 相关
  // isShowDistributeTaskModal = false;
  // distributeTaskFormData: WorkpieceModel = null;
  // distributeTaskForm: FormGroup;


  ngOnInit() {
    this.GetAllMachineList();
    this.GetUserList();

    // this.mouldModelDto = this._activatedRoute.snapshot.queryParams['currentModel'];
    const dto = new MouldModel(null, null, null, null, null);
    // 获取上层路由传输过来的数据
    this._activatedRoute.queryParams.subscribe(params => {
      dto.MouldId = params.MouldId;
      dto.MouldName = params.MouldName;
      dto.State = params.State;
      dto.MouldType = params.MouldType;
      dto.PlanOverMachiningDate = params.PlanOverMachiningDate;
    });

    this.mouldModelDto = dto;
    this.createMouldModel(this.mouldModelDto);
    /**自动加载工件数据 */
    this.submitWorkPieceForm(null);

    this.dataOperate.GetWorkPiecesListFromFb(this.mouldModelDto.MouldId).subscribe(result => {
      if (result === null || result.length === 0) {
        // MsgHelper.ShowInfoModal(this.modalService, '工件列表查询无结果！');
        this.workpieceFromFbDataSet = [];
      } else if (result.length > 0) {
        this.workpieceFromFbDataSet = result;
      }
    }, err => {
      const msg = (err as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `获取工件信息时与远程服务器通信失败:${msg}`);
    });
  }


  /**根据模具编号加载workpiece列表 */
  createMouldModel(dto: MouldModel): void {
    this.workPieceForm = this.fb.group({
      MouldId: [dto.MouldId],
    });
    this.workPieceForm.disable();
  }

  /**
   * 初始化工件模型对象
   */
  initWorkpieceDto(): WorkpieceModel {
    // tslint:disable-next-line:max-line-length
    return new WorkpieceModel(null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, new Date());
  }

  /**
   * 加载工件模型列表
   * @param $event 提交事件
   */
  submitWorkPieceForm($event) {
    if ($event !== null) {
      $event.preventDefault();
    }
    this.dataOperate.GetWorkpieceList(this.mouldModelDto.MouldId).subscribe(result => {
      if (result.length === 0) {
        MsgHelper.ShowInfoModal(this.modalService, '查询无数据！');

      } else {
        this.programInfoDataSet = result;
      }
    },
      error => {
        const msg = (error as HttpErrorResponse).message;
        MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
      });
  }

  /**
   * 打开添加程序单窗口
   */
  OnImportProgramList(dto: WorkpieceModel) {

    if (!this.validateLoginUser()) {
      MsgHelper.ShowErrorModal(this.modalService, '无权限进行此操作！');
      return;
    }
    this.checkQrcode(dto.WorkpieceId);
    // 添加程序单时将程序单列表设置为空，隐藏TAB2
    this.cncProgramDataSet = [];
    this.addWorkpieceId = dto.WorkpieceId;
    this.addProgramListFormData = new AddProgramListDto(this.addWorkpieceId, null, null);
    this.createAddProgramListForm(this.addProgramListFormData);
    this.isShowOperateProgramlistModal = true;
  }


  createAddProgramListForm(dto: AddProgramListDto) {
    this.addProgramListForm = this.fb.group({
      WorkpieceId: [dto.WorkpieceId, [Validators.required], [this.workpieceAsyncValidator]],
      // WorkpieceName: [dto.WorkpieceName, [Validators.required]],
      WorkpieceName: new FormControl({ value: dto.WorkpieceName, disabled: true }, Validators.required),
      MachiningProcess: [dto.MachiningProcess],
    });
  }

  workpieceAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    setTimeout(() => {
      const controlValue = ((control.value) as string).trim();
      if (controlValue.indexOf(this.addWorkpieceId) === -1) {
        observer.next({ error: true, format: true });
      } else if (this.programInfoDataSet.length !== 0) {
        const array = this.programInfoDataSet.filter(item => {
          return item.WorkpieceId.trim() === controlValue;
        });
        if (array.length > 0) {
          observer.next({ error: true, repetition: true });
        } else {
          observer.next(null);
        }
      } else {
        observer.next(null);
      }
      observer.complete();
    }, 500);
  })


  submitAddProgramList($event) {
    $event.prevetnDefault();
  }

  OnProgramOperation(dto: WorkpieceModel): void {
    if (dto.SopFileId !== null && dto.SopFileId.trim() !== '') {
      this.pdfSrc = this.dataOperate.GetSopFileUrl() + dto.SopFileId;
      console.log(this.pdfSrc);
    }
    this.isShowPdfModal = true;
  }

  /**
   * 分配任务
   */
  // distributeTask(dto: WorkpieceModel): void {
  //   if (!this.validateLoginUser()) {
  //     MsgHelper.ShowErrorModal(this.modalService, '您无权限操作该页面！');
  //     return;
  //   }
  //   this.distributeTaskFormData = dto;
  //   this.createDistributeTaskForm(this.distributeTaskFormData);
  //   this.isShowDistributeTaskModal = true;
  // }

  // createDistributeTaskForm(dto: WorkpieceModel): void {
  //   this.distributeTaskForm = this.fb.group({
  //     MachineId: [dto.MachineId, [Validators.required]],
  //     OpUser: [dto.OpUser, [Validators.required]],
  //   });
  // }

  // submitDistributeTaskForm($event): void {
  //   $event.preventDefault();
  //   FormHelper.YGSubmitForm(this.distributeTaskFormData, this.distributeTaskForm, dto => {
  //     this.dataOperate.EditWorkpiece(dto).subscribe(result => {
  //       if (result.Success) {
  //         MsgHelper.ShowSuccessModal(this.modalService, '任务分配成功！');
  //         this.isShowDistributeTaskModal = false;
  //       } else {
  //         MsgHelper.ShowErrorModal(this.modalService, `任务分配失败:${result.ErrorMessage}`);
  //       }
  //     }, err => {
  //       const msg = (err as HttpErrorResponse).message;
  //       MsgHelper.ShowErrorModal(this.modalService, `分配任务时与远程服务器通信失败:${msg}`);
  //     });
  //   });
  // }
  // resetDistributeTaskForm($event): void {
  //   this.isShowDistributeTaskModal = false;
  //   this.distributeTaskForm.reset();
  // }

  /**
 * 编辑程序单
 * @param item workpeice对象
 */
  // EditWorkpieceDto(item: WorkpieceModel) {
  //   if (!this.validateLoginUser()) {
  //     MsgHelper.ShowErrorModal(this.modalService, '无权限进行此操作！');
  //     return;
  //   }
  //   this.editWorkpieceFormData = item;
  //   this.createEditWorkpieceForm(this.editWorkpieceFormData);
  //   this.isShowEditWorkpieceModal = true;
  // }

  /**
   * 删除程序单（workpiece对象）
   * @param _id 程序单对应的Id
   */
  removeWorkpieceDto(_id: string): void {
    if (!this.validateLoginUser()) {
      MsgHelper.ShowErrorModal(this.modalService, '无权限进行此操作！');
      return;
    }
    MsgHelper.ShowDeleteConfirm(this.modalService, '数据删除后不可恢复！', () => {
      this.dataOperate.DeleteWorkpiece(_id).subscribe(result => {
        if (result.Success) {
          MsgHelper.ShowSuccessModal(this.modalService, '数据删除成功！');
          this.dataOperate.GetWorkpieceList(this.mouldModelDto.MouldId).subscribe(r => {
            if (r.length === 0) {
              this.programInfoDataSet = [];
            } else {
              this.programInfoDataSet = r;
            }
          },
            error => {
              const msg = (error as HttpErrorResponse).message;
              MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
            });
        } else {
          MsgHelper.ShowSuccessModal(this.modalService, '数据删除失败');
        }
      }, err => {
        const msg = (err as HttpErrorResponse).message;
        MsgHelper.ShowErrorModal(this.modalService, `与服务器通信失败!错误信息：${msg}`);
      });
    }, () => { });
  }

  // createEditWorkpieceForm(dto: WorkpieceModel) {
  //   this.editWorkpieceForm = this.fb.group({
  //     PlanOverMachiningDate: [dto.PlanOverMachiningDate, [Validators.required]],
  //     MachiningProcessId: [dto.MachiningProcessId, [Validators.required]],
  //   });
  // }

  // submitEditWorkForm = ($event, value) => {
  //   $event.preventDefault();
  //   FormHelper.YGSubmitForm(this.editWorkpieceFormData, this.editWorkpieceForm, dto => {
  //     this.dataOperate.EditWorkpiece(dto).subscribe(result => {
  //       if (result.Success) {
  //         MsgHelper.ShowSuccessModal(this.modalService, '计划完成时间修改成功！');
  //       } else {
  //         MsgHelper.ShowErrorModal(this.modalService, `计划完成时间修改失败:${result.ErrorMessage}`);
  //       }
  //     }, err => {
  //       const msg = (err as HttpErrorResponse).message;
  //       MsgHelper.ShowErrorModal(this.modalService, `提交工件信息时与远程服务器通信失败:${msg}`);
  //     });
  //   });
  // }

  // resetEditWorkForm($event): void {
  //   this.editWorkpieceForm.reset();
  //   this.isShowEditWorkpieceModal = false;
  // }

  OnCloseModal(): void {
    // 清空上传文件列表
    this.fileList = [];
    this.isShowOperateProgramlistModal = false;
    this.isShowProgramList = false;
  }

  checkQrcode(info: string): void {
    this.qrcodeContent = info;
  }


  beforeUpload = (file: UploadFile): boolean => {
    this.fileList.push(file);
    let fileName = file.name;
    fileName = fileName.substring(0, fileName.length - 4);
    const dto: AddProgramListDto = new AddProgramListDto(null, null, null);
    dto.WorkpieceId = this.addProgramListForm.value.WorkpieceId;
    dto.WorkpieceName = fileName;
    this.addProgramListFormData = dto;
    this.createAddProgramListForm(this.addProgramListFormData);
    return false;
  }

  handleUpload(): void {
    console.log();
    FormHelper.YGSubmitForm(this.addProgramListFormData, this.addProgramListForm, dto => {
      const formData = new FormData();
      // tslint:disable-next-line:no-any
      this.fileList.forEach((file: any) => {
        // file.filename = '你要的文件名字';
        // 填入工件编号 hello kitty
        formData.append(dto.WorkpieceId, file);
      });
      this.uploading = true;
      // You can use any AJAX library you like
      // FIXME:待封装到方法类中
      const req = new HttpRequest('POST', 'http://192.168.86.101:8080/api/SopManage/UploadSop', formData, {
        // reportProgress: true
      });
      this.http
        .request(req)
        .pipe(filter(e => e instanceof HttpResponse))
        .subscribe(
          (event: HttpResponse<OpResult>) => {
            this.uploading = false;
            // httpRequest返回的信息在此；
            console.log(event);
            // MsgHelper.ShowSuccessModal(this.modalService, '文件上传成功！');
            // 展示返回的程序清单
            this.isShowProgramList = true;
            this.cncProgramUploadDataSet = (event.body.Data) as CNCProgramModel[];
            // 提交工件信息
            const workPieceDto: WorkpieceModel = this.initWorkpieceDto();
            workPieceDto._id = this.cncProgramUploadDataSet[0]._id;
            // 提交模具相关信息
            workPieceDto.MouldId = this.mouldModelDto.MouldId;
            workPieceDto.MouldName = this.mouldModelDto.MouldName;
            workPieceDto.MouldType = this.mouldModelDto.MouldType;
            workPieceDto.MouldPlangDate = this.mouldModelDto.PlanOverMachiningDate;
            workPieceDto.WorkpieceId = this.addProgramListFormData.WorkpieceId;
            workPieceDto.WorkpieceName = this.addProgramListFormData.WorkpieceName;
            workPieceDto.State = this.mouldModelDto.State;
            // 交期设置为null
            workPieceDto.PlanOverMachiningDate = null;
            workPieceDto.OverMachiningDate = null;
            workPieceDto.SopFileId = event.body.Code;
            console.log(JSON.stringify(workPieceDto));
            this.dataOperate.UploadWorkpiece(workPieceDto).subscribe(result => {
              if (result.Success) {
                MsgHelper.ShowSuccessModal(this.modalService, '工件信息提交成功！');
                this.dataOperate.GetWorkpieceList(this.mouldModelDto.MouldId).subscribe(r => {
                  this.programInfoDataSet = r;
                });
              } else {
                MsgHelper.ShowErrorModal(this.modalService, `工件信息提交失败！${result.ErrorMessage}`);
              }
            }, error => {
              const msg = (error as HttpErrorResponse).message;
              MsgHelper.ShowErrorModal(this.modalService, `提交工件信息时与远程服务器通信失败:${msg}`);
            });
          },
          err => {
            this.uploading = false;
            console.log(err);
            const msg = (err as HttpErrorResponse).message;
            MsgHelper.ShowErrorModal(this.modalService, `上传失败：${msg}`);
          }
        );
      // this.dataOperate.UploadSop(formData).subscribe(result => {
      //   console.log(result);
      // });
    });
  }

  resetUploadForm(): void {
    /**上传成功后初始化 */
    this.addProgramListFormData = new AddProgramListDto(this.addWorkpieceId, null, null);
    this.createAddProgramListForm(this.addProgramListFormData);
    this.fileList = [];
    this.cncProgramUploadDataSet = [];
  }

  loadStateChange($event): void {
    console.log($event);
  }

  /**
   * 关闭第二标签页
   */
  closeTab(): void {
    this.workpieceTransmitDto = null;
    this.cncProgramDataSet = [];
    this.selectedIndex = 0;
  }

  handlePdfOk(): void {
    this.isShowPdfModal = false;
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
  GetAllMachineList(): void {
    this.dataOperate.GetAllMachineList().subscribe(result => {
      if (result !== null && result.length !== 0) {
        this.machineDataSet = result;
      }
    }, err => {
      const msg = (err as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
    });
  }

  validateLoginUser(): boolean {
    if (CurrentUserDto.CurrentUser.UserName !== '管理员') {
      return false;
    } else {
      return true;
    }
  }

  openProgramList(dto: WorkpieceModel): void {
    console.log(dto);
    this.workpieceTransmitDto = dto;

    // 如何根据程序单号获取程序单列表
    // this.dataOperate.GetCNCprogramList(dto.WorkpieceId).subscribe(result => {
    //   if (result.length === 0) {
    //     MsgHelper.ShowInfoModal(this.modalService, '查询无结果！');
    //     this.cncProgramDataSet = [];
    //   } else {
    //     this.cncProgramDataSet = result;
    //   }
    // }, err => {
    //   const msg = (err as HttpErrorResponse).message;
    //   MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信失败:${msg}`);
    // });
    this.selectedIndex = 1;
  }

}
