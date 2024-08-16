<template>
    <div>
        <a-descriptions bordered :column="1">
            <a-descriptions-item :label="i.label" v-for="i in configuration">
                {{ i.label===$t('components.SixthKind.428295-0')? i.value ?  $t('components.SixthKind.428295-1') : $t('components.SixthKind.428295-2') : i.value }}
            </a-descriptions-item>
        </a-descriptions>
    </div>
</template>

<script setup>
import { detail } from '@/api/link/accessConfig';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
    },
});
const configuration = ref([]);
const configurationMap = new Map();
configurationMap.set('domain', $t('components.SixthKind.428295-3'));
configurationMap.set('sipId', 'SIP ID');
configurationMap.set('shareCluster', $t('components.SixthKind.428295-0'));
configurationMap.set('host', $t('components.SixthKind.428295-4'));
configurationMap.set('publicHost', $t('components.SixthKind.428295-5'));
const queryDetail = async () => {
    const res = await detail(props.data.id);
    if (res.success) {
        Object.keys(res.result.configuration || {}).forEach((i) => {
            if (configurationMap.has(i)) {
                configuration.value.push({
                    label: configurationMap.get(i),
                    value: res.result.configuration[i],
                });
            }
            if (i === 'hostPort') {
                Object.keys(res.result.configuration[i] || {}).forEach(
                    (item) => {
                        if (item === 'host') {
                            configuration.value.push({
                                label: configurationMap.get(item),
                                value:
                                    res.result.configuration.hostPort.host +
                                    ':' +
                                    res.result.configuration.hostPort.port,
                            });
                        } else if (item === 'publicHost') {
                            configuration.value.push({
                                label: configurationMap.get(item),
                                value:
                                    res.result.configuration.hostPort
                                        .publicHost +
                                    ':' +
                                    res.result.configuration.hostPort
                                        .publicPort,
                            });
                        }
                    },
                );
            }
        });
    }
};
onMounted(() => {
    queryDetail();
});
</script>
<style lang="less" scoped></style>
