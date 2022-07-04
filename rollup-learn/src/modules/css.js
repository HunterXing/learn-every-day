const styles = {
  // 'selectDialog': '.el-dialog__wrapper{z-index: 3000 !important}\n' +
  //                 '.v-modal{z-index: 2999 !important}',
  'el-rate': '.el-rate{display: inline-block; vertical-align: text-top;}',
  'el-upload': '.el-upload__tip{line-height: 1.2;}\n' +
               '.file-btn-wrap{float:left;position:absolute;right:-300px;top:0px}\n' +
               '.file-btn-wrap .el-button{width:80px;height:28px}\n' +
               '.upload-wrap .el-upload-list--text{min-height:36px;padding-right: 88px;margin-top:-30px;border:solid #DCDFE6 1px;display:block!important;}\n' +
               '.upload-wrap .el-upload-list--text .el-upload-list__item{float:left;}\n' +
               `
               .upload-wrap .el-upload-list--text {
                  display: flex;
                  align-items: center;
                  padding-left: 4px;
                  overflow: hidden
               }
               .upload-wrap .el-upload-list__item {
                  margin: 2px;
                  margin-right: 5px;
                  float: left;
                  width: 47%;
                  display:inline-block;
                  height: 26px;
                  line-height: 26px;
                  background-color: rgba(0,122,255,.1);
               }
               .upload-wrap .el-upload-list__item-name {
                  margin-right: 0px;
               }
               .el-upload-list__item:first-child {
                  margin: 2px;
               }

               ` +
               '.el-upload-list--text .el-button--primary {color: #FFF;background-color: #007aff;border-color: #007aff;}\n' +
               '.upload-wrap .uploadButton {position: absolute;right: 0;top: 0px;border: solid #DCDFE6 1px;border-left: 0px;border-radius: 0;height: 100%;}',
  'el-table': '.table_find{width:40px;}',
  'el-card': '.el-card__body{padding:0px}',
  'el-collapse-item': '.el-collapse {\n' +
    '  position: relative;\n' +
    '  cursor: move;\n' +
    '  box-sizing: border-box;\n' +
    '  border-radius: 3px;\n' +
    '  border: 1px solid rgba(232, 232, 232, 1);\n' +
    '}\n' +
    '\n' +
    '.el-collapse-item__header {\n' +
    '  background-color: #f7f8fa;\n' +
    '  border-color: #EBEEF5;\n' +
    '  overflow: hidden;\n' +
    '  border-bottom: 1px solid #e8e8e8;\n' +
    '  transition: border-bottom-color .3s;\n' +
    '  outline: none;\n' +
    '  height: 38px;\n' +
    '  line-height: 38px;\n' +
    '  padding: 0 10px;\n' +
    '  font-size: 14px;\n' +
    '  position: relative;\n' +
    '  background: #f7f8fa;\n' +
    '}\n' +
    '\n' +
    '.el-collapse-item__header:hover {\n' +
    '  background: #fff;\n' +
    '  border-bottom: 1px solid #e8e8e8;\n' +
    '  color: #333;\n' +
    '}\n' +
    '\n' +
    '  .el-collapse-item__content {padding: 10px;min-height: 40px;}' +
    '.el-collapse-item__header:before {\n' +
    '    content: \'\';\n' +
    '    display: inline-block;\n' +
    '    position: absolute;\n' +
    '    left: 0;\n' +
    '    width: 3px;\n' +
    '    height: 20px;\n' +
    '    background: #007aff;' +
    '}\n',
  'el-card-title': '.el-card__header .clearfix{\n' +
    '    position: relative;\n' +
    '    margin:   0;    \n' +
    '    padding: 0 0 0 10px;\n' +
    '    line-height: 16px;\n background-color: #f7f8fa;' +
    '    border-bottom: 1px solid #f5f5f5;\n' +
    '    box-sizing: border-box; \n' +
    '}\n.titleStyle {\n' +
    '  margin-bottom: 0px!important;\n' +
    '  padding:3px 0 ;background-color: #f7f8fa;\n' +
    '}' +
    '.el-card__header{\n' +
    '    padding: 0;\n\n' +
    '    border:0;    background-color: #f7f8fa;\n' +
    '}\n' +
    '.el-card__body{\n' +
    '    padding: 0;\n' +
    '} ' +
    '.gc-card__title {line-height: 20px; font-size: 14px;font-weight: 500;padding: 6px 0;color: #36474f;height: 20px;display: inline-block;position: relative;}   \n' +
    '  .card_style1{padding:20px 40px!important;}      \n' +
    '.el-card .el-card__header::before{\n' +
    '  width: -0;height: 0;\n' +
    '}.el-card .el-card__header{padding:0}' +
    '    .gc-card__title:before {    content: "";position: absolute;left: -10px;top: 6px;width: 3px;height: 20px;background-color: #007aff;}\n'

}
// 锚点的样式
function anchorPoint(anchorPointBackgroundColor, anchorPointColor) {
  return `html {
  scroll-behavior: smooth;
}

  #anchorPoint {
    z-index: 99999;
    position: fixed;
    top: 50%;
    padding: 0;
    transform: translateY(-50%);
    right: 10px;
    font-size: 13px;
    background:  ${anchorPointBackgroundColor};
    box-shadow: 0 0 8px rgba(215, 215, 215, 0.8);
  }

    #anchorPoint a {
      cursor: pointer;
      display: inline-block;
      width: 14px;
      word-wrap: break-word;
      padding: 6px 4px;
      color: ${anchorPointColor};
      line-height: 15px;
      text-decoration: none;
      border: 1px solid #d7d7d7;
    }
        #anchorPoint a:hover{
                color: #fff;
                background: #007aff;
                border-color: #007aff;
            }
`
}
// 弹窗表格样式
function dialogTable() {
  return `
  .el-form-item .el-form-item {
      margin-bottom: 15px;
  }
  .el-dialog__body {
    overflow: auto;
  }`
}
// tabs样式
function tabsStyle() {
  return `
  .el-tabs--border-card>.el-tabs__content {
    padding: 15px;
    height: calc(100vh - 160px);
    overflow-y:auto;
  }
  .el-tabs--border-card>.el-tabs__content>.el-tab-pane {
    height: 100%;
  }`
}

