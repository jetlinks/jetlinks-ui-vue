<template>
    <page-container>
        <div>
            <j-row :gutter="[24, 24]">
                <j-col :span="24"><TopCard @serviceChange='serviceChange' /> </j-col>
                <j-col :span="24"><Network :serviceId='serviceId' /></j-col>
                <j-col :span="12"><Cpu :serviceId='serviceId'/></j-col>
                <j-col :span="12"><Jvm :serviceId='serviceId'/></j-col>
            </j-row>
        </div>
    </page-container>
</template>

<script lang="ts" setup name="DashBoardPage">
import TopCard from './components/TopCard.vue';
import Network from './components/Network.vue';
import Cpu from './components/Cpu.vue';
import Jvm from './components/Jvm.vue';

const serviceId = ref<string | undefined>()

const serviceChange = (id: string) => {
  serviceId.value = id
}

</script>

<style lang="less" scoped></style>
