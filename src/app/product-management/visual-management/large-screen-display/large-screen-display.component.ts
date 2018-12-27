import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MsgHelper } from 'src/app/common-use/msg-helper';
import { NzModalService, NzMessageService } from 'ng-zorro-antd';
import { EquipmentInfoDto } from 'src/app/data-models';
import { MainDataOperationService } from '../../main-data-operation.service';
import { DatePipe } from '@angular/common';
import { min } from 'rxjs/operators';

@Component({
  selector: 'app-large-screen-display',
  templateUrl: './large-screen-display.component.html',
  styleUrls: ['./large-screen-display.component.css']
})
export class LargeScreenDisplayComponent implements OnInit, OnDestroy {

  equipmentInfoDataSet: EquipmentInfoDto[] = [];
  entireCount = 0;
  /**运行  1*/
  powerOn = '#87d068';
  powerOnCount = 0;
  /**停机  0*/
  powerOff = '#808080';
  powerOffCount = 0;
  /**待机 4*/
  standby = '#efef00';
  standbyCount = 0;
  /**报警 2*/
  alert = '#f50';
  alertCount = 0;

  isEquipmentListLoading = false;

  intervalFc: any;
  constructor(
    private dataOperate: MainDataOperationService,
    private modalService: NzModalService,
    private msgService: NzMessageService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit() {
    this.isEquipmentListLoading = true;
    this.getEquipmentInfo();

    // 每个十秒获取一次数据, 10000);
    this.intervalFc = setInterval(() => {
      // this.isEquipmentListLoading = true;
      /**获取设备信息 */
      this.getEquipmentInfo();
    }, 10000);
  }
  /**
   * 在组件销毁前停止定时器，取消订阅（？）
   */
  ngOnDestroy(): void {
    // 取消定时器
    clearInterval(this.intervalFc);
  }

  /**
   * 获取所有设备信息
   */
  private getEquipmentInfo() {
    this.dataOperate.GetMachineInfos().subscribe(result => {
      if (result == null) {
        MsgHelper.ShowErrorModal(this.modalService, '获取数据失败！');
        this.isEquipmentListLoading = false;
        clearInterval(this.intervalFc);
      } else if (result.length === 0) {
        MsgHelper.ShowInfoModal(this.modalService, '查询无结果！');
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
        this.entireCount = result.length;

        let powerOnCount = 0, powerOffCount = 0, alertCount = 0, standbyCount = 0;
        this.equipmentInfoDataSet.forEach(item => {
          switch (item.State.State) {
            case 0:
              powerOffCount++;
              break;
            case 1:
              powerOnCount++;
              break;
            case 2:
              alertCount++;
              break;
            case 4:
              standbyCount++;
              break;
            default:
              MsgHelper.ShowErrorModal(this.modalService, `出现不明设备状态代码:${item.State},请检查后重试！`);
              break;
          }
          this.powerOffCount = powerOffCount;
          this.powerOnCount = powerOnCount;
          this.standbyCount = standbyCount;
          this.alertCount = alertCount;
          // console.log(Date.now());
        });
      }
      this.isEquipmentListLoading = false;
    }, error => {
      const msg = (error as HttpErrorResponse).message;
      MsgHelper.ShowErrorModal(this.modalService, `与远程服务器通信发生错误,数据刷新终止:\t\n${msg}`);
      this.isEquipmentListLoading = false;
      clearInterval(this.intervalFc);
    }
    );
  }

  getBackgroundColor(state: number) {
    switch (state) {
      case 0:
        return this.powerOff; // 停机背景颜色
      case 1:
        return this.powerOn; // 开机背景颜色
      case 2:
        return this.alert;  // 报警背景颜色
      case 4:
        return this.standby; // 待机背景颜色

      default:
        return 'transparent';
    }
  }

}