// 综调表格模式的样式
function tableStyle(tableLabelWidth) {
  return `body,html {
  background-color: #fff;
}

.tableStyle {
  display: flex;
  flex-wrap: wrap;
  position: relative;
  font-size: 13px;
  text-decoration: none;
  letter-spacing: normal;
  vertical-align: none;
  text-align: left;
  text-transform: none;
  font-weight: 400;
  line-height: 32px;
  color: #333;
  margin-bottom: 20px;
  overflow: hidden;
  width: 100%;
  border: 1px solid rgba(215, 215, 215, 1);
  border-right: none;
  border-bottom: none;
}

.tableStyle:after {
  content: '';
  position: absolute;
  width: 100%;
  bottom: 0;
  height: 1px;
  background: rgba(215, 215, 215, 1);
}

.tableStyle:before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100%;
  width: 1px;
  background: rgba(215, 215, 215, 1);
}

.tableDivStyle {
  border-bottom: 1px solid rgba(215, 215, 215, 1);
  border-top: 1px solid rgba(215, 215, 215, 1);
  margin-top: -1px;
}

.tableHeadStyle {
  box-sizing: border-box;
  background-color: #f8f9ff;
  float: left;
  padding: 0 10px;
  height: 100%;
  width: ${tableLabelWidth}px;
}

.tableBodyStyle {
  box-sizing: border-box;
  float: left;
  width: calc(100% - ${tableLabelWidth}px);
  padding: 0 10px;
  color: #7F7F7F;
  height: 100%;
  border-left: 1px solid rgba(215, 215, 215, 1);
  border-right: 1px solid rgba(215, 215, 215, 1);
}

.tableHeadTitleStyle {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  background: #f7f8fa;
  border-bottom: 1px solid #f5f5f5;
  color: #36474f;
  padding: 0 10px;
  line-height: 32px;
}
.tableHeadTitleStyle:before {
    content: "";
    position: absolute;
    left: 0px;
    top: 6px;
    width: 3px;
    height: 20px;
    background-color: #007aff;
}

.uploadStyle {
  min-height: 48px;
  padding: 6px 10px;
}

.attach-item {
  color: #007aff;
  font-size: 13px;
  display: inline-block;
  margin: 4px 40px 4px 10px;
  cursor: pointer;
}

.uploadStyle1 {
  width: 100%;
  border-left: 1px solid rgba(215, 215, 215, 1);
}
`
}
function getUserCss(cssStr) {
  // // 将用户自定义的css样式进行保存
  if (cssStr.lastIndexOf('/* 请在此注释下方进行css编码 */') !== -1) {
    cssStr = cssStr.slice(cssStr.lastIndexOf('/* 请在此注释下方进行css编码 */') + 20)
  }
  return cssStr.replace('<style>', '').replace('</style>', '')
}
function addCss(cssList, el) {
  // console.log('-------------------------------------')
  let css = ''
  // 如果存在网页锚点，则插入网页锚点相关样式
  if (el.__config__.isAnchorPoint) {
    const anchorPointCss = anchorPoint(el.__config__.anchorPointBackgroundColor, el.__config__.anchorPointColor)
    anchorPointCss && cssList.indexOf(anchorPointCss) === -1 && cssList.push(anchorPointCss)
  }
  if (el.__config__.componentType == 'dialog-table') {
    const dialogTableCss = dialogTable()
    dialogTableCss && cssList.indexOf(dialogTableCss) === -1 && cssList.push(dialogTableCss)
  }
  if (el.__config__.tagIcon == 'tabs') {
    const tabCss = tabsStyle()
    tabCss && cssList.indexOf(tabCss) === -1 && cssList.push(tabCss)
  }
  // 如果是自定义组件则插入自定义组件的css样式
  if (el.__config__.tag == 'el-card' && el.__config__.css) {
    let css = ''
    // 将用户自定义的css样式进行保存
    if (el.__config__.css.lastIndexOf('/* 请在此注释下方进行css编码 */') !== -1) {
      css = el.__config__.css.slice(el.__config__.css.lastIndexOf('/* 请在此注释下方进行css编码 */') + 20)
    } else {
      css = el.__config__.css
    }
    cssList.push(css.replace('<style>', '').replace('</style>', ''))
  }
  // 如果是标题组件
  if (el.__config__.isTitle) {
    const tag = 'el-card-title'
    css = styles[tag]
  } else {
    css = styles[el.__config__.tag]
  }
  // 如果使用了折叠面版且尖括号位置在左
  if (el.__config__.tag == 'el-collapse-item' && el.__config__.iconPosition === 'left') {
    cssList.push('.collapse-title {flex: 1 0 90%;order: 1;}\n' +
      '     .el-collapse-item__header {flex: 1 0 auto;order: -1;}\n')
  }
  if (el.__config__.tag == 'el-collapse-item' && el.__config__.showtext) {
    cssList.push('.el-collapse .el-collapse-item .el-collapse-item__header:after { content: "\\5C55\\5F00"; position: absolute; top: 0; right: 40px; color: #888; font-size: 12px;}\n' +
      '.el-collapse  .el-collapse-item.is-active .el-collapse-item__header:after { content: "\\6536\\8D77";}')
  }
  css && cssList.indexOf(css) === -1 && cssList.push(css)
  if (el.__config__.children) {
    el.__config__.children.forEach(el2 => addCss(cssList, el2))
  }
}
// 印章的地址
function getSealStyle(url) {
  return `
  .bg-prd-box {
      position: relative;
      width: 100%;
      height: 100%;
    }
    .bg-prd {
      background: url("${url}");
     background-size: auto 100%;
      background-repeat: no-repeat;
          margin: 30px;
      pointer-events: none;
      background-size: 12%;
      height: 300px;
      width: 100%;
      top:0;
      left:0;
      position: absolute;
      z-index: 1000;
    }`
}
// 综调基础样式
const cssCard = '    .bottonStyle{color: #fff;background-color: #007aff;border-color: #007aff;padding: 9px 15px;font-size: 12px; border-radius: 3px;}.el-input--medium .is-disabled > *{\n' +
'    color:#36474f!important;\n' +
'} .el-form  {\n' +
'    padding: 16px 10px 60px 10px;margin: 0;position: relative;\n' +
'  }.el-input__inner {\n' +
  '  height: 32px!important;\n' +
  '  line-height: 32px!important;\n' +
  '}' +
