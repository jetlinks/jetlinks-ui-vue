<template>
    <page-container :showBack="true">
        <template #title> </template>
        <FullPage>
            <div class="detail">
                <div class="sider">
                    <Left :productListData="productListData" @select-data="selectData" />
                </div>
                <j-tabs v-model:activeKey="activeKey" class="tabs">
                    <j-tab-pane class="tab_con" key="DataMap" tab="物模型映射">
                        <DataMap :mapDataList="mapDataList" :dataMapOpt="dataMapOpt"
                            :deviceDetailList="deviceDetailList" :dataDetailList="dataDetailList" :sendId="sendId"
                            :selectProductId="selectProductId"
                            :allDataMapping="allDataMapping" :allDeviceMapping="allDeviceMapping" @refresh="refresh" />
                    </j-tab-pane>
                    <j-tab-pane class="tab_con" key="DeviceMap" tab="设备映射">
                        <DeviceMap :deviceIdsMap="deviceIdsMap" :deviceIdsMapOpt="deviceIdsMapOpt"
                            :deviceDetailList="deviceDetailList" :dataDetailList="dataDetailList"
                            :allDataMapping="allDataMapping" :allDeviceMapping="allDeviceMapping"
                            :selectProductId="selectProductId"
                            @updateParentVar="updateParentVar" :sendId="sendId" @refresh="refresh" />
                    </j-tab-pane>
                </j-tabs>
            </div>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import {
    queryDeviceProductList,
    queryDataSendList,
} from '@/api/exchange/receive';
import { getDataSandMap } from '@/api/exchange/receive';
import DataMap from './dataMap/index.vue';
import DeviceMap from './deviceMap/index.vue';
import Left from './DetailLeft/index.vue'
import { getImage, onlyMessage } from '@/utils/comm';
const route = useRoute();
const productListData = ref<any>([])
const allOriData = ref<any>()
const allTargetData = ref<any>()
const allDataMapping = ref<any>([]);
const allDeviceMapping = ref<any>([]);

const mapDataList = ref<any>([]);
const dataMapOption = ref<any>([]);
const dataMapOpt = ref<any>([]);

const deviceIdsMapOpt = ref<any>([]);
const deviceIdsMap = ref();
const activeKey = ref('DataMap');

const dataDetailList = ref<any>([]);
const deviceDetailList = ref<any>([]);
const sendId = ref<any>();
const selectProductId = ref<any>();
const selectData = (data: any) => {
    selectProductId.value = data[0]
    selectInit()
}

sendId.value = route.query.id as string;

const updateParentVar = (newValue: any) => {
    deviceDetailList.value = newValue;

    let getDeviceData = deviceDetailList.value.map((item: any) => {
        let deviceTargetAttribute = item.deviceTargetAttribute.map(
            (item: any) => ({
                originalId: item.originalId,
                state: item.state,
                targetAttribute: item.targetAttribute,
            }),
        );
        return {
            originalId: item.originalId,
            bln: item.bln,
            targetAttribute: item.targetAttribute,
            deviceTargetAttribute: deviceTargetAttribute,
            state: item.state,
        };
    });
    let getData = dataDetailList.value.map((item: any) => ({
        originalId: item.originalId,
        targetAttribute: item.targetAttribute,
        state: item.state,
    }));
    let senSaveDataMap = { dataMapping: getData, deviceMapping: getDeviceData };
    console.log('senSaveDataMap', senSaveDataMap);
    getDataSandMap(sendId.value, senSaveDataMap).then((res: any) => {
        if (res.status === 200) {
            onlyMessage('保存成功');
        }
    });
};

const mergeArraysById = (arr1: any, arr2: any) => {
    const merged = arr1.map((item1: any) => {
        const item2 = arr2.find(
            (item: any) => item.targetId === item1.originalId,
        );
        if (item2) {
            // 如果在arr2中找到了相同id的对象，则合并除了id以外的属性
            const { id, ...rest2 } = item2;
            return {
                ...item1,
                targetAttribute: { ...rest2 },
                select: item2.targetName + `(${item2.targetId})`,
                state: 'disabled',
            };
        } else {
            return item1;
        }
    });
    return merged;
};

