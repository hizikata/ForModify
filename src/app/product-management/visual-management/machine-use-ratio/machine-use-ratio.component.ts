import { Component, OnInit } from '@angular/core';
import { MachineOeeModel, MachineOeeQuery } from 'src/app/data-models';
import { MainDataOperationService } from '../../main-data-operation.service';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-machine-use-ratio',
  templateUrl: './machine-use-ratio.component.html',
  styleUrls: ['./machine-use-ratio.component.css']
})
export class MachineUseRatioComponent implements OnInit {

  machineOeeDataSet: MachineOeeModel[] = [];
  startDate = new Date(Date.now());
  endDate = new Date(Date.now());

  machineOeeQueryForm: FormGroup = null;
  machineOeeQueryFormData: MachineOeeQuery = null;

  public option1: any;
  public option2: any;
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

  constructor(
    public dataOperate: MainDataOperationService,
    public datePiepe: DatePipe,
    public fb: FormBuilder,
  ) {

  }
  ngOnInit() {

    this.machineOeeQueryFormData = this.initMachineOeeQuery();
    this.createMachineOeeQeeryForm(this.machineOeeQueryFormData);
    this.getMachineOeeArray();

    this.option1 = {
      backgroundColor: '#2c343c',
      // backgroundColor: 'white',

      title: {
        text: 'Customized Pie',
        left: 'center',
        top: 20,
        textStyle: {
          color: '#ccc'
        }
      },

      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },

      visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
          colorLightness: [0, 1]
        }
      },
      series: [
        {
          name: '访问来源',
          type: 'pie',
          radius: '55%',
          center: ['50%', '50%'],
          data: [
            { value: 335, name: '直接访问' },
            { value: 310, name: '邮件营销' },
            { value: 274, name: '联盟广告' },
            { value: 235, name: '视频广告' },
            { value: 400, name: '搜索引擎' }
          ].sort(function (a, b) { return a.value - b.value; }),
          roseType: 'radius',
          label: {
            normal: {
              textStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              }
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            normal: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: function (idx) {
            return Math.random() * 200;
          }
        }
      ]
    };

    this.option2 = {
      backgroundColor: 'white',   // '#2c343c',
      color: ['#003366', '#006699', '#4cabce', '#e5323e'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
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
          type: 'category',
          axisTick: { show: false },
          data: ['2012', '2013', '2014', '2015', '2016']
        }
      ],
      yAxis: [
        {
          type: 'value'
        }
      ],
      series: [
        {
          name: 'Forest',
          type: 'bar',
          barGap: 0,
          label: this.labelOption,
          data: [320, 332, 301, 334, 390]
        },
        {
          name: 'Steppe',
          type: 'bar',
          label: this.labelOption,
          data: [220, 182, 191, 234, 290]
        },
        {
          name: 'Desert',
          type: 'bar',
          label: this.labelOption,
          data: [150, 232, 201, 154, 190]
        },
        {
          name: 'Wetland',
          type: 'bar',
          label: this.labelOption,
          data: [98, 77, 101, 99, 40]
        }
      ]
    };
  }

  initMachineOeeQuery(): MachineOeeQuery {
    return new MachineOeeQuery(null, null);
  }

  createMachineOeeQeeryForm(dto: MachineOeeQuery): void {
    this.machineOeeQueryForm = this.fb.group({
      StartDate: [dto.StartDate, [Validators.required]],
      EndDate: [dto.EndDate, [Validators.required]],
    });
  }


  getMachineOeeArray(): void {
    const startDate = this.datePiepe.transform(this.startDate, 'yyyy/MM/dd HH:mm:ss');
    const endDate = this.datePiepe.transform(this.endDate, 'yyyy/MM/dd HH:mm:ss');
    this.dataOperate.GetMachineOee(startDate, endDate).subscribe(result => {
      if (result !== null && result.length !== 0) {
        this.machineOeeDataSet = result;
      } else {
        this.machineOeeDataSet = [];
      }
    });
  }
}
