import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-staff-efficiency-display',
  templateUrl: './staff-efficiency-display.component.html',
  styleUrls: ['./staff-efficiency-display.component.css']
})
export class StaffEfficiencyDisplayComponent implements OnInit {

  public option1: any;
  constructor() {

  }
  ngOnInit() {

    this.option1 = {
      backgroundColor: '#404A59',
      color: ['#ffd285', '#ff733f', '#ec4863'],

      title: {
        backgroundColor: '#fff',
        show: true,
        text: '组合图',
        link: 'https://www.baidu.com/index.php?tn=monline_3_dg',
        left: '40%',
        top: '6%',
        textStyle: {
          color: '#ffd285'
        }
      },
      tooltip: {
        /*trigger: 'item',
        formatter: "{a} <br/>{b} : {c}",
        formatter: function(params) {
            return params.seriesType
            return params.name+':'+params.value
        }*/
      },
      legend: {
        x: '30%',
        bottom: '1%',
        textStyle: {
          color: '#ffd285',
        },
        // data: ['郑州', '永城', '新乡']
        data: [{
          name: '郑州',
          // icon: 'circle',
          textStyle: { color: 'red' },
        }, {
          name: '永城',
          icon: 'circle',
          textStyle: { color: 'red' },
        }, {
          name: '新乡',
          icon: 'circle',
          textStyle: { color: 'red' },
        }],
        backgroundColor: '#fff'
      },
      radar: {
        name: {
          show: true,
          color: '#fffaaa',
        },
        indicator: [{
          name: '销售',
          max: 6500
        }, {
          name: '管理',
          max: 16000
        }, {
          name: '信息技术',
          max: 30000
        }, {
          name: '客服',
          max: 38000
        }, {
          name: '研发',
          max: 52000
        }, {
          name: '市场',
          max: 25000,
          color: '#ff6600'
        }],
        center: ['83%', '85%'],
        radius: 80,
        startAngle: 120,
        axisLine: {
          show: true,
          lineStyle: {
            type: 'solid'
          }
        }
        // shape : 'circle'
      },
      grid: {
        // show:true,
        left: '10%',
        right: '45%',
        top: '16%',
        bottom: '16%',
        containLabel: true
      },
      toolbox: {
        'show': false,
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        // show:false,
        type: 'category',
        axisLine: {
          // show:false,
          onZero: false,
          lineStyle: {
            color: '#fff'
          }
        },
        axisTick: {
          'show': true,
          // length: 15,
        },
        axisLabel: {
          // show:false,
          // rotate:45,
          textStyle: {
            color: '#ffd285'
          }
        },
        splitArea: {
          show: true
        },
        boundaryGap: true, // false时X轴从0开始
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      },
      yAxis: {
        // show:false,
        'axisLine': {
          // show:false,
          lineStyle: {
            color: '#c0576d'
          }
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#c0576d'
          }
        },
        'axisTick': {
          show: true
        },
        axisLabel: {
          // show:false,
          textStyle: {
            color: '#ffd285'
          }
        },
        type: 'value'
      },
      dataZoom: [
        {
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          // start: 0,
          end: 100,
          bottom: '10%',
          startValue: '周二'
        },
        {
          type: 'slider',
          show: true,
          yAxisIndex: [0],
          textStyle: {
            color: '#ff6600'
          },
          left: '60%',
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          xAxisIndex: [0],
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          yAxisIndex: [0],
          start: 0,
          end: 100
        }
      ],
      /*visualMap: [
          {
              type: 'continuous',
              min:0,
              max:200,
              left:20,
              range: [15,100],//手柄位置
              realtime: true,
              calculable : true,
          }
          {
              type:'piecewise',
              left:20,
              textStyle:{
                  color:'#fff'
              },
              pieces: [
                  {min: 1500}, // 不指定 max，表示 max 为无限大（Infinity）。
                  {min: 900, max: 1500},
                  {min: 310, max: 1000},
                  {min: 200, max: 300},
                  {min: 10, max: 200, label: '10 到 200'},
                  {value: 123, label: '123（自定义特殊颜色）', color: 'grey'}, // 表示 value 等于 123 的情况。
                  {max: 5}     // 不指定 min，表示 min 为无限大（-Infinity）。
              ]
          }
      ],*/
      series: [{
        name: '郑州',
        smooth: true,
        type: 'line',
        lineStyle: {
          normal: {
            color: '#ffff00',
            opacity: 10
          }
        },
        itemStyle: {
          normal: {
            color: '#ff6600'
          },
          emphasis: {
            color: '#ff6600'
          }
        },
        areaStyle: {
          normal: {
            color: '#ff6600'
          },
        },
        symbolSize: 8,
        // symbol: 'circle',
        data: [10, 50, 39, 50, 120, 82, 80],
        markPoint: {
          label: {
            normal: {
              show: true,
              color: '#ff0066'
            },
            emphasis: {
              show: true,
              color: '#ff9900'
            }
          },
          data: [
            {
              name: '最大值',
              type: 'min'
            }
          ]
        }
      }, {
        name: '永城',
        smooth: true,
        type: 'bar',
        symbolSize: 8,
        // symbol: 'circle',
        /*markLine:{
            lineStyle:{
                normal:{
                    type: 'solid',
                    color:'#ff9900'
                },
                emphasis:{
                    type: 'solid',
                    color:'#fff'
                }
            },
            data: [
                {
                    name: '平均线',
                    // 支持 'average', 'min', 'max'
                    type: 'average'
                },
                {
                    name: 'Y 轴值为 100 的水平线',
                    yAxis: 100
                },
                [
                    {
                        // 起点和终点的项会共用一个 name
                        name: '最小值到最大值',
                        type: 'min'
                    },
                    {
                        type: 'max'
                    }
                ],
                [
                    {
                        name: '两个坐标之间的标线',
                        coord: ['周三', 65]
                    },
                    {
                        coord: ['周三', 120]
                    }
                ], [{
                    // 固定起点的 x 像素位置，用于模拟一条指向最大值的水平线
                    yAxis: 'min',
                    x: '70%'
                }, {
                    type: 'min'
                }]
            ]
        },*/
        data: [70, 50, 50, 87, 90, 80, 70]
      }, {
        name: '新乡',
        smooth: true,
        type: 'bar',
        symbolSize: 8,
        // symbol: 'circle',
        /*markArea:{
            itemStyle:{
                normal:{
                    type: 'solid',
                    color:'#ff9900'
                },
                emphasis:{
                    type: 'solid',
                    color:'#fff'
                }
            },
            data: [
                [
                    {
                        name: '平均值到最大值',
                        type: 'average'
                    },
                    {
                        type: 'max'
                    }
                ],
                [
                    {
                        name: '两个坐标之间的标域',
                        coord: ['周二', 50]
                    },
                    {
                        coord: ['周三', 60]
                    }
                ]
            ]
        },*/
        data: [290, 200, 20, 132, 15, 200, 90]
      }, {
        type: 'pie',
        name: '饼图',
        center: ['83%', '20%'],
        radius: ['15%', '20%'],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        label: {
          normal: {
            position: 'center'
          },
          emphasis: {
            show: true,
            color: '#ff6600',
          }
        },
        data: [{
          value: 335,
          name: '污染来源分析',
          itemStyle: {
            normal: {
              color: '#ffd285'
            }
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          label: {
            normal: {
              formatter: '{d} %',
              textStyle: {
                color: '#ffd285',
                fontSize: 20

              }
            }
          }
        }, {
          value: 180,
          name: '占位',
          tooltip: {
            show: false
          },
          itemStyle: {
            normal: {
              color: '#404A59'
            }
          },
          label: {
            normal: {
              textStyle: {
                color: '#ffd285',
              },
              formatter: '\n汽车尾气'
            }
          }
        }]
      }, {
        type: 'pie',
        center: ['83%', '50%'],
        radius: ['15%', '20%'],
        name: '饼图',
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        label: {
          normal: {
            textStyle: {
              color: '#ffd285',
            },
            formatter: '{b}: {c} ({d}%)'
          }
        },
        data: [{
          value: 335,
          name: '直接访问',
          itemStyle: {
            normal: {
              color: '#FF0000'
            }
          }
        }, {
          value: 310,
          name: '邮件营销',
          itemStyle: {
            normal: {
              color: '#FFFF00'
            }
          }
        }, {
          value: 234,
          name: '联盟广告',
          itemStyle: {
            normal: {
              color: '#00FF00'
            }
          }
        }, {
          value: 135,
          name: '视频广告',
          itemStyle: {
            normal: {
              color: '#1E90FF'
            }
          }
        }, {
          value: 1548,
          name: '搜索引擎',
          itemStyle: {
            normal: {
              color: '#ADFF2F'
            }
          }
        }]
      },

      {
        type: 'radar',
        center: ['83%', '85%'],
        symbolSize: 4,
        symbolRotate: 120,
        // radius: ['15%', '20%'],
        // name: '雷达',
        tooltip: {

        },
        data: [{
          value: [4300, 10000, 28000, 35000, 50000, 19000],
          name: '预算分配'
        }, {
          value: [5000, 14000, 28000, 31000, 42000, 21000],
          name: '实际开销'
        }]
      }
      ]
    };
  }

}