const mergeArraysByArr = (arr1: any, arr2: any) => {
    const merged = arr1.map((item1: any) => {
        const item2 = arr2.find(
            (item: any) => item.targetId === item1.originalId,
        );
        if (item2) {
            // 如果在arr2中找到了相同id的对象，则合并除了id以外的属性
            const { originalId, originalName, ...orgData } = item1;
            const {
                deviceTargetAttribute,
                deviceTargetAttributeMap,
                ...rest2
            } = item2;
            const mergedDevDataMap = orgData.deviceTargetAttribute.map(
                (orgItem1: any) => {
                    const orgItem2 = deviceTargetAttribute.find(
                        (item: any) => item.targetId === orgItem1.originalId,
                    );
                    if (orgItem2) {
                        if (orgItem2.targetId) {
                            return {
                                ...orgItem1,
                                targetAttribute: orgItem2,
                                select: orgItem2.targetName + `(${orgItem2.targetId})`,
                                state: 'disabled',
                            };
                        } else {
                            return {
                                ...orgItem1,
                                state: 'disabled',
                            }
                        }
                    } else {
                        return orgItem1;
                    }
                },
            );
            if (item2.targetId) {
                return {
                    name: originalName,
                    originalId,
                    originalName,
                    targetAttribute: {
                        ...rest2,
                    },
                    deviceTargetAttribute: mergedDevDataMap,
                    deviceTargetAttributeMap: deviceTargetAttributeMap,
                    select: item2.targetName + `(${item2.targetId})`,
                    state: 'disabled',
                };
            } else {
                return {
                    name: originalName,
                    originalId,
                    originalName,
                    deviceTargetAttribute: mergedDevDataMap,
                    deviceTargetAttributeMap: deviceTargetAttributeMap,
                    state: 'disabled',
                }
            }
        } else {
            return item1;
        }
    });
    return merged;
};

const refresh = () => {
    Init();
};

