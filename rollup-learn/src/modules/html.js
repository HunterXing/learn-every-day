import ruleTrigger from './ruleTrigger'
// 是否卡片的开头
let isCardTop = true
let confGlobal
// 获取当前操作的组件
let currentFiles
let formConfig
export function dialogWrapper(str) {
  return `<el-dialog v-bind="$attrs" v-on="$listeners" @open="onOpen" @close="onClose" title="Dialog Titile">
    ${str}
    <div slot="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="handelConfirm">确定</el-button>
    </div>
  </el-dialog>`
}

export function vueTemplate(str) {
  return `<template>
    <div>
      ${str}
    </div>
  </template>`
}

export function vueScript(str) {
  return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
  return `<style>
    ${cssStr}
  </style>`
}

// 表单html创建
function buildFormTemplate(scheme, child, type) {
  let labelPosition = ''
  if (scheme.labelPosition !== 'right') {
    labelPosition = `label-position="${scheme.labelPosition}"`
  }
  const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : ''
  const seal = scheme.sealList && scheme.sealList.length && scheme.sealList[0].isShow ? `<div class='bg-prd-box'>  <div class='bg-prd'></div> </div>` : ''
  const str = `<el-form name="ustc_form" ref="${scheme.formRef ? scheme.formRef : 'defaultForm'}" :model="${scheme.formModel}" :rules="${scheme.formRules}" size="${scheme.size}" ${disabled} label-width="${scheme.labelWidth}px" ${labelPosition} :validate-on-rule-change="false">
${seal}
${child}
      <!-- 请勿修改该注释 -->
      <!-- 请勿修改该全局按钮注释 -->
    </el-form>`
  return str
}
// 表格风格的html创建
function buildTableTemplate(scheme, child, type) {
  if (scheme.isCustom && scheme.template) {
    return scheme.template
  }
  let labelPosition = ''
  if (scheme.labelPosition !== 'right') {
    labelPosition = `label-position="${scheme.labelPosition}"`
  }
  // let jsonData=JSON.stringify(scheme)
  const disabled = scheme.disabled ? `:disabled="${scheme.disabled}"` : ''
  const seal = scheme.sealList && scheme.sealList.length && scheme.sealList[0].isShow ? `<div class='bg-prd-box'>  <div class='bg-prd'></div> </div>` : ''
  const str = `<el-form name="ustc_form" ref="${scheme.formRef}" :model="${scheme.formModel}" :rules="${scheme.formRules}" size="${scheme.size}" ${disabled} label-width="${scheme.labelWidth}px" ${labelPosition}>
           ${seal} ${child}</el-row>
    </el-form>`
  return str
}

