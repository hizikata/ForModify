import { Injectable } from '@angular/core';

@Injectable()
export class FormHelperService {

  constructor() { }
  public MapT<T1, T2>(source: T1, dest: T2): void {
    for (const key of Object.keys(source)) {
      if (dest.hasOwnProperty(key)) {
        dest[key] = source[key];
      }
    }
  }
  // 向数组中添加对象
  AddTo<T>(list: T[], data: T, isExistInArray: boolean): T[] {
    const datas = list;
    if (!isExistInArray) {
      list.push(data);
    }
    list = [...datas];
    return list;
  }

  // 移除数组中的元素
  Remove<T>(list: T[], removeFn: (array: T[]) => void): T[] {
    const dataset = list;
    removeFn(dataset);
    list = [...dataset];
    return list;
  }
}
