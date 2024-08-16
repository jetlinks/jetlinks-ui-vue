<template>
    <div v-if="data.provider === 'official-edge-gateway'">
        <TitleComponent :data="$t('components.FifthKind.428298-0')" v-if="network"></TitleComponent>
        <AccessCard
            v-if="network"
            :data="{
                ...network,
                description: network.description
                    ? network.description
                    : descriptionList[data.provider],
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
                                >{{ $t('components.FifthKind.428298-1') }}{{ item.addresses.length }}{{ $t('components.FifthKind.428298-2') }}</span
                            >
                        </div>
                    </j-tooltip>
                </div>
            </template></AccessCard
        >
    </div>
    <div v-else>
        <TitleComponent :data="$t('components.FifthKind.428298-3')" v-if="protocol"></TitleComponent>
        <AccessCard
            v-if="protocol"
            :data="{ ...protocol, type: 'protocol' }"
        ></AccessCard>
    </div>
</template>

<script setup>
import AccessCard from '../../components/AccessCard/index.vue';
import {
    descriptionList,
    NetworkTypeMapping,
    ProtocolMapping,
} from '../../data';
import { getNetworkList, getProtocolList } from '@/api/link/accessConfig';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
    },
});
const network = ref();
const protocol = ref();
const queryNetwork = async () => {
    const res = await getNetworkList(
        NetworkTypeMapping.get(props.data.provider),
        '',
        {},
    );
    if (res.success) {
        network.value = res.result.find((i) => {
            return i.id === props.data.channelId;
        });
    }
};
const queryProtocol = async () => {
    const res = await getProtocolList(
        ProtocolMapping.get(props.data.provider),
        {
            'sorts[0].name': 'createTime',
            'sorts[0].order': 'desc',
        },
    );
    if (res.success) {
        protocol.value = res.result.find((i) => {
            return i.id === props.data.protocol;
        });
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
    if (props.data.provider === 'child-device') {
        queryProtocol();
    } else {
        queryNetwork();
    }
});
</script>
<style lang="less" scoped></style>