// span不为24的用el-col包裹
function colWrapper(scheme, str) {
  // const _condition = scheme.__config__.condition ? `${scheme.__config__.condition}` : true
  // const processCondition = scheme.__config__.processCondition ? `${scheme.__config__.processCondition}` : false
  // const condition = (scheme.__config__.condition || scheme.__config__.processCondition)
  //   ? `v-if="${_condition} || ${processCondition}"` : ''
  const _condition = scheme.__config__.condition
  const processCondition = scheme.__config__.processCondition
  let condition = ''
  if (processCondition && _condition) {
    condition = `v-if='${_condition} || ${processCondition}'`
  } else {
    if (scheme.__config__.condition) {
      condition = `v-if='${_condition}'`
    } else if (scheme.__config__.processCondition) {
      condition = `v-if='${processCondition}'`
    } else {
      condition = ``
    }
  }
  // 每个组件添加类名为其vmodel值
  const className = `class="${scheme.__vModel__}"`
  const isHidden = scheme.__config__.isHidden ? `v-show="${!scheme.__config__.isHidden}"` : ''
  if (scheme.__config__.isTitle && isCardTop) {
    isCardTop = false
    return `<el-col class="card_style" ${condition} >
              <el-col ${condition} ${isHidden} ${className} :span="${scheme.__config__.span}" :xs="24" style="padding: 0">
                ${str}
              </el-col>
              <el-col class="card_style1">`
    // 需要用两个 el-col 封闭
  } else if (scheme.__config__.tag === 'el-collapse-item') {
    // 如果是外部折叠面板，直接封闭,如果是嵌套的折叠面板，不封闭
    isCardTop = true
    if (scheme.__config__.isInner) {
      return `
    <el-col ${className} :span="${scheme.__config__.span}" :xs="24" ${condition} ${isHidden} style="background-color: transparent;padding: 0;margin: 16px 5px; ">
      ${str}
    </el-col>`
    }
    return `</el-col></el-col>
    <el-col ${className} :span="${scheme.__config__.span}" :xs="24" ${condition} ${isHidden} style="background-color: transparent;padding: 0;margin: 16px 5px; ">
      ${str}
    </el-col>`
  } else if (scheme.__config__.tag === 'el-collapse-item' && isCardTop) {
    return `<el-col ${className} :span="${scheme.__config__.span}" :xs="24"  ${condition} ${isHidden}style="background-color: transparent;padding:0; margin: 16px 5px;">
      ${str}
    </el-col>`
  } else if (scheme.__config__.isTitle && isCardTop === false) {
    return `</el-col></el-col>
    <el-col class="card_style" ${condition} >
      <el-col ${className} :span="${scheme.__config__.span}" :xs="24"  ${condition} ${isHidden} style="padding: 0">
      ${str}
      </el-col>
    <el-col class="card_style1">`
  } else if (scheme.__config__.isComponent && scheme.__config__.rowTitle.trim() === '') {
    return `<el-col ${className} :span="${scheme.__config__.span}" :xs="24" ${condition} ${isHidden} style="padding: 0">
      ${str}
    </el-col>`
  } else if (scheme.__config__.isComponent && scheme.__config__.rowTitle.trim() !== '') {
    return `<el-col ${className} :span="${scheme.__config__.span}" :xs="24"  ${condition} ${isHidden} style="padding: 0"><div style="color:#606266;">${scheme.__config__.rowTitle}</div>
      ${str}
    </el-col>`
  } else if (scheme.__config__.rowTitle === '' && scheme.__config__.rowShow === false) {
    return `<el-col ${className} :span="${scheme.__config__.span}" ${condition} ${isHidden}  :xs="24">
      ${str}
    </el-col>`
  } else if (scheme.__config__.rowTitle !== '' && scheme.__config__.rowShow === false) {
    return `<el-col ${className} :span="${scheme.__config__.span}"  ${condition} ${isHidden} :xs="24"> <div style="margin:10px;color:#606266;font-size:12px">${scheme.__config__.rowTitle}</div>
      ${str}
    </el-col>`
  } else if (scheme.__config__.rowTitle && scheme.__config__.rowShow) {
    return `<el-col ${className} :span="${scheme.__config__.span}" :xs="24" ${condition} ${isHidden} style="border:1px solid #dcdfe6;margin-bottom:22px"><div style="margin:10px;color:#606266;font-size:12px;">${scheme.__config__.rowTitle}</div>
      ${str}
    </el-col>`
  } else if (scheme.__config__.rowTitle === '' && scheme.__config__.rowShow) {
    return `<el-col ${className} :span="${scheme.__config__.span}" :xs="24" ${condition} ${isHidden} style="border:1px solid #dcdfe6;margin-bottom:22px">
      ${str}
    </el-col>`
  } else if (scheme.__config__.tag === 'dialog') {
    return `${str}`
  } else if (!['el-button'].includes(scheme.__config__.tag) && scheme.__config__.btnStyle) {
    return `<el-col ${className} style="width:${scheme.__config__.btnSpace}px" ${condition} ${isHidden}>
      ${str}
    </el-col>`
  } else if (scheme.__config__.tag === 'el-button' && scheme.__config__.btnStyle) {
    return `<el-col ${className} style="width:${scheme.__config__.btnSpace}px" ${condition} ${isHidden}>
      ${str}
    </el-col>`
  }
  return `<el-col ${className} :span="${scheme.__config__.span}" :xs="24" ${condition} ${isHidden}>
      ${str}
    </el-col>`
}
// 表单的解析
const layouts = {
  colFormItem(scheme, parentModel) {
    const config = scheme.__config__
    let labelWidth = ''
    let label = `label="${config.label}"`
    if (config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`
    }
    if (config.showLabel === false || config.tag === 'el-table') {
      labelWidth = 'labelWidth="0"'
      label = 'label=""'
    }
    if (config.tag === 'el-card' && config.isAlert) {
      labelWidth = `label-width="${config.labelWidth}px"`
    }
    const required = !ruleTrigger[config.tag] && config.required ? 'required' : ''
    const formId = config.formId ? config.formId : ''
    // const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null
    const tagDom = buildTagDom(config.tag, scheme, parentModel)
    const isHidden = `${config.isHidden}` ? `v-show="${!config.isHidden}"` : ''
    const dataType = config.dataType ? `dataType="${config.dataType}"` : ''
    const entity = config.entity ? `entity="${config.entity}"` : ''
    const entityId = config.entityId ? `entityId="${config.entityId}"` : ''
    const entityCode = config.entityCode ? `entityCode="${config.entityCode}"` : ''
    const entityField = config.entityField ? `entityField="${config.entityField}"` : ''
    const entityFieldCode = config.entityFieldCode ? `entityFieldCode="${config.entityFieldCode}"` : ''
    const entityFieldName = config.entityFieldName ? `entityFieldName="${config.entityFieldName}"` : ''
    const tableCode = config.tableCode ? `tableCode="${config.tableCode}"` : `tableCode="tablecode"`
    const displayAttr = config.displayAttr ? `displayAttr="${config.displayAttr}"` : ''
    const sourceAttr = config.sourceAttr ? `sourceAttr="${config.sourceAttr}"` : ''
    const sourceSpecId = config.sourceSpecId ? `sourceSpecId="${config.sourceSpecId}"` : ''
    const isFind = `${config.isFind}` ? `isFind="${config.isFind}"` : ''
    const ref = `ref="${scheme.__vModel__}"`
    const filterable = `${!config.filterable}` ? `${!config.filterable}` : ''
    const tabPosition = `${!config.tabPosition}`
    const selectUrl = config.selectUrl ? `selectUrl="${config.selectUrl}"` : '' // 接口地址
    const selectMethod = config.selectMethod ? `selectMethod="${config.selectMethod}"` : '' // entity或者interface
    const interfaceMethod = config.interfaceMethod ? `interfaceMethod="${config.interfaceMethod}"` : '' // entity或者interface
    const domainSource = config.domainSource ? `domainSource="${config.domainSource}"` : ''
    const businessDictionary = config.businessDictionary ? `businessDictionary="${config.businessDictionary}"` : ''
    const businessDictionaryId = config.businessDictionaryId ? `businessDictionaryId="${config.businessDictionaryId}"` : ''
    const buttonMethod = config.methodValue ? `buttonMethod="${config.methodValue}"` : ''
    const hookUrl = config.hookUrl ? `hookUrl="${config.hookUrl}"` : ''
    const vModel = `vModel="${scheme.__vModel__}"`
    const showTip = config.showTip ? `showTip="${config.showTip}"` : ''
    const key = `key="${scheme.__vModel__}"`

    let prop = ''
    // isComponentChildren判断是组件容器组件里面元素
    if (config.isComponentChildren) {
      prop = `:prop="'item.' + index + '.${scheme.__vModel__}'"`
    } else {
      prop = `prop="${scheme.__vModel__}"`
    }
    let str = `<el-form-item  ${ref} ${key} ${labelWidth} ${dataType} ${filterable} ${label} ${buttonMethod} ${hookUrl} ${prop} ${vModel} type="${config.tag}" form-id="${formId}" ${required} ${isHidden} ${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId} >
        ${tagDom}
      </el-form-item>`
    if (config.tag === 'el-table' && config.dataType === 'interface') {
      const buttonList = `buttonList="${config.buttonList}"`
      // 接口地址
      const url = `url="${config.url}"`
      let optionList = ''
      for (const item of config.options) {
        optionList += `{"name":"${item.name}","value":"${item.value}"}/`
      }
      // 查询条件对应的数组
      const option = `option='${optionList}'`
      let buttonLists = ''
      if (config.buttons != null) {
        for (const item of config.buttons) {
          buttonLists += `{"name":"${item.name}","pop":"${item.pop}","popAddress":"${item.popAddress}","partAddress":"${item.partAddress}"}/`
        }
      }
      // 查询条件对应的数组
      const buttons = `buttons='${buttonLists}'`
      // 接口查询按钮的地址
      const findUrl = `findUrl='${config.findUrl}'`
      // 结局查询按钮的方法
      const findMethods = `findMethods='${config.findMethods}'`

      str = `<el-form-item ${ref} ${labelWidth} ${buttons} ${isFind}  ${buttonList}${dataType}${url}${option}${findUrl}${findMethods}${filterable} ${interfaceMethod} ${label} ${buttonMethod} ${hookUrl}${vModel}  ${prop}  type="${config.tag}" form-id="${formId}" ${required} ${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId} >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-select' || config.tag === 'el-cascader' || config.tag === 'el-tree') {
      str = `<el-form-item ${key} ${ref} ${labelWidth} ${businessDictionaryId}  ${businessDictionary} ${domainSource} ${selectUrl}${selectMethod} ${interfaceMethod}${dataType} ${filterable} ${label} ${vModel} ${prop}  type="${config.tag}" form-id="${formId}" ${required} ${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr}  >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-transfer') {
      str = `<el-form-item  ${ref} ${labelWidth} ${businessDictionaryId}  ${businessDictionary} ${domainSource}  ${selectUrl}${selectMethod} ${interfaceMethod}${dataType} ${filterable} ${label}  ${vModel} ${prop} type="${config.tag}" form-id="${formId}" ${required} >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-tabs') {
      str = `<el-form-item ${ref} ${labelWidth}${selectUrl}${selectMethod} ${interfaceMethod}${dataType} ${tabPosition} ${label}  ${vModel} ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden} ${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr}  >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-button') {
      str = `<el-form-item ${ref} ${labelWidth}${dataType} ${businessDictionaryId}   ${businessDictionary} ${domainSource} ${filterable} ${label} ${buttonMethod} ${hookUrl} ${vModel}  ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId} >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-table') {
      str = `<el-form-item  ${ref} ${labelWidth} ${dataType} ${filterable} ${buttonMethod} ${hookUrl} ${vModel}    ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId} >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'iframe') {
      str = `<el-form-item ${ref} ${labelWidth} ${dataType} form-id="${formId}" type="${config.tag}">
        ${tagDom}
      </el-form-item>`
    }
    // 标题
    if (config.isTitle && config.tag === 'el-card') {
      const name = (scheme.__slot__.options).trim()
      const anchorPointBackgroundColor = scheme.__config__.anchorPointBackgroundColor ? `anchorPointBackgroundColor="${config.anchorPointBackgroundColor}"` : ''
      const anchorPointColor = scheme.__config__.anchorPointColor ? `anchorPointColor="${config.anchorPointColor}"` : ''
      const anchorPoint = scheme.__config__.anchorPoint ? `anchorPoint="${config.anchorPoint}"` : ''
      const ID = scheme.__config__.isAnchorPoint ? `ID="${config.formId}"` : ''
      const isTitle = `isTitle="${scheme.__config__.isTitle}"`
      const classs = `class="titleStyle"`
      str = `<el-form-item ${ref}${isHidden} ${ID} ${labelWidth} ${classs} ${label} ${isTitle} ${anchorPointColor} ${anchorPointBackgroundColor} ${anchorPoint}  type="${config.tag}"  ${vModel}  ${prop} name="${name}"${required} form-id="${formId}">
        ${tagDom}
      </el-form-item>`
    // 提示文字
    } else if (config.tag === 'el-card' && config.isAlert) {
      const isAlert = `isAlert="${scheme.__config__.isAlert}"`
      const color = `color="${scheme.__config__.color}"`
      const fontSize = `fontSize="${scheme.__config__.fontSize}"`
      const textAlign = `textAlign="${scheme.__config__.textAlign}"`
      str = `<el-form-item  ${ref}${isHidden}  ${labelWidth} ${label} ${isAlert}  ${textAlign} ${fontSize} ${color}  type="${config.tag}"  ${vModel}  ${prop}  ${required} form-id="${formId}">
        ${tagDom}
      </el-form-item>`
    } else if (config.tag === 'el-card') {
      const shadow = `shadow="${scheme.shadow}"`
      const name = (scheme.__slot__.options).trim()
      const html = config.html
      const css = config.css
      const style = 'style = "border: 0px solid #EBEEF5;"'
      // 直接覆盖掉原有的html代码，解决组件更新无效的问题
      sessionStorage.setItem(name + 'HTML', html)
      if (sessionStorage.getItem(name + 'CSS') === null) {
        sessionStorage.setItem(name + 'CSS', css)
      }
      if (sessionStorage.getItem(name + 'JS') === null && config.js !== undefined) {
        const js = config.js
        sessionStorage.setItem(name + 'JS', objectToString(js))
      }
      str = `<el-card ${ref} ${shadow} ${labelWidth}${dataType}  ${label} type="${config.tag}" name="${name}" ${required} form-id="${formId}" ${style}>
        ${config.html}
      </el-card>`
    }
    // 分割线
    if (config.tag === 'el-divider') {
      const { tag, vModel } = attrBuilder(scheme)
      const content_position = scheme['content-position'] ? `content-position="${scheme['content-position']}"` : ''
      const anchorPoint = scheme.__config__.anchorPoint ? `anchorPoint="${config.anchorPoint}"` : ''
      const child = buildDividerChild(scheme)
      str = `<${tag}  ${vModel} form-id="${formId}" type="${config.tag}" ${anchorPoint} ${prop} ${content_position}> ${child} </${tag}>`
    }
    if (config.tag === 'el-upload') {
      const actionUrl = scheme.__config__.action ? `actionUrl="${scheme.__config__.action}"` : ''
      const action = scheme.action ? `:action="${scheme.__vModel__}Action"` : ''
      if (config.uploadStyle === 'button') {
        str = `<el-form-item ${ref} ${labelWidth} ${dataType}  ${actionUrl}  ${filterable} ${businessDictionaryId}  ${businessDictionary} ${domainSource} ${action} ${vModel}  ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}   >
        ${tagDom}
      </el-form-item>`
      } else {
        str = `<el-form-item ${ref} ${labelWidth} ${dataType}  ${actionUrl}  ${filterable} ${businessDictionaryId}  ${businessDictionary} ${domainSource}  ${label} ${action} ${vModel}  ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}   >
        ${tagDom}
      </el-form-item>`
      }
    }
    if (config.tag === 'custom-date-picker') {
      const children = config.children.map(el => {
        return layouts[el.__config__.layout](el)
      })
      str = `<el-form-item ${ref} ${showTip} ${labelWidth} ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}   >
         ${children.join('\n')}
      </el-form-item>`
    }
    if (config.tag === 'select-tree') {
      str = `<el-form-item ${ref} ${labelWidth} ${label} ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}   >
                ${tagDom}
             </el-form-item>`
    }
    str = colWrapper(scheme, str)
    currentFiles = scheme
    return str
  },
  rowFormItem(scheme) {
    const config = scheme.__config__
    const type = scheme.type === 'default' ? '' : `type="${scheme.type}"`
    const justify = scheme.type === 'default' ? '' : `justify="${scheme.justify}"`
    const align = scheme.type === 'default' ? '' : `align="${scheme.align}"`
    const gutter = scheme.gutter ? `:gutter="${scheme.gutter}"` : ''
    const children = config.tag !== 'dialog' ? config.children.map(el => layouts[el.__config__.layout](el)) : []
    const formId = config.formId ? config.formId : ''
    const componentName = config.componentName ? config.componentName : ''
    // const isHidden = config.isHidden ? 'style="display: none;" is-hidden' : ''
    const isHidden = `v-show="${!config.isHidden}"`
    const dataType = config.dataType ? `dataType="${config.dataType}"` : ''
    const entity = `entity="${config.entity}"`
    const entityCode = `entityCode="${config.entityCode}"`
    const entityField = `entityField="${config.entityField}"`
    const entityFieldCode = `entityFieldCode="${config.entityFieldCode}"`
    const entityFieldName = `entityFieldName="${config.entityFieldName}"`
    const displayAttr = `displayAttr="${config.displayAttr}"`
    const sourceAttr = `sourceAttr="${config.sourceAttr}"`
    const sourceSpecId = `sourceSpecId="${config.sourceSpecId}"`
    const maxNum = `maxNum="${config.maxNum}"`
    const style = config.rowShow ? `style="margin-top:20px;"` : ''
    const _condition = scheme.__config__.condition
    const processCondition = scheme.__config__.processCondition
    let condition = ''
    if (processCondition && _condition) {
      condition = `v-if="${_condition} || ${processCondition}"`
    } else {
      if (scheme.__config__.condition) {
        condition = `v-if="${_condition}"`
      } else if (scheme.__config__.processCondition) {
        condition = `v-if="${processCondition}"`
      } else {
        condition = ``
      }
    }
    // condition = (scheme.__config__.condition || scheme.__config__.processCondition)
    //   ? `v-if="${_condition} || ${processCondition}"` : ''

    const ref = `ref="${config.componentName}"`
    let str = ''
    // 组件容器组件
    if (config.isComponent) {
      const children1 = config.children.map(el => {
        el.__config__.isComponentChildren = config.componentName
        return layoutsRules[el.__config__.layout](el)
      })
      str = `
      <template v-for="(item,index) in formData.${config.componentName}List" style="position:relative;padding:0"   ${maxNum}    ${ref}  ${justify} ${align}${dataType}  ${displayAttr} ${sourceAttr} ${sourceSpecId} ${gutter} form-id="${formId}" component-name="${componentName}" ${isHidden}>
        <el-col id="col" :span="24" :xs="24" style="padding: 10px 20px 0 10px;position:relative;border:1px solid #EBEEF5;margin-bottom:10px;min-height:40px">
        <span
          v-if="${config.componentName}Show"
          style="position:absolute;left:0;top:20px;border:1px solid #f56c6c;border-radius:50%;width:14px;height:14px;line-height:13px;display:inline-block;text-align:center;color:#f56c6c">
        {{ index + 1 }}</span>
          ${children1.join('\n')}
          <i
            v-if="${config.componentName}Show"
            class="el-icon-remove-outline"
            style="fontSize: 20px;color:#f56c6c;cursor:pointer;line-height:32px;position:absolute"
            @click="deleteRow('${config.componentName}', index)"
          ></i>
        </el-col>
      </template>

     <el-col ${condition} :span="24" :xs="24" style="padding: 0">
     <el-button style="margin:10px" class="bottonStyle" v-if="${config.componentName}Button[0].isShow" @click="addComponentList('${config.componentName}',${config.maxNum})" type="primary"   size="medium"> {{${config.componentName}Button[0].name}} </el-button>
    </el-col>
     `
    } else if (config.tag === 'el-collapse-item') {
      const title = `title="${scheme.title}"`
      const name = `name="${scheme.name}"`
      const anchorPointBackgroundColor = scheme.__config__.anchorPointBackgroundColor ? `anchorPointBackgroundColor="${config.anchorPointBackgroundColor}"` : ''
      const anchorPointColor = scheme.__config__.anchorPointColor ? `anchorPointColor="${config.anchorPointColor}"` : ''
      const anchorPoint = scheme.__config__.anchorPoint ? `anchorPoint="${config.anchorPoint}"` : ''
      const ID = scheme.__config__.isAnchorPoint ? `ID="${config.formId}"` : ''
      const iconPosition = scheme.__config__.iconPosition ? `iconPosition="${config.iconPosition}"` : `iconPosition="right"`
      const showtext = scheme.__config__.showtext ? `showtext="${config.showtext}"` : ``
      str = ` <el-collapse v-model="formData.${componentName}" form-id="${formId}" ${showtext} ${ref} ${ID} ${iconPosition} ${anchorPointBackgroundColor}  ${anchorPointColor}  ${anchorPoint} ${isHidden} ${title} ${name}  component-name="${componentName}" @change="collapseItemNames.push('${scheme.name}') ">
                <el-collapse-item  ${name} >
                 <span class="collapse-title" slot="title">${scheme.title} </span>
                    <el-col v-if="collapseItemNames.indexOf('${scheme.name}') > -1">
                          ${children.join('\n')}
                    </el-col>
                </el-collapse-item>
              </el-collapse>`
    } else if (config.tag === 'dialog') {
      const title = `:title="${scheme.__vModel__}_title"`
      const width = isNaN(config.width) ? `width="${config.width}"` : `width="${config.width}px"`
      const height = isNaN(config.height) ? config.height : `${config.height}px`
      const heightStr = height ? `style="height: ${height};"` : ''
      const visible = `:visible.sync="${scheme.__vModel__}Visible"`
      const children = config.children.map(el => layouts[el.__config__.layout](el))
      config.btnArea = config.btnArea.filter(el => el.__config__.tag === 'el-button')
      const btnArea = !scheme.__vModel__ ? config.btnArea.map(el => layouts[el.__config__.layout](el, formConfig.formRef)) : config.btnArea.map(el => layouts[el.__config__.layout](el, scheme.__vModel__))
      const className = config.btnAlign === 'right' ? 'dialog-button algin-right' : 'dialog-button'
      // 如果使用了标题组件结尾添加'</el-row></el-col></el-col>',前提是最后一个组件不是折叠面板
      if (isCardTop === false && currentFiles.__config__.tag !== 'el-collapse-item') {
        str = `</el-row></el-col></el-col>` + str
        isCardTop = true
      }
      if (config.btnArea.length > 0) {
        str = ` <el-dialog ${title} ${width} ${visible}>
                  <div class="body-wrap" ${heightStr}>
                    <el-form ref="${scheme.__vModel__}" :model="${formConfig.formModel}" :rules="${scheme.__vModel__}_rules" size="small" label-width="${formConfig.labelWidth}px" style="display: block; width: 100%;">
                      <el-row>
                      ${children.join('\n')}
                      </el-row>
                    </el-form>
                  </div>
                  <div slot="footer" class="${className} dialog-footer">
                    ${btnArea.join('\n')}
                  </div>
                </el-dialog>`
      } else {
        str = ` <el-dialog ${title} ${width} ${visible}>
                   <div class="body-wrap" ${heightStr}>
                     <el-form ref="${scheme.__vModel__}" :model="${formConfig.formModel}" :rules="${scheme.__vModel__}_rules" size="small" label-width="${formConfig.labelWidth}px" style="display: block; width: 100%;">
                      <el-row>
                        ${children.join('\n')}
                      </el-row>
                    </el-form>
                   </div>
                 </el-dialog>`
      }
    } else if (config.tag === 'table') {
      // 如果是表格
      const searchArea = config.searchArea.map(el => layouts[el.__config__.layout](el))
      const children = config.children.map(el => layouts[el.__config__.layout](el))
      const searchAreaHtml = config.searchArea.length ? ` <div class="search-wrap">
             ${searchArea.join('\n')}
        </div>` : ''
      str = `
        ${searchAreaHtml}
        ${children.join('\n')}
      `
    } else {
      config.children.map(el => {
        el.__config__.isComponentChildren = false
        return layouts[el.__config__.layout](el)
      })
      if (!config.isBlock) {
        str = `<el-row ${style} ${ref} ${type}  ${justify} ${align}${dataType} ${entity} ${entityField} ${entityCode} ${entityFieldCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId}  ${gutter} form-id="${formId}" component-name="${componentName}" ${isHidden}>
        ${children.join('\n')}
      </el-row>`
      // 如果是业务组件的块
      } else {
        str = `<el-row ${style} ${ref} ${type}  ${justify} ${align}${dataType} ${entity} ${entityField} ${entityCode} ${entityFieldCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId}  ${gutter} form-id="${formId}" component-name="${componentName}" ${isHidden}>
        </el-col>
        ${children.join('\n')}
      </el-row>`
      }
    }
    currentFiles = scheme
    str = colWrapper(scheme, str)

    return str
  }
}
const layoutsRules = {
  colFormItem(scheme) {
    const config = scheme.__config__
    let labelWidth = ''
    let label = `label="${config.label}"`
    if (config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`
    }
    if (config.showLabel === false || config.tag === 'el-table') {
      labelWidth = 'labelWidth="0"'
      label = 'label=""'
    }
    if (config.tag === 'el-card' && config.isAlert) {
      labelWidth = `label-width="${config.labelWidth}px"`
    }
    const required = !ruleTrigger[config.tag] && config.required ? 'required' : ''
    const formId = config.formId ? config.formId : ''
    // const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null
    const tagDom = buildTagDom(config.tag, scheme)
    const isHidden = `${config.isHidden}` ? `v-show="${!config.isHidden}"` : ''
    const dataType = config.dataType ? `dataType="${config.dataType}"` : ''
    const entity = config.entity ? `entity="${config.entity}"` : ''
    const entityId = config.entityId ? `entityId="${config.entityId}"` : ''
    const entityCode = config.entityCode ? `entityCode="${config.entityCode}"` : ''
    const entityField = config.entityField ? `entityField="${config.entityField}"` : ''
    const entityFieldCode = config.entityFieldCode ? `entityFieldCode="${config.entityFieldCode}"` : ''
    const entityFieldName = config.entityFieldName ? `entityFieldName="${config.entityFieldName}"` : ''
    const tableCode = config.tableCode ? `tableCode="${config.tableCode}"` : `tableCode="tablecode"`
    const displayAttr = config.displayAttr ? `displayAttr="${config.displayAttr}"` : ''
    const sourceAttr = config.sourceAttr ? `sourceAttr="${config.sourceAttr}"` : ''
    const sourceSpecId = config.sourceSpecId ? `sourceSpecId="${config.sourceSpecId}"` : ''
    const isFind = `${config.isFind}` ? `isFind="${config.isFind}"` : ''
    const ref = `ref="${scheme.__vModel__}"`
    const filterable = `${!config.filterable}` ? `${!config.filterable}` : ''
    const tabPosition = `${!config.tabPosition}`
    const selectUrl = config.selectUrl ? `selectUrl="${config.selectUrl}"` : '' // 接口地址
    const selectMethod = config.selectMethod ? `selectMethod="${config.selectMethod}"` : '' // entity或者interface
    const interfaceMethod = config.interfaceMethod ? `interfaceMethod="${config.interfaceMethod}"` : '' // entity或者interface
    const domainSource = config.domainSource ? `domainSource="${config.domainSource}"` : ''
    const businessDictionary = config.businessDictionary ? `businessDictionary="${config.businessDictionary}"` : ''
    const businessDictionaryId = config.businessDictionaryId ? `businessDictionaryId="${config.businessDictionaryId}"` : ''
    const buttonMethod = config.methodValue ? `buttonMethod="${config.methodValue}"` : ''
    const hookUrl = config.hookUrl ? `hookUrl="${config.hookUrl}"` : ''
    const vModel = `vModel="${scheme.__vModel__}"`
    const showTip = config.showTip ? `showTip="${config.showTip}"` : ''
    const message = config.tag === 'el-input' ? `请输入${config.label}` : `请选择${config.label}`
    const regList = config.regList
    const key = `key="${scheme.__vModel__}"`
    let ruleStr = ''
    if (regList && regList.length > 0) {
      regList.forEach(e => {
        ruleStr += `{ pattern: '${e.pattern}', message: '${e.message}', trigger: '${ruleTrigger[config.tag]}' },`
      })
    }
    const rules = ruleStr
      ? `:rules="[
              { required: ${config.required}, message: '${message}', trigger: '${ruleTrigger[config.tag]}' },
              ${ruleStr}
            ]"`
      : `:rules="[
              { required: ${config.required}, message: '${message}', trigger: '${ruleTrigger[config.tag]}' }
            ]"`

    let prop = ''
    // isComponentChildren判断是组件容器组件里面元素
    if (config.isComponentChildren) {
      prop = `:prop="'${config.isComponentChildren}List.' + index + '.${scheme.__vModel__}'"`
    } else {
      prop = `prop="${scheme.__vModel__}"`
    }
    let str = `<el-form-item  ${rules} ${ref} ${labelWidth} ${dataType} ${filterable} ${label} ${buttonMethod} ${hookUrl} ${prop} ${vModel} type="${config.tag}" form-id="${formId}" ${required} ${isHidden} ${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId} >
        ${tagDom}
      </el-form-item>`
    if (config.tag === 'el-table' && config.dataType === 'interface') {
      const buttonList = `buttonList="${config.buttonList}"`
      // 接口地址
      const url = `url="${config.url}"`
      let optionList = ''
      for (const item of config.options) {
        optionList += `{"name":"${item.name}","value":"${item.value}"}/`
      }
      // 查询条件对应的数组
      const option = `option='${optionList}'`
      let buttonLists = ''
      if (config.buttons != null) {
        for (const item of config.buttons) {
          buttonLists += `{"name":"${item.name}","pop":"${item.pop}","popAddress":"${item.popAddress}","partAddress":"${item.partAddress}"}/`
        }
      }
      // 查询条件对应的数组
      const buttons = `buttons='${buttonLists}'`
      // 接口查询按钮的地址
      const findUrl = `findUrl='${config.findUrl}'`
      // 结局查询按钮的方法
      const findMethods = `findMethods='${config.findMethods}'`

      str = `<el-form-item ${ref} ${labelWidth} ${buttons} ${isFind}  ${buttonList}${dataType}${url}${option}${findUrl}${findMethods}${filterable} ${interfaceMethod} ${label} ${buttonMethod} ${hookUrl}${vModel}  ${prop}  type="${config.tag}" form-id="${formId}" ${required} ${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId} >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-select' || config.tag === 'el-cascader' || config.tag === 'el-tree') {
      str = `<el-form-item ${key} ${rules} ${ref} ${labelWidth} ${businessDictionaryId}  ${businessDictionary} ${domainSource} ${selectUrl}${selectMethod} ${interfaceMethod}${dataType} ${filterable} ${label} ${vModel} ${prop}  type="${config.tag}" form-id="${formId}" ${required} ${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr}  >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-transfer') {
      str = `<el-form-item  ${ref} ${labelWidth} ${businessDictionaryId}  ${businessDictionary} ${domainSource}  ${selectUrl}${selectMethod} ${interfaceMethod}${dataType} ${filterable} ${label}  ${vModel} ${prop} type="${config.tag}" form-id="${formId}" ${required} >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-tabs') {
      str = `<el-form-item ${ref} ${labelWidth}${selectUrl}${selectMethod} ${interfaceMethod}${dataType} ${tabPosition} ${label}  ${vModel} ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden} ${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr}  >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-button') {
      str = `<el-form-item ${ref} ${labelWidth}${dataType} ${businessDictionaryId}   ${businessDictionary} ${domainSource} ${filterable} ${label} ${buttonMethod} ${hookUrl} ${vModel}  ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId} >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'el-table') {
      str = `<el-form-item  ${ref} ${labelWidth} ${dataType} ${filterable} ${buttonMethod} ${hookUrl} ${vModel}    ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}${entity}  ${entityId}  ${entityField} ${entityCode} ${entityFieldCode} ${tableCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId} >
        ${tagDom}
      </el-form-item>`
    }
    if (config.tag === 'iframe') {
      str = `<el-form-item ${ref} ${labelWidth} ${dataType} form-id="${formId}" type="${config.tag}">
        ${tagDom}
      </el-form-item>`
    }
    // 标题
    if (config.isTitle && config.tag === 'el-card') {
      const name = (scheme.__slot__.options).trim()
      const anchorPointBackgroundColor = scheme.__config__.anchorPointBackgroundColor ? `anchorPointBackgroundColor="${config.anchorPointBackgroundColor}"` : ''
      const anchorPointColor = scheme.__config__.anchorPointColor ? `anchorPointColor="${config.anchorPointColor}"` : ''
      const anchorPoint = scheme.__config__.anchorPoint ? `anchorPoint="${config.anchorPoint}"` : ''
      const ID = scheme.__config__.isAnchorPoint ? `ID="${config.formId}"` : ''
      const isTitle = `isTitle="${scheme.__config__.isTitle}"`
      const classs = `class="titleStyle"`
      str = `<el-form-item ${ref}${isHidden} ${ID} ${labelWidth} ${classs} ${label} ${isTitle} ${anchorPointColor} ${anchorPointBackgroundColor} ${anchorPoint}  type="${config.tag}"  ${vModel}  ${prop} name="${name}"${required} form-id="${formId}">
        ${tagDom}
      </el-form-item>`
    // 提示文字
    } else if (config.tag === 'el-card' && config.isAlert) {
      const isAlert = `isAlert="${scheme.__config__.isAlert}"`
      const color = `color="${scheme.__config__.color}"`
      const fontSize = `fontSize="${scheme.__config__.fontSize}"`
      const textAlign = `textAlign="${scheme.__config__.textAlign}"`
      str = `<el-form-item  ${ref}${isHidden}  ${labelWidth} ${label} ${isAlert}  ${textAlign} ${fontSize} ${color}  type="${config.tag}"  ${vModel}  ${prop}  ${required} form-id="${formId}">
        ${tagDom}
      </el-form-item>`
    } else if (config.tag === 'el-card') {
      const shadow = `shadow="${scheme.shadow}"`
      const name = (scheme.__slot__.options).trim()
      const html = config.html
      const css = config.css
      const style = 'style = "border: 0px solid #EBEEF5;"'
      // 直接覆盖掉原有的html代码，解决组件更新无效的问题
      sessionStorage.setItem(name + 'HTML', html)
      if (sessionStorage.getItem(name + 'CSS') === null) {
        sessionStorage.setItem(name + 'CSS', css)
      }
      if (sessionStorage.getItem(name + 'JS') === null && config.js !== undefined) {
        const js = config.js
        sessionStorage.setItem(name + 'JS', objectToString(js))
      }
      str = `<el-card ${ref} ${shadow} ${labelWidth}${dataType}  ${label} type="${config.tag}" name="${name}" ${required} form-id="${formId}" ${style}>
        ${config.html}
      </el-card>`
    }
    // 分割线
    if (config.tag === 'el-divider') {
      const { tag, vModel } = attrBuilder(scheme)
      const content_position = scheme['content-position'] ? `content-position="${scheme['content-position']}"` : ''
      const anchorPoint = scheme.__config__.anchorPoint ? `anchorPoint="${config.anchorPoint}"` : ''
      const child = buildDividerChild(scheme)
      str = `<${tag}  ${vModel} form-id="${formId}" type="${config.tag}" ${anchorPoint} ${prop} ${content_position}> ${child} </${tag}>`
    }
    if (config.tag === 'el-upload') {
      const actionUrl = scheme.__config__.action ? `actionUrl="${scheme.__config__.action}"` : ''
      const action = scheme.action ? `:action="${scheme.__vModel__}Action"` : ''
      if (config.uploadStyle === 'button') {
        str = `<el-form-item ${ref} ${labelWidth} ${dataType}  ${actionUrl}  ${filterable} ${businessDictionaryId}  ${businessDictionary} ${domainSource} ${action} ${vModel}  ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}   >
        ${tagDom}
      </el-form-item>`
      } else {
        str = `<el-form-item ${ref} ${labelWidth} ${dataType}  ${actionUrl}  ${filterable} ${businessDictionaryId}  ${businessDictionary} ${domainSource}  ${label} ${action} ${vModel}  ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}   >
        ${tagDom}
      </el-form-item>`
      }
    }
    if (config.tag === 'custom-date-picker') {
      const children = config.children.map(el => {
        return layouts[el.__config__.layout](el)
      })
      str = `<el-form-item ${ref} ${showTip} ${labelWidth} ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}   >
         ${children.join('\n')}
      </el-form-item>`
    }
    if (config.tag === 'select-tree') {
      str = `<el-form-item ${ref} ${labelWidth} ${label} ${prop} type="${config.tag}" form-id="${formId}" ${required} ${isHidden}   >
                ${tagDom}
             </el-form-item>`
    }
    str = colWrapper(scheme, str)
    return str
  },
  rowFormItem(scheme) {
    const config = scheme.__config__
    const type = scheme.type === 'default' ? '' : `type="${scheme.type}"`
    const justify = scheme.type === 'default' ? '' : `justify="${scheme.justify}"`
    const align = scheme.type === 'default' ? '' : `align="${scheme.align}"`
    const gutter = scheme.gutter ? `:gutter="${scheme.gutter}"` : ''
    const children = config.tag !== 'dialog' ? config.children.map(el => layouts[el.__config__.layout](el)) : []
    const formId = config.formId ? config.formId : ''
    const componentName = config.componentName ? config.componentName : ''
    // const isHidden = config.isHidden ? 'style="display: none;" is-hidden' : ''
    const isHidden = `v-show="${!config.isHidden}"`
    const dataType = config.dataType ? `dataType="${config.dataType}"` : ''
    const entity = `entity="${config.entity}"`
    const entityCode = `entityCode="${config.entityCode}"`
    const entityField = `entityField="${config.entityField}"`
    const entityFieldCode = `entityFieldCode="${config.entityFieldCode}"`
    const entityFieldName = `entityFieldName="${config.entityFieldName}"`
    const displayAttr = `displayAttr="${config.displayAttr}"`
    const sourceAttr = `sourceAttr="${config.sourceAttr}"`
    const sourceSpecId = `sourceSpecId="${config.sourceSpecId}"`
    const maxNum = `maxNum="${config.maxNum}"`
    const style = config.rowShow ? `style="margin-top:20px;"` : ''
    // const _condition = scheme.__config__.condition ? `${scheme.__config__.condition}` : true
    // const processCondition = scheme.__config__.processCondition ? `${scheme.__config__.processCondition}` : false
    // const condition = (scheme.__config__.condition || scheme.__config__.processCondition)
    //   ? `v-if="${_condition} || ${processCondition}"` : ''
    const _condition = scheme.__config__.condition
    const processCondition = scheme.__config__.processCondition
    let condition = ''
    if (processCondition && _condition) {
      condition = `v-if="${_condition} || ${processCondition}"`
    } else {
      if (scheme.__config__.condition) {
        condition = `v-if="${_condition}"`
      } else if (scheme.__config__.processCondition) {
        condition = `v-if="${processCondition}"`
      } else {
        condition = ``
      }
    }
    const ref = `ref="${config.componentName}"`
    let str = ''
    // 组件容器组件
    if (config.isComponent) {
      const children1 = config.children.map(el => {
        el.__config__.isComponentChildren = config.componentName
        return layoutsRules[el.__config__.layout](el)
      })
      str = `
      <template v-for="(item,index) in formData.${config.componentName}List" style="position:relative;padding:0"   ${maxNum}    ${ref}  ${justify} ${align}${dataType}  ${displayAttr} ${sourceAttr} ${sourceSpecId} ${gutter} form-id="${formId}" component-name="${componentName}" ${isHidden}>
        <el-col id="col" :span="24" :xs="24" style="padding: 10px 20px 0 10px;position:relative;border:1px solid #EBEEF5;margin-bottom:10px;min-height:40px">
        <span
          v-if="${config.componentName}Show"
          style="position:absolute;left:0;top:20px;border:1px solid #f56c6c;border-radius:50%;width:14px;height:14px;line-height:13px;display:inline-block;text-align:center;color:#f56c6c">
        {{ index + 1 }}</span>
          ${children1.join('\n')}
          <i
            v-if="${config.componentName}Show"
            class="el-icon-remove-outline"
            style="fontSize: 20px;color:#f56c6c;cursor:pointer;line-height:32px;position:absolute"
            @click="deleteRow('${config.componentName}', index)"
          ></i>
        </el-col>
      </template>

     <el-col ${condition} :span="24" :xs="24" style="padding: 0">
     <el-button style="margin:10px" class="bottonStyle" v-if="${config.componentName}Button[0].isShow" @click="addComponentList('${config.componentName}',${config.maxNum})" type="primary"   size="medium"> {{${config.componentName}Button[0].name}} </el-button>
    </el-col>
     `
    } else if (config.tag === 'el-collapse-item') {
      const title = `title="${scheme.title}"`
      const name = `name="${scheme.name}"`
      const anchorPointBackgroundColor = scheme.__config__.anchorPointBackgroundColor ? `anchorPointBackgroundColor="${config.anchorPointBackgroundColor}"` : ''
      const anchorPointColor = scheme.__config__.anchorPointColor ? `anchorPointColor="${config.anchorPointColor}"` : ''
      const anchorPoint = scheme.__config__.anchorPoint ? `anchorPoint="${config.anchorPoint}"` : ''
      const ID = scheme.__config__.isAnchorPoint ? `ID="${config.formId}"` : ''
      const iconPosition = scheme.__config__.iconPosition ? `iconPosition="${config.iconPosition}"` : `iconPosition="right"`
      const showtext = scheme.__config__.showtext ? `showtext="${config.showtext}"` : ``
      str = ` <el-collapse v-model="formData.${componentName}" form-id="${formId}" ${showtext} ${ref} ${ID} ${iconPosition} ${anchorPointBackgroundColor}  ${anchorPointColor}  ${anchorPoint} ${isHidden} ${title} ${name}  component-name="${componentName}" @change="collapseItemNames.push('${scheme.name}') ">
                <el-collapse-item  ${name} >
                 <span class="collapse-title" slot="title">${scheme.title} </span>
                    <el-col v-if="collapseItemNames.indexOf('${scheme.name}') > -1">
                          ${children.join('\n')}
                    </el-col>
                </el-collapse-item>
              </el-collapse>`
    } else if (config.tag === 'dialog') {
      const title = `:title="${scheme.__vModel__}_title"`
      const width = isNaN(config.width) ? `width="${config.width}"` : `width="${config.width}px"`
      const visible = `:visible.sync="${scheme.__vModel__}Visible"`
      const children = config.children.map(el => layouts[el.__config__.layout](el))
      const btnArea = config.btnArea.map(el => layouts[el.__config__.layout](el))
      const className = config.btnAlign === 'right' ? 'dialog-button algin-right' : 'dialog-button'
      if (config.btnArea.length > 0) {
        str = ` <el-dialog ${title} ${width} ${visible}>
                  <el-form size="small" label-width="80px" style="display: block; width: 100%;">
                    <el-row>
                    ${children.join('\n')}
                    </el-row>
                  </el-form>
                  <div slot="footer" class="${className} dialog-footer">
                    ${btnArea.join('\n')}
                  </div>
                </el-dialog>`
      } else {
        str = ` <el-dialog ${title} ${width} ${visible}>
                  <el-form size="small" label-width="80px" style="display: block; width: 100%;">
                    <el-row>
                      ${children.join('\n')}
                    </el-row>
                  </el-form>
              </el-dialog>`
      }
    } else if (config.tag === 'table') {
      // 如果是表格
      const searchArea = config.searchArea.map(el => layouts[el.__config__.layout](el))
      const children = config.children.map(el => layouts[el.__config__.layout](el))
      str = `
        <div class="search-wrap">
             ${searchArea.join('\n')}
        </div>
        ${children.join('\n')}
      `
    } else {
      config.children.map(el => {
        el.__config__.isComponentChildren = false
        return layouts[el.__config__.layout](el)
      })
      if (!config.isBlock) {
        str = `<el-row ${style} ${ref} ${type}  ${justify} ${align}${dataType} ${entity} ${entityField} ${entityCode} ${entityFieldCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId}  ${gutter} form-id="${formId}" component-name="${componentName}" ${isHidden}>
        ${children.join('\n')}
      </el-row>`
      // 如果是业务组件的块
      } else {
        str = `<el-row ${style} ${ref} ${type}  ${justify} ${align}${dataType} ${entity} ${entityField} ${entityCode} ${entityFieldCode} ${entityFieldName} ${displayAttr} ${sourceAttr} ${sourceSpecId}  ${gutter} form-id="${formId}" component-name="${componentName}" ${isHidden}>
        </el-col>
        ${children.join('\n')}
      </el-row>`
      }
    }
    str = colWrapper(scheme, str)

    return str
  }
}
// 表格的解析
const tableLayouts = {
  colFormItem(scheme) {
    let divWidth
    if (scheme.__config__.span <= 12 && scheme.__config__.span > 8) {
      divWidth = 12
    } else if (scheme.__config__.span <= 8 && scheme.__config__.span > 6) {
      divWidth = 8
    } else if (scheme.__config__.span <= 6) {
      divWidth = 6
    } else {
      divWidth = 24
    }
    const config = scheme.__config__
    let labelWidth = ''
    let label = `label="${config.label}"`
    if (config.labelWidth && config.labelWidth !== confGlobal.labelWidth) {
      labelWidth = `label-width="${config.labelWidth}px"`
    }
    if (config.showLabel === false || config.tag === 'el-table') {
      labelWidth = 'labelWidth="0"'
      label = 'label=""'
    }
    const formId = config.formId ? config.formId : ''
    const ref = `ref="${config.componentName}"`
    const required = !ruleTrigger[config.tag] && config.required ? 'required' : ''
    let prop = ''
    // isComponentChildren判断是区块遍历组件里面元素
    if (config.isComponentChildren) {
      prop = ``
    } else {
      prop = `prop="${scheme.__vModel__}"`
    }

    const isHidden = `${config.isHidden}` ? `v-show="${!config.isHidden}"` : ''
    const formData = (scheme.__config__.isComponentChildren) ? 'item' : 'formData'
    // const _condition = scheme.__config__.condition ? `${scheme.__config__.condition}` : true
    // const processCondition = scheme.__config__.processCondition ? `${scheme.__config__.processCondition}` : false
    // const condition = (scheme.__config__.condition || scheme.__config__.processCondition)
    //   ? `v-if="${_condition} || ${processCondition}"` : ''
    const _condition = scheme.__config__.condition
    const processCondition = scheme.__config__.processCondition
    let condition = ''
    if (processCondition && _condition) {
      condition = `v-if="${_condition} || ${processCondition}"`
    } else {
      if (scheme.__config__.condition) {
        condition = `v-if="${_condition}"`
      } else if (scheme.__config__.processCondition) {
        condition = `v-if="${processCondition}"`
      } else {
        condition = ``
      }
    }
    let str = `<el-col :span="${divWidth}"   class="tableDivStyle" ${condition}>
    <div class='tableHeadStyle'>${scheme.__config__.label}</div>
  <div class='tableBodyStyle'>{{${formData}.${scheme.__vModel__}}}</div>
