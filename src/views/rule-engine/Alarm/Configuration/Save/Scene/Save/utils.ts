import {isArray, isBoolean, isObject} from "lodash-es";
import {randomString} from "@/utils/utils";
import {getImage} from "@/utils/comm";

export const TermTypeMap = {
    'and': '并且',
    'or': '或者'
}

const DoubleFilter = ['nbtw', 'btw', 'in', 'nin'];

const TermsTypeMap = {
    eq: '等于_value',
    neq: '不等于_value',
    gt: '大于_value',
    gte: '大于等于_value',
    lt: '小于_value',
    lte: '小于等于_value',
    btw: '在_value和_value2之间',
    nbtw: '不在_value和_value2之间',
    time_gt_now: '距离当前时间大于_value秒',
    time_lt_now: '距离当前时间小于_value秒',
    in: '在_value,_value2之中',
    nin: '不在_value,_value2之中',
    like: '包含_value',
    nlike: '不包含_value',
    notnull: '不为空',
    isnull: '为空'
};

const handleValueString = (t: string, value: any) => {
    if (DoubleFilter.includes(t)) {
        const _v = value.length === 2 ? value : [value[0], value[0]]
        return TermsTypeMap[t].replace('_value', _v[0]).replace('_value2', _v[1])
    } else if(['notnull', 'isnull'].includes(t)) {
        return TermsTypeMap[t]
    } else if (TermsTypeMap[t]){
        return TermsTypeMap[t].replace('_value', value[0]);
    } else {
        return `${t}${value[0]}`
    }
}

const handleNotifyType = (data: any, options: any) => {
    if (data.notifyType === 'dingTalk') {
        const { sendTo, orgName, templateName } = options
        if (options.provider === 'dingTalkRobotWebHook') {
            return `通过群机器人消息发送 ${templateName || data?.notify?.templateId}`
        }
        const move = sendTo || orgName ? '向' : ''
        return `通过钉钉${move} ${sendTo || ''} ${orgName || ''} 发送 ${templateName || data?.notify?.templateId}`
    }

    if (data.notifyType === 'weixin') {
        const { sendTo, orgName, tagName, templateName } = options
        const move = sendTo || orgName || tagName ? '向' : ''

        return `通过微信${move}${sendTo || ''}${orgName || ''}${tagName || ''}发送${templateName || data?.notify?.templateId}`
    }

    if (data.notifyType === 'email') {
        const { sendTo, templateName } = options
        const move = sendTo ? '向' : ''
        return `通过邮件${move}${sendTo || ''}发送${templateName || data?.notify?.templateId}`
    }

    if (data.notifyType === 'voice') {
        const { sendTo, templateName } = options
        const move = sendTo ? '向' : ''
        return `通过语音${move}${sendTo || ''}发送${templateName || data?.notify?.templateId}`
    }

    if (data.notifyType === 'sms') {
        const { sendTo, templateName } = options
        const move = sendTo ? '向' : ''
        return `通过短信${move}${sendTo || ''}发送${templateName || data?.notify?.templateId}`
    }

    if (data.notifyType === 'sms') {
        const { templateName } = options
        return `通过WebHook发送${templateName || data?.notify?.templateId}`
    }

    return undefined
}

const handleDevice = (device: any, options: any) => {
    let str = ''
    const {type, name, propertiesName, propertiesValue, tagName, productName, triggerName, relationName} = options
    if (['fixed', 'context'].includes(device?.selector)) {
        str += `${type} ${name} ${propertiesName}`
        let isValueBoolean = isBoolean(propertiesValue)
        if (propertiesValue && isValueBoolean) {
            str += '为'
        }
        str += isValueBoolean || propertiesValue ? propertiesValue : ''
    } else if (device?.selector === 'tag') {
        str = `${type} ${tagName} ${productName} ${propertiesName}`
    } else if (device?.selector === 'relation') {
        str = `${type}与${triggerName}具有相同${relationName}的${productName}设备的${propertiesName}`
    }

    return str
}
const handleActions = (then: any): any[] => {
    let actionsArr:any[] = []
    const arr = then?.[0].actions.length ? then?.[0].actions : then?.[1].actions

    arr?.forEach((item: any) => {
        console.log(item, item.options)
        if (item.executor === 'alarm') {
            actionsArr.push(
                item.alarm.mode === 'trigger' ?
                    '满足条件后将触发关联告警' :
                    '满足条件后将解除关联告警'
            )
        }

        if (item.executor === 'notify') {
            actionsArr.push(handleNotifyType(item.notify, item.options))
        }

        if (item.executor === 'delay') {
            actionsArr.push(item.options?.name)
        }

        if (item.executor === 'device') {
            actionsArr.push(handleDevice(item.device, item.options))
        }

    })

    return actionsArr
}

