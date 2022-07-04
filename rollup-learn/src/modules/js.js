
const units = {
  KB: '1024',
  MB: '1024 / 1024',
  GB: '1024 / 1024 / 1024'
}
let confGlobal
let anchorPointList = [] // 页面锚点
// let allFields = []
/**
 * 组装js 【入口函数】
 * @param {Object} formConfig 整个表单配置
 * @param {String} type 生成类型，文件或弹窗等
 */
export function makeUpJs(formConfig, type) {
  // console.log(formConfig)
  // if (formConfig.isCustom && formConfig.script) {
  //   return formConfig.script
  // }
  const dialogRules = {} // 弹窗规则
  confGlobal = formConfig = deepClone(formConfig)
  if (formConfig.__created__ === formConfig.__mounted__) {
    formConfig.__created__ = []
  }
  let dataList = []
  let dataList2 = mixinData(formConfig)
  let ruleList = []
  const optionsList = []
  const propsList = []
  let methodList = mixinMethod(type, formConfig)
  const uploadVarList = []
  let created = mixinCreated(formConfig)
  let mounted = mixinMounted(formConfig)
  let updated = mixinUpdated(formConfig)
  const computed = mixinComputed(formConfig)
  let watch = mixinWatch(formConfig)
  const components = []
  const prop = []
  // if (formConfig) {
  //   const datas = formConfig.__data__
  //   const formData = formConfig.__formData__
  //   const rules = formConfig.__rules__
  //   for (const key in datas) {
  //     const value = JSON.stringify(datas[key])
  //     dataList2.push(`${key}: ${value},`)
  //   }
  //   for (const key in formData) {
  //     if (!/_pickerOptions/.test(key)) {
  //       const value = JSON.stringify(formData[key])
  //       dataList.push(`${key}: ${value},`)
  //     }
  //   }
  //   for (const key in rules) {
  //     const value = JSON.stringify(rules[key])
  //     ruleList.push(`${key}: ${value},`)
  //   }
  // }

  const getGlobalValue = `getGlobalValue(){
    // 获得全局变量
    if(this.globalKeys) {
        const that = this
        const orderId = sessionStorage.getItem('orderId')
        let tokenValue = this.getToken()
        if(orderId){
          Object.keys(this.globalKeys).forEach(key => {
             $.ajax({
              type: 'get',
              url: window.SITE_CONFIG['dcloud'] + '/variable/getByName?name='+key+'&orderId='+orderId,
              headers: {
                token: tokenValue
              },
              dataType: "json",
              success: function (data) {
                console.log(data,'data')
                if(data) {
                  that.globalKeys.gradeId = data.data.val
                }
              },
              error: function (jqXHR) {
                console.log("发生错误：" + jqXHR.status);
              }
            })
          })
        }
    }
  },`
  methodList.push(getGlobalValue)
  const getFields = `getFields(){
  // getFields获取表单json
      const that = this
      const time = new Date().getTime()
        let fields = {}
      $.ajax({
        type:'get',
        async:false,
        url:window.SITE_CONFIG['formDesignUrl']+ '/formVersion/getVersionData/'+sessionStorage.getItem('formCode') +'/'+sessionStorage.getItem('versionId') +'?t='+time,
              headers: {
        token: this.$gc.getToken()
      },
        dataType:"json",
        success:function(data){
        fields = JSON.parse(data.data.jsonData).fields
        },
        error:function(jqXHR){
           console.log("发生错误："+ jqXHR.status);
        }
      })
  return fields
  },`
  methodList.splice(0, 0, getFields)
  // 获取详情数据的接口
  const getDetailData = `getDetailData(){
     // 获取详情数据
      const that = this
        const fields = this.getFields()
        // 获取所有含有模型的组件
        const modelFilesList = this.getModelFilesList(fields)
        let obj = {}
        modelFilesList.forEach(item => {
          if (item.tag && item.tag!=='el-table') {
            obj = {
              orderId: sessionStorage.getItem('orderId') ,
              eeOrderEntity: item.modelCode + '@' + item.modelPrimaryKey,
              dataList: []
            }
          }else if(item.modelCode!='upload'){
           if(obj.dataList.includes(item.modelCode)!==-1){
           obj.dataList.push(item.modelCode)
           }
          }
        })
        if(!sessionStorage.getItem('orderId')){
        return }
        this.$post(window.SITE_CONFIG['orderHandleCenter'] + '/publicBusinessDeal/details', obj).then( data => {
        // 如果有变量detailData则把详情数据存入
        if(this.detailData){this.detailData= data}
        // 执行信息赋值,判断状态
        sessionStorage.setItem('shardingId', data.emOrderEntity.shardingId || '')
        data.EeWorkOrder.forEach(item=>{
        item.workOrderStatus = (item.workOrderStatus==="DONE")?'完成':'处理中'
        item.completeTime = (item.completeTime==="1970-01-01 00:00:00")?'--':item.completeTime
        item.createTime = (item.createTime==="1970-01-01 00:00:00")?'--':item.createTime
        })
        this.FORM_COMPONENT_FAUZ_field140_tableData=data.EeWorkOrder || []
          // 不含模型的字段
          fields.forEach(fieldsItem => {
            if (fieldsItem.__config__.modelCode === undefined || fieldsItem.__config__.modelCode === '') {
              // 如果是默认字段则赋值
              if (data.emOrderEntity[fieldsItem.__vModel__]!==undefined) {
                if (fieldsItem.__vModel__ === 'areaCode') {
                // 如果区域编码则调用获取城市的接口cityCodeOptions
                this.areaCode_change(data.emOrderEntity[fieldsItem.__vModel__])
                }
                if(fieldsItem.__config__.tag==='el-date-picker'){
                  that.formData[fieldsItem.__vModel__] = moment(data.emOrderEntity[fieldsItem.__vModel__])
                }else{
                  that.formData[fieldsItem.__vModel__] = data.emOrderEntity[fieldsItem.__vModel__]
                }
              }
            }
          })
          // 将所有模型拼接起来成为一个对象
          var modelList = {}
          modelFilesList.forEach(item => {
            if (modelList[item.modelCode] && modelList[item.modelCode].length) {
              modelList[item.modelCode].push(item)
            } else {
              modelList[item.modelCode] = []
              modelList[item.modelCode].push(item)
            }
          })
          for (var modelData in modelList) {
            // 业务扩展表
            if (data.eeOrderEntity && data.eeOrderEntity.tableCode.indexOf(modelData) !== -1) {
              modelList[modelData].forEach(item => {
                 if(item.tag ==='el-date-picker'){
                  that.formData[item.__vModel__] = moment(data.eeOrderEntity[item.__vModel__]).format('YYYY-MM-DD HH:mm:ss')
                } else {
                  that.formData[item.__vModel__] = data.eeOrderEntity[item.__vModel__]
                }
                if (['el-select', 'el-radio-group', 'el-checkbox-group'].includes(item.tag)) {
           // 如果组件json上有change事件，调用
                 if(item.on && item.on.change !== undefined){
                           this[item.__vModel__+'_change'](data.eeOrderEntity[item.__vModel__])
                           }
                }
              })
            } else if (modelData === 'upload') {
              // 如果是附件
              data.fileList.tableData.forEach(item=>{
              item.name = item.fileName
              })
              that[modelList['upload'][0].__vModel__ + 'fileList'] = data.fileList.tableData
            } else {
              // 子表
              data.dataList.forEach(item => {
                if (item.tableCode.indexOf(modelData) !== -1) {
                  item.tableData.forEach((tableDataItem, index) => {
                    tableDataItem = that.resolveDict(tableDataItem)
                  })
                  that[modelList[modelData][0].__vModel__+'_tableData' ] = item.tableData || []
                }
              })
            }
          }
        })
      },`
  const getModelFilesList = `getModelFilesList(list) {
    // 获取所有含有模型的实体，获取详情数据的时候会使用
    let  modelFilesList=[]
 list.forEach(item => {
      // 如果是行容器、折叠面板和表格
      if(["table","el-collapse-item"].includes(item.__config__.tag) || item.__config__.tagIcon === 'row'){
      if(item.__config__.modelCode && item.__config__.modelCode.length){
       modelFilesList.push({
            modelPrimaryKey: item.__config__.modelPrimaryKey,
            modelCode: item.__config__.modelCode,
            tag: item.__config__.tag,
            on:item.on || {},
            __vModel__: item.__vModel__+'_tableCellMouseLeave' ||componentName+'List'
          })}
       if (item.__config__.children && item.__config__.children.length && item.__config__.tag !== 'el-table') {
       item.__config__.children.forEach(child => {
       if (child.__config__.modelCode && child.__config__.modelCode.length) {
        // 如果是 输入框 下拉等
          modelFilesList.push({
            modelPrimaryKey: child.__config__.modelPrimaryKey,
            modelCode: child.__config__.modelCode,
            tag: child.__config__.tag,
            on:item.on || {},
            props: child.props || {props:{  label:"name",  value:"id"  }},
            __vModel__: child.__vModel__
          })
        }  else if (child.__config__.tag === 'el-upload') {
          modelFilesList.push({
            modelCode:'upload',
            on:item.on || {},
            __vModel__:child.__vModel__
          })
        }})
       }
      }else if (item.__config__.modelCode && item.__config__.modelCode.length) {
        // 如果是 输入框 下拉等
          modelFilesList.push({
            modelPrimaryKey: item.__config__.modelPrimaryKey,
            modelCode: item.__config__.modelCode,
            tag: item.__config__.tag,
            on:item.on || {},
            props: item.props || {props:{  label:"name",  value:"id"  }},
            __vModel__: item.__vModel__
          })
        }  else if (item.__config__.tag === 'el-upload') {
          modelFilesList.push({
            modelCode:'upload',
            on:item.on || {},
            __vModel__:item.__vModel__
          })
        }
      })
      return modelFilesList
    },`
  if (!methodList.some(item => { item.indexOf('getDetailData') !== -1 })) {
    methodList.push(getDetailData)
  }
  methodList.push(getModelFilesList)
  const collapseItems = [] // 判断折叠面板是否有默认展开
  const hasCollapse = [] // 判断组件中是否有折叠面板,有则需要添加collapseItemNames变量
  const fields = [...formConfig.fields, ...formConfig.drawingBottomList, ...formConfig.drawingDialogList]
  // allFields = fields
  // console.log(fields)
  fields.forEach(el => {
    // console.log(el)
    buildAttributes(el, dataList, dataList2, ruleList, optionsList, mounted, methodList, propsList, uploadVarList, formConfig, computed, watch, components, prop, created, updated, collapseItems, hasCollapse)

    // if (el.__config__.tag === 'dialog' && el.__config__.children.length > 0) {
    if (el.__config__.tag === 'dialog') {
      dialogRules[`${el.__vModel__}_rules`] = []
      el.__config__.children.forEach(element => {
        buildDialogAttributes(element, dialogRules[`${el.__vModel__}_rules`])
      })
    }
    // console.log(dialogRules)
  })

  // 当折叠面板默认展开时控制内部元素的展开
  if (hasCollapse.length) {
    let str = '['
    if (collapseItems.length) {
      collapseItems.forEach(item => {
        str += `'${item}'` + ','
      })
    }
    str += ']'
    dataList2.push(`collapseItemNames: ${str},`)
  }
  // end-统一去重操作
  dataList = [...new Set(dataList)]
  // begin-统一去重操作
  dataList = uniqueArrStr(dataList, 'formData')
  dataList2 = uniqueArrStr(dataList2, 'data')
  ruleList = uniqueArrStr(ruleList, 'rules')
  methodList = uniqueArrStr(methodList, 'method', /(\S*)\(/) // 去重methods
  watch = uniqueArrStr(watch, 'watch', /'\S*\s*'/) // 去重methods
  mounted = uniqueArrStr(mounted, 'method', /(\S*)\(/) // 去重 mounted
  created = uniqueArrStr(created, 'created', /(\S*)\(/) // 去重 created
  updated = uniqueArrStr(updated, 'updated', /(\S*)\(/) // 去重 updated

  for (const e in dialogRules) {
    dialogRules[e] = uniqueArrStr(dialogRules[e], 'rules')
  }

  // 去重之后统构建vue 的script
  const script = buildexport(
    formConfig,
    type,
    dataList.join('\n'),
    ruleList.join('\n'),
    optionsList.join('\n'),
    uploadVarList.join('\n'),
    propsList.join('\n'),
    methodList.join('\n'),
    mounted.join('\n'),
    computed,
    watch,
    dataList2.join('\n'),
    components,
    prop,
    created.join('\n'),
    updated.join('\n'),
    dialogRules
  )
  confGlobal = null
  return script
}

// 统一去重
function uniqueArrStr(list, type, reg) {
  // 去重数组/ mounted/ created/updated
  if (['watch'].includes(type)) {
    try {
      const resArr = []
      list.forEach((methodStr, index) => {
        if (resArr.indexOf(methodStr.split(':')[0]) !== -1) {
          list[index] = ''
        } else {
          resArr.push(methodStr.split(':')[0])
        }
        // // 数组中所有方法的名称
        // const names = list.length ? list.map(methodStr => { if (methodStr) return methodStr.match(reg)[1] }) : []
        // // 得到当前方法的方法名
        // const name = methodStr.match(reg)[1]
        // // 查看方法是否其他方法相同
        // if (names.filter((_name) => _name === name).length > 1) {
        //   list[index] = ''
        // }
      })
      list = list.filter(method => method)
      return list
    } catch (error) {
      return list
    }
  }
  // 去重数组/ mounted/ created/updated
  if (['created'].includes(type)) {
    try {
      const resArr = []
      list.forEach((methodStr, index) => {
        // 有custom_标识，说明是自定义的方法，应该保留json中生成的,将不继续执行下方的逻辑
        if (keepCustomMethods(list, methodStr, index, reg)) return
        if (resArr.indexOf(methodStr.match(reg)[1]) !== -1) {
          list[index] = ''
        } else {
          resArr.push(methodStr.match(reg)[1])
        }
        // // 数组中所有方法的名称
        // const names = list.length ? list.map(methodStr => { if (methodStr) return methodStr.match(reg)[1] }) : []
        // // 得到当前方法的方法名
        // const name = methodStr.match(reg)[1]
        // // 查看方法是否其他方法相同
        // if (names.filter((_name) => _name === name).length > 1) {
        //   list[index] = ''
        // }
      })
      list = list.filter(method => method)
      return list
    } catch (error) {
      return list
    }
  }
  // 去重数组/ mounted/ created/updated
  if (['method', 'mounted', 'updated'].includes(type)) {
    try {
      const resArr = []
      list.forEach((methodStr, index) => {
        // 有custom_标识，说明是自定义的方法，应该保留json中生成的,将不继续执行下方的逻辑
        if (keepCustomMethods(list, methodStr, index, reg)) return
        if (resArr.indexOf(methodStr.match(reg)[1]) !== -1) {
          list[index] = ''
        } else {
          resArr.push(methodStr.match(reg)[1])
        }
        // // 数组中所有方法的名称
        // const names = list.length ? list.map(methodStr => { if (methodStr) return methodStr.match(reg)[1] }) : []
        // // 得到当前方法的方法名
        // const name = methodStr.match(reg)[1]
        // // 查看方法是否其他方法相同
        // if (names.filter((_name) => _name === name).length > 1) {
        //   list[index] = ''
        // }
      })
      list = list.filter(method => method)
      return list
    } catch (error) {
      return list
    }
  }
  // 去重 data / formData
  if (['data', 'rules'].includes(type)) {
    list = list.filter(data => !(/undefined:\s*\S*/.test(data))) // 清除 undefined 数据
    // list = list.length ? list.map(data => data.replace(/\s*/g, '')) : []
    list = Array.from(new Set(list)) // 去重data
    return list
  }
  if (['formData'].includes(type)) {
    list = list.filter(data => !(/undefined:\s*\S*/.test(data))) // 清除 undefined 数据
    const resArr = []
    list.forEach((ele, index) => {
      const repeatIndex = resArr.indexOf(ele.split(':')[0])
      if (repeatIndex !== -1) {
        list.splice(repeatIndex, 1)
        resArr.push(ele.split(':')[0])
      } else {
        resArr.push(ele.split(':')[0])
      }
    })
    return list
  }
}

/**
 * @description 如果是自定义的方法（方法前缀是 custom_）
 * @param list
 * @param methodStr
 * @param index
 * @param reg
 * @returns {boolean}
 */
function keepCustomMethods(list, methodStr, index, reg) {
  const name = methodStr.match(reg)[1]
  if (name.indexOf('custom_') > -1 || name.indexOf('select_') > -1) {
    const names = list.length ? list.map(methodStr => { if (methodStr) return methodStr.match(reg)[1] }) : []
    // 查看方法是否其他方法相同
    if (names.filter((_name) => _name === name).length > 1) {
      list[index] = ''
    }
    return true
  }
  return false
}
// 构建组件属性===================
function buildAttributes(scheme, dataList, dataList2, ruleList, optionsList, mounted, methodList, propsList, uploadVarList, formConfig, computed, watch, components, prop, created, updated, collapseItems, hasCollapse) {
  const config = scheme.__config__
  const slot = scheme.__slot__
  const downloadAPI = scheme.__config__.downloadAPIconsole?.log(scheme)
  // console.log(scheme)
  // console.log(slot)
  // 特殊处理options属性
  if (scheme.options || (slot && slot.options)) {
    // console.log(2)
    if (scheme.__config__.tag === 'el-divider') {
      buildDividerOptions(scheme, optionsList, mounted, methodList)
    } else {
      buildOptions(scheme, optionsList, methodList, mounted)
      /* if (config.dataType === 'dynamic' && config.selectMethod === 'entity') {
        const model = `${scheme.__vModel__}OptionsByEntity`
        const options = titleCase(model)
        buildOptionEntity(`get${options}${config.entityField}`, model, mounted, methodList, scheme, model)
      }
      if (config.dataType === 'dynamic' && config.selectMethod === 'interface') {
        const model = `${scheme.__vModel__}OptionsByInterface`
        const options = titleCase(model)
        buildOptionInterface(`get${options}`, model, mounted, methodList, scheme, model)
      }*/
    }
  }
  buildData(scheme, dataList, dataList2, formConfig, ruleList)
  buildRules(scheme, ruleList)
  pushInit(methodList, created, formConfig, scheme, dataList2, updated, collapseItems, hasCollapse)
  // 自定义表单的mounted拼接
  if (config.tag === 'el-card' && config.js) {
    buildCardMounted(scheme, mounted, formConfig)
    buildCardWatch(scheme, watch, formConfig)
    buildCardComponents(scheme, components, formConfig)
    buildCardProps(scheme, prop, formConfig)
    buildCardCreated(scheme, created, formConfig)
    buildCardUpdated(scheme, updated, formConfig)
    buildCardComputed(scheme, computed, formConfig)
  }
  if (downloadAPI) {
    mounted.push(`this.buttonCss()\n`)
  }
  // 如果存在平台内部接口,则添加获取业务字典的函数
  let businessDictionaryFlag = false
  if (Array.isArray(config.optButtonArr) && config.optButtonArr.length > 0) {
    config.optButtonArr.forEach(item => {
      const buttonData = item.buttonJsonData ? JSON.parse(item.buttonJsonData) : []
      if (buttonData.businessDictionary !== '') {
        businessDictionaryFlag = true
      }
    })
  } else if (Array.isArray(config.buttonArr) && config.buttonArr.length > 0) {
    config.buttonArr.forEach(item => {
      const buttonArr = item.buttonJsonData ? JSON.parse(item.buttonJsonData) : []
      if (buttonArr.businessDictionary !== '') {
        businessDictionaryFlag = true
      }
    })
  } else if (config.domainSource === 'inside') {
    businessDictionaryFlag = true
  } else if (slot && slot.options && Array.isArray(slot.options) && slot.options.length >= 0) {
    if (scheme.__slot__.options) {
      scheme.__slot__.options.forEach(item => {
        if (item.domainSource === 'inside') {
          businessDictionaryFlag = true
        }
      })
    }
  } else if (scheme.__config__.aboutUrl && scheme.__config__.aboutUrl.domainSource === 'inside') {
    businessDictionaryFlag = true
  }
  if (businessDictionaryFlag) {
    buildInterfaceUrl(scheme, methodList, created, dataList2)
    businessDictionaryFlag = false
  }

  if (config.tag === 'el-card' && config.js) {
    if (config.js.methods && config.js.methods.changeEventCascade && config.js.methods.changeEventShow && config.js.methods.translateDate) {
      delete (config.js.methods).changeEventCascade
      delete (config.js.methods).changeEventShow
      delete (config.js.methods).translateDate
    }
    const userMethods = []
    for (const i in config.js.methods) {
      userMethods.push(config.js.methods[i])
    }
    const notNullDataStr = `${userMethods}`.replace(/\s*$/g, '')
    if (notNullDataStr.substr(notNullDataStr.length - 1, 1) !== ',' && notNullDataStr.length !== 0) {
      methodList.push(`${userMethods},`)
    } else {
      methodList.push(`${userMethods}`)
    }
  }
  // 构建on中的函数
  for (const on in scheme.on) {
    const element = scheme.on[on]
    if (scheme.__config__?.tag && scheme.__vModel__ !== 'areaCode') {
    // 如果有写函数则都添加
      if (element && element.trim().length) {
        buildNormalFunction(scheme, `${scheme.__vModel__}_${element}()`, methodList)
      }
    }
    // 区域编码不需要重新构建change事件，防止覆盖
    if (scheme.__vModel__ === 'areaCode') {
      if (on !== 'change') {
        buildNormalFunction(scheme, `${scheme.__vModel__}_${element}()`, methodList)
      }
    }
  }

  // 分页操作    pageSize
  // if (config.tag === 'el-table' && config.pagination) {
  //   const methodName = `handleSizeChange${scheme.__vModel__}`
  //   const model = ` ${config.pagination}`
  //   if (config.dataType === 'interface') {
  //     const tableData = config.interfaceData
  //     handleSizeChange(methodName, model, methodList, scheme, tableData)
  //   }
  //   if (config.dataType === 'entity') {
  //     const tableData = config.entityData
  //     handleSizeChange(methodName, model, methodList, scheme, tableData)
  //   }
  //   if (config.dataType === 'custom' || config.dataType === 'entityDialog') {
  //     const tableData = config.entityData
  //     handleSizeChange(methodName, model, methodList, scheme, tableData)
  //   }
  // }
  if (config && config.tag === 'el-select') {
    const jsonData = safelyParseJSON(scheme.__config__.jsonData)
    if (jsonData && jsonData.dataOrigin === '2') {
      const paramsList = jsonData.paramsList[0].children
      const params = {}
      paramsList.forEach(item => {
        params[item.name] = item.realValue
      })
      if (!jsonData.APIType) return
      const method = `${scheme.__vModel__}_select_focus(val) {
        this.${scheme.__vModel__}Options = []
        axios({
          method: 'get',
          url: \`\${window.SITE_CONFIG['dcloud']}/component/api/detailByCode/${jsonData.APIType}\`,
          headers: {
            'Content-Type': 'application/json',
            token: this.getToken()
          }
        }).then(res => {
          const requestConfig = res.data.data
          let paramsObj = ${JSON.stringify(params)}
          let params = {}
          for (let key in paramsObj) {
            params[key] = this.formData[paramsObj[key]]
          }
          const axiosConfig = {
            method: requestConfig.requestMethod,
            url: requestConfig[\`${window.SITE_CONFIG['apiEnv']}\`],
            headers: {
              'Content-Type': 'application/json',
              token: this.getToken()
            }
          }
          if(axiosConfig.method === 'GET'){
            axiosConfig.params = params
          } else {
            axiosConfig.data = params
          }
          axios(axiosConfig).then(res => {
            // 在此处理下拉框数据
            const list = res.data.${jsonData.dataKey}
            this.${scheme.__vModel__}Options = list
          })
        })
      },`
      methodList.push(method)
      created.push(`this.${scheme.__vModel__}_select_focus();\n`)
      // methodList.push(`${scheme.__vModel__}_dataSolve(res){
      //   // 在此处理下拉框数据
      //   const list = res.data.data.list
      //   list.forEach(e => {
      //     e.label = e.componentName
      //     e.value = e.apiType
      //   })
      //   this.${scheme.__vModel__}Options = list
      // },`)

      const selectCreated = `this.${scheme.__vModel__}_select_focus();`
      created.push(selectCreated)
    } else if (jsonData && jsonData.dataOrigin === '3') { // 字典项获取数据
      if (!jsonData.dict) return
      const method = `${scheme.__vModel__}_select_focus(val) {
        this.${scheme.__vModel__}Options = []
        axios({
          method: 'get',
          url: \`\${window.SITE_CONFIG['baseCenter']}/sys/dict-item/getByCode?dictCode=${jsonData.dict}\`,
          headers: {
            'Content-Type': 'application/json',
            token: this.getToken()
          }
        }).then(res => {
          // 在此处理下拉框数据
          const list = res.data.data
          this.${scheme.__vModel__}Options = list
        })
      },`
      methodList.push(method)
      created.push(`this.${scheme.__vModel__}_select_focus();\n`)
      const selectCreated = `this.${scheme.__vModel__}_select_focus();`
      created.push(selectCreated)
    } else {
      created.forEach((e, i) => {
        if (e === `this.${scheme.__vModel__}_select_focus();`) {
          created.splice(i, 1)
        }
      })
    }
    // 如果是区域编码
    if (scheme.__vModel__ === 'areaCode') {
      // 如果是详情页， 则使用同步调用数据 发单页则使用异步避免造成卡顿
      methodList.push(`${scheme.__vModel__}_change(val) {
          // el-select ${scheme.__vModel__}组件的change事件
          let that = this
          that.formData.cityCode = ''
          const id = this.areaCodeOptions.find(item => item.code === val).id
          $.ajax({
                type: 'post',
                url:  \`\${window.SITE_CONFIG['orderHandleCenter']}/ucArea/queryBy\`,
                headers: {
                  token: this.$gc.getToken(),
                  "Content-Type":" application/json"
                },
                data:JSON.stringify({parentId: id}),
                async: ${formConfig.formStyle != '3'},
                dataType: "json",
                success: function (data) {
                  that.cityCodeOptions = data.data
                },
                error: function (jqXHR) {
                that.cityCodeOptions = []
                  console.log("发生错误：" + jqXHR.status);
                }
              })
        },`)
    } else {
      methodList.push(`${scheme.__vModel__}_change(val) {
        // el-select ${scheme.__vModel__}组件的change事件
      },`)
    }
  }

  if (config && config.tag === 'el-radio-group') {
    const jsonData = safelyParseJSON(scheme.__config__.jsonData)
    if (jsonData && jsonData.dataOrigin !== '1') {
      const paramsList = jsonData.paramsList[0].children
      const params = {}
      paramsList.forEach(item => {
        params[item.name] = item.realValue
      })
      if (!jsonData.APIType) return
      const method = `async ${scheme.__vModel__}_radio_data(val) {
        // this.${scheme.__vModel__}Options = []
        const res = await axios({
          method: 'get',
          url: \`\${window.SITE_CONFIG['dcloud']}/component/api/detailByCode/${jsonData.APIType}\`,
          headers: {
            'Content-Type': 'application/json',
            token: this.getToken()
          }
        })
        const requestConfig = res.data.data
        let paramsObj = ${JSON.stringify(params)}
        let params = {}
        for (let key in paramsObj) {
          params[key] = this.formData[paramsObj[key]]
        }
        const axiosConfig = {
          method: requestConfig.requestMethod,
          url: requestConfig[\`${window.SITE_CONFIG['apiEnv']}\`],
          headers: {
            'Content-Type': 'application/json',
            token: this.getToken()
          }
        }
        if(axiosConfig.method === 'GET'){
          axiosConfig.params = params
        } else {
          axiosConfig.data = params
        }
        await axios(axiosConfig).then(res => {
          // 在此处理下拉框数据
          const list = res.data.${jsonData.dataKey}
          this.${scheme.__vModel__}Options = list
        })
      },`
      console.log(method)
      methodList.push(method)
      created.push(`this.${scheme.__vModel__}_radio_data();\n`)
      // methodList.push(`${scheme.__vModel__}_dataSolve(res){
      //   // 在此处理下拉框数据
      //   const list = res.data.data.list
      //   list.forEach(e => {
      //     e.label = e.componentName
      //     e.value = e.apiType
      //   })
      //   this.${scheme.__vModel__}Options = list
      // },`)

      // const selectCreated = `this.${scheme.__vModel__}_select_focus();`
      // mounted.push(selectCreated)
    } else {
      created.forEach((e, i) => {
        if (e === `this.${scheme.__vModel__}_radio_data();`) {
          created.splice(i, 1)
        }
      })
    }
    // 如果是区域编码
    if (scheme.__vModel__ === 'areaCode') {
      // 如果是详情页， 则使用同步调用数据 发单页则使用异步避免造成卡顿
      methodList.push(`${scheme.__vModel__}_change(val) {
          // el-select ${scheme.__vModel__}组件的change事件
          let that = this
          that.formData.cityCode = ''
          $.ajax({
                type: 'post',
                url:  \`\${window.SITE_CONFIG['orderHandleCenter']}/ucArea/queryBy\`,
                headers: {
                  token: this.$gc.getToken(),
                  "Content-Type":" application/json"
                },
                data:JSON.stringify({parentId: val}),
                async: ${formConfig.formStyle != '3'},
                dataType: "json",
                success: function (data) {
                  that.cityCodeOptions = data.data
                },
                error: function (jqXHR) {
                that.cityCodeOptions = []
                  console.log("发生错误：" + jqXHR.status);
                }
              })
        },`)
    } else {
      methodList.push(`${scheme.__vModel__}_change(val) {
        // el-select ${scheme.__vModel__}组件的change事件
      },`)
    }
  }

  if (config && config.tag === 'el-time-select') {
    const option = `${JSON.stringify(scheme['picker-options'])}`
    optionsList.push(`${scheme.__vModel__}_pickerOptions: ${option},`)
  }

  if (config && config.tag === 'el-table') {
    // const methodName = `inputChange`
    // inputChange(methodName, mounted, methodList, scheme)
    // 构建表格的行单击和双击事件
    buildTableRowClick(scheme, formConfig, methodList, dataList2)
    buildTableRowDblClick(scheme, formConfig, methodList, dataList2)
    // 表格的单元格点击事件
    buildTableCellClick(scheme, methodList)
    buildTableCellMouseEnter(scheme, methodList)
    buildTableCellMouseLeave(scheme, methodList)
    // 构建表格的初始化函数
    buildTableInitData(scheme, formConfig, methodList, dataList2, mounted)
    // 构建表格的文件下载函数
    buildTableUploadUrl(scheme, methodList)
    // 构建表格鼠标移动上去获得人员信息的函数
    buildgUserInfoHover(scheme, methodList)

    buildNormalFunction(scheme, `${scheme.__vModel__}_tableSelectAll(selection, row)`, methodList)
    buildNormalFunction(scheme, `${scheme.__vModel__}_tableSelect(selection)`, methodList)
    buildNormalFunction(scheme, `${scheme.__vModel__}_tableSelectionChange(selection)`, methodList)

    methodList.push(`${scheme.__vModel__}_edit_row(form) {
      // 此处编写修改弹窗后的事件、如编辑
    },`)
    // 处理表格中的字典项
    methodList.push(`resolveDict(form) {
      // 此处处理表格中的字典项
      for (const formKey in form) {
        // 如果是附件，则取到附件数据
        if(this[formKey+ 'fileList']) {
          form[formKey] = this[formKey+ 'fileList'].map(file => (file.response && file.response.data[0]) ? file.response.data[0].data : {})
        }
      }
      return form
    },`)

    methodList.push(`resolveTableDict(prop, row) {
      // 此处处理表格中的字典项
      if (this[prop + 'Options'] && row[prop]) {
        // 如果是数组，下拉多选
          const arrIds = row[prop].toString().split(',')
          const label = this[prop + 'Props'].label
          const value = this[prop + 'Props'].value
          const arr = []
          arrIds.forEach(id => {
            const name = this[prop + 'Options'].find(el => el[value] == id) ? this[prop + 'Options'].find(
              el => el[value] == id)[label] : id
            arr.push(name)
          })
          return arr.toString()

      }
      return row[prop]
    },`)
  }

  // 分页操作   currentPage
  if (config.tag === 'el-table' && config.hasPagination) {
    methodList.push(`${scheme.__vModel__}_sizeChange(size) {
      // el-table ${scheme.__vModel__}组件的分页页码改变操作
      this.${scheme.__vModel__}_pagination.size = size
      this.${scheme.__vModel__}_custom_tableInitData()
    },`)
    methodList.push(`${scheme.__vModel__}_currentChange(page) {
      // el-table ${scheme.__vModel__}组件的分页页数改变操作
      this.${scheme.__vModel__}_pagination.current = page
      this.${scheme.__vModel__}_custom_tableInitData()
    },`)
  }
  if (scheme.__config__.isAnchorPoint) {
    buildAnchorPointOptions(scheme, optionsList, mounted, methodList)
  }
  if (scheme.__slot__ && scheme.__slot__.dynamicOptions && scheme.__slot__.dynamicOptions.length > 0) {
    const methodName = `${scheme.__vModel__}_getIframeURL`
    getIframeURL(methodName, scheme, mounted, methodList)
  }
  // 按钮
  if (config.tag === 'el-button') {
    // 在data中生成相应的loading和disabled参数
    dataList2.push(`${scheme.__vModel__}_loading: false,`)
    dataList2.push(`${scheme.__vModel__}_disabled: false,`)
    const btnJsonData = scheme.__config__.btnJsonData
    const btnJson = safelyParseJSON(btnJsonData, {})
    const methodName = `${scheme.__vModel__}_custom_click`
    // 如果是内置的默认方法，则在此处理其方法 否则就构建公共的自定义方法
    if (scheme.__config__.defaultType) {
      buildDefaultFunction(scheme, methodName, methodList, dataList2, btnJson.JSCode)
      return
    }
    const paramsStr = scheme.__config__.defaultType ? 'row, index, tableDataName' : 'row, column, event'
    // 构建自定义的方法
    buildCustomFunction(scheme, btnJsonData, formConfig, methodName, methodList, dataList2, paramsStr)
  }
  // 处理props
  if (scheme.props && scheme.props.props) {
    buildProps(scheme, propsList)
  }
  // 日期选择
  if (scheme.__config__.tag === 'el-date-picker') {
    const method = `${scheme.__vModel__}_blur`
    const method1 = `${scheme.__vModel__}_change`
    const limitTodayBeforeMethod = `${scheme.__vModel__}_dateChange`
    const rangeAfter = scheme.rangeAfter
    const rangeBefore = scheme.rangeBefore
    if (scheme.__config__.limitTodayBefore) {
      limitTodayBefore(limitTodayBeforeMethod, methodList, mounted, scheme, formConfig)
    }
    rangeAB(method, method1, rangeAfter, rangeBefore, methodList, mounted, scheme, formConfig)
  }
  // 机构人员弹窗组件
  if (scheme.__config__.tag === 'selectDialog') {
    dataList2.push(`${scheme.__vModel__}_options: [],`)
    dataList2.push(`${scheme.__vModel__}_filterText: '',`)
    dataList2.push(`${scheme.__vModel__}_multiple: ${scheme.multiple},`)
    dataList2.push(`${scheme.__vModel__}_selectLimit: ${scheme.__config__.selectLimit},`)
    dataList2.push(`${scheme.__vModel__}_dialogVisible: false,`)
    dataList2.push(`${scheme.__vModel__}_data: [],`)
    dataList2.push(`${scheme.__vModel__}_realName: '',`)
    dataList2.push(`${scheme.__vModel__}_userName: '',`)
    dataList2.push(`${scheme.__vModel__}_tableData: [],`)
    dataList2.push(`${scheme.__vModel__}_tableHeight: ${scheme.__config__.dialogHeight} - 90,`)
    dataList2.push(`${scheme.__vModel__}_currentPage: 1,`)
    dataList2.push(`${scheme.__vModel__}_total: 0,`)
    dataList2.push(`${scheme.__vModel__}_pageSize: 10,`)
    dataList2.push(`${scheme.__vModel__}_orgId: '',`)
    // const mouthed = `this.${scheme.__vModel__}_getTreeData()`
    // mounted.push(mouthed)
    checkFocus(methodList, scheme)
    const loadMethod = `${scheme.__vModel__}_custom_loadNode`
    const getDataMethod = `${scheme.__vModel__}_custom_getSelectTreeData`
    const filterTextMethod = `${scheme.__vModel__}_filterText`
    const filterNodeMethod = `${scheme.__vModel__}_filterNode`
    if (scheme.loadLazy) { // 懒加载
      loadLazy(loadMethod, methodList, mounted, scheme)
    } else {
      dataList2.push(`${scheme.__vModel__}_data: [],`)
      getSelectTreeData(getDataMethod, methodList, scheme, created)
    }
    if (scheme.__config__.filterable) { // 可搜索
      searchTree(filterTextMethod, filterNodeMethod, methodList, watch, scheme)
      dataList2.push(`${scheme.__vModel__}_filterText: '',`)
    }
    // getTreeData(methodList, scheme)
    // filterText(watch, scheme)
    getTableData(methodList, scheme)
    handleUser(methodList, scheme)
    handlePagination(methodList, scheme)
  }
  // 组件容器组件
  if (scheme.__config__.isComponent) {
    const str = []
    let getFunction = ''
    for (const key in config.children) {
      str.push(`${config.children[key].__vModel__}: '',`)
      if (config.children[key].__config__.tag === 'el-select') {
        str.push(`${config.children[key].__vModel__}Options: ${JSON.stringify(config.children[key].__slot__.options)},`)
      } else {
        if (config.children[key].__config__.tag === 'el-select' && config.children[key].__config__.selectMethod === 'interface') {
          str.push(`${config.children[key].__vModel__}Options: '',`)
          const model = `${config.children[key].__vModel__}OptionsByInterface`
          const options = titleCase(model)
          getFunction += `this.get${options}()
        `
        }
      }
    }
    dataList2.push(`${config.componentName}Button:${JSON.stringify(config.buttonList)},`)
    buildComponentFunction(methodList, scheme, `{${str.join('\n')}}`, getFunction, formConfig)
  }
  // 处理el-upload的action
  if (scheme.action && config.tag === 'el-upload') {
    // 转换成表格的时候需要添加的函数
    buildTableUploadUrl(scheme, methodList)
    if (scheme.__config__.domainSource === 'inside') {
      dataList2.push(`${scheme.__vModel__}Url: '',`)
      const mouthed = `this.get${scheme.__vModel__}UploadUrl()`
      mounted.push(mouthed)
      buildUploadUrl(scheme, methodList)
    } else {
      dataList2.push(`${scheme.__vModel__}Url: '${scheme.__config__.action}',`)
      dataList2.push(`${scheme.__vModel__}delUrl: '${scheme.__config__.delaction}',`)
    }
    uploadVarList.push(
      `${scheme.__vModel__}Action: '${scheme.action}',
      ${scheme.__vModel__}delAction: '${scheme.delaction}',
      ${scheme.__vModel__}fileList: [],
      ${scheme.__vModel__}headers: {
              token: (document.cookie.indexOf("token=") == -1) ? sessionStorage.getItem('token') : document.cookie.replace('token=','')
            },`
    )
    methodList.push(buildBeforeUpload(scheme))
    methodList.push(buildOnSuccess(scheme, methodList))
    methodList.push(buildOnFileChange(scheme))
    methodList.push(buildUploadFile(scheme)) // 手动上传文件的方法
    methodList.push(buildOnRemove(scheme))
    // 非自动上传时，生成手动上传的函数
    if (!scheme['auto-upload']) {
      methodList.push(buildSubmitUpload(scheme))
    }
  }
  // 下拉树节点点击事件
  if (scheme.__config__.tag === 'select-tree') {
    dataList2.push(`${scheme.__vModel__}loading: false,`)
    const Field = `${scheme.__vModel__}`
    const method = `${Field}_nodeClick`
    const loadMethod = `${Field}_custom_loadNode`
    const getDataMethod = `${Field}_custom_getSelectTreeData`
    const checkChangeMethod = `${Field}_checkchange` // 多选
    const selectChangeMethod = `${Field}_selectchange` // 多选
    const filterTextMethod = `${Field}_filterText`
    const filterNodeMethod = `${Field}_filterNode`
    const inputMethod = `${Field}_input() {
      this.$refs['${scheme.__vModel__}'].resetField()
    },`
    methodList.push(inputMethod)
    treeNodeClick(method, methodList, mounted, scheme)
    if (scheme.loadLazy) { // 懒加载
      loadLazy(loadMethod, methodList, mounted, scheme)
    } else {
      dataList2.push(`${scheme.__vModel__}_data: [],`)
      getSelectTreeData(getDataMethod, methodList, scheme, created)
    }
    if (scheme['show-checkbox']) { // 多选
      multipleTree(checkChangeMethod, selectChangeMethod, filterTextMethod, filterNodeMethod, methodList, watch, scheme)
      dataList2.push(`${scheme.__vModel__}flag: true,`)
    }
    if (scheme.__config__.searchable) { // 可搜索
      searchTree(filterTextMethod, filterNodeMethod, methodList, watch, scheme)
      dataList2.push(`${scheme.__vModel__}_filterText: '',`)
    }
  }
  // 处理标签页的子组件
  if (config.tag === 'el-tabs') {
    const methodName = `changeTab`
    changeTabs(methodName, methodList, scheme)
    scheme.__slot__.options.forEach(_el => {
      _el.customConfigs.forEach(el => {
        // const js = deepClone(eval('(' + el.jsonData.script.split('export default ')[1] + ')'))
        const scriptJsArr = el.script.split('export default ')
        scriptJsArr.shift()
        let scriptJsString = ''
        scriptJsArr.forEach(item => {
          scriptJsString += item
        })
        // eslint-disable-next-line no-eval
        const js = deepClone(eval('(' + scriptJsString + ')'))
        if (typeof js === 'string') return
        // 自定义组件data合并
        const data = deepClone(js.data())
        for (const key in data) {
          dataList2.push(`${key}: ${JSON.stringify(data[key])},`)
        }
        // 自定义组件method拼接
        for (const key in js.methods) {
          methodList.push(`${js.methods[key]},`)
        }
        // 自定义组件mounted拼接
        const startIndex = `${js.mounted}`.indexOf('{') + 1
        const endIndex = `${js.mounted}`.lastIndexOf('}')
        const userMounted = `${js.mounted}`.substring(startIndex, endIndex)
        mounted.push(`${userMounted}`)
        // 自定义组件watch拼接
        if (typeof js.watch === 'object' && objectToString(js.watch) !== undefined) {
          const userWatch = objectToString(js.watch)
          watch.push(`${userWatch}`)
        }
        // 自定义组件子组件拼接
        if (typeof js.components === 'object' && objectToString(js.components) !== undefined) {
          let userComponents = objectToStr(js.components)
          const startIndex = `${userComponents}`.indexOf('{') + 1
          const endIndex = `${userComponents}`.lastIndexOf('}')
          userComponents = `${userComponents}`.substring(startIndex, endIndex)
          components.push(`${userComponents}`)
        }
        // 自定义组件created拼接
        const start = `${js.created}`.indexOf('{') + 1
        const end = `${js.created}`.lastIndexOf('}')
        const userCreated = `${js.created}`.substring(start, end)
        created.push(`${userCreated}`)

        // 自定义组件updated拼接
        const starti = `${js.updated}`.indexOf('{') + 1
        const endi = `${js.updated}`.lastIndexOf('}')
        const userUpdated = `${js.updated}`.substring(starti, endi)
        updated.push(`${userUpdated}`)
        // 自定义组件prop拼接
        if (typeof js.props === 'object' && js.props instanceof Array === false) {
          const userProps = Object.keys(js.props)
          prop.push(`${userProps}`)
        }
        if (Array.isArray(js.props) && js.props[0]) {
          prop.push(js.props)
        }
        // 自定义组件Computed拼接
        if (typeof js.components === 'object' && objectToString(js.computed) !== undefined) {
          const userComputed = objectTostr(js.computed)
          computed.push(`${userComputed}`)
        }
        function objectTostr(obj) { // 用于替代JSON.stringify函数
          const _object = stringifyFunction(obj) // 将对象中的函数转为字符串
          for (const key in _object) {
            var str = _object[key] + `\n`
          }
          return str
        }
      })
    })
  }
  // 构建子级组件属性
  if (config.children) {
    config.children.forEach(item => {
      buildAttributes(item, dataList, dataList2, ruleList, optionsList, mounted, methodList, propsList, uploadVarList, formConfig, computed, watch, components, prop, created, updated, collapseItems, hasCollapse)
    })
  }
  if (config.btnArea) {
    config.btnArea.forEach(item => {
      buildAttributes(item, dataList, dataList2, ruleList, optionsList, mounted, methodList, propsList, uploadVarList, formConfig, computed, watch, components, prop, created, updated, collapseItems, hasCollapse)
    })
  }
  // 表格搜索区域的组件
  if (config.searchArea) {
    config.searchArea.forEach(item => {
      buildAttributes(item, dataList, dataList2, ruleList, optionsList, mounted, methodList, propsList, uploadVarList, formConfig, computed, watch, components, prop, created, updated, collapseItems, hasCollapse)
    })
  }
}

function buildDialogAttributes(scheme, dialogRuleList) {
  buildDialogRules(scheme, dialogRuleList)
  // console.log(dialogRuleList)
}

// 混入处理data
function mixinData(formConfig) {
  const list = []

  const datas = formConfig.__data__
  Object.keys(datas).forEach(key => {
    list.push(key + ':' + JSON.stringify(datas[key]) + ',')
  })
  return list
}
// 混入处理函数
function mixinMethod(type, formConfig) {
  const list = []
  const minxins = {
    file: confGlobal.formBtns
      ? {}
      : null,
    dialog: {
      onOpen: 'onOpen() {},',
      onClose: `onClose() {
      this.$refs['${confGlobal.formRef}'].resetFields()
    },`,
      close: `close() {
      this.$emit('update:visible', false)
    },`,
      handelConfirm: `handelConfirm() {
      this.$refs['${confGlobal.formRef}'].validate(valid => {
        if(!valid) return
        this.close()
      })
    },`
    }
  }

  const globalMethods = formConfig.__methods__
  Object.keys(globalMethods).forEach(key => {
    // const fromMethods = globalMethods[key].toString().split('function ')[1]
    list.push(globalMethods[key] + ',')
  })

  const methods = minxins[type]
  if (methods) {
    Object.keys(methods).forEach(key => {
      list.push(methods[key])
    })
  }
  return list
}

// 混入处理computed
function mixinComputed(formConfig) {
  const list = []

  const com = formConfig.__computed__
  if (com) {
    Object.keys(com).forEach(key => {
      list.push(com[key])
    })
  }
  return list
}

function mixinWatch(formConfig) {
  const list = []

  const watch = formConfig.__watch__
  if (watch) {
    Object.keys(watch).forEach(key => {
      list.push(watch[key])
    })
  }
  return list
}

function mixinMounted(formConfig) {
  let list = []
  const mounted = formConfig.__mounted__
  list = getFuncArray(mounted)
  return list
}
function mixinUpdated(formConfig) {
  const list = []
  const updated = formConfig.__updated__
  if (updated) {
    list.push(updated)
  }
  return list
}
function mixinCreated(formConfig) {
  let list = []
  const created = formConfig.__created__
  list = getFuncArray(created)
  return list
}
/**
 * @description: 此方法是将 mounted或者 created中的方法通过换行符分割成数组，然后再进一步去重（去重操作在其他方法中）
 * @param {*} str mounted或者 created 的字符串
 * @return {*} list 返回的mounted或者 created 字符串数组
 */
function getFuncArray(str) {
  try {
    const list = []
    const strArr = str.split(/\n+/).map(item => item.replace(/\s*/, ''))
    strArr.forEach((item, index) => {
      if (!item) {
        strArr.splice(index, 1)// 删除空项
      }
    })
    strArr.forEach((mounted) => {
      if (mounted) {
        list.push(mounted)
      }
    })
    return list
  } catch (err) {
    return []
  }
}
// 构建data
function buildData(scheme, dataList, dataList2, formConfig, ruleList) {
  if (scheme.__config__.tableDataName) return
  const config = scheme.__config__
  // if (scheme.__vModel__ === undefined) return
  if (scheme.__config__.tagIcon === 'daterange') {
    const startValue = JSON.stringify(scheme.daterangeOptions[0].startValue)
    const endValue = JSON.stringify((scheme.daterangeOptions[1].endValue))
    const start = `{
      disabledDate: time => {
        if (this.formData.${scheme.__vModel__}[1]) {
          return (
            time.getTime() >= new Date(this.formData.${scheme.__vModel__}[1]).getTime()
          )
        }
      }
    }`
    const end = `{
      disabledDate: time => {
        if (this.formData.${scheme.__vModel__}[0]) {
          return (
            time.getTime() <= new Date(this.formData.${scheme.__vModel__}[0]).getTime()
          )
        }
      }
    }`
    dataList.push(`${scheme.__vModel__}: [${startValue},${endValue}],`)
    dataList.push(`${scheme.__vModel__}Start: ${start},`)
    dataList.push(`${scheme.__vModel__}End: ${end},`)
  } else if (scheme.__config__.tag === 'el-collapse-item' || scheme.__config__.tagIcon === 'row') {
    let defaultValue = ''
    if (scheme.__config__.isOpen) {
      defaultValue = scheme.name
      dataList.push(`${config.componentName}: '${defaultValue}',`)
    } else {
      defaultValue = JSON.stringify(config.defaultValue) ? JSON.stringify(config.defaultValue) : '""'
      dataList.push(`${config.componentName}: ${defaultValue},`)
    }
  } if (scheme.__config__.tagIcon === 'date-range' && config.defaultValue) {
    const startValue = JSON.stringify(config.defaultValue[0])
    const endValue = JSON.stringify((config.defaultValue[1]))
    dataList.push(`${scheme.__vModel__}: [${startValue},${endValue}],`)
  } else {
    const defaultValue = JSON.stringify(config.defaultValue) ? JSON.stringify(config.defaultValue) : '""'
    dataList.push(`${scheme.__vModel__}: ${defaultValue},`)
  }

  if (scheme.__config__.tag === 'el-button') {
    dataList2.push(`${scheme.__vModel__}_visible: false,`)
    dataList2.push(`${scheme.__vModel__}: '',`)
    dataList2.push(`${scheme.__vModel__}_hookUrl: '',`)
  }
  // 组件容器组件组件
  if (scheme.__config__.isComponent) {
    const str = []
    for (const key in config.children) {
      if (config.children[key].__vModel__ !== '' || config.children[key].__vModel__ !== undefined) {
        str.push(`'${config.children[key].__vModel__}': '',`)
        if (config.children[key].__config__.tag === 'el-select') {
          str.push(`'${config.children[key].__vModel__}Options': ${JSON.stringify(config.children[key].__slot__.options)},`)
        } else if (config.children[key].__config__.tag === 'el-select' && config.children[key].__config__.selectMethod === 'interface') {
          str.push(`'${config.children[key].__vModel__}Options': [],`)
        }
      }
    }
    // dataList2.push(`${config.componentName}List: [{${str.join('\n')}}],`)
    dataList.push(`${config.componentName}List: [{${str.join('\n')}}],`)
    dataList2.push(`${config.componentName}Show: true,`)
  }
  // iframe
  if (scheme.__config__.tag === 'iframe') {
    dataList2.push(`${scheme.__vModel__}URL: '${scheme.src}',`)
    dataList2.push(`${scheme.__vModel__}URL1: '${scheme.src}',`)
    if (scheme.__slot__ && scheme.__slot__.dynamicOptions && scheme.__slot__.dynamicOptions.length > 0) {
      dataList2.push(`${scheme.__vModel__}dynamicOptions: ${JSON.stringify(scheme.__slot__.dynamicOptions)},`)
    }
  }
  // 日期范围
  if (scheme.__config__.tagIcon === 'date-range') {
    const options = [
      {
        text: '最近一周',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      }, {
        text: '最近一个月',
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }
    ]
    const shortcuts = { shortcuts: options }
    dataList2.push(`pickerOptions: ${objectToStr(shortcuts)},`)
  }
  if (scheme.__config__.tag === 'el-date-picker' && scheme.__config__.notClone) {
    // const option = `{
    //   disabledDate: time => {
    //     return (
    //      time.getTime() < Date.now()
    //     )
    //   }
    // }`
    // dataList.push(`pickerOptions${scheme.__vModel__}: ${option},`)
  }
  if (scheme.__config__.tag === 'el-date-picker' && scheme.__config__.limitTodayBefore) {
    const option = `{
      disabledDate: time => {
        return (
         time.getTime() < Date.now()-24*60*60*1000
         // time.getTime() < Date.now()
        )
      }
    }`
    dataList.push(`${scheme.__vModel__}_pickerOptions: ${option},`)
  }
  // 穿梭框
  if (scheme.__config__.tag === 'el-transfer') {
    dataList2.push(`${scheme.__vModel__}titles: ['${scheme.titles[0]}','${scheme.titles[1]}'],`)
    dataList2.push(`${scheme.__vModel__}targetOrder: '${scheme['target-order']}',`)
  }
  // tab页
  if (scheme.__config__.tag === 'el-tabs') {
    dataList2.push(`method${scheme.__vModel__}:'${config.method}',`)
    dataList2.push(`selectMethod${scheme.__vModel__}:'${config.selectMethod}',`)
    dataList2.push(`selectUrl${scheme.__vModel__}:'${config.selectUrl}',`)
    dataList2.push(`curTab: '0',`)
  }
  // 弹窗表格iput输入值匹配
  if (scheme.__config__.tag === 'el-input' && scheme.__config__.tagIcon === 'dialog-table') {
    dataList2.push(`propfield${scheme.__config__.formId}:'${config.inputProp}',`)
  }
  // 表格
  if (scheme.__config__.tag === 'el-table') {
    dataList2.push(`${scheme.__vModel__}_tableData: [],`)
    dataList2.push(`${scheme.__vModel__}_tableData_raw: [],`) // 纯字典项的tableList
    dataList2.push(`${scheme.__vModel__}_pagination :{ current:1, size:10, totalCount: 0 },`)
    dataList2.push(`tableParticipantInfo: [],`)
    dataList2.push(`tableRowIndex: 0,`)
    const columns = scheme.__config__.children?.filter(child => child.prop !== '_operation')?.map(child => child.label)
    dataList2.push(`${scheme.__vModel__}_columns: ${JSON.stringify(columns)},`)
    const headers = scheme.__config__.children?.filter(child => child.prop !== '_operation')?.map(child => ({
      label: child.label,
      prop: child.prop
    }))

    const headerObj = {}
    headers.forEach(header => {
      headerObj[header.label] = header.prop
    })
    dataList2.push(`${scheme.__vModel__}_headerObj: ${JSON.stringify({
      valueMap: JSON.stringify(headerObj)
    })},`)
  }
  // 自定义组件data拼接
  if (scheme.__config__.tag === 'el-card' && scheme.__config__.js) {
    try {
      let data = ''
      if (typeof config.js === 'string') {
        // eslint-disable-next-line no-eval
        const js = eval('(' + config.js + ')')
        const dataFuncStr = js.data.replace('data() ', 'function()')
        const dataFunc = new Function('return ' + dataFuncStr)()
        data = dataFunc()
      } else {
        data = deepClone(config.js.data())
      }
      // 将自定义组件中的formData和其他组件的formdata进行合并
      for (const key in data) {
        if (key === 'formData') {
          for (const _key in data['formData']) {
            if (Object.hasOwnProperty.call(data['formData'], _key)) {
              const element = data['formData'][_key]
              dataList.push(`${_key}:${JSON.stringify(element)},`)
            }
          }
          // 将自定义组件中的rules和其他组件的rules进行合并
        } else if (key === 'rules') {
          for (const _key in data['rules']) {
            if (Object.hasOwnProperty.call(data['rules'], _key)) {
              const element = data['rules'][_key]
              ruleList.push(`${_key}:${JSON.stringify(element)},`)
            }
          }
        } else {
          dataList2.push(`${key}: ${JSON.stringify(data[key])},`)
        }
      }
    } catch (e) {
      // console.log(e)
    }
  }

  if (scheme.__config__.tag === 'dialog') {
    dataList2.push(`${scheme.__vModel__}Visible: false,`)
    dataList2.push(`${scheme.__vModel__}_title: '${scheme.__config__.title}',`)
  }
}
// 自定义组件mounted拼接
function buildCardMounted(scheme, mounted, formConfig) {
  const config = scheme.__config__
  if (typeof config.js === 'string') {
    return
  }
  const startIndex = `${config.js.mounted}`.indexOf('{') + 1
  const endIndex = `${config.js.mounted}`.lastIndexOf('}')
  const userMounted = `${config.js.mounted}`.substring(startIndex, endIndex)
  mounted.push(`${userMounted}\n`)
}
// 自定义组件watch拼接
function buildCardWatch(scheme, watch, formConfig) {
  const config = scheme.__config__
  if (typeof config.js === 'string') {
    return
  }
  if (typeof config.js.watch === 'object' && objectToString(config.js.watch) !== undefined) {
    const userWatch = objectToString(config.js.watch)
    watch.push(`${userWatch}`)
  }
}

/**
 * @description 构建自定义的方法
 * @param scheme 组件json
 * @param btnJsonData 组件上的事件json
 * @param formConfig 表单配置
 * @param methodName 方法名称
 * @param methodList 整个vue列表的方法数组
 * @param dataList2 data中的数据
 * @param paramsStr 方法的参数
 */
function buildCustomFunction(scheme, btnJsonData, formConfig, methodName, methodList, dataList2, paramsStr) {
  paramsStr = scheme.__config__.tag !== 'el-table' ? `parentModel, ${paramsStr}` : `${paramsStr}`
  const parentIdProgram = scheme.__config__.parentId ? `// start: 此处是获得按钮父级的id代码请勿修改
      const parentId = '${scheme.__config__.parentId}';
    // end: 此处是获得按钮父级的id代码，请勿修改
  ` : ``
  let method = `async ${methodName}(${paramsStr}) {
    ${parentIdProgram}
  },`
  const config = safelyParseJSON(btnJsonData, {})
  // 筛选出所有的自定义组件并且取出他的表单ref
  // const customComponents = allFields.filter(field => field.__config__.tag === 'el-card' && field.__config__.html)
  // const customComponentRefs = customComponents.length ? customComponents.map(com => com.__slot__.options) : []
  // 自定义组件的表单ref和最外层的表单ref进行合并，如果按钮开启了校验，则在下方进行统一处理
  // let refs = [formConfig.formRef]

  // 表单验证的代码片段
  const checkForm = config.checkFlag ? `
  // start: 此处是表单验证代码，请勿修改
        const checkForm = (formName) => {
          return new Promise((resolve, reject) => {
            this.$refs[formName].validate(valid => {
              if (valid) {
                resolve();
              } else {
                reject()
              }
            });
          });
        }
        let list = [];
        parentModel.forEach((item) => {
          list.push(
            checkForm(item)
          );
        })
        const ok = await Promise.all(list)
        if(!ok) {
          return false
        }
// end: 此处是表单验证代码，请勿修改
    ` : ''
  // 按钮加载状态代码片段
  const btnLoading = config.loadingFlag ? `// start: 此处是按钮开启加载状态loading代码，请勿修改
    this.${scheme.__vModel__}_loading = true;
// end: 此处是表单验证代码，请勿修改
  ` : ``

  // 默认按钮 取消 关闭弹窗
  if (scheme.isDefault && scheme.__slot__.default === '取消') {
    method = `async ${methodName}(parentModel) {
      this[parentModel + 'Visible'] = false
      this.$refs[parentModel].resetFields()
    },`
  }

  // 响应动作 打开弹窗
  if (config.responseAction === 1) {
    // 打开页面中的弹窗
    if (config.targetDialog) {
      method = `async ${methodName}(parentModel) {
          // 此处打开当前弹窗的Visible 构建dialog的时候，需要在data中生成该变量 fieldId + Visible
          ${checkForm}
          ${btnLoading}
          this["${config.targetDialog}Visible"] = true
          // tip: 注意。此处是打开弹窗页面，在此方法中写自定义js将无法生效，若要写自定义的方法，请在下面的方法中写。
          this.${scheme.__vModel__}_openDialogOtherEvent()
        },`
      methodList.push(`${scheme.__vModel__}_openDialogOtherEvent() {
          //  此处写打开弹窗页面事件的额外方法
      },`)
    }

    // 打开弹窗（弹窗中是iframe）
    if (config.formUrl) {
      let formUrl = ''
      // 是否需要携带地址的参数
      if (config.isCarryParameters) {
        formUrl = window.location.origin + '/#/run' + window.location.hash.substring(window.location.hash.indexOf('?'))
      } else {
        formUrl = window.location.origin + `/#/run?formCode=${formConfig.formCode}&versionId=${formConfig.version}`
      }
      // 如果是修改页则需要加上参数isEdit，则formStyle=4且activityRepoId=EditStatus，如果有则调用查询详情接口
      if (config.pageStatus === 'edit') {
        if (/formStyle=[0-9]/.test(formUrl)) {
          formUrl = formUrl.replace(/formStyle=[0-9]/, 'formStyle=4')
        } else {
          formUrl += '&formStyle=4'
        }
        if (/activityRepoId=\w+&/.test(formUrl)) {
          formUrl = formUrl.replace(/activityRepoId=\w+&/, 'activityRepoId=EditStatus&')
        } else {
          formUrl += '&activityRepoId=EditStatus'
        }
      }
      method = `async ${methodName}(parentModel) {
          ${checkForm}
         ${btnLoading}
          this["${scheme.__vModel__}_visible"] = true
          this["${scheme.__vModel__}_formUrl"] = "${formUrl.replace('version=', 'versionId=').replace('&closeBtn=true', '')}"
          // tip: 注意。此处是打开弹窗页面，在此方法中写自定义js将无法生效，若要写自定义的方法，请在下面的方法中写。
          this.${scheme.__vModel__}_openDialogIframeOtherEvent()
        },`
      methodList.push(`${scheme.__vModel__}_openDialogIframeOtherEvent() {
          //  此处写打开弹窗页面事件的额外方法
      },`)
    }
  }

  // 响应动作 打开标签页
  if (config.responseAction === 2) {
    let formUrl = ''
    // 是否需要携带地址的参数
    if (config.isCarryParameters) {
      formUrl = window.location.origin + '/#/run' + window.location.hash.substring(window.location.hash.indexOf('?'))
    } else {
      formUrl = window.location.origin + `/#/run?formCode=${formConfig.formCode}&versionId=${formConfig.version}`
    }
    // 如果是修改页则需要加上参数isEdit，则formStyle=4且activityRepoId=EditStatus，如果有则调用查询详情接口
    if (config.pageStatus === 'edit') {
      if (/formStyle=[0-9]/.test(formUrl)) {
        formUrl = formUrl.replace(/formStyle=[0-9]/, 'formStyle=4')
      } else {
        formUrl += '&formStyle=4'
      }
      if (/activityRepoId=\w+&/.test(formUrl)) {
        formUrl = formUrl.replace(/activityRepoId=\w+&/, 'activityRepoId=EditStatus&')
      } else {
        formUrl += '&activityRepoId=EditStatus'
      }
    }
    method = `async ${methodName}(parentModel) {
        ${checkForm}
         ${btnLoading}
        window.open("${formUrl.replace('version=', 'versionId=').replace('&closeBtn=true', '')}")
        // tip: 注意。此处是打开标签页的方法，在此方法中写自定义js将无法生效，若要写自定义的方法，请在下面的方法中写。
          this.${scheme.__vModel__}_openTabOtherEvent()
      },`
    methodList.push(`${scheme.__vModel__}_openDialog() {
      //  此处写打开标签页的额外方法
    },`)
  }

  // 响应动作 逻辑处理
  if (config.responseAction === 3) {
    // js
    if (config.handleType === 1) {
      const baseUrlStr = `let urls = {};
      this.baseUrlList.forEach(url => {
        urls[url.baseName] = url.url
      })`
      method = `async ${methodName}(${paramsStr}) {
          ${config.JSCode ? checkForm : ''}
          ${btnLoading}
          ${config.baseUrl ? baseUrlStr : ''}
          ${parentIdProgram}
          ${config.JSCode}
        },`
    }
    // api
    if (config.handleType === 2) {
      const paramsList = config.__config__.paramsList[0].children
      const params = {}
      paramsList.forEach(item => {
        params[item.name] = item.realValue
      })
      method = `async ${methodName}(parentModel) {
         ${checkForm}
         ${btnLoading}
          // todo
        axios({
          method: 'get',
          url: \`\${window.SITE_CONFIG['dcloud']}/component/api/detailByCode/${config.__config__.APIType}\`,
          headers: {
            'Content-Type': 'application/json',
            token: this.getToken()
          }
        }).then(res => {
          const requestConfig = res.data.data
          let paramsObj = ${JSON.stringify(params)}
          let params = {}
          for (let key in paramsObj) {
            params[key] = this.formData[paramsObj[key]]
          }
          const axiosConfig = {
            method: requestConfig.requestMethod,
            url: requestConfig[\`${window.SITE_CONFIG['apiEnv']}\`],
            headers: {
              'Content-Type': 'application/json',
              token: this.getToken()
            }
          }
          if(axiosConfig.method === 'GET'){
            axiosConfig.params = params
          } else {
            axiosConfig.data = params
          }
          axios(axiosConfig).then(res => {
            this.${scheme.__vModel__}_dataSolve(res)
          })
        })
        },`
      methodList.push(`${scheme.__vModel__}_dataSolve(res){
        // 在此处理数据
  },`)
    }
  }
  methodList.push(method)
  dataList2.push(`${scheme.__vModel__}_visible: false,`)
  dataList2.push(`${scheme.__vModel__}_formUrl: "",`)
}

/**
 * @param scheme 组件json
 * @param methodList 整个vue列表的方法数组
 * @param dataList2 data中的数据
 */
function buildDefaultFunction(scheme, methodName, methodList, dataList2, btnJsCode) {
  const defaultType = scheme.__config__.defaultType
  let method = `async ${methodName}() {},`
  if (defaultType === 'edit') {
    const jscode = btnJsCode || `
      const tableId = tableDataName.split("_tableData")[0]
      this[tableId + '_add_dialog_title'] = "修改"
      for (const rowKey in row) {
        this.formData[rowKey] = row[rowKey]
      }
      this.tableRowIndex = index
      this[ tableId + '_add_dialogVisible'] = true
    `
    method = `async ${methodName}(row, index, tableDataName = '${scheme.__config__.tableDataName}') {
      ${jscode}
    },`
  }
  if (defaultType === 'del') {
    const jscode = btnJsCode || `
       this.$confirm('此操作将删除该行表格数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this[tableDataName].splice(index, 1)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    `
    method = `async ${methodName}(row, index, tableDataName = '${scheme.__config__.tableDataName}') {
      ${jscode}
    },`
  }
  methodList.push(method)
}

/**
 * @description 构建组件普通通用的方法
 * @param scheme
 * @param methodList
 */
function buildNormalFunction(scheme, methodName, methodList) {
  // 当已有该函数则不做操作
  if (methodList.filter(item => item.indexOf(methodName) !== -1).length) {
    return
  }
  methodList.push(`${methodName} {
      // 此处写${scheme.__vModel__}的自定义${methodName}方法
    },`)
}
/**
 * @description 构建表格的行点击事件
 * @param scheme
 * @param formConfig
 * @param methodList
 * @param dataList2
 */
function buildTableRowClick(scheme, formConfig, methodList, dataList2) {
  const defaultJs = `
    // start 此处是处理表格事件的点击颜色变化
    this.activeRowColor(event, "${scheme.__config__.rowClickColor}")
    // end 此处是处理表格事件的点击颜色变化
    // 此处函数不能修改，修改后将不生效，若想在表格点击事件中添加方法，请在下方的函数中编写：
    this.${scheme.__vModel__}_tableRowClickModify(row, column, event)
  `
  // 如果是内置的执行信息，则需要联动表格
  if (scheme.__vModel__ === 'FORM_COMPONENT_FAUZ_field140') {
    methodList.push(`${scheme.__vModel__}_tableRowClickModify(row, column, event){
      this.workOrderId = row.workOrderId
      this.getTable()
    },`)
    methodList.push(` getTable() {
      let that = this
      let tokenValue = this.$gc.getToken()
      console.log(tokenValue)
      $.ajax({
        type: 'get',
        url: \`${window.SITE_CONFIG['orderHandleCenter']}/public/queryOperation?workOrderId=\${this.workOrderId}\`,
        headers: {
          token: tokenValue
        },
        dataType: "json",
        success: function (data) {
          that.FORM_COMPONENT_FAUZ_field145_tableData = data.data
        },
        error: function (jqXHR) {
          console.log("发生错误：" + jqXHR.status);
        }
      })
    },`)
  } else {
    methodList.push(`${scheme.__vModel__}_tableRowClickModify(row, column, event){},`)
  }
  const btnJsonObj = safelyParseJSON(scheme.__config__.rowClickJson, btnJson)
  btnJsonObj.JSCode = `
    ${defaultJs}
    ${btnJsonObj.JSCode}
  `
  const method = `activeRowColor(event, color) {
   Array.from(event.currentTarget.parentNode.children).forEach(el => {
      el.style.background = "#fff"
    })
    event.currentTarget.style.background = color || "rgb(249 246 246)"
  },
  `
  methodList.push(method)
  const btnJsonData = JSON.stringify(btnJsonObj)
  const methodName = `${scheme.__vModel__}_custom_tableRowClick`
  const paramsStr = `row, column, event`
  buildCustomFunction(scheme, btnJsonData, formConfig, methodName, methodList, dataList2, paramsStr)
}

/**
 * @description 构建表格的行双击事件
 * @param scheme
 * @param formConfig
 * @param methodList
 * @param dataList2
 */
function buildTableRowDblClick(scheme, formConfig, methodList, dataList2) {
  const btnJsonData = scheme.__config__.rowDblClickJson
  const methodName = `${scheme.__vModel__}_custom_tableRowDblClick`
  buildCustomFunction(scheme, btnJsonData, formConfig, methodName, methodList, dataList2, `row, column, event`)
}

/**
 * @description 构建表格的单元格点击事件
 * @param scheme
 * @param methodList
 */
function buildTableCellClick(scheme, methodList) {
  const method = `${scheme.__vModel__}_tableCellClick(row, column, cell, event) {},`
  methodList.push(method)
}

/**
 * @description 当单元格 hover 进入时会触发该事件
 * @param scheme
 * @param methodList
 */
function buildTableCellMouseEnter(scheme, methodList) {
  const method = `${scheme.__vModel__}_tableCellMouseEnter(row, column, cell, event) {},`
  methodList.push(method)
}

/**
 * @description 当单元格 hover 退出时会触发该事件
 * @param scheme
 * @param methodList
 */
function buildTableCellMouseLeave(scheme, methodList) {
  const method = `${scheme.__vModel__}_tableCellMouseLeave(row, column, cell, event) {},`
  methodList.push(method)
}
/**
 * 初始化
 * @param scheme
 * @param formConfig
 * @param methodList
 * @param dataList2
 * @param mounted
 */
function buildTableInitData(scheme, formConfig, methodList, dataList2, mounted) {
  const config = scheme.__config__
  if (config.apiUrlId) {
    const apiParams = config.apiParamas
    const paramsList = apiParams.paramsList[0].children
    const params = {}
    paramsList.forEach(item => {
      params[item.name] = item.realValue
    })
    const dataKey = apiParams.dataKey ? `res.data.${apiParams.dataKey}` : 'res.data'
    const dataTotal = apiParams.dataTotal ? `res.data.${apiParams.dataTotal}` : ''
    // 分页字段程序
    const panigationProgram = config.hasPagination ? `
        params['${apiParams.current}'] = this.${scheme.__vModel__}_pagination.current;
        params['${apiParams.size}'] = this.${scheme.__vModel__}_pagination.size;
    ` : ''

    const totalProgram = config.hasPagination && dataTotal ? `
        this.${scheme.__vModel__}_pagination.totalCount = ${dataTotal};
    ` : ''

    const method = `${scheme.__vModel__}_custom_tableInitData() {
    try {
        this.$get(\`\${window.SITE_CONFIG['dcloud']}/component/api/detailByCode/${config.apiUrlId}\`).then(res => {
          const requestConfig = res
          let paramsObj = ${JSON.stringify(params)}
          let params = {}
          for (let key in paramsObj) {
            const paginationKeys = ['${apiParams.current}', '${apiParams.size}']
            if(!paginationKeys.includes(key)) {
               params[key] = this.formData[paramsObj[key]]
            }
          }
          // 匹配size和current
         ${panigationProgram}

          const axiosConfig = {
            method: requestConfig.requestMethod,
            url: requestConfig[\`${window.SITE_CONFIG['apiEnv']}\`],
            headers: {
              'Content-Type': 'application/json',
              token: this.$gc.getToken()
            }
          }
          if(axiosConfig.method === 'GET'){
            axiosConfig.params = params
          } else {
            axiosConfig.data = params
          }
          axios(axiosConfig).then(res => {
              if(Array.isArray(${dataKey})) {
                  this["${scheme.__vModel__}_tableData"] = ${dataKey};
                  ${totalProgram}
                  this.${scheme.__vModel__}_dataSolve(res);
              } else {
                this.$message.error("表格配置错误, 请正确配置表格api参数")
              }
          })
        })
      } catch (e) {
        this.$message.error('接口配置异常')
      }
    },`
    mounted.push(`this.${scheme.__vModel__}_custom_tableInitData();\n`)
    methodList.push(method)
    methodList.push(`${scheme.__vModel__}_dataSolve(res){
        // 在此处理表格数据
  },`)
  }
}
// 对象转字符串
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
// 自定义组件component拼接
function buildCardComponents(scheme, components, formConfig) {
  let js = scheme.__config__.js
  if (typeof js === 'string') {
    // eslint-disable-next-line no-eval
    js = eval('(' + js + ')')
  }
  if (typeof js.components === 'object' && objectToString(js.components) !== undefined) {
    let userComponents = objectToStr(js.components)
    const startIndex = `${userComponents}`.indexOf('{') + 1
    const endIndex = `${userComponents}`.lastIndexOf('}')
    userComponents = `${userComponents}`.substring(startIndex, endIndex)
    components.push(`${userComponents}`)
  }
}
// 自定义组件created拼接
function buildCardCreated(scheme, created, formConfig) {
  let js = scheme.__config__.js
  if (typeof js === 'string') {
    // eslint-disable-next-line no-eval
    js = eval('(' + js + ')')
  }
  const startIndex = `${js.created}`.indexOf('{') + 1
  const endIndex = `${js.created}`.lastIndexOf('}')
  const userCreated = `${js.created}`.substring(startIndex, endIndex)
  created.push(`${userCreated}`)
}
// 自定义组件mounted拼接
function buildCardUpdated(scheme, updated, formConfig) {
  const config = scheme.__config__
  if (typeof config.js === 'string') {
    return
  }
  const startIndex = `${config.js.updated}`.indexOf('{') + 1
  const endIndex = `${config.js.updated}`.lastIndexOf('}')
  const userUpdated = `${config.js.updated}`.substring(startIndex, endIndex)
  updated.push(`${userUpdated}\n`)
}
// 自定义组件prop拼接
function buildCardProps(scheme, prop, formConfig) {
  let js = scheme.__config__.js
  if (typeof js === 'string') {
    // eslint-disable-next-line no-eval
    js = eval('(' + js + ')')
  }
  if (typeof js.props === 'object' && js.props instanceof Array === false) {
    const userProps = Object.keys(js.props)
    prop.push(`${userProps}`)
  }
  if (Array.isArray(js.props) && js.props[0]) {
    prop.push(js.props)
  }
}

function buildCardComputed(scheme, computed, formConfig) {
  const js = scheme.__config__.js
  if (typeof js === 'string') {
    return
  }
  if (typeof js.components === 'object' && objectToString(js.computed) !== undefined) {
    const userComputed = objectTostr(js.computed)
    computed.push(`${userComputed}`)
  }
  function objectTostr(obj) { // 用于替代JSON.stringify函数
    const _object = stringifyFunction(obj) // 将对象中的函数转为字符串
    for (const key in _object) {
      var str = _object[key] + `\n`
    }
    return str
  }
}
// 构建校验规则
function buildRules(scheme, ruleList) {
  if (scheme.__config__.tableDataName) return
  const config = scheme.__config__
  if (scheme.__vModel__ === undefined) return
  const rules = []
  if (ruleTrigger[config.tag]) {
    if (config.required) {
      const type = Array.isArray(config.defaultValue) ? 'type: \'array\',' : ''
      let message = Array.isArray(config.defaultValue) ? `请至少选择一个${config.label}` : scheme.placeholder
      if (message === undefined) message = `${config.label}不能为空`
      // if (message === undefined) message = ''
      rules.push(`{"required":true,${type}"message":"${message}","trigger":"${ruleTrigger[config.tag]}"}`)
    }
    if (config.regList && Array.isArray(config.regList)) {
      config.regList.forEach(item => {
        if (item.pattern) {
          rules.push(
            // eslint-disable-next-line no-eval
            `{ pattern: ${item.pattern}, message: "${item.message}", trigger: "${ruleTrigger[config.tag]}" }`
          )
        }
      })
    }
    ruleList.push(`${scheme.__vModel__}: [${rules.join(',')}],`)
  }
  // console.log(ruleList)
}
function buildDialogRules(scheme, dialogRuleList) {
  const config = scheme.__config__
  const rules = []
  if (ruleTrigger[config.tag]) {
    if (config.required) {
      const type = Array.isArray(config.defaultValue) ? 'type: \'array\',' : ''
      let message = Array.isArray(config.defaultValue) ? `请至少选择一个${config.label}` : scheme.placeholder
      if (message === undefined) message = `${config.label}不能为空`
      // if (message === undefined) message = ''
      rules.push(`{"required":true,${type}"message":"${message}","trigger":"${ruleTrigger[config.tag]}"}`)
    }
    if (config.regList && Array.isArray(config.regList)) {
      config.regList.forEach(item => {
        if (item.pattern) {
          rules.push(
            // eslint-disable-next-line no-eval
            `{ pattern: ${item.pattern}, message: "${item.message}", trigger: "${ruleTrigger[config.tag]}" }`
          )
        }
      })
    }
    // console.log(`${scheme.__vModel__}: [${rules.join(',')}]`)
    dialogRuleList.push(`${scheme.__vModel__}: [${rules.join(',')}]`)
  }
  // console.log(dialogRuleList)
}
function buildAnchorPointOptions(scheme, optionsList, mounted, methodList) {
  anchorPointList.forEach((item, index) => {
    if (item.id + '' === scheme.__config__.formId) {
      anchorPointList.splice(index)
    }
  })
  let condition = ''
  if (scheme.__config__.processCondition && scheme.__config__.condition) {
    condition = `${scheme.__config__.condition} || ${scheme.__config__.processCondition}`
  } else {
    if (scheme.__config__.condition) {
      condition = scheme.__config__.condition
    } else if (scheme.__config__.processCondition) {
      condition = scheme.__config__.processCondition
    } else {
      condition = 'true'
    }
  }
  anchorPointList.push({
    id: scheme.__config__.formId, // 锚点的id
    value: scheme.__config__.anchorPoint, // 锚点显示内容
    anchorPointBackgroundColor: scheme.__config__.anchorPointBackgroundColor, // 锚点背景颜色
    anchorPointColor: scheme.__config__.anchorPointColor, // 锚点文字颜色
    condition: condition.replace(/formData/g, 'this.formData') // 锚点文字颜色
  })
  const getBoolean = `
    getBoolean(strProgromer) {
    // 锚点使用的函数，请勿删除
      return eval(strProgromer)
    },`
  methodList.push(getBoolean)
  const dividerFunction = `
  skipModel(anchor) {
      // 找到锚点，请勿删除
      var target = document.getElementById(anchor);
       $(document).scrollTop(target.offsetTop-33);
    },
      setAnchorPointColor(anchor) {
      // 设置锚点的颜色和背景颜色，请勿删除
     var anchorPoint = document.getElementById('anchorPoint');
      if(!anchorPoint){
      // 如果是表格风格的时候获取不到anchorPoint
      return}
      this.anchorPointList.forEach((item,index)=>{
      anchorPoint.children[index].children[0].style.color=item.anchorPointColor
      anchorPoint.children[index].children[0].style.backgroundColor=item.anchorPointBackgroundColor
      })
    },`
  methodList.push(dividerFunction)
  const mouthed = `this.setAnchorPointColor();`
  mounted.push(mouthed)
}
// 构建分割线的options
function buildDividerOptions(scheme, optionsList, mounted, methodList) {
  const options = []
  scheme.__slot__.options.forEach((item, index) => {
    if (item.value === 'nowTime') {
      options.push({
        label: item.value,
        type: item.type,
        value: '1970-01-01 00：00：00'
      })
      buildDividerFunction(mounted, methodList, scheme, index)
    } else if (sessionStorage.getItem(item.value)) {
      options.push({
        label: item.value,
        type: item.type,
        value: sessionStorage.getItem(item.value)
      })
    } else {
      options.push({
        label: item.value,
        value: item.value,
        type: item.type
      })
    }
  })
  const newOptions = deepClone(options)
  const str = `${scheme.__vModel__}Options: ${JSON.stringify(newOptions)},`
  optionsList.push(str)
}
// 构建options
function buildOptions(scheme, optionsList, methodList, mounted) {
  if (scheme.__vModel__ === undefined) return
  // el-cascader直接有options属性，其他组件都是定义在slot中，所以有两处判断
  let { options } = scheme
  if (!options) options = scheme.__slot__.options
  if (scheme.__config__.dataType === 'dynamic') {
    options = []
  }
  const newOptions = deepClone(options)
  if (scheme.__config__.tag === 'el-tabs') {
    newOptions.map(el => {
      el.customConfigs.forEach(item => {
        if (item.script) {
          delete item.script
        }
      })
      if (el.domainSource === 'inside') {
        buildTabContentUrl(scheme, newOptions, methodList, mounted)
      }
    })
  }
  let str = `${scheme.__vModel__}Options: ${JSON.stringify(newOptions)},`
  if (scheme.__config__.tableDataName) {
    str = `${scheme.__config__.tableDataName}Options: ${JSON.stringify(newOptions)},`
  }
  optionsList.push(str)
}
function buildTabContentUrl(scheme, newOptions, methodList, mounted) {
  const mouthed = `this.get${scheme.__vModel__}TabContentUrl()`
  const string = mounted.toString()
  if (string.search(`this.get${scheme.__vModel__}TabContentUrl()`) === -1) {
    mounted.push(mouthed)
  }
  const getTabContentUrlFunction = `get${scheme.__vModel__}TabContentUrl(){
  this.${scheme.__vModel__}Options.forEach(item=>{
      if (item.domainSource === 'inside') {
        // 平台内部
      let api=''
       this.allInterfaceUrlList.forEach(el => {
        if(el.id==item.businessDictionaryId){
        api = el.value.replace('-','.').replace('-','.').replace('-','.').replace('-',':')
        }
      })
        item.contentUrl = 'http://' + api +  item.content
      }

  })
            },
            `
  methodList.push(getTabContentUrlFunction)
}
function buildProps(scheme, propsList) {
  // console.log('配置项为', scheme.props.props)
  let str = `${scheme.__vModel__}Props: ${JSON.stringify(scheme.props.props)},`
  if (scheme.__config__.tableDataName) {
    str = `${scheme.__config__.tableDataName}Props: ${JSON.stringify(scheme.props.props)},`
  }
  propsList.push(str)
}
// el-upload的BeforeUpload
function buildBeforeUpload(scheme) {
  const config = scheme.__config__
  const unitNum = units[config.sizeUnit]
  let rightSizeCode = ''
  let acceptCode = ''
  const returnList = []
  if (config.fileSize) {
    rightSizeCode = `let isRightSize = file.size / ${unitNum} < ${config.fileSize}
    if(!isRightSize){
      this.$message.error('文件大小超过 ${config.fileSize}${config.sizeUnit}')
    }`
    returnList.push('isRightSize')
  }
  if (scheme.accept) {
    acceptCode = `let isAccept = new RegExp('${scheme.accept}').test(file.type)
    if(!isAccept){
      this.$message.error('应该选择${scheme.accept}类型的文件')
    }`
    returnList.push('isAccept')
  }
  const str = `${scheme.__vModel__}BeforeUpload(file) {
    ${rightSizeCode}
    ${acceptCode}
    return ${returnList.join('&&')}
  },`
  return returnList.length ? str : ''
}

// el-upload的OnSuccess
function buildOnSuccess(scheme, methodList) {
  const str = `${scheme.__vModel__}onChange(response, file, fileList) {
      this.${scheme.__vModel__}fileList.push(file);
      this.formData.${scheme.__vModel__} = fileList;
      this.${scheme.__vModel__}fileList = [...new Set(this.${scheme.__vModel__}fileList)]
      console.log(this.${scheme.__vModel__}fileList)
      // 下方处理导入数据、表格回显问题
      const tableData = '${scheme.__vModel__}'.split('_btn')[0]
      this.resolveTableData(response, tableData + '_table_tableData')
    },`
  methodList.push(`
    resolveTableData(response, tableData) {
    // 处理表格的数据
      let data = response.data
      data = data.map(column => {
        for (const key in column) {
          // 如果是字典项
          if (this[key + 'Options']) {
            const labelName = this[key + 'Props'].label
            const valueName = this[key + 'Props'].value
            column[key].split(',').forEach(label => {
              const value = this[key + 'Options'].find(el => el[labelName] == label) ? this[key +
                'Options'].find(el => el[labelName] == label)[valueName] : label
              column[key] = value
            })
          }
            return column
        }
      })
      this.$confirm('请选择覆盖表格数据还是向后追加数据', '提示', {
        confirmButtonText: '覆盖',
        cancelButtonText: '追加',
        type: 'warning'
      }).then(() => {
        this[tableData] = data
      }).catch(() => {
        this[tableData] = [...this[tableData], ...data]
      });
    },
  `)
  return str
}

// el-upload的文件 OnChange
function buildOnFileChange(scheme) {
  const str = `${scheme.__vModel__}FileChange(file, fileList) {
    // AI文字填充mock;后期换成真的 todo
      if("${scheme.__config__.fillComponentField}") {
        "${scheme.__config__.fillComponentField}".split(",").forEach(field => {
          this.formData[field] = '2022012300102';
        })
      }
      this.${scheme.__vModel__}fileList = fileList;
      this.formData.${scheme.__vModel__} = fileList;
    },`
  return str
}

// el-upload的OnRemove
function buildOnRemove(scheme) {
  const str = `${scheme.__vModel__}onRemove(file, fileList) {
      const index = this.${scheme.__vModel__}fileList.indexOf(file)
      this.${scheme.__vModel__}fileList.splice(index,1)
      console.log(this.${scheme.__vModel__}fileList)
      this.formData.${scheme.__vModel__} = this.${scheme.__vModel__}fileList;
    },`
  return str
}
// el-upload的submit
function buildSubmitUpload(scheme) {
  const str = `${scheme.__vModel__}submitUpload() {
           if (this.${scheme.__vModel__}fileList.length === 0) {
        this.$message.warning('请打开上传附件的弹窗')
        return
      }
    this.$refs['${scheme.__vModel__}'].submit()
  },
      ${scheme.__vModel__}handleRemove(file, fileList) {
      console.log(file, fileList)
      this.${scheme.__vModel__}fileList = []
    },
        ${scheme.__vModel__}onChange(file, fileList) {
      this.${scheme.__vModel__}fileList = fileList
    },`
  return str
}
// 手动上传文件
function buildUploadFile(scheme) {
  const str = `${scheme.__vModel__}UploadFile() {
    let formData = new FormData();
      let i = 0
    this['${scheme.__vModel__}' + 'fileList'].forEach((file) => {
      if(file.raw) {
          i ++
        formData.append('${scheme.name}', file.raw);
      }
    })
      if(!i) return
    let tokenValue = this.$gc.getToken();
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        token: tokenValue
      }
    };
    return new Promise((resolve, reject) => {
      axios.post(this['${scheme.__vModel__}' + 'Action'], formData, config).then(res => {
        resolve(res)
      }).catch(error => {
        // this.$message.error('文件上传出错')
        reject(error)
      })
    })
  },`
  return str
}
// 分割线函数
function buildDividerFunction(mounted, methodList, scheme, indexData) {
  const dividerFunction = `
    nowTime(){
         var now = new Date();
            var year = now.getFullYear(); //得到年份
            var month = now.getMonth();//得到月份
            var date = now.getDate();//得到日期
            var hour = now.getHours();//得到小时
            var minu = now.getMinutes();//得到分钟
            var sec = now.getSeconds();//得到秒
            month = month + 1;
            if (month < 10) month = "0" + month;
            if (date < 10) date = "0" + date;
            if (hour < 10) hour = "0" + hour;
            if (minu < 10) minu = "0" + minu;
            if (sec < 10) sec = "0" + sec;
            return year + "-" + month + "-" + date+ " " + hour + ":" + minu + ":" + sec;
    },
    getTime(){
    this.nowTime()
    this.${scheme.__vModel__}Options[${indexData}].value= this.nowTime()
    this.timer=window.setInterval((()=>{
    this.${scheme.__vModel__}Options[${indexData}].value= this.nowTime()
    }), 500)
    },
    `
  const mouthed = `this.getTime()`
  methodList.push(dividerFunction)
  mounted.push(mouthed)
}
// 上传组件平台内部时
function buildUploadUrl(scheme, methodList) {
  const getUploadUrlFunction = `get${scheme.__vModel__}UploadUrl(){
      let api=''
       this.allInterfaceUrlList.forEach(el => {
        if(el.id==${scheme.__config__.businessDictionaryId}){
        api = el.value.replace('-','.').replace('-','.').replace('-','.').replace('-',':')
        }
      })
            this.${scheme.__vModel__}Url= 'http://' + api +  '${scheme.__config__.action}'
            console.log(this.${scheme.__vModel__}Url)
            },
            `
  methodList.push(getUploadUrlFunction)
}
// 上传组件平台内部时
function buildTableUploadUrl(scheme, methodList) {
  const downFile = `downloadFile(file) {
  // 下载函数，请勿修改
    let tokenValue = this.$gc.getToken();
    let that = this
    $.ajax({
      type: "GET",
      url: window.SITE_CONFIG['fileCenterUrl'] + '/gcFile/downloadFile/' + file.fileId,
      xhrFields: {
        responseType: 'blob'
      },
      headers: {
        token: tokenValue
      },
      success: (data) => {
        if (window.navigator.msSaveOrOpenBlob) {
          try {
            const blob = new Blob([data])
            window.navigator.msSaveOrOpenBlob(blob, file.fileName)
          }catch (e) {
            console.log(e)
          }
        } else {
          const blob = data
          const reader = new FileReader()
          reader.readAsDataURL(blob) // 转换为base64，可以直接放入a标签href
          reader.onload = function (e) {
            // 转换完成，创建一个a标签用于下载
            const a = document.createElement('a')
            a.download = file.fileName // 自定义下载文件名称
            a.href = e.target.result
            document.body.appendChild(a)
            a.click()
            a.remove()
          }
        }
      },
      error: function (jqXHR) {
        console.log("发生错误：" + jqXHR.status);
      }
    })
  },
            `
  methodList.push(downFile)
}
function buildgUserInfoHover(scheme, methodList) {
  const getUserInfoHover = `
  // 表格鼠标移动上去获得人员信息的函数，请勿修改
  getUserInfoHover(account){
    this.tableParticipantInfo = account
    //  account = account || 'admin'
    //  $.ajax({
    //     type: 'get',
    //     url: \`${window.SITE_CONFIG['baseUrl']}/sys/user/getByCount/\` + account,
    //     dataType: 'json',
    //     headers: {
    //       token: this.$gc.getToken()
    //     },
    //     success: (data) => {
    //        this.tableParticipantInfo = [data.data]
    //     },
    //     error: (jqXHR) => {
    //       console.log('发生错误：' + jqXHR.status)
    //     }
    //   })
  },
  `
  methodList.push(getUserInfoHover)
}

// 上传组件平台内部时
function buildInterfaceUrl(scheme, methodList, created, dataList2) {
  const getInterfaceUrlFunction = `getInterfaceUrl(){
      const that=this
      $.ajax({
        type:'get',
        async:false,
        url:sessionStorage.getItem('BusinessDictionaryUrl') + '/sys/dict-item/getByCode?dictCode=IP_Port',
              headers: {
        token: document.cookie.replace('token=','')
      },
        dataType:"json",
        success:function(data){
          console.log(data)
          that.allInterfaceUrlList=data.data
        },
        error:function(jqXHR){
           console.log("发生错误："+ jqXHR.status);
        }
      })

  },`
  methodList.push(getInterfaceUrlFunction)

  dataList2.push(`allInterfaceUrlList:[],`)

  const mouthed = `this.getInterfaceUrl()`
  created.push(mouthed)
}
// 组件增珊函数
function buildComponentFunction(methodList, scheme, str, getFunction, formConfig) {
  const componentFunction = `addComponentList(val,maxNum){
    if(this['${formConfig.formModel}'][val+'List'].length<maxNum){
    this['${formConfig.formModel}'][val+'List'].push(${str})}
    ${getFunction}
    this.$forceUpdate()
    },
    deleteRow(val, index) {
      if (this['${formConfig.formModel}'][val + 'List'].length >1) {
        this['${formConfig.formModel}'][val + 'List'].splice(index, 1)
      }
    },
    `
  methodList.push(componentFunction)
}
// 拼接iframe的url
function getIframeURL(methodName, scheme, mounted, methodList) {
  const str =
    `${methodName}() {
    // 获取iframe的地址，请勿修改
      let str=''
      this.${scheme.__vModel__}dynamicOptions.forEach((item)=>{
        if(item.type==='address'){
          if(item.value==='token'){
            str+=item.value+'='+this.$gc.getToken()+'&'
          } else {
            str += item.value+'='+sessionStorage.getItem(item.value)+'&'
          }
        }
      })
      if(this.${scheme.__vModel__}URL.indexOf('?')!=-1){
        this.${scheme.__vModel__}URL=this.${scheme.__vModel__}URL1+'&'+str
      }else{
        this.${scheme.__vModel__}URL=this.${scheme.__vModel__}URL1+'?'+str
      }
    },`
  methodList.push(str)
  const mouthedString = `this.${methodName}()`
  const string = mounted.toString()
  if (string.search(`this.${methodName}()`) === -1) {
    mounted.push(mouthedString)
  }
}
// 初始化时push回显表单的数据
function pushInit(methodList, created, formConfig, scheme, dataList2, updated, collapseItems, hasCollapse) {
  const init = `init() {
    // 初始化函数
     this.query =  this.getResultObj()
     this.initBaseUrlList()
     this.getGlobalValue()
     // 查询所有的模型，添加详情回显的接口
      if (sessionStorage.getItem('formStyle') === '3' || sessionStorage.getItem('formStyle') === '4') {
      this.getDetailData()
      }
      // 修改环节的取消按钮会用到，用于关闭修改弹窗
      window.closeIframe = (btnVmodel) => {
        this[btnVmodel + "_visible"] = false
      }
  },
  `
  methodList.push(init)
  methodList.push(`resolveDetailDict(field, name, value) {
  // 回显使用的业务字典转换，请勿修改
    if(this[field + 'Options'] && Array.isArray(this[field + 'Options'])) {
    // 如果是数组则遍历
      if(Array.isArray(this.formData[field])){
      let actions = []
       for (let i = 0; i < this.formData[field].length; i++) {
          Object.keys(this[field + 'Options']).map((key) => {
           if (this[field + 'Options'][key][value] == "" + this.formData[field][i]) {
              actions.push(this[field + 'Options'][key][name]);
             return false;
            }
          });
       }
      return actions.join(" , ") ;
      }else{
      return this[field + 'Options'].find(el => el[value] == this.formData[field])
        ? this[field + 'Options'].find( el => el[value] ==  this.formData[field])[name]
        : this.formData[field]}
    }
    },`)
  const initBaseUrlList = `
    initBaseUrlList() {
    // todo 后续这个baseUrlList需要从字典项中获取 应该要调接口
      this.baseUrlList = ${JSON.stringify(baseUrlList)}
    },
  `
  methodList.push(initBaseUrlList)
  dataList2.push(`baseUrlList: [],`)
  const getResultObj = `
    getResultObj() {
      let resultObj = {}
      let search = window.location.search
      if (search && search.length > 1) {
        search = search.substring(1)
        var items = search.split('&')
        for (let i = 0; i < items.length; i++) {
          if (!items[i]) {
            continue
          }
          var kv = items[i].split('=')
          resultObj[kv[0]] = kv[1] === 'undefined' ? '' : kv[1]
        }
      }
      return resultObj
    },
  `
  methodList.push(getResultObj)

  const createdMethod = `this.init();`
  const string = created.toString()
  if (string.search(`this.init()`) === -1) {
    created.push(createdMethod)
  }
  // 组件为折叠面板时添加该变量
  if (scheme.__config__.tag === 'el-collapse-item') {
    hasCollapse.push(scheme.name)
    if (scheme.__config__.isOpen) {
      collapseItems.push(String(scheme.name))
    }
  }
  // 组件容器组件更新行序号和删除图标的show
  if (scheme.__config__.isComponent) {
    const str = scheme.__config__.isComponentChildren ? scheme.__config__.isComponentChildren : scheme.__config__.componentName
    const update = `updateShow(val) {
      if (val) {
        if (Object.keys(this.${str}List[0]).length) {
          this.row101Show = true
          return
        }
      }
      let element = document.getElementById('col')
      let arr = []
      if (element) {
        for(let obj in element.children) {
          if (element.children[obj].nodeName == 'DIV') {
            arr.push(element.children[obj])
          }
        }
      }
      let show = arr.every(value =>{
        return value.children.length == 0
      })
      this.${str}Show= !show
    },`
    methodList.push(update)
    // created.push('this.updateShow("val");')
    updated.push('this.updateShow();')
    dataList2.push('query: {},')
  }
}
// 切换tab事件
function changeTabs(methodName, methodList, scheme) {
  const str =
    `${methodName}(val) {
      try {
      this.curTab = val.index
      let js = this.${scheme.__vModel__}Options[val.index].customEvent
       eval(js);
      } catch (err) {
       // this.$message.error('方法错误');
      }
    },`
  methodList.push(str)
}

// 日期选择 开始时间之前/结束时间之后

function rangeAB(method, method1, rangeAfter, rangeBefore, methodList, mounted, scheme, formConfig) {
  let str = ''
  if (rangeAfter && rangeBefore) {
    str = `
    ${method}(){
      this.formData.${scheme.__vModel__}[0] = '0100-01-01 00:00:00'
      this.formData.${scheme.__vModel__}[1] = '9999-12-31 23:59:59'
    },`
  } else if (rangeAfter) {
    str = `
    ${method}(){
      this.formData.${scheme.__vModel__}[1] = '9999-12-31 23:59:59'
    },`
  } else if (rangeBefore) {
    str = `
    ${method}(){
      this.formData.${scheme.__vModel__}[0] = '0100-01-01 00:00:00'
    },`
  } else {
    str = `
    ${method}(){
      console.log(this.formData.${scheme.__vModel__})
    },`
  }
  let str1
  const timepickerType = scheme.__config__.timdCode
  if (timepickerType === 'start') {
    let endTimeField
    formConfig.fields.forEach(drawItem => {
      if (drawItem.__config__.tag === 'custom-date-picker') {
        if (scheme.__vModel__ === drawItem.__config__.children[0].__vModel__) {
          endTimeField = drawItem.__config__.children[1].__vModel__
        }
      }
    })
    str1 = `${method1}(){
        const startTime = Date.parse(this.formData.${scheme.__vModel__})
        const endTime = Date.parse(this.formData.${endTimeField})
       if (endTime && endTime < startTime) {
          this.$message.warning('开始时间必须早于结束时间!')
          this.formData.${scheme.__vModel__} = null
        }
      },`
  } else {
    let startTimeField
    formConfig.fields.forEach(drawItem => {
      if (drawItem.__config__.tag === 'custom-date-picker') {
        if (scheme.__vModel__ === drawItem.__config__.children[1].__vModel__) {
          startTimeField = drawItem.__config__.children[0].__vModel__
        }
      }
    })
    str1 = `${method1}(){
        const startTime = Date.parse(this.formData.${startTimeField})
        const endTime = Date.parse(this.formData.${scheme.__vModel__})
       if (startTime && endTime < startTime) {
          this.$message.warning('开始时间必须早于结束时间!')
          this.formData.${scheme.__vModel__} = null
        }
      },`
  }
  methodList.push(str1)
  methodList.push(str)
}

// 日期选择 限制选择此刻以前的时间
function limitTodayBefore(limitTodayBeforeMethod, methodList, mounted, scheme, formConfig) {
  let str = ''
  str = `
  ${limitTodayBeforeMethod}(val){
    const nowTime = Date.now() - 1000 // 点击此刻有时间延迟，-1000与当前时间做对比
    if(Date.parse(val) < nowTime) {
      this.$message.warning('不能选择当前时间以前的时间')
      val = null
      this.formData.${scheme.__vModel__} = null
    }
  },`
  methodList.push(str)
}
// 机构人员
function checkFocus(methodList, scheme) {
  const str = `${scheme.__vModel__}_focus(){
    this.${scheme.__vModel__}_dialogVisible = true
    if(this.formData.${scheme.__vModel__}.length == 0){
      this.formData.${scheme.__vModel__} = ['机构人员']
    }
  },
  ${scheme.__vModel__}_rest(){
    if(this.formData.${scheme.__vModel__}[0] === '机构人员'){
      this.formData.${scheme.__vModel__} = []
    }
    this.${scheme.__vModel__}_dialogVisible = false
  },`
  methodList.push(str)
}

function getTableData(methodList, scheme) {
  const str = `${scheme.__vModel__}_getTableData(){
    const that = this
    let tokenValue = this.$gc.getToken()
    $.ajax({
      type: 'get',
      url: '${scheme.__config__.tableURL}',
      headers: {
        token: tokenValue
      },
      data: {
        current: that.${scheme.__vModel__}_currentPage,
        size: that.${scheme.__vModel__}_pageSize,
        orgId: that.${scheme.__vModel__}_orgId,
        realName: that.${scheme.__vModel__}_realName,
        userName: that.${scheme.__vModel__}_userName
      },
      dataType: "json",
      success: function (data) {
        that.${scheme.__vModel__}_tableData = data.data.list
        that.${scheme.__vModel__}_total = data.data.totalCount
        that.${scheme.__vModel__}_pageSize = data.data.size
      },
      error: function (jqXHR) {
        console.log("发生错误：" + jqXHR.status);
      }
    })
  },
    ${scheme.__vModel__}_handleNodeClick(node){
      if(!this.${scheme.__vModel__}_selectLimit || (this.${scheme.__vModel__}_selectLimit && node.isLeaf)){
        this.${scheme.__vModel__}_orgId = node.id
        this.${scheme.__vModel__}_getTableData()
      }else {
        this.$message.warning('选取限制，仅可选择最末级节点')
      }
    },`
  methodList.push(str)
}
function handleUser(methodList, scheme) {
  const str = `${scheme.__vModel__}_addUser(row){
    if(!this.${scheme.__vModel__}_multiple && this.${scheme.__vModel__}_options.length > 0){
      this.$message.warning('仅可选择一个')
    }else{
      if(this.${scheme.__vModel__}_options.indexOf(row) === -1){
        this.${scheme.__vModel__}_options.push(row)
      }else{
        this.$message.warning('已选择'+row.realName)
      }
    }
  },
  ${scheme.__vModel__}_deleteUser(index){
      this.${scheme.__vModel__}_options.splice(index,1)
    },
    ${scheme.__vModel__}_dialogSure(){
      this.formData.${scheme.__vModel__} = []
      this.${scheme.__vModel__}_options.forEach(item => {
        this.formData.${scheme.__vModel__}.push(item.realName)
      })
      this.${scheme.__vModel__}_dialogVisible = false
    },`
  methodList.push(str)
}
function handlePagination(methodList, scheme) {
  const str = `${scheme.__vModel__}_handleSizeChange(val){
      this.${scheme.__vModel__}_pageSize = val
      this.${scheme.__vModel__}_getTableData()
    },
    ${scheme.__vModel__}_handleCurrentChange(val){
      this.${scheme.__vModel__}_currentPage = val
      this.${scheme.__vModel__}_getTableData()
    },`
  methodList.push(str)
}
/**
 * 下拉树点击节点回显
 */
function treeNodeClick(method, methodList, mounted, scheme) {
  let str = ''
  const Field = `${scheme.__vModel__}`
  const selectRef = `${scheme.__vModel__}selectRef`
  str = `
  ${method}(val){
    this.formData.${Field} = val.${scheme.props.props.label}
    this.$refs.${selectRef}.blur()
  },`
  methodList.push(str)
}
/**
 * 下拉树正常获取数据方法-非懒加载
 */
function getSelectTreeData(getDataMethod, methodList, scheme, created) {
  const jsonData = safelyParseJSON(scheme.__config__.jsonData, {})
  const paramsList = jsonData?.paramsList && jsonData.paramsList[0]?.children
  const params = {}
  paramsList && paramsList.forEach(item => {
    params[item.name] = item.realValue
  })
  let str1 = ''
  str1 = `${getDataMethod}(){
        this.${scheme.__vModel__}_data = []
        axios({
          method: 'get',
          url: \`\${window.SITE_CONFIG['dcloud']}/component/api/detailByCode/${jsonData.APIType}\`,
          headers: {
            'Content-Type': 'application/json',
            token: this.getToken()
          }
        }).then(res => {
          const requestConfig = res.data.data
          let paramsObj = ${JSON.stringify(params)}
          let params = {}
          for (let key in paramsObj) {
            params[key] = this.formData[paramsObj[key]]
          }
          const axiosConfig = {
            method: requestConfig.requestMethod,
            url: requestConfig[\`${window.SITE_CONFIG['apiEnv']}\`],
            headers: {
              'Content-Type': 'application/json',
              token: this.getToken()
            }
          }
          if(axiosConfig.method === 'GET'){
            axiosConfig.params = params
          } else {
            axiosConfig.data = params
          }
          axios(axiosConfig).then(res => {
            // 在此处理下拉框数据
            const list = res.data.${jsonData.dataKey}
            this.${scheme.__vModel__}_data = list
          })
        })
      },`
  methodList.push(str1)
  const selectCreated = `this.${getDataMethod}();`
  created.push(selectCreated)
}
/**
 * 下拉树懒加载方法
 */
function loadLazy(loadMethod, methodList, mounted, scheme) {
  const jsonData = safelyParseJSON(scheme.__config__.jsonData, {})
  const secondurl = jsonData.secondUrl
  const firstLabel = jsonData.label ? jsonData.label : 'name'
  const firstValue = jsonData.value ? jsonData.value : 'id'
  const secondLabel = jsonData.secondlabel ? jsonData.secondlabel : 'name'
  const secondValue = jsonData.secondvalue ? jsonData.secondvalue : 'id'
  let str1 = ''
  // 外部系统
  str1 = `
    ${loadMethod}(node, resolve){
      let secondurl = '${secondurl}'
      if (node.level === 0) {
        const that = this
         axios({
          method: 'get',
          url: \`\${window.SITE_CONFIG['dcloud']}/component/api/detailByCode/${jsonData.APIType}\`,
          headers: {
            'Content-Type': 'application/json',
            token: this.getToken()
          }
        }).then(res => {
          const requestConfig = res.data.data
          const requestExamples = JSON.parse(requestConfig.requestExamples)
          const paramsKey = Object.keys(requestExamples)[0]
          const paramaValueInit = Object.values(requestExamples)[0]
          const axiosConfig = {
            method: requestConfig.requestMethod,
            url: requestConfig[\`\${window.SITE_CONFIG['apiEnv']}\`]+'?'+\`\${paramsKey}=\${eval(paramaValueInit.substring(2,paramaValueInit.length-1))}\`,
            headers: {
              'Content-Type': 'application/json',
              token: this.getToken()
            }
          }
          axios(axiosConfig).then(res => {
            // 在此处理下拉树数据
           let data1 = {}
            if(res.data) {
              data1 = {
                label:res.data.data.${firstLabel},
                id:res.data.data.${firstValue}
              }
            }
            const _data = [{...data1}]
            console.log(_data,'_data')
            that.${scheme.__vModel__}loading = false
            return resolve(_data)
          })
        })
      }
    `
  let str2 = ''
  if (jsonData.secondRequestMethod && jsonData.secondlabel && jsonData.secondvalue) { // 二级懒加载接口没选时不生成第二级方法
    str2 = `
      if (node.level >= 1 && secondurl) {
        console.log(node,'node')
        const id = (node.data.id && node.data) ? node.data.id : ''
        axios({
          method: 'get',
          url: \`\${window.SITE_CONFIG['dcloud']}/component/api/detailByCode/${jsonData.secondAPIType}\`,
          headers: {
            'Content-Type': 'application/json',
            token: this.getToken()
          }
        }).then(res => {
          const requestConfig = res.data.data
          const axiosConfig = {
            method: requestConfig.requestMethod,
            url: requestConfig[\`\${window.SITE_CONFIG['apiEnv']}\`]+'/'+id,
            headers: {
              'Content-Type': 'application/json',
              token: this.getToken()
            }
          }
          axios(axiosConfig).then(res => {
            // 在此处理下拉树二级数据
            if(res&&res.data){
              const _data = res.data.data.length ? res.data.data.map(item => ({
                ...item,
                label:item.${secondLabel},
                id:item.${secondValue},
              })) : []
              return resolve(_data)
            }else {
              return resolve([])
            }
          })
        })
      };
     },
    `
  } else {
    str2 = `},`
  }
  const str = str1 + str2
  methodList.push(str)
}
/**
 * 下拉树懒多选方法
 */
function multipleTree(checkChangeMethod, selectChangeMethod, filterTextMethod, filterNodeMethod, methodList, watch, scheme) {
  const checkChangeStr = `
    ${checkChangeMethod}() {
      this.formData.${scheme.__vModel__} = []
      let list = this.$refs.${scheme.__vModel__}_tree.getCheckedNodes();
      list.forEach(item => {
        var label = item.${scheme.props.props.label};
        this.formData.${scheme.__vModel__}.push(label);
      })
      this.${scheme.__vModel__}flag = true
    },
  `
  const selectChangeStr = `
    ${selectChangeMethod}() {
       let list2=[];
       let list=[];
       list=this.$refs.${scheme.__vModel__}_tree.getCheckedNodes();
       if(this.${scheme.__vModel__}flag === true) {
          for(let i=1;i<list.length;i++){
            list2.push(list[i])
          }
          list=list2
          this.${scheme.__vModel__}flag = false;
       }else{
          for(let i=1;i<list.length;i++){
            list2.push(list[i])
          }
          list=list2
       }
        this.$refs.${scheme.__vModel__}_tree.setCheckedNodes(list2);
    },
  `
  methodList.push(checkChangeStr)
  methodList.push(selectChangeStr)
}
function searchTree(filterTextMethod, filterNodeMethod, methodList, watch, scheme) {
  const label = scheme.props.props.label ? scheme.props.props.label : 'name'
  const filterTextStr = `
    '${filterTextMethod}': function (val) {
      this.$refs.${scheme.__vModel__}_tree.filter(val)
    }
  `
  const filterNodeStr = `
    ${filterNodeMethod}(value, data) {
      if (!value) return true;
      return data.${label}.indexOf(value) !== -1
    },
  `
  watch.push(filterTextStr)
  methodList.push(filterNodeStr)
}

// js整体拼接
function buildexport(conf, type, data, rules, selectOptions, uploadVar, props, methods, mounted, computed, watch, datalist2, components, prop, created, updated, dialogRules) {
  try {
    methods = methods.replaceAll(/function\s* (?!: function)(?!\()/g, '') // 解决safari上渲染方法体出错的bug
  // eslint-disable-next-line no-empty
  } catch (e) {
    console.log(e)
  }

  // 去重
  const anchorList = `anchorPointList: ${JSON.stringify(anchorPointList)
  }`
  anchorPointList = []
  let dataList = '{' + datalist2 + uploadVar + selectOptions + props + anchorList + '}'
  // eslint-disable-next-line no-eval
  dataList = eval('(' + dataList + ')')
  const datas = []
  for (const key in dataList) {
    const value = JSON.stringify(dataList[key])
    datas.push(`${key}: ${value}`)
  }

  // 弹窗表单规则
  let dialogStrs = ''
  for (const e in dialogRules) {
    // 规则已存在就先删除
    datas.map((el, i) => {
      if (el.includes(e)) { datas.splice(i, 1) }
    })
    dialogStrs += `${e}: {
        ${dialogRules[e]}
      },`
  }

  const str = `${exportDefault}{
     components: {${components}},
     props: [${prop}],
     data () {
      return {
        ${conf.formModel}:
        {
          ${data}
        },
        ${conf.formRules}: {
          ${rules}
        },
        ${dialogStrs}
        ${datas}
      }
    },
    computed: {
      ${computed}
    },
     watch: {
    ${watch}
    },
    async created () {${created}},
    async mounted() {${mounted}},
    updated() {${updated}},
    methods: {
      ${methods}
    }
  }`
  return str
}

