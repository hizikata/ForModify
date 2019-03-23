import { NzModalService } from 'ng-zorro-antd';
import { OpResult } from './op-result';

export class MsgHelper {

  // 显示成功消息的模态窗口
  public static ShowSuccessModal(modalService: NzModalService, msg: string): void {
    modalService.success({
      nzTitle: '成功提示：',
      nzContent: msg,
      nzOkText: '确定'
    });
  }

  // 显示错误消息的模态窗口
  public static ShowErrorModal(modalService: NzModalService, msg: string): void {
    modalService.error({
      nzTitle: '错误提示：',
      nzContent: msg,
      nzOkText: '确定'
    });
  }

  // 显示常规消息的模态窗口
  public static ShowInfoModal(modalService: NzModalService, msg: string): void {
    modalService.info({
      nzTitle: '温馨提示：',
      nzContent: msg,
      nzOkText: '确定'
    });
  }

  // 显示警告消息的模态窗口
  public static ShowWarningModal(modalService: NzModalService, msg: string): void {
    modalService.warning({
      nzTitle: '警示：',
      nzContent: msg,
      nzOkText: '确定'
    });
  }

  // 显示确认模态窗口
  public static ShowConfirm(modalService: NzModalService, question: string,
    content: string,
    okFun: () => (false | void | {}) | Promise<false | void | {}>): void {
    modalService.confirm({
      nzTitle: `<i> ${question} ?</i>`,
      nzContent: `<b> ${content} </b>`,
      nzOnOk: () => {
        okFun();
      }
    });
  }

  // 显示删除询问模态窗口
  public static ShowDeleteConfirm(modalService: NzModalService,
    content: string,
    okFun: () => (false | void | {}) | Promise<false | void | {}>,
    cancelFun: () => (false | void | {}) | Promise<false | void | {}>): void {
    modalService.confirm({
      nzTitle: '您确定要删除此项数据吗?',
      nzContent: `<b style="color: red;"> ${content}</b>`,
      nzOkText: '是',
      nzOkType: 'danger',
      nzOnOk: () => {
        okFun();
      },
      nzCancelText: '否',
      nzOnCancel: () => {
        cancelFun();
      }
    });
  }

}
