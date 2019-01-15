
/**
 * 设备信息模型
 */
export class EquipmentInfoDto {
    constructor(
        // 是否是法兰克机台
        public IsFanuc: Boolean,
        public MachineId: any,
        public Name: string,
        public ErrMsg: string,
        public IpAddress: string,
        public Port: number,
        public State: MachineStateModel,
        public DriveProgram: number,
        public IsConnected: boolean,
        public Refresh: number,
        public GatherGroup: string,
    ) { }
}

/**
 * 设备状态模型
 */
export class MachineStateModel {
    constructor(
        public State: number,
        /**工件编号 */
        public WorkpieceId: string,
        public Program: string,
        /**开始时间 */
        public StartTime: Date,
        /**耗时 */
        public TakenTime: Date,
        /**经过转换用于显示的耗时 */
        public DisplayTakenTime: string,
        /**剩余时间 */
        public SurplusTime: string,
        /**备刀剩余时间 */
        public KnifeTime: string,
        public ProgramRunTime: Date,
        public Progress: string,
        public YieldGood: number,
        public YieldBad: number,
    ) { }
}

export class MachineModel {
    constructor(
        public MachineId: string,
        public Name: string,
    ) { }
}


/**
 * 程序信息模型
 */
export class ProgramInfoDto {
    constructor(
        /**程序名称 */
        public ProgramName: string,
        /**说明 */
        public Description: string,
        /**计划时间 */
        public PlanTim: Date,
        /**状态 */
        public State: string,
        /**开始时间 */
        public StartDate: Date,
        /**耗时 */
        public ConsumingTime: Date,
        public OpSign: number,
    ) { }
}


export class SopFile {
    constructor(
        public ProductId: string,
        public FileName: string,
    ) { }
}


// ---------------------- 11-24日模型重新制作---------------------------------



/**
 * 模具模型（总目录)
 */
export class MouldModel {
    constructor(
        /**模具编号 */
        public MouldId: string,
        /**模具名称 */
        public MouldName: string,
        /**状态 */
        public State: string,
        /**计划完成时间 */
        public PlanOverMachiningDate: Date,
        /**模具类型 */
        public MouldType: string,
    ) { }
}

export class MouldModelQueryDto {

    constructor(
        /**模具名称 */
        public MouldName: string,
        /**模具编号 */
        public MouldId: string,
        /**模具类型 */
        public MouldType: string
    ) { }
}

/**
 * 工件模型
 */
export class WorkpieceModel {
    constructor(
        public _id: string,
        /**模具编号 */
        public MouldId: string,
        /**模具名称 */
        public MouldName: string,
        /**模具类型(接单类型) */
        public MouldType: string,
        /**模具计划完成日期 */
        public MouldPlangDate: Date,
        /**工件编号 */
        public WorkpieceId: string,
        /**工件名称 */
        public WorkpieceName: string,
        /**产品Id */
        public ProductId: string,
        /**状态 */
        public State: string,
        /**状态操作记录 */
        public StateOpRecords: StateModel[],
        /**分配的机台编号 */
        public MachineId: string,
        /**加工工艺 */
        public MachiningProcess: string,
        /**工序代码 */
        public MachiningProcessId: string,
        /**计划完成日期 */
        public PlanOverMachiningDate: Date,
        /**实际完成时间 */
        public OverMachiningDate: Date,
        /**计划加工耗时 格式：小时：分钟：秒 */
        public PlanMachingTime: string,
        /**上传的文件名称 */
        public SopFileName: string,
        /**文件Id 在MongoDB中的ObjectId */
        public SopFileId: string,
        /**操作员 */
        public OpUser: string,
        /**首检确认(四个签名使用逗号隔开)*/
        public OneOperationUser: string,
        /**上传时间 */
        public UpDateTime: Date,

    ) { }
}

export class WorkpieceQueryDto {
    constructor(
        /**模具Id */
        public WorkpieceId: string,
        /**模具名称 */
        public MouldName: string,
        /**模具类型(接单类型) */
        public MouldType: string,
        /**机台 */
        public MachineId: string,
        /**当前状态 */
        public State: string,
    ) { }
}

/**
 * 工序模型
 */
export class ProcessModel {
    constructor(
        /**工序代码 */
        public Code: string,
        /**工序名称 */
        public Name: string,
    ) { }
}

