<template>
    <j-page-container>
        <div>
            <a-row :gutter="[24, 24]">
                <a-col :span="24"><TopCard @serviceChange='serviceChange' /> </a-col>
                <a-col :span="24" v-if="isNoCommunity"><Network :serviceId='serviceId' /></a-col>
                <a-col :span="12"><Cpu :isNoCommunity="isNoCommunity" :serviceId='serviceId'/></a-col>
                <a-col :span="12"><Jvm :isNoCommunity="isNoCommunity" :serviceId='serviceId'/></a-col>
            </a-row>
        </div>
    </j-page-container>
</template>

<script lang="ts" setup name="DashBoardPage">
import TopCard from './components/TopCard.vue';
import Network from './components/Network.vue';
import Cpu from './components/Cpu.vue';
import Jvm from './components/Jvm.vue';
import { isNoCommunity } from '@jetlinks-web-core/utils/utils'

const serviceId = ref<string | undefined>()

const serviceChange = (id: string) => {
  serviceId.value = id
}

</script>

<style lang="less" scoped></style>