const handleConditions = (when: any, whenData: any[]) => {
    let termsArr: string = ''

    if (when) {
        when?.terms.forEach((item, itemIndex) => {
            if (item.terms?.length) {
                if (itemIndex != 0) {
                    termsArr += item.termType
                }
                termsArr += '【'
                item.terms.forEach((b, index) => {
                    const [ name, termType, value, type ] = b
                    if (index !== 0) {
                        termsArr += ` ${TypeMap[type] || type} `
                    }
                    termsArr += `${name} ${handleValueString(termType, value)}`
                })
                termsArr += '】'
            }
        })
    } else {
        whenData.forEach((item, itemIndex) => {
            if (item.terms.length) {
                if (itemIndex !== 0) {
                    termsArr += TypeMap[item.type]
                }
                termsArr += '【'
                item.terms.forEach((b, index) => {
                    console.log(b)
                    const { column, termType, value, type } = b
                    let _val: any = { 0: value }

                    if (isObject(value)) {
                        _val = { 0: value.value }
                    } else if (isArray(value)) {
                        _val = value
                    }

                    if (index !== 0) {
                        termsArr += ` ${TypeMap[type] || type} `
                    }
                    termsArr += `${column} ${handleValueString(termType, _val)}`
                })
                termsArr += '】'
            }
        })
    }
    return termsArr
}

const handleBranches = (branches: any[], when: any, parentId: string) => {
    const msg: any[] = []

    branches.forEach((item: any, index) => {
        const _id = `condition_${index}`

        const obj = {
            title: `条件 ${index + 1}`,
            id: _id,
            parentId,
            children: [{
                title: handleConditions(when[index], item.when),
                id: randomString(),
                branchId: item.branchId || -1,
                parentId: _id,
                sceneId: parentId
            }]
        }
        if (index === 0) {
            msg[0] = obj
        } else {
            const lastIndex = msg.length - 1
            if (item.executeAnyway) {
                msg[lastIndex + 1] = obj
            } else {
                msg[lastIndex].children.push({
                    title: handleConditions(when[index], item.when),
                    id: randomString(),
                    branchId: item.branchId || -1,
                    parentId: _id,
                    sceneId: parentId
                })
            }
        }
    })
    return msg
}
export const handleSceneBranches = (data: any): any[] => {
    const group: any[] = []

    data?.forEach((item: any) => {
        let obj: any = {
            title: item.name,
            id: item.id,
            children: []
        }
        if (item.branches?.length) {
            obj.trigger = item.options.trigger
            obj.children = handleBranches(item.branches, item.options.when, item.id)
        }

        group.push(obj)
    })

    return group
}

export const typeMap = new Map();
typeMap.set('manual', {
    text: '手动触发',
    img: getImage('/scene/scene-hand.png'),
    icon: getImage('/scene/trigger-type-icon/manual.png'),
    tip: '适用于第三方平台向物联网平台下发指令控制设备',
});
typeMap.set('timer', {
    text: '定时触发',
    img: getImage('/scene/scene-timer.png'),
    icon: getImage('/scene/trigger-type-icon/timing.png'),
    tip: '适用于定期执行固定任务',
});
typeMap.set('device', {
    text: '设备触发',
    img: getImage('/scene/scene-device.png'),
    icon: getImage('/scene/trigger-type-icon/device.png'),
    tip: '适用于设备数据或行为满足触发条件时，执行指定的动作',
});

export const handleGroupAndFilter = (branches: any[], when: any[]) =>{
    const group: any[] = []

    if (!branches) return []

    branches.forEach((item, index) => {
        if (when) {
            item.when = when[index]
        }
        console.log(item)
        if (index === 0 || item.executeAnyway) {
            group.push({
                branchName: item.branchName || item.when?.branchName || `条件${group.length + 1}`,
                key: item.key || item.branchId,
                children: []
            })
        }

        const lastItem = group[group.length - 1]

        if (item.then[0]?.actions.length) {
            item.serial = item.then[0]?.actions
        }

        if (item.then[1]?.actions.length) {
            item.parallel = item.then[1]?.actions
        }



        lastItem.children.push(item)
    })
    return group
}

export const handleActiveBranches = (branches: any[], activeKeys: any[]) => {
    const branchesNames: string[] = []
    const activeKeySet = new Set(activeKeys)
    let invalid = false

    branches.forEach((item) => {
        let hasAlarmId = false

        item.children.forEach(child => {
            invalid = child.serial?.some(serial => !serial.actionId)
            if (hasAlarmId === false) {

                const status = child.serial?.some(serial => activeKeySet.has(serial.actionId)) || child.parallel?.some(parallel => activeKeySet.has(parallel.actionId))
                if (status) {
                    hasAlarmId = true
                }
            }
        })

        if (hasAlarmId) {
            branchesNames.push(item.branchName)
        }

    })


    return {
        data: branchesNames,
        invalid
    }
}
