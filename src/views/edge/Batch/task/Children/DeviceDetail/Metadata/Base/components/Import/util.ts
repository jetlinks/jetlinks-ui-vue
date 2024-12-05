
export const validateDate = (item: Record<string, any>) => {
    if (!item.valueType.format) {
        console.log('validateDate - error', item.valueType.format)
        return false
    }
    return true
}

export const validateEnum = (item: Record<string, any>) => {
    if (item.valueType.elements?.length) {
        if (item.valueType.elements.every((item: {value: string, text: string}) => item.value && item.text)) {
            return true
        }
        console.log('validateEnum - error', item.valueType)
        return false
    }
    console.log('validateEnum - error', item.valueType)
    return false
}

export const validateFile = (item: Record<string, any>) => {
    if (!!item.valueType.bodyType) {
        return true
    }
    console.log('validateFile - error', item.valueType.bodyType)
    return false
}

export const validateArray = (item: Record<string, any>): boolean => {
    const { valueType } = item

    if (!valueType.elementType?.type) {
        console.log('validateArray - error', valueType.elementType)
        return false
    }

    return handleValidate(valueType.elementType.type, valueType.elementType)
}

export const validateObject = (item: Record<string, any>): boolean => {
    const { valueType } = item
    return valueType.properties?.length ? valueType.properties.every(item => {

        if(!item.id || !item.name || !item.valueType.type) {
            console.log('validateArray - error', item)
            return false
        }

        return handleValidate(item.valueType.type, item)

    }) : false
}

export const validateMap = {
    enum: validateEnum,
    date: validateDate,
    file: validateFile,
    array: validateArray,
    object: validateObject,
}

export const handleValidate = (type: string, item: any) => {
    const validateKeys = Object.keys(validateMap)

    if (validateKeys.includes(type)) {
        return validateMap[type](item)
    }

    return true
}

export const validateItem = (item: Record<string, any>): boolean => {

    if (!item || !item.id || !item.name || !item.valueType?.type || !item.expands?.source || !item.expands?.type?.length) {
        console.log('validateItem - error', item)
        return false
    }
    console.log(item.valueType.type)

    return handleValidate(item.valueType.type, item)

}
export const validate = (importMetadata: Array<Record<string, any>>, metadata: Array<Record<string, any>>, validateCallBack: (validate: boolean) => void):Array<Record<string, any>> => {
    const metadataMap = new Map()
    const copyMetadata = []

    metadata.forEach((item, index) => {
        metadataMap.set(item.id, index)
    })

    for (let i = importMetadata.length - 1; i >= 0;  i--) {
        const item = importMetadata[i]
        const isValidate = validateItem(item)

        if (isValidate) {
            // 与设备物模型属性id一致：覆盖
            if (metadataMap.has(item.id)) {
                metadata.splice(metadataMap.get(item.id), 1, item)
                importMetadata.splice(i, 1)
            } else {
                copyMetadata.push(item)
            }

        }
        validateCallBack?.(isValidate)
    }

    return [...metadata, ...copyMetadata]
}
