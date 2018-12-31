import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrlsService } from '../common-use/api-urls.service';
// tslint:disable-next-line:max-line-length
import { EquipmentInfoDto, MouldModel, WorkpieceModel, CNCProgramModel, LoginUserDto, MachineModel, ProcessModel, MachineOeeModel } from '../data-models';
import { OpResult } from '../common-use/op-result';

@Injectable({
  providedIn: 'root'
})
export class MainDataOperationService {

  constructor(
    private apiUrl: ApiUrlsService,
  ) { }

  /**
   * 获取设备状态信息
   */
  public GetMachineInfos(): Observable<EquipmentInfoDto[]> {
    return this.apiUrl.GetPp('machines');
  }

  /**
   * 获取模具加工计划（总目录）
   */
  public GetMachiningMouldPlanList(): Observable<MouldModel[]> {
    return this.apiUrl.GetPp('SopManage/GetMachiningMouldPlanList');
  }

  /**
   * 获取程序单列表
   * @param dto 模具编号
   */
  public GetWorkpieceList(dto: string): Observable<WorkpieceModel[]> {
    return this.apiUrl.GetPp('SopManage/GetWorkpieceList', { params: { 'mouldId': dto } });
  }

  /**
   * 获取未完成的程序单列表
   */
  public GetNotOverWorkpieceList(): Observable<WorkpieceModel[]> {
    return this.apiUrl.GetPp('SopManage/GetNotOverWorkpieceList');
  }

  /**
   * 提交工件信息
   */
  public UploadWorkpiece(dto: WorkpieceModel): Observable<OpResult> {
    return this.apiUrl.PostPp('SopManage/UploadWorkpiece', dto);
  }

  /**
   * 获取工件信息
   * @param workpieceId 工件编号
   */
  public GetWorkpiece(workpieceId: string): Observable<WorkpieceModel> {
    return this.apiUrl.GetPp('SopManage/GetWorkpiece', { params: { 'workpieceId': workpieceId } });
  }

  /**
   * 修改工件信息
   * @param dto 工件模型
   */
  public EditWorkpiece(dto: WorkpieceModel): Observable<OpResult> {
    return this.apiUrl.PostPp('SopManage/EditWorkpiece', dto);
  }

  /**
   * 根据_id删除工件信息
   * @param _id 工件对象_id
   */
  public DeleteWorkpiece(_id: string): Observable<OpResult> {
    return this.apiUrl.GetPp('SopManage/DeleteWorkpiece', { params: { '_id': _id } });
  }


  /**
   * 修改CNC程序单信息
   * @param dto CNC程序模型
   */
  public EditCncProgram(dto: CNCProgramModel): Observable<OpResult> {
    return this.apiUrl.PostPp('SopManage/EditCncProgram', dto);
  }

  /**
   * 依据工艺编号获取工艺名称 PS：限定在CNC范围之内
   * @param code 工艺编号
   */
  public GetProcessByCode(code: string): Observable<string> {
    return this.apiUrl.GetPp('SopManage/GetProcessByCode', { params: { 'code': code } });
  }

  /**
   * 获取工艺列表 限定在CNC范围内
   */
  public GetProcessList(): Observable<ProcessModel[]> {
    return this.apiUrl.GetPp('SopManage/GetProcessList');
  }

  /**
   * 上传SOP
   * @param dto sop文件数据
   */
  public UploadSop(dto: FormData): Observable<OpResult> {
    return this.apiUrl.PostPp('SopManage/ UploadSop', dto);
  }


  /**
   * 获取SOP
   * @param code pdf文件对应的ObjectId
   */
  public GetSopFile(code: string): Observable<any> {
    return this.apiUrl.GetPp('SopManage/GetSopFile', { params: { 'objid': code } });
  }

  /**
   * 获取sop文件的url
   */
  public GetSopFileUrl(): string {
    return 'http://192.168.86.101:8080/api/SopManage/GetSopFile?objid=';
  }

  /**
   * 根据工件编号获取cnc程序列表
   * @param workpieceId 工件编号
   */
  public GetCNCprogramList(workpieceId: string): Observable<CNCProgramModel[]> {
    return this.apiUrl.GetPp('SopManage/GetCNCprogramList', { params: { 'workpieceId': workpieceId } });
  }


  /**
   * 根据模具编号获取工件列表
   * @param mouldId 模具编号
   */
  public GetWorkPiecesListFromFb(mouldId: string): Observable<WorkpieceModel[]> {
    return this.apiUrl.GetPp('SopManage/GetWorkPiecesListFromFb', { params: { 'mouldId': mouldId } });
  }

  /**
   * 获取用户列表
   */
  public GetUserList(): Observable<LoginUserDto[]> {
    return this.apiUrl.GetPp('SopManage/GetUserList');
  }

  /**
   * 获取机台列表
   */
  public GetAllMachineList(): Observable<MachineModel[]> {
    return this.apiUrl.GetPp('Machines/GetAllMachineList');
  }


  /**
   * 获取机台利用率列表
   * @param startTime 起始时间
   * @param endTime 结束时间
   */
  public GetMachineOee(startTime: string, endTime: string): Observable<MachineOeeModel[]> {
    return this.apiUrl.GetPp('Machines/GetMachineOee', { params: { t1: startTime, t2: endTime } });
  }
}
