<template>
    <page-container :showBack="true">
        <template #title> </template>
        <FullPage>
            <j-tabs v-model:activeKey="activeKey" class="tabs">
                <j-tab-pane class="tab_con" key="DataMap" tab="数据映射">
                    <DataMap
                        :mapDataList="mapDataList"
                        :dataMapOption="dataMapOption"
                        :dataDetailList="dataDetailList"
                    />
                </j-tab-pane>
                <j-tab-pane class="tab_con" key="DeviceMap" tab="设备映射">
                    <DeviceMap
                        :mapDeviceList="mapDeviceList"
                        :deviceMapOption="deviceMapOption"
                        :deviceIdsMap="deviceIdsMap"
                        :deviceDetailList="deviceDetailList"
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
const route = useRoute();

const mapDeviceList = ref<any>([]);
const mapDataList = ref<any>([]);
const deviceMapOption = ref<any>([]);
const dataMapOption = ref<any>([]);
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
            return { ...item1, targetAttribute: { ...rest2 } };
        }
        return item1;
    });
    return merged;
};

onMounted(() => {
    //获取原设备和原属性
    const terms: any = [
        {
            column: 'productId',
            termType: 'eq',
            type: 'or',
            value: `${route.params?.productId}`,
        },
    ];
    queryDeviceProductList({ terms }).then((res: any) => {
        const getData = res.result[0];
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
                    value: `${route.params?.id}`,
                },
            ],
        }).then((res: any) => {
            console.log(res.result[0]);
            const deviceMap = res.result[0]?.deviceMapping;
            const dataMap = res.result[0]?.dataMapping;
            const deviceTargetMaps = res.result[0].targetMapping?.deviceDetails;
            // console.log('deviceTargetMaps', deviceTargetMaps);

            const dataTargetMaps = res.result[0].targetMapping?.metadata;
            const dataTargetMap = JSON.parse(dataTargetMaps).properties;
            let TargetAttribute = dataTargetMap.map((item: any) => ({
                targetId: item.id,
                targetName: item.name,
            }));
            dataMapOption.value = TargetAttribute;
            let mergeDataMap = mergeArraysById(
                dataDetailList.value,
                dataMapOption.value,
            );
            if(mergeDataMap){
                dataDetailList.value = mergeDataMap
            }
            console.log('mergeDataMap', mergeDataMap);
            console.log('dataMapOption', dataMapOption.value);

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
