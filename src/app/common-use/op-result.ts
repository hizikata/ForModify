/**
 * 操作结果类
 */
export class OpResult {
    constructor(
        public RequestId: string,
        public Success: boolean,
        public ErrorMessage: string,
        public Code: string,
        public Data: object,
    ) { }
}
