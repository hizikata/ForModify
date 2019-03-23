import { Component, OnInit } from '@angular/core';
import { MainDataOperationService } from '../../main-data-operation.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { WorkpieceModel, WorkpieceDataQueryDto, EquipmentInfoDto, PieDataTemplate } from 'src/app/data-models';
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

  isShowDetailData = false;

  /**机台编号 */
  // machineId = 'CNC03';
  machineId: string;
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
  uploadedColor = 'rgb(254,67,101)';

  /**计划已排产 */
  planedValue = 0;
  /**计划已排产颜色 */
  planedColor = 'rgb(252,157,154)';

  /**分配机台 */
  allotMachineValue = 0;
  /**分配机台颜色 */
  allotMachineColor = 'rgb(249,205,173';

  /**备刀完成 */
  swordPreparationValue = 0;
  /**备刀完成颜色标识 */
  swordPreparationColor = 'rgb(200,200,169)';

  /**加工中 */
  processingValue = 0;
  /**加工中颜色 */
  processingColor = 'rgb(131,175,155)';

  /**已完成 */
  completionValue = 0;
  /**已完成颜色标识 */
  completionColor = '#87d068';



  // ---------------数据查询相关---------
  workpieceDataQueryForm: FormGroup;
  workpieceDataQueryFormData: WorkpieceDataQueryDto = null;
  isEquipmentListLoading = false;
  intervalFc: any;
  equipmentInfoDataSet: EquipmentInfoDto[] = [];
  equipmentInfoSet: EquipmentInfoDto[] = [];
  constructor(
    public dataOperater: MainDataOperationService,
    public nzMessage: NzMessageService,
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


    // this.getWorkpieceListByMachineId();

    this.pieDataSource = this.initPieDatasource();

    this.getMachineInfos();


    // 每个十秒获取一次数据, 10000);
    this.intervalFc = setInterval(() => {
      // this.isEquipmentListLoading = true;
      /**获取设备信息 */
      this.getEquipmentInfo();
    }, 10000);
  }



  initFaultRateQuery(): WorkpieceDataQueryDto {
    return new WorkpieceDataQueryDto(this.getFirstDayOfMonth(), new Date(Date.now()), null);
  }

  createMachineOeeQeeryForm(dto: WorkpieceDataQueryDto): void {
    this.workpieceDataQueryForm = this.fb.group({
      StartDate: [dto.StartDate, [Validators.required]],
      EndDate: [dto.EndDate, [Validators.required]],
      Name: [dto.Name]

    });
  }

  submitQueryForm($event) {
    event.preventDefault();
    FormHelper.YGSubmitForm(this.workpieceDataQueryFormData, this.workpieceDataQueryForm, dto => {
      this.startTime = this.datePipe.transform(dto.StartDate, this.timeFormat);
      console.log(`startTime:${this.startTime}`);
      this.endTime = this.datePipe.transform(dto.EndDate, this.timeFormat);
      console.log(`endTime:${this.endTime}`);
      this.machineId = dto.Name;
      console.log('id+++++++++++++' + dto.Name);
      this.equipmentInfoSet = this.equipmentInfoDataSet.filter(item => item.Name === dto.Name);
      console.log('aaaa++++' + this.equipmentInfoSet.length);
      this.getWorkpieceListByMachineId();
    });
  }

  resetQueryForm($event) {
    event.preventDefault();
    this.workpieceDataQueryFormData = null;
    this.workpieceDataQueryForm.reset();
  }

  calculateState(): void {
    let completeValue = 0, processingValue = 0, swordPreparationValue = 0, uploadedValue = 0, planedValue = 0, allotMachineValue = 0;
    this.workpieceDataset.forEach(item => {
      switch (item.State) {
        case '已完成':
          completeValue++;
          break;
        case '加工中' + item.MachineId:
          processingValue++;
          break;
        case '备刀完成':
          swordPreparationValue++;
          break;
        case '程序单已上传':
          uploadedValue++;
          break;
        case '计划已排产':
          planedValue++;
          break;
        case '已分配机台':
          allotMachineValue++;
          break;
        default:
          break;
      }
    });
    this.completionValue = completeValue;
    this.processingValue = processingValue;
    this.swordPreparationValue = swordPreparationValue;
    this.uploadedValue = uploadedValue;
    this.planedValue = planedValue;
    this.allotMachineValue = allotMachineValue;
  }
  getWorkpieceListByMachineId(): void {
    this.workpieceDataLoading = true;
    this.dataOperater.GetWorkpieceListByMachineId(this.machineId, this.startTime, this.endTime).subscribe(result => {
      if (result !== null && result.length !== 0) {
        this.workpieceDataset = result;
        this.calculateState();
        this.updatePieDataSource();
        console.log(result);
      } else {
        this.workpieceDataset = [];
        this.pieDataSource = this.initPieDatasource();
        // MsgHelper.ShowWarningModal(this.modalService, '查询无结果！');
      }
      this.workpieceDataLoading = false;
    }, error => {
      const msg = (error as HttpErrorResponse).message;
      this.nzMessage.error(`与服务器通信失败，请联系工程师解决！msg:${msg}`);
      this.workpieceDataLoading = false;
    });
  }

  getFirstDayOfMonth(): Date {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    return new Date(currentYear, currentMonth, 1, 0, 0, 0);
  }

  private getEquipmentInfo() {
    this.dataOperater.GetMachineInfos().subscribe(result => {
      if (result == null) {
        this.nzMessage.error('获取数据失败！');
        this.isEquipmentListLoading = false;
        clearInterval(this.intervalFc);
      } else if (result.length === 0) {
        this.nzMessage.warning('查询无结果！');
        this.isEquipmentListLoading = false;
        clearInterval(this.intervalFc);
      } else {
        result.forEach(item => {
          item.State.StartTime = new Date(item.State.StartTime);
          item.State.TakenTime = new Date(item.State.TakenTime);
          const aa = item.State.StartTime.getHours();
          let day = item.State.TakenTime.getDay();
          const hour = item.State.TakenTime.getHours();
          const minute = item.State.TakenTime.getMinutes();
          if (day > 1) {
            day = day - 1;
            item.State.DisplayTakenTime = `${day}天${hour}时${minute}分`;
          } else if (day === 1) {
            item.State.DisplayTakenTime = `${hour}时${minute}分`;
          }

        });

      }
      this.isEquipmentListLoading = false;
    }, error => {
      const msg = (error as HttpErrorResponse).message;
      this.nzMessage.error(`与远程服务器通信发生错误,数据刷新终止:\t\n${msg}`);
      this.isEquipmentListLoading = false;
      clearInterval(this.intervalFc);
    }
    );
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
            { value: 0, name: '程序单已上传' },
            { value: 0, name: '计划已排产' },
            { value: 0, name: '已分配机台' },
            { value: 0, name: '备刀完成' },
            { value: 0, name: '加工中' },
            { value: 0, name: '已完成' }
          ]
        }
      ],
      color: ['rgb(254,67,101)', 'rgb(252,157,154)', 'rgb(249,205,173)', 'rgb(200,200,169)', 'rgb(131,175,155)', '#87d068']
    };


    return datasource;
  }



  updatePieDataSource(): void {
    const dataArray: PieDataTemplate[] = [];
    if (this.uploadedValue === 0) {
      this.uploadedValue = null;
      //  this.uploadedColor = null;
    }
    if (this.planedValue === 0) {
      //  this.planedColor = null;
      this.planedValue = null;
    }
    if (this.allotMachineValue === 0) {
      this.allotMachineValue = null;
      // this.allotMachineColor = null;
    }
    if (this.swordPreparationValue === 0) {
      this.swordPreparationValue = null;
      // this.swordPreparationColor = null;
    }
    if (this.processingValue === 0) {
      this.processingValue = null;
      // this.processingColor = null;
    }
    if (this.completionValue === 0) {
      this.completionValue = null;
      // this.completionColor = null;
    }
    dataArray.push(new PieDataTemplate(this.uploadedValue, '程序单已上传', { color: this.uploadedColor }));
    dataArray.push(new PieDataTemplate(this.planedValue, '计划已排产', { color: this.planedColor }));
    dataArray.push(new PieDataTemplate(this.allotMachineValue, '已分配机台', { color: this.allotMachineColor }));
    dataArray.push(new PieDataTemplate(this.swordPreparationValue, '备刀完成', { color: this.swordPreparationColor }));
    dataArray.push(new PieDataTemplate(this.processingValue, '加工中', { color: this.processingColor }));
    dataArray.push(new PieDataTemplate(this.completionValue, '已完成', { color: this.completionColor }));
    const option1 = this.initPieDatasource();
    option1.series[0].data = dataArray.sort(function (a, b) { return a.value - b.value; });
    this.pieDataSource = option1;
  }




  getMachineInfos(): void {

    this.dataOperater.GetMachineInfos().subscribe(result => {
      if (result == null) {
        this.nzMessage.error('获取数据失败！');
        this.isEquipmentListLoading = false;
        clearInterval(this.intervalFc);
      } else if (result.length === 0) {
        this.nzMessage.warning('查询无结果！');
        this.isEquipmentListLoading = false;
        clearInterval(this.intervalFc);
      } else {
        // 当机台数字编号均为两位数时，可取消排序
        // result = result.sort((a, b) => {
        //   const numberA: number = Number(a['MachineId']);
        //   const numberB: number = Number(b['MachineId']);
        //   return numberA > numberB ? 1 : -1;
        // });
        result.forEach(item => {
          item.State.StartTime = new Date(item.State.StartTime);
          item.State.TakenTime = new Date(item.State.TakenTime);
          const aa = item.State.StartTime.getHours();
          let day = item.State.TakenTime.getDay();
          const hour = item.State.TakenTime.getHours();
          const minute = item.State.TakenTime.getMinutes();
          if (day > 1) {
            day = day - 1;
            item.State.DisplayTakenTime = `${day}天${hour}时${minute}分`;
          } else if (day === 1) {
            item.State.DisplayTakenTime = `${hour}时${minute}分`;
          }

        });
        this.equipmentInfoDataSet = result;
      }
      this.isEquipmentListLoading = false;
    }, error => {
      const msg = (error as HttpErrorResponse).message;
      this.nzMessage.error(`与远程服务器通信发生错误,数据刷新终止:\t\n${msg}`);
      this.isEquipmentListLoading = false;
      clearInterval(this.intervalFc);
    }
    );
  }


  showDetailData() {
    this.isShowDetailData = true;
  }

  closeDetailData() {
    this.isShowDetailData = false;
  }

}
