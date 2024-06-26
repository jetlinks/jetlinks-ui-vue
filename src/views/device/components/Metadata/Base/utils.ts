import {getMetadataConfig, getMetadataDeviceConfig} from "@/api/device/product";

export const levelMap = ref({
    ordinary: '普通',
    warn: '警告',
    urgent: '紧急',
})
export const sourceMap = ref({
    device: '设备',
    manual: '手动',
    rule: '规则',
});
export const expandsType = ref({
    read: '读',
    write: '写',
    report: '上报',
});

export const limitsMap = new Map<string, any>();
limitsMap.set('events-add', 'eventNotInsertable');
limitsMap.set('events-updata', 'eventNotModifiable');
limitsMap.set('properties-add', 'propertyNotInsertable');
limitsMap.set('properties-updata', 'propertyNotModifiable');

export const getMetadataItemByType = (type: string) => {
    let item = {
        id: undefined,
        name: undefined,
        expands: {
            group: undefined
        }
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