</el-col>`
    if (scheme.__config__.tag === 'tinymce') {
      str = `<el-col :span="${divWidth}"   class="tableDivStyle" ${condition}>
    <div class='tableHeadStyle'>${scheme.__config__.label}</div>
  <div class='tableBodyStyle' v-html='${formData}.${scheme.__vModel__}'>{{${formData}.${scheme.__vModel__}}}</div>
</el-col>`
    } else if (scheme.__config__.isAlert || scheme.__config__.isHidden || scheme.__config__.tag === 'el-button') {
      // 如果是提示文字或按钮等不显示
      str = ``
    } else if (['el-select', 'el-radio-group', 'el-checkbox-group'].includes(scheme.__config__.tag)) {
      const props = scheme.props?.props || {}
      const label = props.label || 'name'
      const value = props.value || 'value'
      // 如果是下拉则动态切换
      str = `<el-col :span="${divWidth}"   class="tableDivStyle" ${condition}>
    <div class='tableHeadStyle'>${scheme.__config__.label}</div>
    <div class='tableBodyStyle'>{{ resolveDetailDict("${scheme.__vModel__}", "${label}", "${value}" )}}</div>
</el-col>`
    } else if (scheme.__config__.tag === 'el-upload') {
      // 附件组件
      if (scheme.__config__.showLabel) {
        str = `<el-col :span="${divWidth}"   class="tableDivStyle" ${condition}>
    <div class='tableHeadStyle '>${scheme.__config__.label}</div>
  <div class='tableBodyStyle uploadStyle'><template  v-for="item in ${scheme.__vModel__}fileList">
                <el-tooltip :content="'点按下载：'+item.fileName" placement="top" effect="light">
                  <a class="attach-item" @click.prevent="downloadFile(item)">{{ item.fileName }}</a>
                </el-tooltip>
              </template></div>
      </el-col> `
      } else {
        str = `<el-col :span="${divWidth}"   class="tableDivStyle" ${condition}>
  <div class='tableBodyStyle uploadStyle uploadStyle1'><template v-for="item in ${scheme.__vModel__}fileList">
              <el-tooltip :content="'点按下载：'+item.fileName" placement="top" effect="light">
                <a class="attach-item" @click.prevent="downloadFile(item)">{{ item.fileName }}</a>
                </el-tooltip>
              </template></div>
