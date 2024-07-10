<template>
    <div class="right-container">
        <div class="data-nav">
            <p>已选属性</p>
            <j-select
                ref="select"
                v-model:value="value"
                style="width: 200px"
                :options="options"
                :field-names="{
                    label: 'name',
                    value: 'id',
                }"
                size="small"
                allowClear="true"
                @change="handleChange"
            >
            </j-select>
        </div>
        <div class="data-content">
            <div class="data-content-con">
                <p>位数数据</p>
                <div>
                    <j-checkbox-group
                        v-model:value="state.value1"
                        :options="plainOptions1"
                        size="small"
                    />
                </div>
            </div>
            <div class="data-content-con content-second">
                <p>安全数据</p>
                <div>
                    <j-checkbox-group
                        v-model:value="state.value2"
                        :options="plainOptions2"
                        size="small"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const value = ref('humidity');
const state = reactive({
    value1: ['x', 'y'],
    value2: ['speed'],
});
const plainOptions1 = ref<any[]>([
    { label: 'x', value: 'x' },
    { label: 'y', value: 'y' },
    { label: '高度', value: 'height' },
]);
const plainOptions2 = ref<any[]>([
    { label: '速度', value: 'speed' },
    { label: '发动机转速', value: 'engineSpeed' },
]);
const options = ref<any[]>([
    {
        id: 'temp',
        name: '温度',
    },
    {
        id: 'speed',
        name: '速度',
    },
    {
        id: 'humidity',
        name: '湿度',
    },
]);
const handleChange = (value: string) => {
    console.log(`selected ${value}`);
};
</script>

<style lang="less" scoped>
.right-container {
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    overflow-x: auto;

    :deep p {
        font-size: 16px;
        font-weight: 400;
        line-height: 16px;
        height: 16px;
    }

    .data-nav {
        padding: 20px;
        border-bottom: 1px solid #f0f0f0;
    }
    .data-content {
        padding: 20px;

        .content-second {
            margin-top: 20px;
        }
    }
}
</style>
