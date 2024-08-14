import i18n from '@/i18n'

const $t = i18n.global.t
import {isArray, isBoolean, isObject} from "lodash-es";
import {randomString} from "@/utils/utils";
import {getImage} from "@/utils/comm";

export const TermTypeMap = {
    'and': $t('Save.utils.426526-0'),
    'or': $t('Save.utils.426526-1')
}

const DoubleFilter = ['nbtw', 'btw', 'in', 'nin'];

const TermsTypeMap = {
    eq: $t('Save.utils.426526-2'),
    neq: $t('Save.utils.426526-3'),
    gt: $t('Save.utils.426526-4'),
    gte: $t('Save.utils.426526-5'),
    lt: $t('Save.utils.426526-6'),
    lte: $t('Save.utils.426526-7'),
    btw: $t('Save.utils.426526-8'),
    nbtw: $t('Save.utils.426526-9'),
    time_gt_now: $t('Save.utils.426526-10'),
    time_lt_now: $t('Save.utils.426526-11'),
    in: $t('Save.utils.426526-12'),
    nin: $t('Save.utils.426526-13'),
    like: $t('Save.utils.426526-14'),
    nlike: $t('Save.utils.426526-15'),
    notnull: $t('Save.utils.426526-16'),
    isnull: $t('Save.utils.426526-17')
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
            return $t('Save.utils.426526-18', [templateName || data?.notify?.templateId])
        }
        const move = sendTo || orgName ? $t('Save.utils.426526-19') : ''
        return $t('Save.utils.426526-20', [move,sendTo || '',orgName || '',templateName || data?.notify?.templateId])
    }

    if (data.notifyType === 'weixin') {
        const { sendTo, orgName, tagName, templateName } = options
        const move = sendTo || orgName || tagName ? $t('Save.utils.426526-19') : ''

        return $t('Save.utils.426526-21', [move,sendTo || '',orgName || '',tagName || '',templateName || data?.notify?.templateId])
    }

    if (data.notifyType === 'email') {
        const { sendTo, templateName } = options
        const move = sendTo ? $t('Save.utils.426526-19') : ''
        return $t('Save.utils.426526-22', [move,sendTo || '',templateName || data?.notify?.templateId])
    }

    if (data.notifyType === 'voice') {
        const { sendTo, templateName } = options
        const move = sendTo ? $t('Save.utils.426526-19') : ''
        return $t('Save.utils.426526-23', [move,sendTo || '',templateName || data?.notify?.templateId])
    }

    if (data.notifyType === 'sms') {
        const { sendTo, templateName } = options
        const move = sendTo ? $t('Save.utils.426526-19') : ''
        return $t('Save.utils.426526-24', [move,sendTo || '',templateName || data?.notify?.templateId])
    }

    if (data.notifyType === 'sms') {
        const { templateName } = options
        return $t('Save.utils.426526-25', [templateName || data?.notify?.templateId])
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
            str += $t('Save.utils.426526-26')
        }
        str += isValueBoolean || propertiesValue ? propertiesValue : ''
    } else if (device?.selector === 'tag') {
        str = `${type} ${tagName} ${productName} ${propertiesName}`
    } else if (device?.selector === 'relation') {
        str = $t('Save.utils.426526-27',[type,triggerName,relationName,productName,propertiesName])
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
                    $t('Save.utils.426526-31') :
                    $t('Save.utils.426526-32')
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
            title: $t('Save.utils.426526-33', [index + 1]),
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
    text: $t('Save.utils.426526-34'),
    img: getImage('/scene/scene-hand.png'),
    icon: getImage('/scene/trigger-type-icon/manual.png'),
    tip: $t('Save.utils.426526-35'),
});
typeMap.set('timer', {
    text: $t('Save.utils.426526-36'),
    img: getImage('/scene/scene-timer.png'),
    icon: getImage('/scene/trigger-type-icon/timing.png'),
    tip: $t('Save.utils.426526-37'),
});
typeMap.set('device', {
    text: $t('Save.utils.426526-38'),
    img: getImage('/scene/scene-device.png'),
    icon: getImage('/scene/trigger-type-icon/device.png'),
    tip: $t('Save.utils.426526-39'),
});

export const handleGroupAndFilter = (branches: any[], when: any[]) =>{
    const group: any[] = []

    if (!branches) return []

    branches.forEach((item, index) => {
        if (when) {
            item.whenOptions = when[index]
        }

        if (index === 0 || item.executeAnyway) {
            group.push({
                branchName: item.branchName || item.whenOptions?.branchName || $t('Save.utils.426526-40', [group.length + 1]),
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