export class StateModel {
    constructor(
        /**操作时间 */
        public OpTime: Date,
        /**操作状态 */
        public OpState: string,
    ) { }
}



/**
 * 程序单模型
 */
export class CNCProgramModel {
    constructor(
        public _id: string,
        /**工件编号 */
        public WorkpieceId: string,
        /**程序名称 */
        public ProgramNam: string,
        /**状态 */
        public State: string,
        /**类型 */
        public type: string,
        /**刀具 */
        public Knife: string,
        /**刀具编号 */
        public KnifeNum: string,
        /**刀具长度 */
        public KinfeLength: string,
        /**刀刃长度 */
        public KinfeBladeLength: string,
        /**进给 */
        public Feed: string,
        /**深度 */
        public Depth: string,
        /**余量 */
        public Surplus: string,
        /**转速 */
        public Speed: string,
        /**加工时间 */
        public MachiningTime: string,
        /**说明 */
        public Remarks: string,
        /**备注 */
        public Note: string,
    ) { }
}

/**
 * 添加程序单对象模型
 */
export class AddProgramListDto {
    constructor(
        /**工件编号 */
        public WorkpieceId: string,
        /**工件名称 */
        public WorkpieceName: string,
        /**工序代码 */
        public MachiningProcess
            : string,
    ) { }
}

/**
 * 登录用户对象模型
 */
export class LoginUserDto {
    constructor(
        /**用户Id */
        public UserId: string,
        /**用户名称 */
        public UserName: string,
        /**用户密码 */
        public Password: string,
    ) { }
}

/**
 * 开始加工前四步签名验证
 */
export class ValidationBeforeStartProgressDto {
    constructor(
        /**装夹、基准确认 */
        public StandardValidation: string,
        /**校正(分中)工作 */
        public Calibration: string,
        /**X/Y//Z碰数 */
        public CoordinateAxis: string,
        /**检查再次确认 */
        public CheckOnceMore: string,
    ) { }
}



/**
 * 机台利用率看板
 */
export class MachineOeeModel {
    constructor(
        /**设备编号 */
        public MachineId: string,
        /**设备名称 */
        public Name: string,
        /**运行时间 */
        public RunTime: number,
        /**待机时间 */
        public StandbyTime: number,
        /**停机时间 */
        public PowerOffTime: number,
        /**报警时间 */
        public AlertTime: number,
    ) { }
}


/**
 * 机台利用率查询
 */

export class MachineOeeQuery {
    constructor(
        public StartDate: Date,
        public EndDate: Date,
    ) { }
}

/**
 * 饼图的对象模型
 */
export class PieDataTemplate {
    constructor(
        /**值 */
        public value: number,
        /**显示名称 */
        public name: string,
        /**颜色对象 */
        public itemStyle: ColorTemplate,
    ) { }
}

/**
 * 颜色模型
 */
export class ColorTemplate {
    constructor(
        public color: string,
    ) { }
}


// ------------------设备终端------------------------------------

export class WorkpieceDataQueryDto {
    constructor(
        public StartDate: Date,
        public EndDate: Date,
    ) { }
}


// -----------------设备故障率看板------------------------------
/**
 * 设备故障率
 */
export class MachineFaultRateModel {
    constructor(
        /**设备编号 */
        public MachineId: string,
        /**设备名称 */
        public MachineName: string,
        /**开始时间 时间格式*/
        public StratTime: string,
        /**结束时间 */
        public EndTime: string,
        /**故障时间 单位：分钟 */
        public FaultTime: number,
        /**故障代码 */
        public FailureCode: string,
        /**故障原因 */
        public CauseOfFailure: string,

    ) { }
}

export class MachineFaultRateQueryDto {
    constructor(
        public StartDate: Date,
        public EndDate: Date,
    ) { }
}


/**
 * 用于设备故障率图表显示的模型
 */
export class MachineFaultRateDisplayDto {
    constructor(
        /**机台编号 */
        public MachineId: string,
        /**机台名称 */
        public MachineName: string,
        /**故障时间 单位：分钟 */
        public FaultTime: number,
        /**故障代码 */
        public FailureCode: string,
        /**故障原因 */
        public CauseOfFailure: string,
    ) { }
}


