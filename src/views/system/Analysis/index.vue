<template>
    <page-container>
        <FullPage>
            <!-- <div class="analysis-title">配置条件选择</div> -->
            <div class="analysis-form">
                <j-form layout="vertical" :model="form" ref="formRef">
                    <j-form-item label="首页" name="index">
                        <j-checkbox-group
                            v-model:value="form.index"
                            :options="indexOptions"
                        />
                    </j-form-item>
                    <j-form-item label="运维分析" name="operation">
                        <j-checkbox-group
                            v-model:value="form.operation"
                            :options="operationOptions"
                        />
                    </j-form-item>
                    <j-form-item label="告警分析" name="alarm">
                        <j-checkbox-group
                            v-model:value="form.alarm"
                            :options="alarmOptions"
                        />
                    </j-form-item>
                    <j-form-item label="数据分析" name="information">
                        <j-checkbox-group
                            v-model:value="form.information"
                            :options="informationOptions"
                        />
                    </j-form-item>
                    <j-form-item label="视频分析" name="video">
                        <j-checkbox-group
                            v-model:value="form.video"
                            :options="videoOptions"
                        />
                    </j-form-item>
                    <j-form-item label="物联卡分析" name="iot">
                        <j-checkbox-group
                            v-model:value="form.iot"
                            :options="iotOptions"
                        />
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
import { getReportConfig } from '@/api/system/analysis';
import { onlyMessage } from '@/utils/comm';

const data = reactive({
    form: {} as Partial<Record<string, any>>,
});

const { form } = toRefs(data);
const formRef = ref();

const indexOptions = [
    { label: '设备消息', value: 'deviceMessages' },
    { label: '设备分布', value: 'deviceDistribution' },
];

const operationOptions = [
    { label: '网络分析', value: 'network' },
    { label: 'CPU使用率趋势', value: 'cpu' },
    { label: 'JVM内存使用率趋势', value: 'jvm' },
];

const informationOptions = [{ label: '点位数据量', value: 'information' }];

const alarmOptions = [{ label: '告警统计', value: 'alarm' }];

const videoOptions = [{ label: '播放数量', value: 'videoNumber' }];

const iotOptions = [
    { label: '流量统计', value: 'traffic' },
    { label: '流量使用', value: 'trafficUsage' },
];

/**
 * 提交表单数据
 */
const submitData = () => {
    formRef.value
        .validate()
        .then(async () => {
            // 保存
            console.log('form', form.value);
            onlyMessage('暂无保存接口', 'warning');
        })
        .catch((err: any) => {});
};

onMounted(() => {
    // getReportConfig().then((resp: any) => {
    //     console.log('resp', resp);
    // });
});
</script>

<style lang="less" scoped>
// .analysis-title {
//     padding: 24px 16px;
//     height: 40px;
//     font-weight: 500;
//     font-size: 24px;
//     line-height: 28px;
//     display: flex;
//     align-items: center;
//     color: #191c27;
//     border-bottom: 1px solid #e7e9ef;
// }
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
