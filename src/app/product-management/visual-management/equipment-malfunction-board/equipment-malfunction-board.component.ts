import { FormHelper } from './../../../common-use/form-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { MachineAlertRateModel, MachineFaultRateQueryDto, MachineFaultRateDisplayDto } from './../../../data-models';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { subDays } from 'date-fns';
import { MainDataOperationService } from '../../main-data-operation.service';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { MsgHelper } from 'src/app/common-use/msg-helper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-equipment-malfunction-board',
  templateUrl: './equipment-malfunction-board.component.html',
  styleUrls: ['./equipment-malfunction-board.component.css']
})
export class EquipmentMalfunctionBoardComponent implements OnInit {

  startTime: string;
  endTime: string;
  timeFormat = 'yyyy/MM/dd HH:mm:ss';

  faultRateDataset: MachineAlertRateModel[] = [];
  faultRateLoading = false;

  /**折线图显示数据 */
  displayFaultDataset: MachineFaultRateDisplayDto[] = [];

  pieDataSource: any;
  lineDatasource: any;

  machineFaultRateQueryFormData: MachineFaultRateQueryDto = null;
  machineFaultRateQueryForm: FormGroup;
  faultRateQuerySubmitLoading = false;

  /**是否显示明细数据 */
  isShowDetailData = false;

  constructor(
    public datePipe: DatePipe,
    public dateOperate: MainDataOperationService,
    public fb: FormBuilder,
    public nzMessage: NzMessageService,
  ) { }

  ngOnInit() {
    const dateNow = new Date(Date.now());
    const startDate = subDays(dateNow, 7);
    this.startTime = this.datePipe.transform(startDate, this.timeFormat);
    console.log(`startTime:${this.startTime}`);
    this.endTime = this.datePipe.transform(dateNow, this.timeFormat);
    console.log(`endtime:${this.endTime}`);

    this.machineFaultRateQueryFormData = this.initFaultRateQuery();
    this.createMachineOeeQeeryForm(this.machineFaultRateQueryFormData);
    this.lineDatasource = this.initLinesource();
    this.pieDataSource = this.initPieDataSource();
    this.getFaultRate();
  }

  initFaultRateQuery(): MachineFaultRateQueryDto {
    return new MachineFaultRateQueryDto(this.getFirstDayOfMonth(), new Date(Date.now()));
  }

  createMachineOeeQeeryForm(dto: MachineFaultRateQueryDto): void {
    this.machineFaultRateQueryForm = this.fb.group({
      StartDate: [dto.StartDate, [Validators.required]],
      EndDate: [dto.EndDate, [Validators.required]],
    });
  }

  submitQueryForm($event): void {
    FormHelper.YGSubmitForm(this.machineFaultRateQueryFormData, this.machineFaultRateQueryForm, dto => {
      this.faultRateLoading = true;
      this.faultRateQuerySubmitLoading = true;
      this.startTime = this.datePipe.transform(dto.StartDate, this.timeFormat);
      console.log(`startTime:${this.startTime}`);
      this.endTime = this.datePipe.transform(dto.EndDate, this.timeFormat);
      console.log(`endTime:${this.endTime}`);
      this.displayFaultDataset = [];
      this.getFaultRate();
    });
  }

  resetQueryForm($event): void {
    this.machineFaultRateQueryFormData = null;
    this.machineFaultRateQueryForm.reset(new MachineFaultRateQueryDto(null, null));
  }

  getFaultRate() {
    this.faultRateLoading = true;
    this.dateOperate.GetFaultRate(this.startTime, this.endTime).subscribe(result => {
      if (result !== null && result.length !== 0) {
        this.faultRateDataset = result;
        this.analysisFaultData(this.faultRateDataset);
      } else {
        this.nzMessage.warning('查询无结果');
        // 查询无结果时，清空折线图
        this.lineDatasource = this.initLinesource();
      }
      this.faultRateLoading = false;
      this.faultRateQuerySubmitLoading = false;
    }, error => {
      const msg = (error as HttpErrorResponse).message;
      this.nzMessage.error(`与服务器通信失败，请联系工程师解决！msg:${msg}`);
      this.faultRateLoading = false;
      this.faultRateQuerySubmitLoading = false;
    });
  }

  analysisFaultData(dataset: MachineAlertRateModel[]): void {
    dataset.forEach(item => {
      if (this.displayFaultDataset.length === 0) {
        this.displayFaultDataset.push(new MachineFaultRateDisplayDto(item.MachineId, item.MachineName,
          item.AlertTimeSecond / 60, '', item.StateMsg));
      } else {
        const dto = this.displayFaultDataset.find(element => {
          return element.MachineId === item.MachineId;
        });
        if (dto !== undefined) {
          dto.FaultTime += item.AlertTimeSecond / 60;
        } else {
          this.displayFaultDataset.push(new MachineFaultRateDisplayDto(item.MachineId, item.MachineName,
            item.AlertTimeSecond / 60, '', item.StateMsg));
        }
      }
    });
    // 取整
    this.displayFaultDataset.forEach(item => {
      item.FaultTime = Math.round(item.FaultTime);
    });
    console.log(this.displayFaultDataset);
    this.updateLineDatasource(this.displayFaultDataset);
  }

  updateLineDatasource(dataset: MachineFaultRateDisplayDto[]): void {
    if (dataset.length !== 0) {
      const option = this.initLinesource();
      const xAxisArray: string[] = [];
      const faultTimeDataset: number[] = [];
      dataset = dataset.sort((a, b) => {
        const numA = parseInt(a.MachineId.trim(), 10);
        const numB = parseInt(b.MachineId.trim(), 10);
        return numA - numB;
      });
      dataset.forEach(item => {
        xAxisArray.push(item.MachineName);
        faultTimeDataset.push(item.FaultTime);
      });
      option.xAxis.data = xAxisArray;
      option.series[0].data = faultTimeDataset;
      this.lineDatasource = option;
    }
  }

  /**
   * 初始化折线图
   */
  initLinesource(): any {
    const option = {
      xAxis: {
        name: '机台编号',
        type: 'category',
        data: []
      },
      yAxis: {
        name: '故障时间/分钟',
        type: 'value'
      },
      series: [{
        data: [],
        type: 'line',
        itemStyle: {
          normal: {
            color: 'red',
            barBorderRadius: 0,
            label: {
              show: true,
              position: 'top',
              formatter: function (p) {
                return p.value > 0 ? (p.value) : '';
              }
            }
          }
        },
      }]
    };
    return option;
  }

  initPieDataSource(): any {
    const pieDatasource = {
      title: {
        text: '设备故障率',
        subtext: '饼状图',
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        // d的值为该部分所占的比例，自动计算
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        // this is b's source
        data: ['待机', '程序错误', '进刀异常', '手动停止']
      },
      series: [
        {
          // this is a's source
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
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
            }
          },
          // data.value is c's source
          // itemStyle属性指定扇形颜色  例如： {value:335, name:'直接访问',itemStyle:{color:'#f50'}},
          data: [
            { value: 251, name: '待机', itemStyle: { color: '#22B14C' } },
            { value: 156, name: '程序错误', itemStyle: { color: '#ED1C24' } },
            { value: 856, name: '进刀异常', itemStyle: { color: '#00A2E8' } },
            { value: 345, name: '手动停止', itemStyle: { color: '#A6A6A6' } }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    return pieDatasource;
  }

  getFirstDayOfMonth(): Date {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    return new Date(currentYear, currentMonth, 1, 0, 0, 0);
  }

  showDetailData() {
    this.isShowDetailData = true;
  }

  closeDetailData() {
    this.isShowDetailData = false;
  }

}
