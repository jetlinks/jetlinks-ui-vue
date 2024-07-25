<template>
    <div>
        <a-descriptions bordered :column="1">
            <a-descriptions-item :label="i.label" v-for="i in configuration">
                {{ i.label==='集群'? i.value ?  '共享配置' : '独立配置' : i.value }}
            </a-descriptions-item>
        </a-descriptions>
    </div>
</template>

<script setup>
import { detail } from '@/api/link/accessConfig';
const props = defineProps({
    data: {
        type: Object,
    },
});
const configuration = ref([]);
const configurationMap = new Map();
configurationMap.set('domain', 'SIP 域');
configurationMap.set('sipId', 'SIP ID');
configurationMap.set('shareCluster', '集群');
configurationMap.set('host', 'SIP 地址');
configurationMap.set('publicHost', '公网 Host');
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
