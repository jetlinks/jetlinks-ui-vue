<!-- 物联卡查看 -->
<template>
    <page-container>
        <!-- 新增、编辑 -->
        <Save
            v-if="visible"
            :type="saveType"
            :data="current"
            @change="saveChange"
        />
        <a-row :gutter="[24, 24]">
            <a-col :span="24">
                <a-card>
                    <a-descriptions size="small" :column="3" bordered>
                        <template #title>
                            <span key="1">基本信息</span>
                            <a-button
                                key="2"
                                type="link"
                                @click="
                                    () => {
                                        visible = true;
                                        current = detail;
                                        saveType = 'edit';
                                    }
                                "
                            >
                                <AIcon type="EditOutlined"></AIcon>
                                编辑
                            </a-button>
                        </template>

                        <a-descriptions-item label="卡号">{{
                            detail.id
                        }}</a-descriptions-item>
                        <a-descriptions-item label="ICCID">{{
                            detail.iccId
                        }}</a-descriptions-item>
                        <a-descriptions-item label="绑定设备">{{
                            detail.deviceName
                        }}</a-descriptions-item>
                        <a-descriptions-item label="平台类型">{{
                            detail.operatorPlatformType?.text
                        }}</a-descriptions-item>
                        <a-descriptions-item label="平台名称">{{
                            detail.platformConfigName
                        }}</a-descriptions-item>
                        <a-descriptions-item label="运营商">{{
                            detail.operatorName
                        }}</a-descriptions-item>
                        <a-descriptions-item label="类型">{{
                            detail.cardType?.text
                        }}</a-descriptions-item>
                        <a-descriptions-item label="激活日期">{{
                            detail.activationDate
                                ? moment(detail.activationDate).format(
                                      'YYYY-MM-DD HH:mm:ss',
                                  )
                                : ''
                        }}</a-descriptions-item>
                        <a-descriptions-item label="更新时间">{{
                            detail.updateTime
                                ? moment(detail.updateTime).format(
                                      'YYYY-MM-DD HH:mm:ss',
                                  )
                                : ''
                        }}</a-descriptions-item>
                        <a-descriptions-item label="总流量">{{
                            detail.totalFlow
                                ? detail.totalFlow.toFixed(2) + ' M'
                                : ''
                        }}</a-descriptions-item>
                        <a-descriptions-item label="使用流量">{{
                            detail.usedFlow
                                ? detail.usedFlow.toFixed(2) + ' M'
                                : ''
                        }}</a-descriptions-item>
                        <a-descriptions-item label="剩余流量">{{
                            detail.residualFlow
                                ? detail.residualFlow.toFixed(2) + ' M'
                                : ''
                        }}</a-descriptions-item>
                        <a-descriptions-item label="状态">{{
                            detail?.cardState?.text
                        }}</a-descriptions-item>
                        <a-descriptions-item label="说明">{{
                            detail?.describe
                        }}</a-descriptions-item>
                    </a-descriptions>
                </a-card>
            </a-col>
            <a-col :span="24">
                <!-- 流量统计 -->
                <a-row :gutter="40">
                    <a-col :span="16">
                        <div class="card">
                            <Guide title="流量统计">
                                <template #extra></template>
                            </Guide>
                            <LineChart
                                :showX="true"
                                :showY="true"
                                style="min-height: 450px"
                                :chartData="flowData"
                            />
                        </div>
                    </a-col>
                    <a-col :span="8">
                        <div class="card">
                            <a-row :gutter="20">
                                <a-col :span="24">
                                    <Guide title="数据统计" />
                                </a-col>
                            </a-row>
                        </div>
                    </a-col>
                </a-row>
            </a-col>
        </a-row>
    </page-container>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { CardManagement } from '../typing';
import { queryDetail } from '@/api/iot-card/cardManagement';
import Save from '../Save.vue';
import Guide from '@/views/iot-card/components/Guide.vue';
import LineChart from '@/views/iot-card/components/LineChart.vue';

const route = useRoute();

const visible = ref<boolean>(false);
const current = ref<Partial<CardManagement>>({});
const saveType = ref<string>('');
const detail = ref<any>({});

const flowData = ref<any[]>([]);

const getDetail = () => {
    queryDetail(route.params.id).then((resp: any) => {
        if (resp.status === 200) {
            detail.value = resp.result;
        }
    });
};

/**
 * 新增、编辑关闭弹窗
 * @param val 加载表格
 */
const saveChange = (val: any) => {
    visible.value = false;
    current.value = {};
    if (val) {
        getDetail();
    }
};

getDetail();
</script>
<style scoped lang="less">
.card {
    padding: 24px;
    background-color: #fff;
}
</style>
