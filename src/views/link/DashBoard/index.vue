<template>
    <page-container>
        <div>
            <a-row :gutter="[24, 24]">
                <a-col :span="24"><TopCard /> </a-col>
                <a-col :span="24"><Network /></a-col>
                <a-col :span="12"><Cpu /></a-col>
                <a-col :span="12"><Jvm /></a-col>
            </a-row>
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