'     @media screen and (min-width: 1600px) {\n' +
'      .el-form  {\n' +
'    margin: 0 auto !important;\n' +
'    width: 1560px;\n' +
'}} ' +
'body{\n' +
'    padding: 0;\n' +
'  }  html{\n' +
'     background-color: rgba(246, 247, 251, 1);\n' +
'  }\n' +
'  .el-col{\n' +
'     background-color: #fff;\n' +
'  }    .card_style{    border: 1px solid rgba(232, 232, 232, 1);box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);padding: 0 !important;margin: 0 0 8px 0;}' + `
.el-input__inner {
    border-radius: 0;
}.bottom-btns-wrap{
z-index:2000}.el-form-item__content{
  line-height: 30px!important;
}.el-button{
    margin-left: 25px;
  } .el-range-editor.el-input__inner{
    justify-content: space-between;
  }`
// 综调的整合样式
const cssDetail = '    .el-form-item {\n' +
'      margin-bottom: 0px;\n' +
'    }\n' +
'                  .card_style1 {\n' +
'      padding:10px !important;\n' +
'    }\n' +
'    .card_style{ \n' +
'      box-shadow:none;\n ' +
'    }\n' +
'        @media screen and (min-width: 1600px) {\n' +
'      .el-form {\n' +
'        margin:0 auto  20px!important;\n' +
'        width: 1560px;\n' +
'      }\n' +
'    }'

