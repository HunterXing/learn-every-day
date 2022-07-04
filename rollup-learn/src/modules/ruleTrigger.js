/**
 * 用于生成表单校验，指定正则规则的触发方式。
 * 未在此处声明无触发方式的组件将不生成rule！！
 */
export default {
  'selectDialog': 'change',
  'el-input': 'blur',
  'select-tree': 'change',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-transfer': 'change',
  'el-cascader': 'change',
  'el-tree': 'change',
  'el-tabs': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-date-picker': 'change',
  'el-time-select': 'change',
  'el-rate': 'change',
  'el-upload': 'change',
  tinymce: 'blur'
}