const selectInit = () => {
    //初始化获取第一个产品物模型和映射属性
    const getData = allOriData.value.find((item: any) => item.id === selectProductId.value);
    if (getData.metadata === undefined) {
        onlyMessage('请先为产品设置物模型信息', 'error');
        return false;
    }
    const attributeList = JSON.parse(getData.metadata);
    if (attributeList?.properties) {
        let objectValues = attributeList?.properties.map((item: any) => ({
            name: item.name,
            originalName: item.name,
            originalId: item.id,
            state: 'disabled',
        }));
        dataDetailList.value = objectValues;
    }
    if (getData.deviceDetails.length > 0) {
        let deviceDetail = getData.deviceDetails.map((item: any) => {
            if (!item.metadata) {
                onlyMessage('设备未添加物模型', 'error');
                return false;
            }
            let yDevMetadata = JSON.parse(item.metadata)?.properties;
            let yDevMetadatas = yDevMetadata.map((item: any) => ({
                name: item.name,
                originalId: item.id,
                originalName: item.name,
                state: 'disabled',
            }));
            let select = yDevMetadata.map(
                (item: any) => item.name + `(${item.id})`,
            );
            return {
                name: item.name,
                originalId: item.id,
                originalName: item.name,
                bln: false,
                state: 'disabled',
                deviceTargetAttribute: yDevMetadatas,
            };
        });
        deviceDetailList.value = deviceDetail;
    }

    const deviceMaps = allTargetData.value[0]?.deviceMapping?.find((item: any) => item.id === selectProductId.value);
    const dataMaps = allTargetData.value[0]?.dataMapping?.find((item: any) => item.id === selectProductId.value);

    if(!deviceMaps?.id){
        onlyMessage('保存的映射数据错误，请检查', 'error');
        return false; 
    }
    if(!dataMaps?.id){
        onlyMessage('保存的映射数据错误，请检查', 'error');
        return false; 
    }
    const deviceMap = deviceMaps.configList
    const dataMap = dataMaps.configList
    if (!allTargetData.value[0].targetMapping) {
        onlyMessage('没有映射数据源，请检查', 'error');
        return false;
    }
    const deviceTargetMaps = allTargetData.value[0].targetMapping.result?.find((item: any) => item.id === selectProductId.value).deviceDetails;
    if (!deviceTargetMaps) {
        onlyMessage('设备映射数据为空', 'error');
        return false;
    }

    //处理数据映射
    const dataTargetMaps = allTargetData.value[0].targetMapping.result?.find((item: any) => item.id === selectProductId.value).metadata;
    if (!dataTargetMaps) {
        onlyMessage('数据映射为空', 'error');
        return false;
    }
    const dataTargetMap = JSON.parse(dataTargetMaps).properties;
    let TargetAttribute = dataTargetMap.map((item: any) => ({
        targetId: item.id,
        targetName: item.name,
    }));
    dataMapOption.value = TargetAttribute;
    dataMapOpt.value = TargetAttribute.map((item: any) => ({
        value: item.targetName + `(${item.targetId})`,
    }));

    let mergeDataMap = mergeArraysById(
        dataDetailList.value,
        dataMapOption.value,
    );
    if (mergeDataMap) {
        dataDetailList.value = mergeDataMap;
    }

    //处理设备映射及其数据映射
    let deviceTargetMap = deviceTargetMaps.map((item: any) => {
        // console.log(item)
        let devicesMetadata = JSON.parse(item.metadata).properties;
        let deviceMapMetadata = devicesMetadata.map((item: any) => ({
            targetId: item.id,
            targetName: item.name,
        }));
        let deviceTargetAttributeMap = deviceMapMetadata.map(
            (item: any) => ({
                value: item.targetName + `(${item.targetId})`,
            }),
        );
        return {
            targetId: item.id,
            targetName: item.name,
            deviceTargetAttribute: deviceMapMetadata,
            deviceTargetAttributeMap: deviceTargetAttributeMap,
        };
    });
    deviceIdsMap.value = deviceTargetMap;
    console.log('deviceTargetMap', deviceTargetMap)

    deviceIdsMapOpt.value = deviceTargetMap.map((item: any) => ({
        value: item.targetName + `(${item.targetId})`,
    }));

    let deviceIdsMapNew = mergeArraysByArr(
        deviceDetailList.value,
        deviceIdsMap.value,
    );
    deviceDetailList.value = deviceIdsMapNew;
    console.log('deviceDetailList', deviceDetailList.value)

    //判断是否保存了数据映射
    if (dataMap) {
        //处理数据映射 已保存后数据加载
        //dataDetailList.value
        console.log('dataMap', dataMap);
        dataDetailList.value = dataDetailList.value.map((item: any) => {
            const dataDetailListLaster = dataMap.find(
                (item1: any) => item1.originalId === item.originalId,
            );
            if (dataDetailListLaster) {
                if (dataDetailListLaster.targetAttribute) {
                    return {
                        name: item.originalName,
                        originalId: item.originalId,
                        originalName: item.originalName,
                        select: `${dataDetailListLaster.targetAttribute?.targetName}(${dataDetailListLaster.targetAttribute?.targetId})`,
                        state: dataDetailListLaster.state.value,
                        targetAttribute:
                            dataDetailListLaster.targetAttribute,
                    };
                } else {
                    return {
                        name: item.originalName,
                        originalId: item.originalId,
                        originalName: item.originalName,
                        state: dataDetailListLaster.state?.value,
                    };
                }
            } else {
                return item;
            }
        });
    }

    //判断是否保存了设备映射
    if (deviceMap) {
        // console.log('deviceMap', deviceMap);
        // console.log('deviceDetailList', deviceDetailList.value);
        // deviceDetailList.value
        const getDevice = deviceDetailList.value.map((item: any) => {
            const deviceDetailListLaster = deviceMap.find(
                (item1: any) => item1.originalId === item.originalId,
            );
            // console.log('deviceDetailListLaster',deviceDetailListLaster)
            if (deviceDetailListLaster) {
                //处理设备映射>>数据映射 已保存后数据加载
                const getDevDataLists = item.deviceTargetAttribute.map(
                    (item2: any) => {
                        const getDevDataList = deviceDetailListLaster.deviceTargetAttribute.find(
                            (item3: any) => item3.originalId === item2.originalId,
                        );
                        // console.log('getDevDataList',getDevDataList)
                        if (getDevDataList) {
                            if (getDevDataList.targetAttribute) {
                                return {
                                    name: item2.originalName,
                                    originalId: item2.originalId,
                                    originalName: item2.originalName,
                                    select: `${getDevDataList.targetAttribute?.targetName}(${getDevDataList.targetAttribute?.targetId})`,
                                    state: getDevDataList.state?.value,
                                    targetAttribute:
                                        getDevDataList.targetAttribute,
                                };
                            } else {
                                return {
                                    name: item2.originalName,
                                    originalId: item2.originalId,
                                    originalName: item2.originalName,
                                    state: getDevDataList.state?.value,
                                };
                            }
                        } else {
                            return item2;
                        }
                    },
                );

                const { originalId, deviceTargetAttribute, state, ...deviceDeRes } = deviceDetailListLaster;
                // console.log('deviceDeRes',deviceDeRes)
                // console.log('deviceState',state)
                if (deviceDeRes.targetAttribute) {
                    return {
                        name: item.originalName,
                        originalId: item.originalId,
                        originalName: item.originalName,
                        deviceTargetAttribute: getDevDataLists,
                        deviceTargetAttributeMap:
                            item.deviceTargetAttributeMap,
                        select: `${deviceDetailListLaster.targetAttribute?.targetName}(${deviceDetailListLaster.targetAttribute?.targetId})`,
                        state: state?.value,
                        ...deviceDeRes,
                    };
                } else {
                    return {
                        name: item.originalName,
                        originalId: item.originalId,
                        originalName: item.originalName,
                        deviceTargetAttribute: getDevDataLists,
                        deviceTargetAttributeMap:
                            item.deviceTargetAttributeMap,
                        state: state?.value,
                        ...deviceDeRes,
                    };
                }
            } else {
                return item;
            }
        });

        deviceDetailList.value = getDevice;
    }
};

