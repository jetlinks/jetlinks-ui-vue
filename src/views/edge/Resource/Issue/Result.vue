<template>
    <j-modal
        visible
        :title="$t('Issue.Result.925641-0')"
        :width="900"
        @ok="emit('close')"
        @cancel="emit('close')"
    >
        <j-row>
            <j-col :span="8">
                <div>{{ $t('Issue.Result.925641-1') }}{{ count }}</div>
                <div>
                    {{ $t('Issue.Result.925641-2') }}{{ countErr }}
                    <j-button @click="_download(errMessage || '', $t('Issue.Result.925641-3'))" v-if="errMessage.length" type="link"
                        >{{ $t('Issue.Result.925641-4') }}</j-button
                    >
                </div>
            </j-col>
            <j-col :span="8">{{ $t('Issue.Result.925641-5') }}{{ list.length || 0 }}</j-col>
            <j-col :span="8">{{ $t('Issue.Result.925641-6') }}{{ countErr + count }}</j-col>
        </j-row>
        <div v-if="!flag">
            <j-textarea :rows="10" :value="JSON.stringify(errMessage)" />
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import { LocalStore } from '@/utils/comm';
import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';
import dayjs from 'dayjs';
import { EventSourcePolyfill } from 'event-source-polyfill';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    list: {
        type: Array,
        default: () => [],
    },
});
const emit = defineEmits(['close']);

const count = ref<number>(0);
const countErr = ref<number>(0);
const flag = ref<boolean>(true);
const errMessage = ref<any[]>([]);

const getData = () => {
    let dt = 0;
    let et = 0;
    const errMessages: any[] = [];
    const _terms = {
        deviceId: (props.list || []).map((item: any) => item?.id),
        params: JSON.stringify({
            name: props.data.name,
            targetId: props.data.targetId,
            targetType: props.data.targetType,
            category: props.data.category,
            metadata: props.data?.metadata,
        }),
    };
    const url = new URLSearchParams();
    Object.keys(_terms).forEach((key) => {
        if (Array.isArray(_terms[key]) && _terms[key].length) {
            _terms[key].map((item: string) => {
                url.append(key, item);
            });
        } else {
            url.append(key, _terms[key]);
        }
    });
    const source = new EventSourcePolyfill(
        `${BASE_API_PATH}/edge/operations/entity-template-save/invoke/_batch?:X_Access_Token=${LocalStore.get(
            TOKEN_KEY,
        )}&${url}`,
    );
    source.onmessage = (e: any) => {
        const res = JSON.parse(e.data);
        if (res.successful) {
            dt += 1;
            count.value = dt;
        } else {
            et += 1;
            countErr.value = et;
            flag.value = false;
            if (errMessages.length < 5) {
                errMessages.push({ ...res });
                errMessage.value = [...errMessages];
            }
        }
    };
    source.onerror = () => {
        source.close();
    };
    source.onopen = () => {};
};

const _download = (record: Record<string, any>, fileName: string, format?: string) => {
  // 创建隐藏的可下载链接
  const ghostLink = document.createElement('a');
  ghostLink.download = `${fileName ? '' : record?.name}${fileName}_${dayjs(new Date()).format(
    format || 'YYYY_MM_DD',
  )}.txt`;
  ghostLink.style.display = 'none';
  //字符串内容转成Blob地址
  const blob = new Blob([JSON.stringify(record)]);
  ghostLink.href = URL.createObjectURL(blob);
  //触发点击
  document.body.appendChild(ghostLink);
  ghostLink.click();
  //移除
  document.body.removeChild(ghostLink);
}

watch(
    () => props.data.id,
    (newId) => {
        if(newId){
            getData()
        }
    },
    {
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
</style>