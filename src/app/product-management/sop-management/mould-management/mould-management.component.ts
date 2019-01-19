import { Component, OnInit } from '@angular/core';
import { isNull } from 'util';
import { MouldModelQueryDto, MouldModel } from 'src/app/data-models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd';
import { MainDataOperationService } from '../../main-data-operation.service';
import { MsgHelper } from 'src/app/common-use/msg-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { FormHelper } from 'src/app/common-use/form-helper';


@Component({
  selector: 'app-mould-management',
  templateUrl: './mould-management.component.html',
  styleUrls: ['./mould-management.component.css']
})
export class MouldManagementComponent implements OnInit {

  mouldModelQueryFormData: MouldModelQueryDto = null;
  moduleModelQueryForm: FormGroup;

  mouldModelDataSet: MouldModel[] = [];
  mouldModelDataLoading = false;
  sortName: string;
  sortValue: string;

  constructor(
    private fb: FormBuilder,
    private modalService: NzModalService,
    private dataOperate: MainDataOperationService,
  ) { }

  ngOnInit() {
    this.mouldModelQueryFormData = this.initQueryFormData();
    this.createQueryForm(this.mouldModelQueryFormData);
    this.mouldModelDataLoading = true;
    this.GetMachiningMouldPlanList();
  }


  /**
   * 获取MouldId列表
   */
  private GetMachiningMouldPlanList() {
    this.dataOperate.GetMachiningMouldPlanList().subscribe(result => {
      // console.log(result);
      if (result.length === 0) {
        MsgHelper.ShowInfoModal(this.modalService, '查询无数据！');
        this.mouldModelDataSet = [];
        return;
      } else {
        result.forEach(item => {
          if (item.State === null) {
            item.State = '';
          }
        });
        this.mouldModelDataSet = result;
      }
      this.mouldModelDataLoading = false;
    }, error => {
      this.mouldModelDataSet = [];
      const msg = (error as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通讯失败:${msg}`);
      this.mouldModelDataLoading = false;
    });
  }

  initQueryFormData(): MouldModelQueryDto {
    return new MouldModelQueryDto(null, null, null);
  }
  createQueryForm(dto: MouldModelQueryDto): void {
    this.moduleModelQueryForm = this.fb.group({
      MouldName: [dto.MouldName],
      MouldId: [dto.MouldId],
      MouldType: [dto.MouldType]
    });
  }

  /**查询 */
  submitQueryForm = ($event) => {
    $event.preventDefault();
    this.mouldModelDataLoading = true;
    FormHelper.YGSubmitForm(this.mouldModelQueryFormData, this.moduleModelQueryForm, dto => {
      this.dataOperate.GetMachiningMouldPlanList().subscribe(result => {

        if (result.length === 0) {
          MsgHelper.ShowInfoModal(this.modalService, '查询无数据！');
          this.mouldModelDataSet = [];
          return;
        } else {
          this.mouldModelDataSet = result;
          let dataArray = this.mouldModelDataSet;
          this.mouldModelDataLoading = true;
          /**模具Id筛选 */
          if (!isNull(dto.MouldId) && dto.MouldId.trim() !== '') {
            dataArray = dataArray.filter(item => {
              return item.MouldId.indexOf(dto.MouldId) !== -1;
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
          this.mouldModelDataSet = dataArray;
        }
        this.mouldModelDataLoading = false;
      }, error => {
        const msg = (error as HttpErrorResponse).message;
        MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通讯失败:${msg}`);
      });
    });
  }

  resetQueryForm($event): void {
    $event.preventDefault();
    this.mouldModelQueryFormData = this.initQueryFormData();
    this.moduleModelQueryForm.reset(this.initQueryFormData());
    this.mouldModelDataLoading = true;
    this.GetMachiningMouldPlanList();
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
    if (this.sortName && this.sortValue) {
      /**使用sort引用发生了变化？ */
      // tslint:disable-next-line:max-line-length
      this.mouldModelDataSet = this.mouldModelDataSet.sort((a, b) => (this.sortValue === 'ascend') ? (a[this.sortName] > b[this.sortName] ? 1 : -1) :
        (b[this.sortName] > a[this.sortName] ? 1 : -1));
    } else {
      this.mouldModelDataSet = this.mouldModelDataSet;
    }
  }

}
