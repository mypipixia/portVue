const isArrOrObj = (val) => {
  let flag = Object.prototype.toString.call(val);
  let kind = 'String';
  if (flag == '[object Object]') {
    kind = 'object';
  } else if (flag == '[object Array]') {
    kind = 'array';
  }
  return kind;
};

//渲染input
const renderInput = (h, ctx, item, formData, key) => {
  let value = formData[key];
  let { ph = '', inputType = '' } = item;
  return h('el-input', {
    attrs: {
      value,
      placeholder: ph,
      type: inputType
    },
    on: {
      input(v) {
        bindForm(v, key, ctx);
      }
    }
  });
};

//渲染时间选择器
const renderDate = (h, ctx, item, formData, key) => {
  let value = formData[key];
  let { ph = '', prop = {} } = item;
  return h('el-date-picker', {
    attrs: {
      value,
      placeholder: ph,
      ...prop
    },
    style: {
      width: '100%'
    },
    on: {
      input(v) {
        bindForm(v, key, ctx);
      }
    }
  });
};

//渲染下拉框
const renderSelect = (h, ctx, item, formData, key) => {
  let value = formData[key];
  let {
    ph = '',
    options,
    disabled = false,
    optionsKey = { label: 'label', value: 'value' }
  } = item;
  let arr = [];
  if (options.length > 0) {
    options.forEach((item) => {
      arr.push(
        h('el-option', {
          attrs: {
            label: item[optionsKey.label],
            value: item[optionsKey.value]
          }
        })
      );
    });
  }
  return h(
    'el-select',
    {
      attrs: {
        value,
        placeholder: ph,
        filterable: true,
        disabled
      },
      style: {
        width: '100%'
      },
      on: {
        input(v) {
          bindForm(v, key, ctx);
        }
      }
    },
    arr
  );
};

const validateNum = (rule, value, callback) => {
  if (!value) {
    callback();
  }
  let flag = /^[-+]?\d+(\.\d{0,1}[1-9])?$/.test(value);
  if (!flag) {
    callback(new Error(rule.message));
  }
  callback();
};

const validatePhone = (rule, value, callback) => {
  let flag = /^1[3456789]\d{9}$/.test(value);
  if (!flag) {
    callback(new Error(rule.message));
  }
  callback();
};
const ruleArr = (kind, label) => {
  let parm = null;
  switch (kind) {
    case 'num':
      parm = { validator: validateNum, message: `${label}必须为数字值` };
      break;
    case 'phone':
      parm = { validator: validatePhone, message: `请输入正确的电话号码` };
      break;
    default:
      parm = false;
      break;
  }
  return parm;
};

const ruleKindArr = (kind, label) => {
  let flag = isArrOrObj(kind);
  let arr = [];
  if (flag == 'array' && kind.length > 0) {
    kind.forEach((item) => {
      let flag = ruleArr(item, label);
      flag && arr.push(flag);
    });
  } else {
    let flag = ruleArr(kind, label);
    flag && arr.push(flag);
  }
  return arr;
};

//处理验证规章
const handerRule = (rules, required, ruleKind, item) => {
  let ruleKindArrs = ruleKindArr(ruleKind, item.label);
  let ruleArr = [];
  if (required) {
    ruleArr.push({
      required: true,
      message: `必须填写${item.label}`
    });
  }
  let flag = isArrOrObj(rules);
  if (flag == 'object' && JSON.stringify(rules) != '{}') {
    ruleArr.push(rules);
  } else if (flag == 'array' && rules.length > 0) {
    ruleArr = ruleArr.concat(rules);
  }
  return ruleArr.concat(ruleKindArrs);
};

const renderChildren = (h, ctx, item, formData, key) => {
  let { type, label, rules, required = false, ruleType } = item;
  let children = [];
  let formItem = [];
  const renderObj = {
    input: renderInput,
    select: renderSelect,
    date: renderDate
  };
  !!renderObj[type] &&
    children.push(renderObj[type](h, ctx, item, formData, key));
  let rulesArr = handerRule(rules, required, ruleType, item);
  formItem.push(
    h(
      'el-form-item',
      {
        attrs: {
          label,
          prop: key,
          rules: rulesArr
        }
      },
      children
    )
  );
  return formItem;
};
const bindForm = (v, key, ctx) => {
  let { listeners } = ctx;
  !!listeners.bindForm && listeners.bindForm(v, key);
};
export default {
  inheritAttrs: false,
  functional: true,
  render(h, ctx) {
    let {
      props: { renderArr, formData }
    } = ctx;
    let elmData = [];
    Object.keys(renderArr).forEach((key) => {
      const item = renderArr[key];
      const el = h(
        'el-col',
        {
          attrs: {
            span: item.span || 24
          }
        },
        renderChildren(h, ctx, item, formData, key)
      );
      elmData.push(el);
    });
    return elmData;
  }
};
