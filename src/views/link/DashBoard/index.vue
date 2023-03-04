<template>
    <page-container>
        <div>
            <j-row :gutter="[24, 24]">
                <j-col :span="24"><TopCard /> </j-col>
                <j-col :span="24"><Network /></j-col>
                <j-col :span="12"><Cpu /></j-col>
                <j-col :span="12"><Jvm /></j-col>
            </j-row>
        </div>
    </page-container>
</template>

<script lang="ts" setup name="DashBoardPage">
import TopCard from './components/TopCard.vue';
import Network from './components/Network.vue';
import Cpu from './components/Cpu.vue';
import Jvm from './components/Jvm.vue';
</script>

<style lang="less" scoped></style>
