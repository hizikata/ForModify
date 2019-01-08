import { Component, OnInit } from '@angular/core';
import { MachineOeeModel, MachineOeeQuery, PieDataTemplate } from 'src/app/data-models';
import { MainDataOperationService } from '../../main-data-operation.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormHelper } from 'src/app/common-use/form-helper';
import { HttpErrorResponse } from '@angular/common/http';
import { MsgHelper } from 'src/app/common-use/msg-helper';
import { NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-machine-use-ratio',
  templateUrl: './machine-use-ratio.component.html',
  styleUrls: ['./machine-use-ratio.component.css']
})
export class MachineUseRatioComponent implements OnInit {

  machineOeeDataLoading = false;
  machineOeeDataSet: MachineOeeModel[] = [];

  startDate: string;
  endDate: string;

  machineOeeQueryForm: FormGroup = null;
  machineOeeQueryFormData: MachineOeeQuery = null;

  selectedRowIndex = 0;
  /**将机台分为四组 */
  rowIndexArray = [
    {
      rowName: '第一组',
      rowNum: 0
    },
    {
      rowName: '第二组',
      rowNum: 1
    },
    {
      rowName: '第三组',
      rowNum: 2
    },
    {
      rowName: '第四组',
      rowNum: 3
    },
  ];


  /**饼图数据源 */
  pieDataSource: any;
  /**柱状图数据源 */
  barDataSource: any;
  labelOption = {
    normal: {
      show: true,
      position: 'insideBottom',
      distance: 15,
      align: 'left',
      verticalAlign: 'middle',
      rotate: 90,
      formatter: '{c}  {name|{a}}',
      fontSize: 16,
      rich: {
        name: {
          textBorderColor: '#fff'
        }
      }
    }
  };

  /**运行时间 */
  runTime = 0;
  /**待机时间 */
  standbyTime = 0;
  /**停机时间 */
  poweroffTime = 0;
  /**报警时间 */
  alertTime = 0;

  // 各种状态颜色标识
  runTimeColor = '#87d068';
  standbyTimeColor = '#FFC90E';
  poweroffTimeColor = '#808080';
  alertTimeColor = '#f50';

  /**查询数据所需要的日期格式化 */
  timeFormat = 'yyyy/MM/dd HH:mm:ss';

  constructor(
    public dataOperate: MainDataOperationService,
    public datePiepe: DatePipe,
    public fb: FormBuilder,
    public modalService: NzModalService,
  ) {

  }
  ngOnInit() {
    const startDate = this.datePiepe.transform(this.getFirstDayOfMonth(), this.timeFormat);
    console.log(`startDate:${this.startDate}`);
    const endDate = this.datePiepe.transform(new Date(Date.now()), this.timeFormat);
    console.log(`endDate:${this.endDate}`);

    this.machineOeeDataLoading = true;
    this.getMachineOee(startDate, endDate);

    this.machineOeeQueryFormData = this.initMachineOeeQuery();
    this.createMachineOeeQeeryForm(this.machineOeeQueryFormData);
    this.barDataSource = this.initBarDatasource();
    this.pieDataSource = this.initPieDataSource();
    // this.getMachineOeeArray();
  }

  initMachineOeeQuery(): MachineOeeQuery {
    return new MachineOeeQuery(this.getFirstDayOfMonth(), new Date(Date.now()));
  }

  createMachineOeeQeeryForm(dto: MachineOeeQuery): void {
    this.machineOeeQueryForm = this.fb.group({
      StartDate: [dto.StartDate, [Validators.required]],
      EndDate: [dto.EndDate, [Validators.required]],
    });
  }

  submitQueryForm(): void {
    FormHelper.YGSubmitForm(this.machineOeeQueryFormData, this.machineOeeQueryForm, dto => {
      this.machineOeeDataLoading = true;
      this.getDateAndShow(dto);
    });
  }

  resetQueryForm(): void {
    this.machineOeeQueryFormData = null;
    this.machineOeeQueryForm.reset();
  }

  /**
   * 获取数据并展示
   * @param dto 查询日期模型
   */
  getDateAndShow(dto: MachineOeeQuery): void {
    const startDate = this.datePiepe.transform(dto.StartDate, this.timeFormat);
    console.log(`start:${startDate}`);
    const endDate = this.datePiepe.transform(dto.EndDate, this.timeFormat);
    console.log(`endDate:${endDate}`);
    this.getMachineOee(startDate, endDate);

  }

  getMachineOee(startDate: string, endDate: string): void {
    this.dataOperate.GetMachineOee(startDate, endDate).subscribe(result => {
      if (result !== null && result.length !== 0) {
        this.machineOeeDataSet = result;
        this.getAllKindOfTime();
      } else {
        this.machineOeeDataSet = [];
      }
      this.machineOeeDataLoading = false;
    }, error => {
      const msg = (error as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `查询机台时间时与服务器通信失败${msg}`);
    });
  }

