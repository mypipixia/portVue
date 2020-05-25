//系统常量

//vue持久化缓存
export const vuex_key = "_web_rep_";
//cookie账号密码key
// 记住密码的cookie
export const cookie_user_key = "__ACCOUNT__KEY__";
// 默认记住7天
export const cookie_time = 24 * 7 * 60 * 60 * 1000;

export const JD_ARR = [
  {
    label: "第一季度",
    value: 1
  },
  {
    label: "第二季度",
    value: 2
  },
  {
    label: "第三季度",
    value: 3
  },
  {
    label: "第四季度",
    value: 4
  }
];

export const JD_ARRs = {
  第一季度: 1,
  第二季度: 2,
  第三季度: 3,
  第四季度: 4
};

//审核状态
export const STA_STU = ["草稿", "审核中", "已审核", "驳回", "停用"];

//月份
export const STA_STUMonth = {
  第一季度: [
    {
      label: "1"
    },
    {
      label: "2"
    },
    {
      label: "3"
    }
  ],
  第二季度: [
    {
      label: "4"
    },
    {
      label: "5"
    },
    {
      label: "6"
    }
  ],
  第三季度: [
    {
      label: "7"
    },
    {
      label: "8"
    },
    {
      label: "9"
    }
  ],
  第四季度: [
    {
      label: "10"
    },
    {
      label: "11"
    },
    {
      label: "12"
    }
  ]
};

export const monthJdArr = [
  1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4
]