<template>
    <page-container>
        <FullPage>
            <!-- <div class="analysis-title">配置条件选择</div> -->
            <div class="analysis-form">
                <j-form layout="vertical" :model="form" ref="formRef">
                    <j-form-item label="首页" name="index">
                        <j-checkbox v-model:checked="form.offlineStyle"
                            >设备离线分析</j-checkbox
                        >
                        <j-checkbox v-model:checked="form.deviceMessages"
                            >设备消息</j-checkbox
                        >
                        <j-checkbox v-model:checked="form.deviceDistribution"
                            >设备分布</j-checkbox
                        >
                    </j-form-item>
                    <j-form-item label="运维分析" name="operation">
                        <j-checkbox v-model:checked="form.traffic"
                            >网络流量</j-checkbox
                        >
                        <j-checkbox v-model:checked="form.cpuUsageTrend"
                            >CPU使用率趋势</j-checkbox
                        >
                        <j-checkbox v-model:checked="form.jvmUsageTrend"
                            >JVM内存使用率趋势</j-checkbox
                        >
                    </j-form-item>
                    <j-form-item label="告警分析" name="alarm">
                        <j-checkbox v-model:checked="form.alarmStatistics"
                            >告警统计</j-checkbox
                        >
                    </j-form-item>
                    <j-form-item label="数据分析" name="information">
                        <j-checkbox v-model:checked="form.pointDataVolume"
                            >点位数据量</j-checkbox
                        >
                    </j-form-item>
                    <j-form-item label="视频分析" name="video">
                        <j-checkbox v-model:checked="form.numberOfPlays"
                            >播放数量</j-checkbox
                        >
                    </j-form-item>
                    <j-form-item label="物联卡分析" name="iot">
                        <j-checkbox v-model:checked="form.trafficStatistics"
                            >流量统计</j-checkbox
                        >
                        <j-checkbox v-model:checked="form.trafficUsage"
                            >流量使用</j-checkbox
                        >
                    </j-form-item>
                </j-form>
                <j-form-item>
                    <PermissionButton
                        style="margin-top: 12px"
                        type="primary"
                        @click="submitData"
                    >
                        保存
                    </PermissionButton>
                </j-form-item>
            </div>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { getReportConfig, saveReportConfig } from '@/api/system/analysis';
import { onlyMessage } from '@/utils/comm';
import { useAnalysisStore } from 'store/AnalysisReport';

const data = reactive({
    form: {} as Partial<Record<string, any>>,
});

const analysisStore = useAnalysisStore();
const { form } = toRefs(data);
const formRef = ref();

/**
 * 提交表单数据
 */
const submitData = () => {
    formRef.value
        .validate()
        .then(async () => {
            // 保存
            saveReportConfig(form.value).then((res: any) => {
                if (res.status === 200) {
                    analysisStore.setCurrent(form.value);
                    onlyMessage('保存成功');
                }
            });
        })
        .catch((err: any) => {});
};

onMounted(() => {
    getReportConfig().then((resp: any) => {
        if (resp.status === 200) {
            if (resp.result.length > 0) {
                data.form = resp.result[0];
            } else {
                data.form = {
                    id: '',
                    deviceMessages: false,
                    deviceDistribution: false,
                    offlineStyle: false,
                    traffic: false,
                    cpuUsageTrend: false,
                    jvmUsageTrend: false,
                    alarmStatistics: false,
                    pointDataVolume: false,
                    numberOfPlays: false,
                    trafficStatistics: false,
                    trafficUsage: false,
                };
            }
        }
    });
});
</script>

<style lang="less" scoped>
.analysis-form {
    padding: 20px 16px;

    .ant-form-vertical {
        .ant-form-item {
            padding: 14px 10px;
            background: linear-gradient(
                90deg,
                #f3f5f8 0%,
                rgba(243, 245, 248, 0) 100%
            );
            border-radius: 2px;
            margin-bottom: 8px;

            :deep(.ant-form-item-label > label) {
                font-size: 18px;
                font-weight: 500;
                color: #191c27;
            }
        }
    }
}
</style>
