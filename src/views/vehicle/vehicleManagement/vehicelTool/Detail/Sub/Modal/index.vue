<template>
    <j-modal
        title="详情"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="Visible"
        width="1300px"
    >
        <template #footer>
            <j-button key="back" @click="handleCancel">关闭</j-button>
        </template>
        <div class="all">
            <div class="main main-top">
                <div class="main-title">设备信息</div>
                <div class="main-con">
                    <div class="main-left">
                        <img
                            :src="
                                deviceForm?.devicePhotoUrl ||
                                getImage('/device-product.png')
                            "
                            class="productImg"
                            style="width: 150px; height: 150px"
                        />
                    </div>
                    <div class="main-right">
                        <j-descriptions bordered size="small">
                            <j-descriptions-item label="设备id"
                                ><Ellipsis>{{
                                    deviceForm?.id
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="物模型名称"
                                ><Ellipsis>{{
                                    deviceForm?.productName
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="设备类型">
                                <Ellipsis>{{
                                    deviceForm?.deviceType?.text
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item
                                label="固件版本"
                            ></j-descriptions-item>
                            <j-descriptions-item label="连接协议">
                                <Ellipsis>{{
                                    deviceForm?.transport
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="消息协议">
                                <Ellipsis>{{
                                    deviceForm?.protocolName
                                }}</Ellipsis>
                            </j-descriptions-item>
                            <j-descriptions-item label="创建时间"
                                ><Ellipsis>{{
                                    deviceForm?.createTime
                                        ? moment(
                                              Number(deviceForm?.createTime),
                                          ).format('YYYY-MM-DD HH:mm:ss')
                                        : ''
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="注册时间"
                                ><Ellipsis>{{
                                    deviceForm?.registerTime
                                        ? moment(
                                              Number(deviceForm?.registerTime),
                                          ).format('YYYY-MM-DD HH:mm:ss')
                                        : ''
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="最后上线时间"
                                ><Ellipsis>{{
                                    deviceForm?.onlineTime
                                        ? moment(
                                              Number(deviceForm?.onlineTime),
                                          ).format('YYYY-MM-DD HH:mm:ss')
                                        : ''
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="父设备">
                            </j-descriptions-item>
                            <j-descriptions-item label="说明"
                                ><Ellipsis>{{
                                    deviceForm?.description
                                }}</Ellipsis></j-descriptions-item
                            >
                        </j-descriptions>
                    </div>
                </div>
            </div>
            <j-divider style="height: 2px; background-color: #e9ecf1" />
            <div class="main main-footer">
                <div class="main-title">SIM卡信息</div>
                <div class="main-con">
                    <div class="main-left">
                        <img
                            :src="
                                deviceForm?.devicePhotoUrl ||
                                getImage('/device-product.png')
                            "
                            class="productImg"
                            style="width: 150px; height: 150px"
                        />
                    </div>
                    <div class="main-right">
                        <j-descriptions bordered size="small">
                            <j-descriptions-item label="设备id"
                                ><Ellipsis>{{
                                    deviceForm?.id
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="物模型名称"
                                ><Ellipsis>{{
                                    deviceForm?.productName
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="设备类型">
                                <Ellipsis>{{
                                    deviceForm?.deviceType?.text
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item
                                label="固件版本"
                            ></j-descriptions-item>
                            <j-descriptions-item label="连接协议">
                                <Ellipsis>{{
                                    deviceForm?.transport
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="消息协议">
                                <Ellipsis>{{
                                    deviceForm?.protocolName
                                }}</Ellipsis>
                            </j-descriptions-item>
                            <j-descriptions-item label="创建时间"
                                ><Ellipsis>{{
                                    deviceForm?.createTime
                                        ? moment(
                                              Number(deviceForm?.createTime),
                                          ).format('YYYY-MM-DD HH:mm:ss')
                                        : ''
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="注册时间"
                                ><Ellipsis>{{
                                    deviceForm?.registerTime
                                        ? moment(
                                              Number(deviceForm?.registerTime),
                                          ).format('YYYY-MM-DD HH:mm:ss')
                                        : ''
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="最后上线时间"
                                ><Ellipsis>{{
                                    deviceForm?.onlineTime
                                        ? moment(
                                              Number(deviceForm?.onlineTime),
                                          ).format('YYYY-MM-DD HH:mm:ss')
                                        : ''
                                }}</Ellipsis></j-descriptions-item
                            >
                            <j-descriptions-item label="父设备">
                            </j-descriptions-item>
                            <j-descriptions-item label="说明"
                                ><Ellipsis>{{
                                    deviceForm?.description
                                }}</Ellipsis></j-descriptions-item
                            >
                        </j-descriptions>
                    </div>
                </div>
            </div>
        </div>
    </j-modal>
</template>
<script setup lang="ts">
import {
    getDeviceDetail,
    queryVehicleNetwork,
} from '@/api/vehicle/vehicleDetail';
import { getImage } from '@/utils/comm';
import moment from 'moment';
const photoUrl = ref('public/images/device-media.png');
const Visible = ref<boolean>(false);

const deviceForm = ref<any>();

/**
 * 显示弹窗
 */
const show = (deviceId: string) => {
    console.log('deviceId', deviceId);
    if (deviceId) {
        getDeviceDetail(deviceId).then((res: any) => {
            console.log('res', res);
            if (res.result) {
                deviceForm.value = res.result;
            }
        });
        queryVehicleNetwork({
            terms: [
                {
                    column: 'deviceId',
                    termType: 'eq',
                    type: 'or',
                    value: deviceId,
                },
            ],
        }).then((resp: any) => {
            console.log('resp', resp);
        });
        Visible.value = true;
    }
};
const emit = defineEmits(['success']);
/**
 * 关闭弹窗
 */
const handleCancel = () => {
    // emit('success', []);
    Visible.value = false;
};

defineExpose({
    show: show,
});
</script>

<style lang="less" scoped>
.all {
    width: 100%;
    height: 100%;

    .main {
        width: 100%;
        display: flex;
        flex-direction: column;

        .main-title {
            font-size: 16px;
            margin-left: 10px;
        }

        .main-con {
            display: flex;
            flex-direction: row;
            margin-top: 10px;

            .main-left {
                width: 150px;
            }

            .main-right {
                width: 1130px;
            }
        }
    }
}

.main-footer {
    margin-top: 20px;
}
</style>
