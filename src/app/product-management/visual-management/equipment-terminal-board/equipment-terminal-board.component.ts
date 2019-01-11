import { Component, OnInit } from '@angular/core';
import { MainDataOperationService } from '../../main-data-operation.service';
import { NzModalService } from 'ng-zorro-antd';
import { WorkpieceModel, WorkpieceDataQueryDto } from 'src/app/data-models';
import { MsgHelper } from 'src/app/common-use/msg-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { addDays, subDays } from 'date-fns';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { FormHelper } from 'src/app/common-use/form-helper';

@Component({
  selector: 'app-equipment-terminal-board',
  templateUrl: './equipment-terminal-board.component.html',
  styleUrls: ['./equipment-terminal-board.component.css']
})
export class EquipmentTerminalBoardComponent implements OnInit {

  /**机台编号 */
  machineId = 'CNC03';
  /**开始时间 */
  startTime: string;
  /**结束时间 */
  endTime: string;
  /**查询数据所需要的日期格式化 */
  timeFormat = 'yyyy/MM/dd HH:mm:ss';
  /**工件数据列表 */
  workpieceDataset: WorkpieceModel[] = [];
  workpieceDataLoading = false;

  /**饼图数据源 */
  pieDataSource: any;

  /**程序单已上传 */
  uploadedValue = 0;
  /**程序单已上传颜色 */
  uploadedColor = '';

  /**计划已排产 */
  planedValue = 0;
  /**计划已排产颜色 */
  planedColor = '';

  /**分配机台 */
  allotMachineValue = 0;
  /**分配机台颜色 */
  allotMachineColor = '';

  /**备刀完成 */
  swordPreparationValue = 0;
  /**备刀完成颜色标识 */
  swordPreparationColor = '';

  /**加工中 */
  processingValue = 0;
  /**加工中颜色 */
  processingColor = '';

  /**已完成 */
  completionValue = 0;
  /**已完成颜色标识 */
  completionColor = '';

  // ---------------数据查询相关---------
  workpieceDataQueryForm: FormGroup;
  workpieceDataQueryFormData: WorkpieceDataQueryDto = null;



  constructor(
    public dataOperater: MainDataOperationService,
    public modalService: NzModalService,
    public datePipe: DatePipe,
    public fb: FormBuilder,
  ) { }

  ngOnInit() {
    const dateNow = new Date(Date.now());
    const startDate = subDays(dateNow, 7);

    this.startTime = this.datePipe.transform(startDate, this.timeFormat);
    console.log(`startTime:${this.startTime}`);

    this.endTime = this.datePipe.transform(dateNow, this.timeFormat);
    console.log(`endtime:${this.endTime}`);

    this.workpieceDataQueryFormData = this.initFaultRateQuery();
    this.createMachineOeeQeeryForm(this.workpieceDataQueryFormData);


    this.getWorkpieceListByMachineId();

    this.pieDataSource = this.initPieDatasource();
  }



  initFaultRateQuery(): WorkpieceDataQueryDto {
    return new WorkpieceDataQueryDto(this.getFirstDayOfMonth(), new Date(Date.now()));
  }

  createMachineOeeQeeryForm(dto: WorkpieceDataQueryDto): void {
    this.workpieceDataQueryForm = this.fb.group({
      StartDate: [dto.StartDate, [Validators.required]],
      EndDate: [dto.EndDate, [Validators.required]],
    });
  }

  submitQueryForm($event) {
    event.preventDefault();
    FormHelper.YGSubmitForm(this.workpieceDataQueryFormData, this.workpieceDataQueryForm, dto => {
      this.startTime = this.datePipe.transform(dto.StartDate, this.timeFormat);
      console.log(`startTime:${this.startTime}`);
      this.endTime = this.datePipe.transform(dto.EndDate, this.timeFormat);
      console.log(`endTime:${this.endTime}`);
      this.getWorkpieceListByMachineId();
    });
  }

  resetQueryForm($event) {
    event.preventDefault();
    this.workpieceDataQueryFormData = null;
    this.workpieceDataQueryForm.reset();
  }

  getWorkpieceListByMachineId(): void {
    this.workpieceDataLoading = true;
    this.dataOperater.GetWorkpieceListByMachineId(this.machineId, this.startTime, this.endTime).subscribe(result => {
      if (result !== null && result.length !== 0) {
        this.workpieceDataset = result;
        console.log(result);
      } else {
        MsgHelper.ShowWarningModal(this.modalService, '查询无结果！');
      }
      this.workpieceDataLoading = false;
    }, error => {
      const msg = (error as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与服务器通信失败，请联系工程师解决！msg:${msg}`);
      this.workpieceDataLoading = false;
    });
  }

  getFirstDayOfMonth(): Date {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    return new Date(currentYear, currentMonth, 1, 0, 0, 0);
  }



  initPieDatasource(): any {
    const datasource = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: ['程序单已上传', '计划已排产', '已分配机台', '备刀完成', '加工中', '已完成']
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          // label: {
          //   normal: {
          //     show: true,
          //     position: 'center'
          //   },
          //   emphasis: {
          //     show: true,
          //     textStyle: {
          //       fontSize: '30',
          //       fontWeight: 'bold'
          //     }
          //   }
          // },
          label: {
            normal: {
              formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}  {per|{d}%}  ',
              backgroundColor: '#eee',
              borderColor: '#aaa',
              borderWidth: 1,
              borderRadius: 4,
              // shadowBlur:3,
              // shadowOffsetX: 2,
              // shadowOffsetY: 2,
              // shadowColor: '#999',
              // padding: [0, 7],
              rich: {
                a: {
                  color: '#999',
                  lineHeight: 22,
                  align: 'center'
                },
                // abg: {
                //     backgroundColor: '#333',
                //     width: '100%',
                //     align: 'right',
                //     height: 22,
                //     borderRadius: [4, 4, 0, 0]
                // },
                hr: {
                  borderColor: '#aaa',
                  width: '100%',
                  borderWidth: 0.5,
                  height: 0
                },
                b: {
                  fontSize: 16,
                  lineHeight: 33
                },
                per: {
                  color: '#eee',
                  backgroundColor: '#334455',
                  padding: [2, 4],
                  borderRadius: 2
                }
              }
            },
            emphasis: {
              show: true,
              textStyle: {
                fontSize: '30',
                fontWeight: 'bold'
              }
            }
          },

          labelLine: {
            normal: {
              show: false
            }
          },
          data: [
            { value: 335, name: '程序单已上传' },
            { value: 310, name: '计划已排产' },
            { value: 234, name: '已分配机台' },
            { value: 135, name: '备刀完成' },
            { value: 1548, name: '加工中' },
            { value: 548, name: '已完成' }
          ]
        }
      ]
    };
    return datasource;
  }



}
