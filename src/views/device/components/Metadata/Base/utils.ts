import i18n from '@/i18n'
const $t = i18n.global.t
import {getMetadataConfig, getMetadataDeviceConfig} from "@/api/device/product";

export const sourceType = [
    {
        value: 'device',
        label: $t('Base.utils.691583-0'),
    },
    {
        value: 'manual',
        label: $t('Base.utils.691583-1'),
    },
    {
        value: 'rule',
        label: $t('Base.utils.691583-2'),
    },
]

export const getSourceMap = () => {
    return sourceType.reduce((prev, next) => {
        prev[next.value] = next.label
        return prev
    }, {})
}

export const limitsMap = new Map<string, any>();
limitsMap.set('events-add', 'eventNotInsertable');
limitsMap.set('events-updata', 'eventNotModifiable');
limitsMap.set('properties-add', 'propertyNotInsertable');
limitsMap.set('properties-updata', 'propertyNotModifiable');

export const getMetadataItemByType = (type: string) => {
    let item = {
        id: undefined,
        name: undefined,
        expands: {}
    }
    if (type === 'properties') {
        item = Object.assign(item, {
            expands: {
                source: 'device',
                group: undefined
            },
            valueType: {
                type: undefined,
                expands: {}
            }
        })
    } else if (type === 'functions') {
        item = Object.assign(item, {
            async: false,
            inputs: [],
            output: {
                type: undefined
            }
        })
    } else if (type === 'events') {
        item = Object.assign(item, {
            async: false,
            valueType: {
                type: 'object',
                properties: []
            },
            expands: {
                level: 'ordinary',
                group: undefined
            }
        })
    } else if (type === 'tags') {
        item = Object.assign(item, {
            valueType: {
                type: undefined
            },
            expands: {
                type: undefined,
                group: undefined
            }
        })
    }

    return item
}

export const useStoreType = (type: string) => {
    const route = useRoute()
    const settingData = ref({})

    const getData = async () => {
        const id = route.params.id;

        if (!id || !type) return;

        const params: any = {
            deviceId: id,
            metadata: {
                id: id,
                type: 'property',
                dataType: type,
            },
        };

        const resp =
            type === 'product'
                ? await getMetadataConfig(params)
                : await getMetadataDeviceConfig(params);
        if (resp.success) {

            if (resp.result.length) {
                resp.result.forEach((a) => {
                    if (a.properties) {
                        a.properties.some(item => {
                            if (item.property === 'storageType') {
                                settingData.value = item.type.elements.reduce((prev, next) => {
                                    prev[next.value] = next.text
                                    return prev
                                }, {})
                            }
                        })
                    }
                });
            }
        }
    }

    getData()

    return {
        settingData
    }
}
