// config配置
export const phoneListConfig = {
  // 表格的key
  includes: ["userName", "idCard", "score", "count"],
  // 对key进行格式化
  formatters: {
    userName: {
      title: "机主姓名"
    },
    idCard: {
      title: "身份证",
      // 设置表格宽度
      width: 140
    },
    score: {
      title: "话单积分"
    },
    count: {
      title: "话单记录(条)",
      // 对该列进行单独的格式化
      formatter: (val, row) => {
        // row 数据行对象，val 当前键的值
        return val;
      }
    }
  }
};

// fnGetData数据格式
[
  {
    intimacy: 92,
    object: "孙德利 与 汪勇",
    dimension:
      "同行-飞机:3,  银行卡转账:81,  同住:1,  同行-大巴:3,  同行-火车:4"
  },
  {
    intimacy: 81,
    object: "孙德利 与 吴建立公司",
    dimension: "投资:1,  银行卡转账:80"
  }
];
