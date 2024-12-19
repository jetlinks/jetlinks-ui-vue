<template>
    <a-modal
        title="应用资源"
        visible
        :centered="true"
        @cancel="emits('close')"
        :maskClosable="false"
        :width="1000"
    >
        <div class="content">
            <div v-if="step === 0" style="margin-top: 15%">
                <j-card-select
                    :column="2"
                    v-model:value="type"
                    :options="typeList"
                    @change="typeChange"
                >
                    <template #image="{ image }">
                        <img :src="image" />
                    </template>
                </j-card-select>
            </div>
            <div v-else>
                <div><List/></div>
            </div>
        </div>

        <template #footer>
            <a-space>
                <a-button @click="emits('close')">取消</a-button>
                <a-button v-if="step === 0" type="primary" @click="step = 1"
                    >下一步</a-button
                >
                <a-button v-else type="primary">确定</a-button>
            </a-space>
        </template>
    </a-modal>
</template>

<script setup lang="ts" name="Apply">
import { getImage } from '@/utils/comm';
import List from './List.vue';
const emits = defineEmits(['close']);

const typeList = [
    {
        value: 'create',
        label: '快捷创建',
        subLabel: '引用该资源在IOT或网关中创建产品',
        iconUrl: getImage('/device/instance/device-card.png'),
    },
    {
        value: 'update',
        label: '快捷更新',
        subLabel: '快捷更新使用该资源创建的物模型、协议或插件',
        iconUrl: getImage('/device/instance/device-card.png'),
    },
];

const porps = defineProps({
    data: {
        type: Object,
    },
});

const type = ref();
const step = ref(0);

const typeChange = (data: any) => {
    console.log(data);
};
</script>

<style lang="less" scoped>
.content {
    height: 60vh;
    overflow-y: auto;
    overflow-x: hidden;
}
</style>
