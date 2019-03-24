
/**
 * 顶部菜单栏模型
 */
export class TopMenuDto {
  constructor(
    public IsSelect: boolean,
    public MenuName: string,
    public RouterLink: string
  ) { }
}



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
    /**模具 */
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
// export class MachineOeeModel {
//   constructor(
//     /**设备编号 */
//     public MachineId: string,
//     /**设备名称 */
//     public Name: string,
//     /**运行时间 */
//     public RunTime: number,
//     /**待机时间 */
//     public StandbyTime: number,
//     /**停机时间 */
//     public PowerOffTime: number,
//     /**报警时间 */
//     public AlertTime: number,
//   ) { }
// }


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
    public MachineId: string,
    public MachineName: string,
    public StartDate: Date,
    public EndDate: Date,
    public Name: string,
  ) { }
}


// -----------------设备故障率看板------------------------------
/**
 * 设备故障率
 */
// export class MachineFaultRateModel {
//   constructor(
//     /**设备编号 */
//     public MachineId: string,
//     /**设备名称 */
//     public MachineName: string,
//     /**开始时间 时间格式*/
//     public AlertStartTime: string,
//     /**结束时间 */
//     public AlertEndTime: string,
//     /**故障时间 单位：分钟 */
//     public AlertTime: number,
//     /**故障代码 */
//     public StateMsg: string,
//     /**故障原因 */
//     public CauseOfFailure: string,

//   ) { }
// }

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


/**
 * 设备开机看板
 */
export class MachineRunRateModel {
  constructor(
    public MachineId: string,
    public MachineName: string,
    /**运行时间 */
    public RunTime: string,
    public RunTimeSecond: number,
    public RunRate: number,
    /**待机时间 */
    public StandbyTime: string,
    public StandbyTimeSecond: number,
    public StandbyRate: number,
    /**停机时间 */
    public PowerOffTime: string,
    public PowerOffTimeSecond: number,
    public PowerOffRate: number,
    /**报警时间 */
    public AlertTime: string,
    public AlertTieSecond: number,
    public AlertRate: number,

    public RecordDateTime: Date,
    public RecordTimeStamp: string,
    public selectDate: string,
  ) { }
}


/**
 * 设备故障率
 */
export class MachineAlertRateModel {
  constructor(
    public MachineId: string,
    public MachineName: string,
    /**开始时间 */
    public AlertStartTime: Date,
    /**结束时间 */
    public AlertEndTime: Date,
    /**故障时间 单位：分钟 */
    public AlertTime: string,
    public AlertTimeSecond: number,
    /**故障原因*/
    public AlermMsg: string,
    public RecordDateTime: Date,
    public RecordTimeStamp: Date,
    public SelectDate: string,
    public selectDate: Date,
  ) { }
}

export class MesOrderModel {
  constructor(
    /**模具编号+工件编号+CNC编号 应为唯一值 */
    public OrderId: string,
    /**模具编号 */
    public MouldId: string,
    /**模具名称 */
    public MouldName: string,
    /**模具类型 */
    public MouldType: string,
    /**模具计划完成时间 */
    public MouldPlangDate: Date,
    /**实际完成时间 */
    public MouldOverMachiningDate: Date,
    /**计划加工时长 */
    public MouldPlanMachingTime: string,
    /**实际加工时长 */
    public MouldMachineTime: string,
    /**实际开始时间 */
    public MouldMachineStartTime: Date,
    /**实际停止时间 */
    public MouldMachineStopTime: Date,

    /**工件编号 */
    public ProductId: string,
    /**工件名称 */
    public ProductName: string,
    /**工件状态 */
    public ProductState: string,


    public WorkpieceId: string,
    public WorkpieceName: string,
    public WorkpieceState: string,
    public WorkpieceMachineId: string,
    public WorkpieceOpUser: string,
    public SopFileId: string,
    public WorkpiecePlangDate: Date,
    public WorkpieceOverMachiningDate: Date,
    public WorkpiecePlanMachingTime: string,
    public WorkpieceMachineTime: string,
    public WorkpieceMachineStartTime: Date,
    public WorkpieceMachineStopTime: Date,
    public ProgramType: string,
    public ProgramName: string,
    public ProgramState: string,
    public ProgramIndex: string,
    public ProgramPlanMachiningTime: string,
    public ProgramMachiningTime: string,
    public ProgramMachineStartTime: Date,
    public ProgramMachineStopTime: Date,
  ) { }
}


export class RhBoardModel {
  constructor(
    public IsFanuc: Boolean,
    /**看板模型 */
    public RhId: number,
    /**设备编号 */
    public MachineId: string,
    /**设备名称 */
    public MachineName: string,
    public MachineState: number,
    /**报警信息 */
    public AlarmMsg: string,
    /**IP地址 */
    public IpAdress: string,
    /**模具编号 */
    public MouldId: string,
    /**产品ID */
    public ProductId: string,
    /**工件编号 */
    public WorkpieceId: string,
    /**加工进度 */
    public ProgramIndex: string,
    /**程序名称 */
    public ProgramNam: string,
    /**机器内部程序名称 */
    public MachineProgram: string,
    /**计划开始时间 */
    public ProgramPlanMachiningTime: string,
    /**开始加工时间 */
    public ProgramStartTime: string,
    /**加工耗时 */
    public ProgramTakenTime: string,
    /**加工剩余时间 */
    public ProgramSurplusTime: string,
    /**备刀剩余时间 */
    public ProgramKnifeSurplusTime: string,


  ) { }
}