const Init = () => {
    //获取原设备和原属性
    const query = {
        ids: JSON.parse(route.query?.ids as string),
        queryParam: {
            terms: [
                {
                    terms: [
                        {
                            column: 'id',
                            termType: 'in',
                            type: 'or',
                            value: JSON.parse(route.query?.productId as string),
                        },
                    ],
                },
            ],
        },
    };
    queryDeviceProductList(query).then((res: any) => {
        console.log('res', res);
        if (!res.result) {
            onlyMessage('请重新创建数据接收，无数据', 'error');
            return false;
        }
        productListData.value = res.result.map((item: any) => ({
            id: item.id,
            name: item.name
        }));
        selectProductId.value = productListData.value[0].id
        allOriData.value = res.result

        //获取目标设备和属性
        queryDataSendList({
            terms: [
                {
                    column: 'id',
                    termType: 'eq',
                    type: 'or',
                    value: `${route.params?.id}`,
                },
            ],
        }).then((res: any) => {
            console.log('mapping', res.result);
            allTargetData.value = res.result;
            allDataMapping.value = res.result[0].dataMapping;
            allDeviceMapping.value = res.result[0].deviceMapping;

            console.log('allDataMapping',allDataMapping.value)
            console.log('allDeviceMapping',allDeviceMapping.value)
            selectInit()
        });
    });
};

onMounted(() => {
    Init();
});
</script>

<style lang="less" scoped>
.detail {
    display: flex;
    flex-direction: row;

    .sider {
        margin-top: 15px;
        margin-left: 8px;
        width: 17%;
    }

    .tabs {
        margin-left: 30px;
        width: 80%;

        .tab_con {
            margin: 10px;
        }
    }
}
</style>