</el-col>`
      }
    } else if (scheme.__config__.isTitle) {
      // 如果是标题组件
      const name = (scheme.__slot__.options).trim()
      const anchorPointBackgroundColor = scheme.__config__.anchorPointBackgroundColor ? `anchorPointBackgroundColor="${config.anchorPointBackgroundColor}"` : ''
      const anchorPointColor = scheme.__config__.anchorPointColor ? `anchorPointColor="${config.anchorPointColor}"` : ''
      const anchorPoint = scheme.__config__.anchorPoint ? `anchorPoint="${config.anchorPoint}"` : ''
      const ID = scheme.__config__.isAnchorPoint ? `ID="${config.formId}"` : ''
      const isTitle = `isTitle="${scheme.__config__.isTitle}"`
      const classs = `class="titleStyle"`
      str = `<el-col class="card_style">
                <el-col :span="24" :xs="24" style="padding: 0">
                  <el-form-item ${condition} ${ref}${isHidden} ${ID} ${labelWidth} ${classs} ${label} ${isTitle} ${anchorPointColor} ${anchorPointBackgroundColor} ${anchorPoint}  type="${config.tag}"   ${prop} name="${name}"${required} form-id="${formId}">
                    <el-card shadow="never" style="border: 0px solid #EBEEF5;" >
                      <div slot="header" class="clearfix">
                        <span class="gc-card__title">{{${scheme.__vModel__}Options}}</span>
                      </div>
                    </el-card>
                  </el-form-item>
                </el-col>
            <el-col class="card_style1">
    <el-row class="tableStyle"> `
      if (isCardTop) {
        // 是表单的开头
        isCardTop = false
      } else {
        str = `</el-row></el-col></el-col>` + str
      }
    } else {
      if (isCardTop) {
        isCardTop = false
        str = `<el-col class="card_style1"><el-row class="tableStyle"> ` + str
      }
    }
    return str
  },
  rowFormItem(scheme) {
    const config = scheme.__config__
    const formId = config.formId ? config.formId : ''
    const ref = `ref="${config.componentName}"`
    const componentName = config.componentName ? config.componentName : ''
    // const _condition = scheme.__config__.condition ? `${scheme.__config__.condition}` : true
    // const processCondition = scheme.__config__.processCondition ? `${scheme.__config__.processCondition}` : false
    // const condition = (scheme.__config__.condition || scheme.__config__.processCondition)
    //   ? `v-if="${_condition} || ${processCondition}"` : ''
    const _condition = scheme.__config__.condition
    const processCondition = scheme.__config__.processCondition
    let condition = ''
    if (processCondition && _condition) {
      condition = `v-if="${_condition} || ${processCondition}"`
    } else {
      if (scheme.__config__.condition) {
        condition = `v-if="${_condition}"`
      } else if (scheme.__config__.processCondition) {
        condition = `v-if="${processCondition}"`
      } else {
        condition = ``
      }
    }
    const children = config.children.map(el => layouts[el.__config__.layout](el))
    const children1 = config.children.map(el => {
      el.__config__.isComponentChildren = config.componentName
      return tableLayouts[el.__config__.layout](el)
    })
    let str = ''

    if (config.isComponent) {
      str = `<template v-for="(item,index) in ${config.componentName}List" >
      ${children1.join('\n')}
    </template> `
    } else if (scheme.__config__.tag === 'el-collapse-item') {
      // 如果是折叠面板
      const title = `title="${scheme.title}"`
      const name = `name="${scheme.name}"`
      const anchorPointBackgroundColor = scheme.__config__.anchorPointBackgroundColor ? `anchorPointBackgroundColor="${config.anchorPointBackgroundColor}"` : ''
      const anchorPointColor = scheme.__config__.anchorPointColor ? `anchorPointColor="${config.anchorPointColor}"` : ''
      const anchorPoint = scheme.__config__.anchorPoint ? `anchorPoint="${config.anchorPoint}"` : ''
      const ID = scheme.__config__.isAnchorPoint ? `ID="${config.formId}"` : ''
      const iconPosition = scheme.__config__.iconPosition ? `iconPosition="${config.iconPosition}"` : `iconPosition="right"`
      const showtext = scheme.__config__.showtext ? `showtext="${config.showtext}"` : ``
      str = `<el-col :span="24" :xs="24" style="background-color: transparent;padding: 0;margin: 16px 0; ">
      <el-collapse ${condition} v-model="formData.${componentName}" form-id="${formId}" ${showtext} ${ref} ${ID} ${iconPosition} ${anchorPointBackgroundColor}  ${anchorPointColor}  ${anchorPoint}   ${title} ${name}  component-name="${componentName}" @change="collapseItemNames.push('${scheme.name}') ">
                <el-collapse-item  ${name} >
                 <span class="collapse-title" slot="title">${scheme.title} </span>
                    <el-col v-if="collapseItemNames.indexOf('${scheme.name}') > -1">${children.join('\n')}</el-col> </el-collapse-item> </el-collapse></el-col>`
      if (isCardTop) {
        isCardTop = false
      } else {
        str = `</el-row></el-col></el-col>` + str
      }
    } else if (config.tag === 'table') {
      // 如果是表格
      const searchArea = config.searchArea.map(el => layouts[el.__config__.layout](el))
      const children = config.children.map(el => layouts[el.__config__.layout](el))
      str = `
        <div class="search-wrap">
             ${searchArea.join('\n')}
        </div>
        ${children.join('\n')}
      `
    } else {
      str = `${children.join('\n')}`
    }

    return str
  }
}

const tags = {
  'selectDialog': el => {
    const {
      disabled, vModel, clearable, placeholder, width, on
    } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const focus = `@focus="${el.__vModel__}_focus"`
    const filterable = el.filterable ? 'true' : 'false'
    const multiple = 'multiple'
    const data = !el.loadLazy ? `:data="${el.__vModel__}_data"` : ''
    const loadLazy = el.loadLazy ? `:load="${el.__vModel__}_custom_loadNode" lazy` : ''
    const filterNode = el.__config__.filterable ? `:filter-node-method="${el.__vModel__}_filterNode"` : ''// 可搜索
    const filterText = el.__config__.filterable ? `v-model="${el.__vModel__}_filterText"` : ''// 可搜索
    const defaultExpandAll = el['default-expand-all'] ? ':default-expand-all="true"' : ':default-expand-all="false"'
    const str = `
    <el-dialog title='${el.__config__.dialogTitle}' append-to-body :visible.sync="${el.__vModel__}_dialogVisible":before-close="${el.__vModel__}_rest" width="${el.__config__.dialogWidth}px" top="5vh">
        <el-row>
          <el-col :span="6" :xs="24"><span>组织机构</span></el-col>
          <el-col :span="12" :xs="24"><span>人员</span></el-col>
          <el-col :span="6" :xs="24"><span>已选人员</span></el-col>
          <el-col :span="6" :xs="24" style="padding: 0; height: ${el.__config__.dialogHeight}px; overflow: auto;">
              <el-input v-if="${filterable}" ${filterText}  placeholder="输入关键字进行过滤" style="position: sticky;z-index: 100;top: 0px" />
              <el-tree ${data}
                       :props="${el.__vModel__}Props"
                       :expand-on-click-node="false"
                       ${defaultExpandAll} ${loadLazy}
                       @node-click="${el.__vModel__}_handleNodeClick"
                       ${filterNode}
                       ref="${el.__vModel__}_tree" />
          </el-col>
          <el-col :span="12" :xs="24" style="padding: 0;position: relative;">
              <el-col :span="10" :xs="24" style="padding: 0">
                  <el-form-item label="登录账号">
                      <el-input v-model="${el.__vModel__}_userName" clearable />
                  </el-form-item>
              </el-col>
              <el-col :span="10" :xs="24" style="padding: 0">
                  <el-form-item label="用户名">
                      <el-input v-model="${el.__vModel__}_realName" clearable />
                  </el-form-item>
              </el-col>
              <el-col :span="3" :offset="1" :xs="24" style="padding: 0"><el-button type="primary" style="margin-left: 0" @click="${el.__vModel__}_getTableData">查询</el-button></el-col>
              <el-table :data="${el.__vModel__}_tableData" :height="${el.__vModel__}_tableHeight" style="width: 100%; margin-top: 50px">
                  <el-table-column prop="userName" label="登录账号" width="120px" align="center" />
                  <el-table-column prop="realName" label="用户名" width="150px" align="center" />
                  <el-table-column prop="orgName" label="机构" align="center">
                    <template slot-scope="scope">
                      <el-popover trigger="hover" placement="top">
                        {{ scope.row.orgNameSeq }}
                        <div slot="reference" style="height: 30px;">
                          {{ scope.row.orgName }}
                        </div>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="65px" align="center">
                      <template slot-scope="scope">
                          <el-button type="text" style="margin-left: 0" @click="${el.__vModel__}_addUser(scope.row)">增加</el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <el-pagination
                  @size-change="${el.__vModel__}_handleSizeChange"
                  @current-change="${el.__vModel__}_handleCurrentChange"
                  :current-page="${el.__vModel__}_currentPage"
                  :page-sizes="[5, 10, 20, 50]"
                  :page-size="${el.__vModel__}_pageSize"
                  layout="total, sizes, prev, pager, next"
                  :total="${el.__vModel__}_total"
                  style="position: absolute;right: 0;">
              </el-pagination>
          </el-col>
          <el-col :span="6" :xs="24" style="padding: 0; height: ${el.__config__.dialogHeight}px; overflow: auto;">
              <span v-for="(item,index) in ${el.__vModel__}_options" :key="index" style="margin-left: 50px">
                  <span>{{ item.realName }}</span>
                  <el-button type="text" style="margin-left: 0" size="mini" icon="el-icon-delete" @click="${el.__vModel__}_deleteUser(index)" />
                  <br>
              </span>
          </el-col>
        </el-row>
        <span slot="footer" class="dialog-footer">
          <el-button @click="${el.__vModel__}_rest">取 消</el-button>
          <el-button type="primary" @click="${el.__vModel__}_dialogSure">确 定</el-button>
        </span>
    </el-dialog>
    `
    return `<el-select ${event} ${vModel} ${focus} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} collapse-tags no-data-text="请选择机构下人员" ${width} />${str}`
  },
  'el-empty': el => {
    const {
      tag, on
    } = attrBuilder(el)
    // eslint-disable-next-line no-unused-vars
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const dialogConfig = el.__config__.tableDialog.__config__
    const dialogChildren = getDialogChildren(dialogConfig)
    const str = `
        <el-col :span="2">
          <el-button type='primary' icon='${el.__config__.dialogBtn.icon}' circle @click="dialogShow${el.__config__.formId}"></el-button>
        </el-col>
        <el-dialog title="${dialogConfig.title}" :visible.sync="visiblefield${el.__config__.formId}DialogTable" width="${dialogConfig.width}">
          ${dialogChildren.length > 0 ? dialogChildren : '暂无数据'}
          <span slot="footer" class="dialog-footer ">
            <el-button v-if="${dialogConfig.btnList[0].isShow}" @click="Cancelfield${el.__config__.formId}">${dialogConfig.btnList[0].actionName}</el-button>
            <el-button v-if="${dialogConfig.btnList[1].isShow}" type="primary" @click="Surefield${el.__config__.formId}">${dialogConfig.btnList[1].actionName}</el-button>
          </span>
        </el-dialog>
      `
    return `<el-col :span="12"><${tag} v-if="false"></${tag}></el-col>${str}`
  },
  'el-button': (el, parentModel) => {
    const {
      tag, disabled, on
    } = attrBuilder(el)
    // eslint-disable-next-line no-unused-vars
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const _condition = el.__config__.condition
    const processCondition = el.__config__.processCondition
    let condition = ''
    if (processCondition && _condition) {
      condition = `v-if="${_condition} || ${processCondition}"`
    } else {
      if (el.__config__.condition) {
        condition = `v-if="${_condition}"`
      } else if (el.__config__.processCondition) {
        condition = `v-if="${processCondition}"`
      } else {
        condition = ``
      }
    }
    const type = el.type ? `type="${el.type}"` : ''
    const icon = el.icon ? `icon="${el.icon}"` : ''
    const round = el.round ? 'round' : ''
    const size = el.size ? `size="${el.size}"` : ''
    const plain = el.plain ? 'plain' : ''
    const circle = el.circle ? 'circle' : ''
    const id = `id="dialog"`
    const vis = `:visible.sync="${el.__vModel__}_visible"`
    let child = buildElButtonChild(el)
    let click = parentModel ? `@click.native.stop="${el.__vModel__}_custom_click(['${parentModel}'])"` : `@click.native.stop="${el.__vModel__}_custom_click(['defaultForm'])"`
    if (el.__config__.tableDataName) { // 如果是表格操作中的按钮
      click = `@click.native.stop="${el.__vModel__}_custom_click(row, $index, '${el.__config__.tableDataName}')"`
    }
    const dialogTitle = el.__config__.dialogTitle && el.__config__.dialogTitle.trim() !== '' ? `title="${el.__config__.dialogTitle}"` : ''
    const style = el.__config__.dialogTitle && el.__config__.dialogTitle.trim() !== '' ? `class="formDialog" ` : ''
    if (child) child = `\n${child}\n` // 换行
    const btnConfig = JSON.stringify(el.__config__.btnJsonData)
    if (btnConfig.responseAction === 1 && btnConfig.formUrl) {
      return `<${tag} ${click} ${type} ${icon} ${round} ${size} ${plain} ${disabled} ${circle}>${child}</${tag}>` +
        `<el-dialog title="${btnConfig.dialogTitle}" width="${btnConfig.dialogWidth || '50%'}" ${vis} ${style} ${dialogTitle} :append-to-body="true">
          <iframe :src="${el.__vModel__}_formUrl" style="width: 100%; height: calc(${btnConfig.dialogHeight || '400px'} - 85px);" frameborder=0  ></iframe>
        </el-dialog>`
    }
    return `<${tag} ${condition} :disabled="${el.__vModel__}_disabled" :loading="${el.__vModel__}_loading" ${click} ${id} ${type} ${icon} ${round} ${size} ${plain} ${disabled} ${circle}>${child}</${tag}>`
  },
  'el-input': el => {
    const {
      tag, disabled, vModel, clearable, placeholder, width, on
    } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${el.__vModel__}_${[e]}"`
    }
    const maxlength = el.maxlength ? `:maxlength="${el.maxlength}"` : ''
    const readonly = el.readonly ? 'readonly' : ''
    const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : ''
    const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : ''
    const showPassword = el['show-password'] ? 'show-password' : ''
    const type = el.type ? `type="${el.type}"` : ''
    const autosize = el.autosize && el.autosize.minRows
      ? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
      : ''
    let child = buildElInputChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${event} ${vModel} ${type} ${placeholder} ${maxlength} ${readonly} ${disabled} ${clearable} ${prefixIcon} ${suffixIcon} ${showPassword} ${autosize} ${width}>${child}</${tag}>`
  },
  'el-input-number': el => {
    const {
      tag, disabled, vModel, placeholder, on, width
    } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const controlsPosition = el['controls-position'] ? `controls-position=${el['controls-position']}` : ''
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step ? `:step='${el.step}'` : ''
    const stepStrictly = el['step-strictly'] ? 'step-strictly' : ''
    const precision = el.precision ? `:precision='${el.precision}'` : ''

    return `<${tag} ${event} ${vModel} ${placeholder} ${step} ${stepStrictly} ${precision} ${controlsPosition} ${min} ${max} ${disabled} ${width}></${tag}>`
  },
  'el-select': el => {
    const {
      tag, disabled, vModel, clearable, placeholder, width, on
    } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) {
        // 如果有el.changeEventCascade说明添加了静态级联
        if (el.changeEventCascade && e === 'change') {
          event += `@${e}="${el.__vModel__}_${[e]};${el.changeEventCascade}"`
        } else {
          event += `@${e}="${el.__vModel__}_${[e]}"`
        }
      }
    }
    // const jsonData = safelyParseJSON(el.__config__.jsonData)
    // const focus = (jsonData && jsonData.dataOrigin !== '1') ? `@focus="${el.__vModel__}_select_focus"` : ''
    const filterable = el.filterable ? 'filterable' : ''
    const multiple = el.multiple ? 'multiple' : ''
    let child = buildElSelectChild(el)
    if (child) child = `\n${child}\n` // 换行
    // return `<${tag} ${event} ${focus} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${tag}>`
    return `<${tag} ${event} ${vModel} ${placeholder} ${disabled} ${multiple} ${filterable} ${clearable} ${width}>${child}</${tag}>`
  },
  'el-cascader': el => {
    const {
      tag, disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el)
    const options = el.options ? `:options="${el.__vModel__}Options"` : ''
    const props = el.props ? `:props="${el.__vModel__}Props"` : ''
    const showAllLevels = el['show-all-levels'] ? ':show-all-levels="true"' : ':show-all-levels="false"'
    const filterable = el.filterable ? 'filterable' : ''
    const separator = el.separator === '/' ? '' : `separator="${el.separator}"`

    return `<${tag} ${vModel} ${options} ${props} ${width} ${showAllLevels} ${placeholder} ${separator} ${filterable} ${clearable} ${disabled}></${tag}>`
  },
  'el-card': el => {
    const {
      tag, vModel
    } = attrBuilder(el)
    const shadow = `shadow="${el.shadow}"`
    const style = 'style = "border: 0px solid #EBEEF5;"'
    if (el.__config__.isTitle) {
      return `<${tag} ${shadow} ${style} ${vModel} ><div slot="header" class="clearfix">
    <span class="gc-card__title">{{${el.__vModel__}Options}}</span>
  </div></${tag}>`
    } else if (el.__config__.isAlert) {
      return `<${tag} ${shadow} ${style} ${vModel} ><div style='margin-left:${el.__config__.labelWidth === null ? 120 : 5}px;font-size:${el.__config__.fontSize}px;line-height:36px;color:${el.__config__.color};text-align:${el.__config__.textAlign};'>{{${el.__vModel__}Options}}</div></${tag}>`
    }
  },
  'el-tree': el => {
    const {
      tag, vModel, placeholder, width
    } = attrBuilder(el)
    const data = el.data ? `:data="${el.__vModel__}Data"` : ''
    const props = el.props ? `:props="${el.__vModel__}Props"` : ''
    const indent = el.indent ? `:indent='${el.indent}'` : ''
    // const emptyText = el.indent ? `empty-text="${el.['empty-text']}"` : ''
    // const nodeKey = el.['node-key'] ? `node-key="${el.['node-key']}"` : ''
    const iconClass = el['icon-class'] ? `icon-class='${el['icon-class']}'` : ''
    const defaultExpandAll = el['default-expand-all'] ? ':default-expand-all="true"' : ':default-expand-all="false"'
    const draggable = el.draggable ? 'draggable' : ''
    const showCheckbox = el['show-checkbox'] ? ':show-checkbox="true"' : ':show-checkbox="false"'
    const highlightCurrent = el['highlight-current'] ? ':highlight-current="true"' : ':highlight-current="false"'
    return `<${tag} ${vModel} ${data} ${props} ${width} ${indent} ${iconClass} ${placeholder} ${defaultExpandAll} ${draggable} ${showCheckbox} ${highlightCurrent} ></${tag}>`
  },
  'select-tree': el => {
    const {
      vModel, placeholder, width
    } = attrBuilder(el)
    // const field = `field${Number(el.__vModel__.substring(5))}`
    const data = el.data && !el.loadLazy ? `:data="${el.__vModel__}_data"` : ''
    const props = el.props ? `:props="${el.__vModel__}Props"` : ''
    const treeRef = `ref="${el.__vModel__}_tree"`
    const selectRef = `ref="${el.__vModel__}selectRef"`
    const indent = el.indent ? `:indent='${el.indent}'` : ''
    // const emptyText = el.indent ? `empty-text="${el.['empty-text']}"` : ''
    // const nodeKey = el.['node-key'] ? `node-key="${el.['node-key']}"` : ''
    const iconClass = el['icon-class'] ? `icon-class='${el['icon-class']}'` : ''
    const defaultExpandAll = el['default-expand-all'] ? ':default-expand-all="true"' : ':default-expand-all="false"'
    const draggable = el.draggable ? 'draggable' : ''
    const loadLazy = el.loadLazy ? `:load="${el.__vModel__}_custom_loadNode" lazy` : ''
    const showCheckbox = el['show-checkbox'] ? ':show-checkbox="true"' : ':show-checkbox="false"'
    const highlightCurrent = el['highlight-current'] ? ':highlight-current="true"' : ':highlight-current="false"'
    const vLoading = `v-loading="${el.__vModel__}loading"`
    const nodeClick = `@node-click="${el.__vModel__}_nodeClick"`
    const selectchange = el['show-checkbox'] ? `@change="${el.__vModel__}_selectchange"` : '' // 下拉框改变事件
    const checkchange = el['show-checkbox'] ? `@check-change="${el.__vModel__}_checkchange"` : '' // 多选
    const multiple = el['show-checkbox'] ? 'multiple' : '' // 多选
    const filterNode = el.__config__.searchable ? `:filter-node-method="${el.__vModel__}_filterNode"` : ''// 可搜索
    const filterText = el.__config__.searchable ? `v-model="${el.__vModel__}_filterText"` : ''// 可搜索
    const nodeKey = el['show-checkbox'] ? `node-key="${el.props.props.id}"` : ''// 多选需要的nodekey
    const clearable = !el['show-checkbox'] ? `clearable` : ''//
    let str
    if (el.__config__.searchable) { // 可搜索结构
      str = `
        <el-select ${vModel} placeholder='请选择' ${multiple} ${nodeKey} ${selectRef} ${width} ${vLoading} ${selectchange} ${clearable}>
           <el-option :value="formData.${el.__vModel__}" disabled style='height:200px;overflow: auto;background-color:#fff'>
             <el-input @input="${el.__vModel__}_input" style="margin-left: 2px;width: 99%;" placeholder="输入关键字进行过滤" ${filterText} clearable size="small"></el-input>
             <div class="tree-box select-tree" >
               <el-tree ${treeRef} ${vModel} ${data} ${nodeKey} ${filterNode} ${props} ${loadLazy} ${width} ${indent} ${iconClass} ${placeholder} ${defaultExpandAll} ${draggable} ${showCheckbox} ${highlightCurrent} ${nodeClick} ${checkchange}></el-tree>
             </div>
           </el-option>
        </el-select>`
    } else { // 不可搜索结构
      str = `
        <el-select ${vModel} placeholder='请选择' ${selectRef} ${width} ${vLoading} ${multiple} ${selectchange} ${clearable}>
            <el-option :value="formData.${el.__vModel__}" :label="formData.${el.__vModel__}" style='height:200px;overflow: auto;background-color:#fff'>
               <el-tree ${treeRef} ${vModel} ${data} ${props} ${loadLazy} ${width} ${indent} ${iconClass} ${placeholder} ${defaultExpandAll} ${draggable} ${highlightCurrent} ${nodeClick} ${checkchange} ${showCheckbox}></el-tree>
            </el-option>
        </el-select>`
    }
    return str
  },
  'el-transfer': el => {
    const {
      tag, disabled, vModel, clearable, placeholder, width
    } = attrBuilder(el)
    const data = el.data ? `:data="${el.__vModel__}Data"` : ''
    const props = el.props ? `:props="${el.__vModel__}Props"` : ''
    const filterable = el.filterable ? 'filterable' : ''
    const titles = el.titles ? `:titles="${el.__vModel__}titles"` : ''
    const targetOrder = el['target-order'] ? `:target-order="${el.__vModel__}targetOrder"` : ''

    return `<${tag} ${vModel} ${data} ${props} ${width} ${titles} ${placeholder}  ${targetOrder} ${filterable} ${clearable} ${disabled}></${tag}>`
  },
  'el-tabs': el => {
    const {
      tag, disabled, vModel, width, on
    } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const type = el.type ? `type="${el.type}"` : ''
    // const stretch = el.stretch ? 'stretch' : ''
    const tabPosition = el.tabPosition ? `tabPosition="${el.tabPosition}"` : ''
    let child = buildElTabsChild(el)
    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${event} ${vModel} ${disabled} ${type} ${width} ${tabPosition}>${child}</${tag} @click-tab="changeTab">`
  },
  'el-radio-group': el => {
    const { tag, disabled, vModel, on } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${el.__vModel__}_${[e]}"`
    }
    const size = `size="${el.size}"`
    let child = buildElRadioGroupChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${event} ${vModel} ${size} ${disabled}>${child}</${tag}>`
  },
  'el-checkbox-group': el => {
    const { tag, disabled, vModel, on } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const size = `size="${el.size}"`
    const optionType = el.__config__.optionType === 'button' ? 'optionType= "button"' : 'optionType= "default"'
    const min = el.min ? `:min="${el.min}"` : ''
    const max = el.max ? `:max="${el.max}"` : ''
    let child = buildElCheckboxGroupChild(el)

    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${event} ${vModel} ${min} ${max} ${size} ${optionType} ${disabled}>${child}</${tag}>`
  },
  'el-switch': el => {
    const { tag, disabled, vModel, on } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const activeText = el['active-text'] ? `active-text="${el['active-text']}"` : ''
    const inactiveText = el['inactive-text'] ? `inactive-text="${el['inactive-text']}"` : ''
    const activeColor = el['active-color'] ? `active-color="${el['active-color']}"` : ''
    const inactiveColor = el['inactive-color'] ? `inactive-color="${el['inactive-color']}"` : ''
    const activeValue = el['active-value'] !== true ? `:active-value='${JSON.stringify(el['active-value'])}'` : ''
    const inactiveValue = el['inactive-value'] !== false ? `:inactive-value='${JSON.stringify(el['inactive-value'])}'` : ''
    return `<${tag} ${event} ${vModel} ${activeText} ${inactiveText} ${activeColor} ${inactiveColor} ${activeValue} ${inactiveValue} ${disabled}></${tag}>`
  },
  'el-slider': el => {
    const { tag, disabled, vModel, on } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const min = el.min ? `:min='${el.min}'` : ''
    const max = el.max ? `:max='${el.max}'` : ''
    const step = el.step ? `:step='${el.step}'` : ''
    const range = el.range ? 'range' : ''
    const showStops = el['show-stops'] ? `:show-stops="${el['show-stops']}"` : ''

    return `<${tag} ${event} ${min} ${max} ${step} ${vModel} ${range} ${showStops} ${disabled}></${tag}>`
  },
  'el-date-picker': el => {
    const {
      tag, disabled, vModel, clearable, placeholder, width, on
    } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const range = el.range ? `range="${el.range}"` : ''
    const blur = `@blur="${el.__vModel__}_blur"`
    const change = el.__config__.notClone ? `@change="${el.__vModel__}_change"` : ''
    const dateChange = el.__config__.limitTodayBefore ? `@change="${el.__vModel__}_dateChange"` : ''
    const startPlaceholder = el['start-placeholder'] ? `start-placeholder="${el['start-placeholder']}"` : ''
    const endPlaceholder = el['end-placeholder'] ? `end-placeholder="${el['end-placeholder']}"` : ''
    const rangeSeparator = el['range-separator'] ? `range-separator="${el['range-separator']}"` : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const type = el.type === 'undefined' ? `type=date` : `type="${el.type}"`
    const readonly = el.readonly ? 'readonly' : ''
    const options = el.__config__.limitTodayBefore ? `:picker-options="formData.${el.__vModel__}_pickerOptions"` : ''
    if (el.__config__.tagIcon === 'daterange') {
      const {
        tag, disabled, vModel1, vModel2, clearable, width, on
      } = attrBuilder2(el)
      let event = ''
      let e
      for (e in on) {
        if (on[e]) event += `@${e}="${on[e]}"`
      }
      const startName = `placeholder="${el.daterangeOptions[0].name}"`
      const endName = `placeholder="${el.daterangeOptions[1].name}"`
      const separator = el.separator
      const start = `:picker-options="formData.${el.__vModel__}Start"`
      const end = `:picker-options="formData.${el.__vModel__}End"`
      return `<${tag} ${event} ${type} ${vModel1} ${start} ${format} ${valueFormat} ${width} ${startName} ${clearable} ${readonly} ${disabled}></${tag}><span style="padding: 10px">${separator}</span><${tag} ${event} ${type} ${vModel2} ${end} ${format} ${valueFormat} ${width} ${endName} ${clearable} ${readonly} ${disabled}></${tag}>`
    } else if (el.__config__.notClone) {
      return `<${tag} ${event} ${type} ${range} ${blur} ${change} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${tag}>`
    } else {
      return `<${tag} ${event} ${type} ${options} ${range} ${blur} ${dateChange} ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${startPlaceholder} ${endPlaceholder} ${rangeSeparator} ${clearable} ${readonly} ${disabled}></${tag}>`
    }
  },
  'el-time-select': el => {
    const {
      tag, disabled, vModel, clearable, placeholder, width, on
    } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${el.__vModel__}_${on[e]}" `
    }
    const options = el['picker-options'] ? `:picker-options="${el.__vModel__}_pickerOptions"` : ''
    const format = el.format ? `format="${el.format}"` : ''
    const valueFormat = el['value-format'] ? `value-format="${el['value-format']}"` : ''
    const readonly = el.readonly ? 'readonly' : ''
    return `<${tag} ${event} ${options}  ${vModel} ${format} ${valueFormat} ${width} ${placeholder} ${clearable} ${readonly} ${disabled}></${tag}>`
  },
  'el-rate': el => {
    const { tag, disabled, vModel, on } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const max = el.max ? `:max='${el.max}'` : ''
    const allowHalf = el['allow-half'] ? 'allow-half' : ''
    const showText = el['show-text'] ? 'show-text' : ''
    const showScore = el['show-score'] ? 'show-score' : ''

    return `<${tag} ${event} ${vModel} ${max} ${allowHalf} ${showText} ${showScore} ${disabled}></${tag}>`
  },
  'el-color-picker': el => {
    const { tag, disabled, vModel, on } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const size = `size="${el.size}"`
    const showAlpha = el['show-alpha'] ? 'show-alpha' : ''
    const colorFormat = el['color-format'] ? `color-format="${el['color-format']}"` : ''

    return `<${tag} ${event} ${vModel} ${size} ${showAlpha} ${colorFormat} ${disabled}></${tag}>`
  },
  'el-upload': el => {
    const { tag } = el.__config__
    const disabled = el.disabled ? ':disabled=\'true\'' : ''
    const multiple = el.multiple ? 'multiple' : ''
    const listType = el['list-type'] !== 'text' ? `list-type="${el['list-type']}"` : ''
    const accept = el.accept ? `accept="${el.accept}"` : ''
    const name = el.name !== 'file' ? `name="${el.name}"` : ''
    const autoUpload = el['auto-upload'] === false ? ':auto-upload="false"' : ''
    const showFileList = el['show-file-list'] === false ? ':show-file-list="false"' : ''
    const beforeUpload = `:before-upload="${el.__vModel__}BeforeUpload"`
    const fileList = `:file-list="${el.__vModel__}fileList"`
    const headers = `:headers="${el.__vModel__}headers"`
    const withCredentials = `:with-credentials="true"`
    // const limit = `:limit='4'`
    const onChange = `:on-success="${el.__vModel__}onChange"`
    const onRemove = `:on-remove="${el.__vModel__}onRemove"`
    const onFileChange = `:on-change="${el.__vModel__}FileChange"`
    const ref = `ref="${el.__vModel__}"`
    let child = buildElUploadChild(el)
    const action = el.action ? `:action="${el.__vModel__}Url"` : ''
    const delaction = el.delaction ? `:delaction="${el.__vModel__}delUrl"` : ''
    const className = el.__config__.uploadStyle === 'button' ? `class="upload-btn-wrap"` : `class="upload-wrap"`
    let data = ''
    // 表格中的导入按钮
    if (el.data) {
      const tableId = el.__vModel__.split('_btn2')[0]
      data = `:data="${tableId}_table_headerObj"`
    }
    if (child) child = `\n${child}\n` // 换行
    return `<${tag} ${className} ${ref} ${fileList} ${headers} ${withCredentials} ${onChange} ${onRemove} ${onFileChange} ${action} ${delaction} ${autoUpload} ${showFileList} ${multiple} ${beforeUpload} ${listType} ${accept} ${name} ${data} ${disabled}>${child}</${tag}>`
  },
  'el-table': el => {
    const {
      tag, on
    } = attrBuilder(el)
    let event = ''
    for (const e in on) {
      if (on[e]) event += `@${e}="${el.__vModel__}_${on[e]}" `
    }

    const border = el.border ? 'border' : ''
    const tableDataName = `${el.__vModel__}_tableData`
    const data = el.__config__.dataType === 'interface' ? `:data="${el.__config__.interfaceData}"` : `:data="${tableDataName}"`
    const height = el.__config__.fixHeader ? `height= "${el.height}px"` : ''
    // columns
    const child = getTableHeader(el, tableDataName)
    const pagination = paginate(el)
    return `<${tag} ${event} ${data} ${border} ${height}>${child}</${tag}>${pagination}`
  },
  'iframe': el => {
    const {
      tag, height, width, frameborder, attr
    } = attrBuilderIframe(el)

    return `<${tag} :src='${el.__vModel__}URL' ${attr} ${frameborder} ${height} ${width}></${tag}>`
  },
  tinymce: el => {
    const { tag, vModel, placeholder, on } = attrBuilder(el)
    let event = ''
    let e
    for (e in on) {
      if (on[e]) event += `@${e}="${on[e]}"`
    }
    const height = el.height ? `:height="${el.height}"` : ''
    const branding = el.branding ? `:branding="${el.branding}"` : ''
    return `<${tag} ${event} ${vModel} ${placeholder} ${height} ${branding}></${tag}>`
  }
}

