<template>
    <j-modal
        :maskClosable="false"
        width="800px"
        :visible="true"
        :title="type === 'active' ? $t('Process.index.170026-0') : $t('Process.index.170026-1')"
        :closable="false"
    >
        <div style="margin: 10px 0px 20px 0px; padding-right: 10px;">
            <div v-if="flag">
                <div>{{ type === 'active' ? $t('Process.index.170026-2') : $t('Process.index.170026-3') }}</div>
                <j-progress :percent="_percent" />
            </div>
            <div v-else>
                <p>{{ type === 'active' ? $t('Process.index.170026-4') : $t('Process.index.170026-9') }}{{ count }}{{ $t('Process.index.170026-5') }}</p>
                <p v-if="type === 'active'">{{ $t('Process.index.170026-6') }}{{ errCount }}{{ $t('Process.index.170026-5') }}<j-tooltip :title="$t('Process.index.170026-7')"><AIcon style="margin-left: 5px" type="QuestionCircleOutlined" /></j-tooltip></p>
            </div>
        </div>
        <template #footer>
            <j-button v-if="!flag" type="primary" @click="handleCancel">{{ $t('Process.index.170026-8') }}</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { getDeviceNumber } from '@/api/device/instance';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
    data: {
        type: Object,
        default: () => []
    }
});

const count = ref<number>(0);
const total = ref<number>(0);
const flag = ref<boolean>(true);
const errCount = ref<number>(0);
const source = ref<Record<string, any>>({});

const handleCancel = () => {
    emit('close');
    emit('save');
};

const _percent = computed(() => {
    return total.value ? ((errCount.value + count.value) / total.value * 100).toFixed(2) : 0
})

const getData = (api: string) => {
    flag.value = true;
    let dt = 0;
    let dt1 = 0;
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
                    dt1 += res.total;
                    errCount.value = dt1;
                }
                break;
            case 'sync':
                dt += res;
                count.value = dt;
                break;
            default:
                break;
        }
        if ((count.value + errCount.value) >= total.value) {
          setTimeout(() => {
            _source.close();
            flag.value = false;
          }, 500)
        }
    };
    _source.onerror = () => {
        _source.close();
        flag.value = false;
    };
    _source.onopen = () => {};
};

watch(
    () => props.api,
    (newValue) => {
        if (newValue) {
            getDeviceNumber(props.data).then(resp => {
                if(resp.status === 200){
                    total.value = resp.result
                    getData(newValue);
                }
            })
        }
    },
    { deep: true, immediate: true },
);
</script>