export function makeUpCss(conf) {
  const cssList = ['/* 此处为预设样式，请在下一个注释下面进行编码 */', 'body,html { background-color: #fff;\n}' +
  `/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar{
  width: 5px;
  height: 5px;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track{
  border-radius: 10px;
}

/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
  background-color: #CCCCCC;
}
.formDialog .el-dialog__header {
    background-color: #fff;
    border-bottom: 1px solid #e8e8e8;
    padding: 14px 0;
    font-weight: 700;
}
.formDialog .el-dialog__title {
    display: inline-block;
    border-left: 4px solid #007aff;
    padding-left: 16px;
    color: #36474f;
    min-height:24px;
}
.el-button--primary {
    background-color: #1183FF;
    border-color: #1183FF;
}
.el-button {
    padding: 7px 6px;
    min-width: 56px;
    height: 30px;
    font-size: 14px;
    border-radius: 2px;
}
.el-form{
  display: flex;
  flex-wrap: wrap;
}
.el-upload__tip {
  position: absolute;
  right: 0;
}
.uploadButton {
  z-index: 100;
}
.el-form .el-form{
  padding:0;margin:0!important;
}
.el-dialog__body {
  overflow: hidden;
}
.dialog-button {
  overflow: hidden;
  margin-top: 16px;
  text-align: center;
}
.dialog-button.algin-right {
  text-align: right;
}
.dialog-button .el-form-item {
  margin-bottom: 0;
}
.dialog-button .el-col {
  float: none;
  display: inline-block;
  width: auto;
}
.dialog-button .el-button {
  margin: 0 8px;
}
.search-wrap {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 10px 10px;
}
.search-wrap .el-col {
  display: flex;
  align-items: center;
}
.search-wrap .el-form-item {
  margin-bottom: 15px
}
.search-wrap .el-form-item__content {
  // margin-left: 0 !important;
}

.search-wrap .el-button {
  margin-left: 0;
}
.el-dialog__header {
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;
  padding: 14px 0;
  font-weight: 700;
}
.el-tree-node__content {
  font-weight:normal!important;
}
.el-table {
  cursor: pointer !important;
}
.el-table > td {
  background: transparent !important;
}
.file-name {
  color: #2683ff;
  margin-right: 4px;
  cursor: pointer;
}
.el-picker-panel {
  z-index: 10000 !important
}
.el-table tbody tr:hover>td {
   background: none !important
}
.pagination-wrap {
    display: flex;
    padding: 10px 0;
    justify-content: flex-end
}
.flex-start {
   justify-content: flex-start
}
.flex-center {
   justify-content: center
}

.dialog-wrap .el-dialog .body-wrap {
  padding: 16px;
  overflow-y: auto;
}

.dialog-wrap .el-dialog__body {
  padding: 0;
}
.el-table__fixed-right {
  background: #fff
}
.tox {
  z-index: 9999;
}
.tox .tox-dialog--width-lg {
  max-height: 90% !important;
}
`]
  if (conf.sealList && conf.sealList.length > 0) {
    cssList.push(getSealStyle(conf.sealList[0].url))
  }
  // console.log('-------------------------------------')
  if (conf.formStyle === '3' || conf.tableShow) {
    // 表格风格
    cssList.push(cssCard)
    conf.fields.forEach(el => addCss(cssList, el))
    cssList.push(cssDetail)
    cssList.push(tableStyle(conf.tableLabelWidth || 150))
    return cssList.join('\n').replace('<style>', '').replace('</style>', '') + '/* 请在此注释下方进行css编码 */' + getUserCss(conf.css)
  } else if (conf.formStyle === '1') {
    // 默认样式
    if (conf.isCustom && conf.css) {
      return conf.css
    }
    conf.fields.forEach(el => addCss(cssList, el))
    return cssList.join('\n').replace('<style>', '').replace('</style>', '') + '/* 请在此注释下方进行css编码 */' + getUserCss(conf.css)
  } else {
    // 默认就是卡片风格
    cssList.push(cssCard)
    if (conf.isCustom && conf.css) {
      return conf.css
    }
    conf.fields.forEach(el => addCss(cssList, el))
    return cssList.join('\n').replace('<style>', '').replace('</style>', '') + '/* 请在此注释下方进行css编码 */' + getUserCss(conf.css)
  }
}