function stringifyFunction(obj) {
  const newobj = JSON.parse(JSON.stringify(obj))
  for (const key in obj) {
    if (obj[key] instanceof Function) {
      newobj[key] = obj[key].toString().replace(/[\n\t]/g, '')
      continue
    }
    if (obj[key] instanceof Object) {
      newobj[key] = stringifyFunction(obj[key])
    }
  }
  return newobj
}
function objectToString(obj) { // 用于替代JSON.stringify函数
  const _object = stringifyFunction(obj) // 将对象中的函数转为字符串
  return JSON.stringify(_object) // 将对象转为字符串
}

// 构建iframe标签
function attrBuilderIframe(el) {
  return {
    tag: el.__config__.tag,
    height: el.height ? `height="${el.height}"` : '',
    width: 'width="100%"',
    frameborder: `frameborder=${el.frameborder}`,
    attr: `attr="${el.__vModel__}URL"`
    // src: el.src ? `:src="${el.__vModel__}url"` : ''
  }
}

function attrBuilder(el) {
  let vModel = ''
  if (el.__config__.isComponentChildren) {
    vModel = `v-model="item.${el.__vModel__}"`
  } else if (el.__config__.tableDataName) {
    // table-column中的组件
    vModel = `v-model="${el.__vModel__}"`
  } else {
    vModel = `v-model="${confGlobal.formModel}.${el.__vModel__}"`
  }
  const _disabled = el.__config__.disabledCondition
  const disabledPlatformCondition = el.__config__.disabledPlatformCondition
  let disabled = ''
  if (_disabled && disabledPlatformCondition) {
    disabled = `:disabled="${_disabled} || ${disabledPlatformCondition}"`
  } else {
    if (_disabled) {
      disabled = `:disabled="${_disabled}"`
    } else if (disabledPlatformCondition) {
      disabled = `:disabled="${disabledPlatformCondition}"`
    } else {
      disabled = ``
    }
  }
  return {
    tag: el.__config__.tag,
    vModel: vModel,
    clearable: el.clearable ? `:clearable='true'` : `:clearable='false'`,
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? `:style="{width: \'${el.style.width}\'}"` : '',
    disabled: disabled || (el[':disabled'] ? `:disabled="${el[':disabled']}"` : (el.disabled ? ':disabled=\'true\'' : '')),
    on: el.on
  }
}
function attrBuilder2(el) {
  let vModel1 = ''
  let vModel2 = ''
  vModel1 = `v-model="${confGlobal.formModel}.${el.__vModel__}[0]"`
  vModel2 = `v-model="${confGlobal.formModel}.${el.__vModel__}[1]"`
  const _disabled = el.__config__.disabledCondition
  const disabledPlatformCondition = el.__config__.disabledPlatformCondition
  let disabled = ''
  if (_disabled && disabledPlatformCondition) {
    disabled = `:disabled="${_disabled} || ${disabledPlatformCondition}"`
  } else {
    if (_disabled) {
      disabled = `:disabled="${_disabled}"`
    } else if (disabledPlatformCondition) {
      disabled = `:disabled="${disabledPlatformCondition}"`
    } else {
      disabled = ``
    }
  }
  return {
    tag: el.__config__.tag,
    vModel1: vModel1,
    vModel2: vModel2,
    clearable: el.clearable ? `:clearable='true'` : `:clearable='false'`,
    placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
    width: el.style && el.style.width ? `:style="{width: \'${el.style.width}\'}"` : '',
    disabled: disabled || (el[':disabled'] ? `:disabled="${el[':disabled']}"` : (el.disabled ? ':disabled=\'true\'' : '')),
    on: el.on
  }
}

