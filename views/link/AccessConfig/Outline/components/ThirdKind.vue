<template>
    <div>
        <TitleComponent
            :data="$t('Cloud.Ctwing.076179-41')"
            v-if="configuration.length"
        ></TitleComponent>
        <a-descriptions bordered :column="1" v-if="configuration.length">
            <a-descriptions-item v-for="i in configuration" :label="i.label">{{
                i.value
            }}</a-descriptions-item>
        </a-descriptions>
        <TitleComponent
            v-if="protocol"
            :data="$t('Cloud.Ctwing.076179-42')"
            style="margin-top: 20px"
        ></TitleComponent>
        <AccessCard v-if="protocol" :data="{ ...protocol, type: 'protocol' }">
        </AccessCard>
    </div>
</template>

<script setup>
import { detail, getProtocolList } from '../../../../../api/link/accessConfig';
import { ProtocolMapping } from '../../data';
import AccessCard from '../../components/AccessCard/index.vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    data: {
        type: Object,
    },
});
const configuration = ref([]);
const protocol = ref();
const CtwingMap = new Map();
CtwingMap.set('apiAddress', $t('Cloud.OneNet.808542-1'));
CtwingMap.set('appKey', 'appKey');
CtwingMap.set('appSecret', 'appSecret');
CtwingMap.set('description', $t('Cloud.OneNet.808542-10'));
const OneNetMap = new Map();
OneNetMap.set('apiAddress', $t('Cloud.OneNet.808542-1'));
OneNetMap.set('apiKey', 'apiKey');
OneNetMap.set('validateToken', $t('Cloud.OneNet.808542-6'));
OneNetMap.set('aesKey', 'aesKey');
OneNetMap.set('description',  $t('Cloud.OneNet.808542-10'));
const queryDetail = async () => {
    const res = await detail(props.data.id);
    if (res.success) {
        if (props.data.channel === 'Ctwing') {
            Object.keys(res.result?.configuration || {}).forEach((i) => {
                if (CtwingMap.has(i)) {
                    configuration.value.push({
                        label: CtwingMap.get(i),
                        value: res.result.configuration[i] || '--',
                    });
                }
            });
        } else if (props.data.channel === 'OneNet') {
            Object.keys(res.result?.configuration || {}).forEach((i) => {
                if (OneNetMap.has(i)) {
                    configuration.value.push({
                        label: OneNetMap.get(i),
                        value: res.result.configuration[i] || '--',
                    });
                }
            });
        }
    }
};
const queryProcotol = async () => {
    const res = await getProtocolList(ProtocolMapping.get(props.data.channel), {
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc',
        paging: false,
    });
    if (res.success) {
        protocol.value = res.result.find((i) => {
            return i.id === props.data.protocol;
        });
    }
};
onMounted(() => {
    queryDetail();
    queryProcotol();
});
</script>
<style lang="less" scoped></style>
