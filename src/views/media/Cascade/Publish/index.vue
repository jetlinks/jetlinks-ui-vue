<!-- 国标级联-推送 -->
<template>
    <j-modal
        v-model:visible="_vis"
        title="推送"
        cancelText="取消"
        okText="确定"
        width="900px"
        @ok="_vis = false"
        @cancel="_vis = false"
    >
        <j-row :gutter="20">
            <j-col :span="8">
                <p>成功：{{ successCount }}</p>
                <j-space>
                    <p>失败：{{ failCount }}</p>
                    <a
                        v-if="errMessage.length"
                        @click="
                            downloadObject(
                                errMessage || '',
                                data.name + '-推送失败',
                            )
                        "
                        >下载</a
                    >
                </j-space>
            </j-col>
            <j-col :span="8">
                <p>推送通道数量：{{ data.count }}</p>
            </j-col>
            <j-col :span="8">
                <p>已推送通道数量：{{ successCount + failCount }}</p>
            </j-col>
        </j-row>
        <div v-if="flag">
            <j-textarea :rows="10" v-model:value="errStr" />
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import { LocalStore } from '@/utils/comm';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { PropType } from 'vue';
import { downloadObject } from '@/utils/utils';

type Emits = {
    (e: 'update:visible', data: boolean): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    data: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

watch(
    () => _vis.value,
    (val: boolean) => {
        if (val) publish();
    },
);

/**
 * 推送
 */
const successCount = ref<number>(0);
const failCount = ref<number>(0);
const flag = ref<boolean>(false);
const errMessage = ref<any[]>([]);
const errStr = computed(() => JSON.stringify(errMessage.value));
const publish = () => {
    successCount.value = 0;
    const activeAPI = `${BASE_API_PATH}/media/gb28181-cascade/${
        props.data.id
    }/bindings/publish?:X_Access_Token=${LocalStore.get(TOKEN_KEY)}`;
    const source = new EventSourcePolyfill(activeAPI);
    source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        if (res.successful) {
            successCount.value += 1;
        } else {
            failCount.value += 1;
            if (errMessage.value.length <= 5) {
                errMessage.value.push({ ...res });
            }
        }
    };
    source.onerror = () => {
        source.close();
    };
    source.onopen = () => {};
};
</script>
