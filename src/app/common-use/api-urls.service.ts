import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams, HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable()
export class ApiUrlsService {

  constructor(
    private http: HttpClient
  ) { }

  private webApiPort = 8080;
  private isLocal = false;
  // 服务器ip地址
  private ip = this.isLocal ? 'localhost' : '192.168.86.101';  // 192.168.86.101   192.168.81.79  '192.168.8.182'

  // 接口获取地址
  protected apiRootUrl = `http://${this.ip}:${this.webApiPort}/api/`;

  private GetApiOperateUrl(actionName: string): string {
    return this.apiRootUrl + actionName;
  }

  /// 产品管理平台API Post方法
  public GetPp<OutT>(actionName: string, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<OutT> {
    const url = this.GetApiOperateUrl(actionName);
    return this.http.get<OutT>(url, options);
  }

  public PostPp<InputT, OutT>(actionName: string, dto: InputT, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<OutT> {
    const url = this.GetApiOperateUrl(actionName);
    return this.http.post<OutT>(url, dto, options);
  }
}
