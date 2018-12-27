import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginUserDto } from 'src/app/data-models';
import { CurrentUserDto } from '../../login/current-user-dto';
import { MsgHelper } from 'src/app/common-use/msg-helper';
import { FormHelper } from 'src/app/common-use/form-helper';
import { NzModalService } from 'ng-zorro-antd';
import { FullScreen } from 'src/app/common-use/full-screen';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  isCollapsed = true;
  // triggerTemplate = null;
  // @ViewChild('trigger') customTrigger: TemplateRef<void>;
  // productTitle = '管理平台';

  // 用户登录验证字段
  currentLoginUserName: string;
  /**是否显示验证用户对话框 */
  isShowValidateLoginUser = false;
  validateLoginUserForm: FormGroup;
  validateLoginUserFormData: LoginUserDto;

  /**可供验证的用户 */
  loginUserList: LoginUserDto[] = [
    {
      UserId: 'admin',
      UserName: '管理员',
      Password: '123321',
    },
  ];

  isFullScreen = false;

  constructor(
    private modalService: NzModalService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.validateLoginUserFormData = null;
    this.currentLoginUserName = CurrentUserDto.CurrentUser.UserName;
    // 页面初始化时添加权限验证 需要输入密码
    if (!CurrentUserDto.IsLogin) {
      this.validateLoginUserFormData = this.initLoginUserDto();
      this.validateLoginUserFormData.UserName = '管理员';
      this.createValidateLoginUserForm(this.validateLoginUserFormData);
      this.isShowValidateLoginUser = true;
    }
  }

  // 用户验证form区域

  initLoginUserDto(): LoginUserDto {
    return new LoginUserDto(null, null, null);
  }
  createValidateLoginUserForm(dto: LoginUserDto): void {
    this.validateLoginUserForm = this.fb.group({
      UserId: [dto.UserId],
      UserName: [dto.UserName, [Validators.required]],
      Password: [dto.Password]
    });
  }
  submitValidateLoginUserForm(value: any): void {
    console.log(value);
    FormHelper.YGSubmitForm(this.validateLoginUserFormData, this.validateLoginUserForm, dto => {
      const userArray: LoginUserDto[] = this.loginUserList.filter(item => {
        return (item.UserName === dto.UserName.trim() && item.Password === dto.Password.trim());
      });
      if (userArray.length !== 0) {
        this.validateLoginUserFormData = dto;
        CurrentUserDto.CurrentUser = dto;
        CurrentUserDto.IsLogin = true;
        this.currentLoginUserName = CurrentUserDto.CurrentUser.UserName;
        MsgHelper.ShowSuccessModal(this.modalService, `登录成功，当前用户:${dto.UserName}`);
        this.isShowValidateLoginUser = false;
      } else {
        MsgHelper.ShowErrorModal(this.modalService, '用户名或密码错误！');
        CurrentUserDto.IsLogin = false;
        this.validateLoginUserFormData = this.initLoginUserDto();
        CurrentUserDto.CurrentUser = this.validateLoginUserFormData;
        this.currentLoginUserName = '';
      }
      this.isCollapsed = true;
    });
  }

  resetValidateLoginUserForm($event): void {
    CurrentUserDto.IsLogin = true;
    this.validateLoginUserFormData = this.initLoginUserDto();
    this.validateLoginUserForm.reset();
    CurrentUserDto.CurrentUser = this.initLoginUserDto();
    CurrentUserDto.CurrentUser.UserName = '一般用户';
    this.currentLoginUserName = '一般用户';
    this.isShowValidateLoginUser = false;
    this.isCollapsed = true;
  }

  logout(): void {
    CurrentUserDto.CurrentUser = new LoginUserDto(null, null, null);
    this.currentLoginUserName = '';
    this.isShowValidateLoginUser = true;
    this.validateLoginUserFormData = this.initLoginUserDto();
    this.validateLoginUserFormData.UserName = '管理员';
    this.createValidateLoginUserForm(this.validateLoginUserFormData);
  }

  fullScreen() {
    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      FullScreen.launchFullscreen(document.documentElement);
    } else {
      FullScreen.exitFullscreen();
    }

  }

}
