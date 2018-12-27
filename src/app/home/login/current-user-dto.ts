import { LoginUserDto } from 'src/app/data-models';

/**
 * 当前登录用户
 */
export class CurrentUserDto {
    public static CurrentUser: LoginUserDto = new LoginUserDto(null, null, null);
    public static IsLogin = false;
}