  getAllKindOfTime(): void {
    if (this.machineOeeDataSet.length !== 0) {
      let runTime = 0, standbyTime = 0, poweroffTime = 0, alertTime = 0;
      this.machineOeeDataSet.forEach(item => {
        runTime += item.RunTime;
        standbyTime += item.StandbyTime;
        poweroffTime += item.PowerOffTime;
        alertTime += item.AlertTime;
      });
      this.runTime = runTime;
      this.standbyTime = standbyTime;
      this.poweroffTime = poweroffTime;
      this.alertTime += alertTime;
      this.updatePieDataSource();
      this.updateBarDatasource(0);
    }
  }

  updatePieDataSource(): void {
    const dataArray: PieDataTemplate[] = [];
    dataArray.push(new PieDataTemplate(this.alertTime, '报警时间', { color: this.alertTimeColor }));
    dataArray.push(new PieDataTemplate(this.poweroffTime, '停机时间', { color: this.poweroffTimeColor }));
    dataArray.push(new PieDataTemplate(this.standbyTime, '待机时间', { color: this.standbyTimeColor }));
    dataArray.push(new PieDataTemplate(this.runTime, '运行时间', { color: this.runTimeColor }));
    const option1 = this.initPieDataSource();
    option1.series[0].data = dataArray.sort(function (a, b) { return a.value - b.value; });
    this.pieDataSource = option1;
  }

  updateBarDatasource(index: number): void {
    if (this.machineOeeDataSet !== null && this.machineOeeDataSet.length !== 0) {
      // 每组显示6个数据
      const power = 6;
      const machineArray = [];
      const runTimeArray = [];
      const standbyTimeArray = [];
      const poweroffTimeArray = [];
      const alertTimeArray = [];
      this.machineOeeDataSet.forEach(item => {
        machineArray.push(item.Name);
        runTimeArray.push(item.RunTime);
        standbyTimeArray.push(item.StandbyTime);
        poweroffTimeArray.push(item.PowerOffTime);
        alertTimeArray.push(item.AlertTime);
      });
      const option2 = this.initBarDatasource();

      if (this.machineOeeDataSet.length >= index * power + power - 1) {
        option2.xAxis[0].data = machineArray.slice(index * power, index * power + power);
        option2.series[0].data = runTimeArray.slice(index * power, index * power + power);
        option2.series[1].data = standbyTimeArray.slice(index * power, index * power + power);
        option2.series[2].data = poweroffTimeArray.slice(index * power, index * power + power);
        option2.series[3].data = alertTimeArray.slice(index * power, index * power + power);
        this.barDataSource = option2;
      } else {
        MsgHelper.ShowErrorModal(this.modalService, '超出Machine数组的边界，请选择其他分组');
        return;
      }
    } else {
      MsgHelper.ShowErrorModal(this.modalService, '机台耗时数据为空，请先获取机台数据！');
    }
  }

  getFirstDayOfMonth(): Date {
    const currentDate = new Date(Date.now());
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    return new Date(currentYear, currentMonth, 1, 0, 0, 0);
  }


  initPieDataSource(): any {
    const pieDatasource = {
      title: {
        text: '机台利用率展示',
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
        data: ['运行时间', '待机时间', '停机时间', '报警时间']
      },
      series: [
        {
          // this is a's source
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          // data.value is c's source
          // itemStyle属性指定扇形颜色  例如： {value:335, name:'直接访问',itemStyle:{color:'#f50'}},
          data: [],
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

  initBarDatasource(): any {
    const barDatasource = {
      // title: {
      //   text: '各状态耗时对比',
      //   x: 'center'
      // },
      backgroundColor: '#F0F2F5',   // '#2c343c',
      // 柱状图颜色配置
      color: [this.runTimeColor, this.standbyTimeColor, this.poweroffTimeColor, this.alertTimeColor],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['运行', '待机', '停机', '报警']
      },
      toolbox: {
        show: true,
        orient: 'vertical',
        left: 'right',
        top: 'center',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar', 'stack', 'tiled'] },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      calculable: true,
      xAxis: [
        {
          name: '机台编号',
          type: 'category',
          axisTick: { show: false },
          /**决定数据有多少组，这里设定为6组 */
          data: []
        }
      ],
      yAxis: [
        {
          name: '时间/分钟',
          type: 'value'
        }
      ],
      series: [
        {
          name: '运行',
          type: 'bar',
          barGap: 0,
          label: this.labelOption,
          data: []
        },
        {
          name: '待机',
          type: 'bar',
          label: this.labelOption,
          data: []
        },
        {
          name: '停机',
          type: 'bar',
          label: this.labelOption,
          data: []
        },
        {
          name: '报警',
          type: 'bar',
          label: this.labelOption,
          data: []
        }
      ]
    };
    return barDatasource;
  }


}
