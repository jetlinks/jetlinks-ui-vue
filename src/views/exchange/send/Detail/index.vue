<template>
    <page-container :showBack="true">
        <template #title> </template>
        <FullPage>
            <j-tabs v-model:activeKey="activeKey" class="tabs">
                <j-tab-pane class="tab_con" key="DataMap" tab="数据映射">
                    <DataMap
                        :mapDataList="mapDataList"
                        :dataMapOpt="dataMapOpt"
                        :dataDetailList="dataDetailList"
                        :sendId="route.query?.id"
                    />
                </j-tab-pane>
                <j-tab-pane class="tab_con" key="DeviceMap" tab="设备映射">
                    <DeviceMap
                        :mapDeviceList="mapDeviceList"
                        :deviceMapOption="deviceMapOption"
                        :deviceIdsMapOpt="deviceIdsMapOpt"
                        :deviceDetailList="deviceDetailList"
                        :sendId="route.query?.id"
                    />
                </j-tab-pane>
            </j-tabs>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/product';
import {
    queryDeviceProductList,
    queryDataSendList,
} from '@/api/exchange/receive';
import DataMap from './dataMap/index.vue';
import DeviceMap from './deviceMap/index.vue';
import { getImage, onlyMessage } from '@/utils/comm';
const route = useRoute();

const mapDeviceList = ref<any>([]);
const mapDataList = ref<any>([]);
const deviceMapOption = ref<any>([]);
const dataMapOption = ref<any>([]);
const dataMapOpt = ref<any>([]);

const deviceIdsMapOpt = ref<any>([]);
const deviceIdsMap = ref();

const activeKey = ref('DataMap');

const dataDetailList = ref<any>([]);
const deviceDetailList = ref<any>([]);

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
                state: 'enabled',
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
            const { deviceTargetAttribute, ...rest2 } = item2;
            const mergedDevDataMap = orgData.deviceTargetAttribute.map(
                (orgItem1: any) => {
                    const orgItem2 = deviceTargetAttribute.find(
                        (item: any) => item.targetId === orgItem1.originalId,
                    );
                    if (orgItem2) {
                        return {
                            ...orgItem1,
                            targetAttribute: orgItem2,
                            select:
                                orgItem2.targetName + `(${orgItem2.targetId})`,
                            state: 'enabled',
                        };
                    } else {
                        return orgItem1;
                    }
                },
            );
            return {
                originalId,
                originalName,
                targetAttribute: {
                    ...rest2,
                },
                deviceTargetAttribute: mergedDevDataMap,
                select: item2.targetName + `(${item2.targetId})`,
                state: 'enabled',
            };
        } else {
            return item1;
        }
    });
    return merged;
};

onMounted(() => {
    //获取原设备和原属性
    const terms: any = [
        {
            column: 'id',
            termType: 'eq',
            type: 'or',
            value: `${route.query?.productId}`,
        },
    ];
    queryDeviceProductList({ terms }).then((res: any) => {
        console.log(res);
        const getData = res.result[0];
        if (getData.metadata === undefined) {
            onlyMessage('请先为产品设置物模型信息', 'error');
            return false;
        }
        const attributeList = JSON.parse(getData.metadata);
        if (attributeList?.properties) {
            let objectValues = attributeList?.properties.map((item: any) => ({
                originalName: item.name,
                originalId: item.id,
            }));
            dataDetailList.value = objectValues;
        }
        if (getData.deviceDetails.length > 0) {
            let deviceDetail = getData.deviceDetails.map((item: any) => {
                let yDevMetadata = JSON.parse(item.metadata)?.properties;
                let yDevMetadatas = yDevMetadata.map((item: any) => ({
                    originalId: item.id,
                    originalName: item.name,
                }));
                let select = yDevMetadata.map(
                    (item: any) => item.name + `(${item.id})`,
                );
                return {
                    originalId: item.id,
                    originalName: item.name,
                    deviceTargetAttribute: yDevMetadatas,
                };
            });
            deviceDetailList.value = deviceDetail;
        }

        //获取目标设备和属性
        queryDataSendList({
            terms: [
                {
                    column: 'id',
                    termType: 'eq',
                    type: 'or',
                    value: `${route.query?.id}`,
                },
            ],
        }).then((res: any) => {
            console.log('mapping', res.result);
            const deviceMap = res.result[0]?.deviceMapping;
            const dataMap = res.result[0]?.dataMapping;
            if (!res.result[0].targetMapping) {
                onlyMessage('没有映射数据源，请检查', 'error');
                return false;
            }
            const deviceTargetMaps = res.result[0].targetMapping?.deviceDetails;
            if (!deviceTargetMaps) {
                onlyMessage('设备映射数据为空', 'error');
                return false;
            }

            //处理数据映射
            const dataTargetMaps = res.result[0].targetMapping?.metadata;
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
                return {
                    targetId: item.id,
                    targetName: item.name,
                    deviceTargetAttribute: deviceMapMetadata,
                };
            });
            deviceIdsMap.value = deviceTargetMap;

            deviceIdsMapOpt.value = deviceTargetMap.map((item: any) => ({
                value: item.targetName + `(${item.targetId})`,
            }));
            console.log(deviceIdsMapOpt.value);

            // console.log('deviceTargetMap', deviceIdsMap.value);
            // console.log('deviceDetailList', deviceDetailList.value);
            let deviceIdsMapNew = mergeArraysByArr(
                deviceDetailList.value,
                deviceIdsMap.value,
            );
            deviceDetailList.value = deviceIdsMapNew;

            if (deviceMap) {
                const deviceMaps = deviceMap.map(
                    (obj: any) => obj.targetAttribute,
                );
                console.log('deviceMaps', deviceMaps);
                deviceMapOption.value = deviceMaps;
            }
            if (dataMap) {
                const dataMaps = dataMap.map((obj: any) => obj.targetAttribute);
                console.log('dataMaps', dataMaps);
                dataMapOption.value = dataMaps;
            }
        });
    });
});
</script>

<style lang="less" scoped>
.tabs {
    margin: 15px;
    .tab_con {
        margin: 10px;
    }
}
</style>