/**
 *  得到表头和操作项
 * @param scheme
 * @param tableDataName
 * @returns {string}
 */
function getTableHeader(scheme, tableDataName) {
  const children = []
  const tablecolumns = scheme.__config__.children
  const columns = [...tablecolumns]
  const tableId = scheme.__config__.formId
  // const options = scheme.__config__.options || {}
  // if (showOptions) {
  //   columns = [...tablecolumns, options]
  // }
  if (columns && columns.length) {
    const selectionColumn = scheme.__config__.hasSelection ? "<el-table-column type='selection'></el-table-column>" : '' // 是否有多选项列
    const indexColumn = scheme.__config__.hasIndex ? "<el-table-column label='序号' type='index'></el-table-column>" : '' // 是否有index序号
    let columnHTML = ''
    columns.forEach((column) => {
      const _condition = column.__config__.condition
      const processCondition = column.__config__.processCondition
      // const _if = column.prop !== '_operation' ? `${column.propType}` : ''
      let condition = ''
      // if (processCondition && _condition) {
      //   condition = `v-if="${_condition} || ${processCondition} && ${_if}"`
      // } else {
      //   if (column.__config__.condition) {
      //     condition = `v-if="${_condition} && ${_if}"`
      //   } else if (column.__config__.processCondition) {
      //     condition = `v-if="${processCondition} && ${_if}"`
      //   } else {
      //     condition = column.prop !== '_operation' ? `v-if=${column.propType}` : ''
      //   }
      // }
      if (column.prop !== '_operation') {
        if (processCondition && _condition) {
          condition = `v-if="${_condition} || ${processCondition} && ${column.propType}"`
        } else {
          if (column.__config__.condition) {
            condition = `v-if="${_condition} && ${column.propType}"`
          } else if (column.__config__.processCondition) {
            condition = `v-if="${processCondition} && ${column.propType}"`
          } else {
            condition = `v-if=${column.propType}`
          }
        }
      } else {
        if (processCondition && _condition) {
          condition = `v-if="${_condition} || ${processCondition}"`
        } else {
          if (column.__config__.condition) {
            condition = `v-if="${_condition}"`
          } else if (column.__config__.processCondition) {
            condition = `v-if="${processCondition}"`
          } else {
            condition = ``
          }
        }
      }
      console.log(condition)
      const child = getTableColumnChild(column, tableDataName, tableId)
      const width = column.width ? `width="${column.width}"` : ''
      // const _if = column.prop !== '_operation' ? `v-if=${column.propType}` : ''
      // 是否显示溢出提示
      const showOverflowTooltip = scheme.__config__.showOverflowTooltip ? `show-overflow-tooltip` : ''
      const fixed = column.fixed
        ? (column.prop === '_operation' ? `fixed="right"` : 'fixed')
        : ''
      columnHTML += `<el-table-column label="${column.label}" ${condition}  prop="${column.prop}" ${width} ${fixed} ${showOverflowTooltip}>
          ${child}
      </el-table-column>`
    })
    const emptyColumn = `<div slot="empty" style="display: flex;flex-direction: column;align-items: center;justify-content: center">
        <img style="width: 113px" src="/static/table_empty.png" />
        <span style="font-size: 12px; color:#76838f">暂无数据，请重新查询</span>
      </div>`
    const tableDom = `
      ${columnHTML}
      ${emptyColumn}
    `

    children.push(selectionColumn + indexColumn + tableDom)
  }
  return children.join('\n')
}

