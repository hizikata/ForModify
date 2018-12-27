import { FormGroup } from '@angular/forms';
import * as _ from 'lodash';
import { isObject, isArray, isString, isNull } from 'util';

export class FormHelper {
    // 提交前进行验证(验证什么？？)
    public static ValidateBeforeSubmit(form: FormGroup): void {
        for (const i in form.controls) {
            if (true) {
                form.controls[i].markAsDirty();
                form.controls[i].updateValueAndValidity();
            }

        }
    }

    // 提交表单
    public static YGSubmitForm<T>(obj: T, form: FormGroup, fn: (arg: T) => void | null): void {
        // FormHelper.ValidateBeforeSubmit(form);
        if (form.valid) {
            FormHelper.SetFormValueToT<T>(obj, form);
            fn(obj);
        }
    }

    // 将对象的值赋给表单以更新表单的值
    public static SetTValueToForm<T>(obj: T, form: FormGroup, ignoreFields?: string[] | string): void {
        if (!isObject(obj)) {
            return;
        }
        for (const key of Object.keys(obj)) {
            if (obj.hasOwnProperty(key)) {
                const ctl = form.get(key);
                if (!isNull(ctl)) {
                    if (ignoreFields !== undefined) {
                        if (isArray(ignoreFields)) {
                            if (_.find(ignoreFields, f => f === key) !== null) {
                                // do nothing
                            } else {
                                ctl.patchValue(obj[key]);
                            }
                        } else if (isString(ignoreFields)) {
                            if (ignoreFields === key) {
                                // do nothing
                            } else {
                                ctl.patchValue(obj[key]);
                            }
                        }
                    } else {
                        ctl.patchValue(obj[key]);
                    }
                }
            }
        }
    }

    // 将表单的值赋值给对象
    public static SetFormValueToT<T>(obj: T, form: FormGroup): void {
        if (!isObject(obj)) {
            return;
        }

        for (const key of Object.keys(obj)) {
            if (obj.hasOwnProperty(key)) {
                const ctl = form.get(key);
                if (!isNull(ctl)) {
                    obj[key] = ctl.value;
                }
            }
        }
    }

    // 映射对象
    public static MapT<T1, T2>(source: T1, dest: T2): void {
        for (const key of Object.keys(source)) {
            if (dest.hasOwnProperty(key)) {
                dest[key] = source[key];
            }
        }
    }

    // 设定选中项的状态
    public static SetSelectedItemStatus<T>(list: T[], item: T, ptyName = 'isSelected'): void {
        list.forEach(d => {
            d[ptyName] = false;
        });
        item[ptyName] = true;
    }

    // 向数组中添加对象
    public static AddTo<T>(list: T[], dto: T, predicate: (this: void, value: T, index: number, obj: Array<T>) => boolean): T[] {
        const datas = list;
        const data = list.find(predicate);
        if (data === undefined) {
            list.push(dto);
        }
        list = [...datas];
        return list;
    }

    // 移除数组中的元素
    public static Remove<T>(list: T[], predicate: (this: void, value: T, index: number, obj: Array<T>) => boolean): T[] {
        const dataset = list;
        _.remove(list, predicate);
        list = [...dataset];
        return list;
    }
}


