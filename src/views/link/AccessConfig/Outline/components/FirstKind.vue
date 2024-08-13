<template>
    <div>
        <TitleComponent :data="$t('components.FirstKind.428297-0')"> </TitleComponent>
        <AccessCard
            v-if="network"
            :data="{
                ...network,
                description: network?.description
                    ? network.description
                    : descriptionList[data?.provider],
                type: 'network',
            }"
        >
            <template #other>
                <div class="other">
                    <j-tooltip
                        placement="top"
                        :title="addressesTip(network.addresses)"
                    >
                        <div
                            v-for="i in (network.addresses || []).slice(0, 1)"
                            :key="i.address"
                            class="item"
                        >
                            <j-badge :status="getColor(i)" :text="i.address" />
                            <span v-if="(network.addresses || []).length > 1"
                                >{{ $t('components.FirstKind.428297-1') }}{{ network.addresses.length }}{{ $t('components.FirstKind.428297-2') }}</span
                            >
                        </div>
                    </j-tooltip>
                </div>
            </template>
        </AccessCard>
        <TitleComponent :data="$t('components.FirstKind.428297-3')" style="margin-top: 20px">
        </TitleComponent>
        <AccessCard v-if="protocol" :data="{ ...protocol, type: 'protocol' }">
        </AccessCard>
        <TitleComponent
            v-if="config?.routes && config.routes.length > 0"
            :data="
                data.provider === 'mqtt-server-gateway' ||
                data.provider === 'mqtt-client-gateway'
                    ? 'topic'
                    : $t('components.FirstKind.428297-4')
            "
            style="margin-top: 20px"
        >
        </TitleComponent>
        <div v-if="config?.routes && config.routes.length > 0">
            <j-scrollbar height="350">
                <j-table
                    :pagination="false"
                    :rowKey="generateUUID()"
                    :data-source="config.routes || []"
                    bordered
                    :columns="config.id === 'MQTT' ? columnsMQTT : columnsHTTP"
                    :scroll="{ y: 400 }"
                >
                    <template #bodyCell="{ column, text, record }">
                        <template v-if="column.dataIndex === 'stream'">
                            {{ getStream(record) }}
                        </template>
                    </template>
                </j-table>
            </j-scrollbar>
        </div>
    </div>
</template>

<script setup>
import {
    getNetworkList,
    getProtocolList,
    getConfigView,
} from '@/api/link/accessConfig';
import {
    NetworkTypeMapping,
    descriptionList,
    ProtocolMapping,
    ColumnsMQTT,
    ColumnsHTTP,
} from '../../data';
import AccessCard from '../../components/AccessCard/index.vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
    },
});
const network = ref();
const protocol = ref();
const config = ref();
const columnsMQTT = ref([]);
const columnsHTTP = ref([]);
function generateUUID() {
    var d = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        },
    );
}
const getStream = (record) => {
    let stream = '';
    if (record.upstream && record.downstream) stream = $t('components.FirstKind.428297-5');
    else if (record.upstream) stream = $t('components.FirstKind.428297-6');
    else if (record.downstream) stream = $t('components.FirstKind.428297-7');
    return stream;
};
const queryNetwork = async () => {
    const resp = await getNetworkList(
        NetworkTypeMapping.get(props.data?.provider),
        props.data?.channelId,
        {},
    );
    if (resp.status === 200) {
        network.value = resp.result.find((i) => {
            return i.id === props.data?.channelId;
        });
    }
};
const queryProcotol = async () => {
    const resp = await getProtocolList(
        ProtocolMapping.get(props.data?.provider),
        {
            'sorts[0].name': 'createTime',
            'sorts[0].order': 'desc',
        },
    );
    if (resp.status === 200) {
        protocol.value = resp.result.find((i) => {
            return i.id === props.data?.protocol;
        });
    }
};
const queryConfig = async () => {
    const resp = await getConfigView(
        props.data.protocol,
        ProtocolMapping.get(props.data.provider),
    );
    if (resp.success) {
        config.value = resp.result;
        const Group = {
            title: $t('components.FirstKind.428297-8'),
            dataIndex: 'group',
            key: 'group',
            ellipsis: true,
            align: 'center',
            width: 100,
            customCell: (record, rowIndex) => {
                const obj = {
                    children: record,
                    rowSpan: 0,
                };
                const list = config.value?.routes || [];
                const arr = list.filter((res) => res.group === record.group);
                const isRowIndex =
                    rowIndex === 0 || list[rowIndex - 1].group !== record.group;
                isRowIndex && (obj.rowSpan = arr.length);
                return obj;
            },
        };
        columnsMQTT.value = [Group, ...ColumnsMQTT];
        columnsHTTP.value = [Group, ...ColumnsHTTP];
    }
};
const getColor = (i) => (i.health === -1 ? 'error' : 'processing');
const addressesTip = (data) => {
    let tip = '';
    data.forEach((item) => {
        tip = tip + ' ' + item.address;
    });
    return tip;
};
onMounted(() => {
    queryNetwork();
    queryProcotol();
    queryConfig();
});
</script>
<style lang="less" scoped>
.other {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}
</style>