/**
   * 得到表格分页
 * @param scheme
 * @returns {string|string}
 */
function paginate(scheme) {
  // 开启分页且设置了数据配置的情况，才有分页
  const str = (scheme.__config__.hasPagination && scheme.__config__.apiUrlId) ? `
    <div class="pagination-wrap">
     <el-pagination
        v-show="${scheme.__vModel__}_tableData.length > 0"
        @size-change="${scheme.__vModel__}_sizeChange"
        @current-change="${scheme.__vModel__}_currentChange"
        :current-page="${scheme.__vModel__}_pagination.current"
        :page-sizes="[1, 3, 5, 10, 20]"
        :page-size="${scheme.__vModel__}_pagination.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="${scheme.__vModel__}_pagination.totalCount">
      </el-pagination>
    </div>

` : ''
  return str
}

// el-buttin 子级
function buildElButtonChild(scheme) {
  const children = []
  const slot = scheme.__slot__ || {}
  if (slot.default) {
    children.push(slot.default)
  }
  return children.join('\n')
}

// el-input 子级
function buildElInputChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.prepend) {
    children.push(`<template slot="prepend">${slot.prepend}</template>`)
  }
  if (slot && slot.append) {
    children.push(`<template slot="append">${slot.append}</template>`)
  }
  return children.join('\n')
}

