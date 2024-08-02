<template>
    <page-container>
        <div>
            <j-row :gutter="[24, 24]">
                <j-col :span="24"
                    ><TopCard @serviceChange="serviceChange" />
                </j-col>
                <j-col :span="24" v-if="isNoCommunity && traffic"
                    ><Network :serviceId="serviceId"
                /></j-col>
                <j-col :span="12" v-if="cpuUsageTrend"
                    ><Cpu :isNoCommunity="isNoCommunity" :serviceId="serviceId"
                /></j-col>
                <j-col :span="12" v-if="jvmUsageTrend"
                    ><Jvm :isNoCommunity="isNoCommunity" :serviceId="serviceId"
                /></j-col>
            </j-row>
        </div>
    </page-container>
</template>

<script lang="ts" setup name="DashBoardPage">
import TopCard from './components/TopCard.vue';
import Network from './components/Network.vue';
import Cpu from './components/Cpu.vue';
import Jvm from './components/Jvm.vue';
import { isNoCommunity } from '@/utils/utils';
import { useAnalysisStore } from 'store/AnalysisReport';
const Analysis = useAnalysisStore();
const traffic = Analysis.current.traffic;
const cpuUsageTrend = Analysis.current.cpuUsageTrend;
const jvmUsageTrend = Analysis.current.jvmUsageTrend;

const serviceId = ref<string | undefined>();

const serviceChange = (id: string) => {
    serviceId.value = id;
};
</script>

<style lang="less" scoped></style>
