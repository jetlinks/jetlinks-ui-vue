<template>
    <j-modal
        :maskClosable="false"
        width="800px"
        :visible="true"
        title="当前进度"
        @ok="handleCancel"
        @cancel="handleCancel"
    >
        <div>
            <j-badge v-if="flag" status="processing" text="进行中" />
            <j-badge v-else status="success" text="已完成" />
        </div>
        <p>总数量：{{ count }}</p>
        <a style="color: red">{{ errMessage }}</a>
    </j-modal>
</template>

<script lang="ts" setup>
import { EventSourcePolyfill } from 'event-source-polyfill';

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    api: {
        type: String,
        default: '',
    },
    type: {
        type: String,
        default: '',
    },
});
// const eventSource = ref<Record<string, any>>({})
const count = ref<number>(0);
const flag = ref<boolean>(false);
const errMessage = ref<string>('');
const isSource = ref<boolean>(false);
const id = ref<string>('');
const source = ref<Record<string, any>>({});

const handleCancel = () => {
    emit('close');
    emit('save');
};

// const handleOk = () => {
//     emit('close');
//     emit('save');
// };

const getData = (api: string) => {
    let dt = 0;
    const _source = new EventSourcePolyfill(api);
    source.value = _source;
    _source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        switch (props.type) {
            case 'active':
                if (res.success) {
                    dt += res.total;
                    count.value = dt;
                } else {
                    if (res.source) {
                        const msg = `${res.source.name}: ${res.message}`;
                        errMessage.value = msg;
                        id.value = res.source.id;
                        isSource.value = true;
                    } else {
                        errMessage.value = res.message;
                    }
                }
                break;
            case 'sync':
                dt += res;
                count.value = dt;
                break;
            case 'import':
                if (res.success) {
                    const temp = res.result.total;
                    dt += temp;
                    count.value = dt;
                } else {
                    errMessage.value = res.message;
                }
                break;
            default:
                break;
        }
    };
    _source.onerror = () => {
        flag.value = false;
        _source.close();
    };
    _source.onopen = () => {};
};

watch(
    () => props.api,
    (newValue) => {
        if (newValue) {
            getData(newValue);
        }
    },
    { deep: true, immediate: true },
);
</script>