// Dialog下自定义组件
function getDialogChildren(scheme) {
  let Str = ''
  scheme.children.forEach(el => {
    if (el.value.template === 'NULL') {
      // 自定义组件
      Str += ''
    } else {
      Str += el.value.template
    }
  })
  return Str
}

// el-select 子级
function buildElSelectChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length >= 0) {
    if (scheme.__config__.isComponentChildren) {
      children.push(`<template v-for="(item, index) in item.${scheme.__vModel__}Options" ><el-option v-if="!item.hidden" :label="item.${scheme.props.props.label ? scheme.props.props.label : 'name'}"  :key="index"  :value="item.${scheme.props.props.value ? scheme.props.props.value : 'id'}" :disabled="item.disabled"></el-option></template>`)
    } else if (scheme.__config__.tableDataName) {
      // children.push(`<template v-for="(item, index) in item.${scheme.__vModel__}Options" ><el-option v-if="!item.hidden" :label="item.${scheme.props.props.label}"  :key="index"  :value="item.${scheme.props.props.value}" :disabled="item.disabled"></el-option></template>`)
    } else {
      children.push(`<template v-for="(item, index) in ${scheme.__vModel__}Options" ><el-option v-if="!item.hidden" :label="item.${scheme.props.props.label ? scheme.props.props.label : 'name'}" :value="item.${scheme.props.props.value ? scheme.props.props.value : 'id'}" :disabled="item.disabled"></el-option></template>`)
    }
  }
  return children.join('\n')
}

// el-tabs子级
function buildElTabsChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length >= 0) {
    let str = ''
    scheme.__slot__.options.forEach((item, index) => {
      if (item.type === 'iframe') {
        str += `
          <el-tab-pane :label="${scheme.__vModel__}Options[${index}].label" :value="${scheme.__vModel__}Options[${index}].customEvent" :disabled="${scheme.__vModel__}Options[${index}].disabled">
              <iframe :key="new Date().getTime()" v-if="curTab == '${index}'" :src="${scheme.__vModel__}Options[${index}].contentUrl"  style="display: block;frameborder:0;scrolling=auto;border: none;height: 100%;width: 100%;"></iframe>
          </el-tab-pane>
       `
      }

      if (item.type === 'custom_components') {
        const start = `<el-tab-pane :label="${scheme.__vModel__}Options[${index}].label" :value="${scheme.__vModel__}Options[${index}].value" :disabled="${scheme.__vModel__}Options[${index}].disabled">`
        let center = ''
        item.customConfigs.forEach(_conf => {
          center += _conf.template
        })
        const end = ` </el-tab-pane>`
        str += start + center + end
      }
    })
    children.push(str)
  }

  return children.join('\n')
}

// el-radio-group 子级
function buildElRadioGroupChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  const config = scheme.__config__
  if (slot && slot.options) {
    const tag = config.optionType === 'button' ? 'el-radio-button' : 'el-radio'
    const border = config.border ? 'border' : ''
    const showTip = config.showTip ? '<span style="color:#f56c6c">{{item.tip}}</span>' : ''
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options"  :label="item.${scheme.props && scheme.props.props.value ? scheme.props.props.value : 'id'}" :disabled="item.disabled" ${border}>{{item.name}} ${showTip}</${tag}>`)
  }

  return children.join('\n')
}

// el-checkbox-group 子级
function buildElCheckboxGroupChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  const config = scheme.__config__
  if (slot && slot.options && slot.options.length) {
    const showTip = config.showTip ? '<span style="color:#f56c6c">{{item.tip}}</span>' : ''
    const tag = config.optionType === 'button' ? 'el-checkbox-button' : 'el-checkbox'
    const border = config.border ? 'border' : ''
    children.push(`<${tag} v-for="(item, index) in ${scheme.__vModel__}Options"  :label="item.id" :disabled="item.disabled" ${border}>{{item.name}} ${showTip}</${tag}>`)
  }
  return children.join('\n')
}
// el-divider 子级
function buildDividerChild(scheme) {
  const children = []
  const slot = scheme.__slot__
  if (slot && slot.options && slot.options.length >= 0) {
    children.push(`
<span v-for="item in ${scheme.__vModel__}Options"  style="margin-right: 10px">{{item.value}}</span>
`)
  }
  return children.join('\n')
}
// el-upload 子级

function buildElUploadChild(scheme) {
  const list = []
  const config = scheme.__config__
  if (scheme['list-type'] === 'picture-card') list.push('<i class="el-icon-plus"></i>')
  // if (scheme['auto-upload'] === false) {
  //   list.push(`                <div class="file-btn-wrap">
  //                 <el-button slot="trigger" plain type="primary" size="mini" icon="el-icon-view">浏览</el-button>
  //                 <el-button plain type="primary" size="mini" icon="el-icon-top" style="margin-left: 15px" @click.stop="${scheme.__vModel__}submitUpload">上传</el-button>
  //                 <el-button plain type="danger" size="mini" icon="el-icon-delete" @click.stop="${scheme.__vModel__}handleRemove">删除</el-button>
  //               </div>`)
  // } else
  if (config.uploadStyle === 'button') {
    list.push(`<el-button size="small" type="primary" icon="el-icon-upload">导入</el-button>`)
    return list.join('\n')
  }

  if (config.icon === 'icon-ocr') {
    list.push(`<el-col :span="${config.span}"><el-button  size="small" type="primary" icon="el-icon-upload" style="margin-left: 2px">${config.buttonText}</el-button></el-col>`)
  } else {
    list.push(`<el-col :span="${config.span}"><el-button class="uploadButton" size="small" type="primary" icon="el-icon-upload">${config.buttonText}</el-button></el-col>`)
  }
  if (config.showTip) list.push(`<div slot="tip" class="el-upload__tip">只能上传不超过 ${config.fileSize}${config.sizeUnit} 的${scheme.accept}文件</div>`)
  return list.join('\n')
}

/**
 * 构建el-table-column 子级
 * @param scheme
 * @param tableDataName
 * @param tableId
 * @returns {string}
 */
function getTableColumnChild(scheme, tableDataName, tableId) {
  // 人员信息
  const showUserInfo = scheme.showUserInfo // 是否鼠标移上去显示人员信息
  // const userAccountProp = scheme.userAccountProp ? `row.${scheme.userAccountProp}` : 'row.participant' // 人员account的字段名称
  const userInfoColumnTemplate = showUserInfo ? `
      <el-popover placement="top" width="460" trigger="hover">
        <el-table :data="tableParticipantInfo" max-height="500">
          <!--空数据状态-->
          <div slot="empty">
            <img src="/static/table_empty.png" alt="">
            <div>暂无数据，请重新查询</div>
          </div>
          <el-table-column
            prop="realName"
            label="姓名"
            align="center"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="orgName"
            label="机构"
            align="center"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机"
            align="center"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            align="center"
            width="150"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
        <span slot="reference"style="color: #007aff; cursor: pointer;" class="pointer" @mouseover="getUserInfoHover(row.participantInfo)">
          {{ row.workOrderStatus ? (row.workOrderStatus==='DONE' ? row.lastFinishUserName: row.participantName) : row.${scheme.prop} }}
        </span>
      </el-popover>
  ` : ''
  const children = scheme.__config__.children || []
  let columnHtml = `<template v-slot="{row, column, $index}">`
  // 附件
  let fileListNameHtml = ``
  if (scheme.prop === 'fileList') {
    fileListNameHtml = `
      <div>
        <span class="file-name" v-for="file in row.fileList" @click="downloadFile(file)">{{ file.fileName }}</span>
      </div>
    `
  } else {
    children.forEach((column, index) => {
      column.__config__.tableDataName = tableDataName
      column.__config__.tableId = tableId
      column.__config__.prop = scheme.prop
      if (scheme.prop !== '_operation') {
        column.__vModel__ = `${tableDataName}[$index].${scheme.prop}`
      }
      columnHtml += buildTagDom(column.__config__.tag, column)
    })
  }
  columnHtml += `${userInfoColumnTemplate}${fileListNameHtml}</template>`
  return (children.length > 0 || scheme.prop === 'fileList' || scheme.showUserInfo) ? columnHtml : `
    <template v-slot="{row, column, $index}">
      {{ resolveTableDict('${scheme.prop}', row) }}
    </template>
  `
}
/**
 * @description: 在编辑或者切换的时候以及新插入dom的时候进行分别判断构建dom
 * @param {*} tagName 标签名
 * @param {*} el 元素的vNode数据json
 * @param {*} parentModel 对应表单ref
 * @return {*} tagStr 返回的标签dom字符串
 */
function buildTagDom(tagName, el, parentModel) {
  return tags[tagName] ? tags[tagName](el, parentModel) : null
}

/**
 * 组装html代码。【入口函数】
 * @param {Object} formConf 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpHtml(formConf, type) {
  formConfig = formConf
  // console.log(formConfig)
  // 如果不用转换成表格
  if (formConfig.formStyle !== '3') {
    // if (false) {
    const htmlList = []
    const bottomHtmlList = []
    confGlobal = formConfig
    // 遍历渲染每个组件成html
    formConfig.fields.filter(e => e.__config__.tag !== 'dialog').forEach(el => {
      htmlList.push(layouts[el.__config__.layout](el, formConfig.formRef))
    })
    let htmlStr = htmlList.join('\n')

    // 底部按钮
    if (formConfig.drawingBottomList.length > 0) {
      formConfig.drawingBottomList.forEach(el => {
        bottomHtmlList.push(layouts[el.__config__.layout](el, formConfig.formRef))
      })
    }
    const bottomHtmlStr =
    `
    <div class="bottom-btns-wrap">
      ${bottomHtmlList.join('\n').replace(/\:xs="24"/g, '')}
    </div>`
    // 如果使用了卡片样式结尾添加'</el-col></el-col>',前提是最后一个组件不是折叠面板
    if (isCardTop === false && formConfig.fields[formConfig.fields.length - 1].__config__.tag !== 'el-collapse-item') {
      htmlStr += '</el-col></el-col>'
      isCardTop = true
    }
    htmlStr += bottomHtmlStr

    // 弹窗
    const dialogHtmlList = []
    // formConfig.fields.filter(e => e.__config__.tag === 'dialog').forEach(el => {
    formConfig.drawingDialogList.forEach(el => {
      dialogHtmlList.push(layouts[el.__config__.layout](el, formConfig.formRef))
    })
    const dialogHtmlStr =
      `
    <div class="dialog-wrap">
      ${dialogHtmlList.join('\n').replace(/\:xs="24"/g, '')}
    </div>`
    htmlStr += dialogHtmlStr

    // 将组件代码放进form标签
    let temp = buildFormTemplate(formConfig, htmlStr, type)
    temp = temp + `
 <!-- 网页锚点 --><div id='anchorPoint'>
      <div class="fix-nav-item" v-for="item in anchorPointList">
      <a href=""  v-if="getBoolean(item.condition)" @click.prevent="skipModel(item.id)">{{item.value}}</a>
      </div>
      </div>`
    // dialog标签包裹代码
    if (type === 'dialog') {
      temp = dialogWrapper(temp)
    }
    confGlobal = null
    return temp
  } else {
    const tableHtmlList = []
    const bottomHtmlList = []
    confGlobal = formConfig
    // 遍历渲染每个组件成html
    formConfig.fields.filter(e => e.__config__.tag !== 'dialog').forEach(el => {
      if (el.__config__.tag !== 'dialog') {
        tableHtmlList.push(tableLayouts[el.__config__.layout](el, formConfig.formRef))
      } else {
        tableHtmlList.push(layouts[el.__config__.layout](el, formConfig.formRef))
      }
    })
    let htmlStr = tableHtmlList.join('\n')
    // 底部按钮
    if (formConfig.drawingBottomList.length) {
      formConfig.drawingBottomList.forEach(el => {
        bottomHtmlList.push(layouts[el.__config__.layout](el, formConfig.formRef))
      })
    }
    // 如果使用了标题组件结尾添加'</el-row></el-col></el-col>',前提是最后一个组件不是折叠面板
    if (isCardTop === false && formConfig.fields[formConfig.fields.length - 1].__config__.tag !== 'el-collapse-item') {
      htmlStr += '</el-row></el-col></el-col>'
      isCardTop = true
    }
    const bottomHtmlStr =
    `
    <div class="bottom-btns-wrap">
      ${bottomHtmlList.join('\n').replaceAll(/\:xs="24"/g, '')}
    </div>

    `
    // 弹窗
    const dialogHtmlList = []
    // formConfig.fields.filter(e => e.__config__.tag === 'dialog').forEach(el => {
    formConfig.drawingDialogList.forEach(el => {
      dialogHtmlList.push(layouts[el.__config__.layout](el, formConfig.formRef))
    })
    const dialogHtmlStr =
      `
    <div class="dialog-wrap">
      ${dialogHtmlList.join('\n').replace(/\:xs="24"/g, '')}
    </div>`

    // 将组件代码放进form标签
    let temp = buildTableTemplate(formConfig, htmlStr + bottomHtmlStr + dialogHtmlStr, type)
    temp = temp + `
 <!-- 网页锚点 --><div id='anchorPoint'>
      <div class="fix-nav-item" v-for="item in anchorPointList">
      <a href=""  v-if="getBoolean(item.condition)" @click.prevent="skipModel(item.id)">{{item.value}}</a>
      </div>
      </div>`
    confGlobal = null
    return temp
  }
}
