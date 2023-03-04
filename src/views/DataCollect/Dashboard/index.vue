<template>
    <page-container>
        <a-row :gutter="24">
            <a-col :span="8" v-for="item in statusData" :key="item[0].type">
                <TopCard
                    :title="item[0].label"
                    :img="
                        getImage(`/DataCollect/dashboard/${item[0].type}.png`)
                    "
                    :footer="item"
                    :value="item[0].total"
                />
            </a-col>
        </a-row>
        <a-row :gutter="24">
            <a-col :span="24">
                <Card />
            </a-col>
        </a-row>
    </page-container>
</template>

<script setup lang="ts">
import TopCard from './components/TopCard.vue';
import Card from './components/Card.vue';
import { getImage } from '@/utils/comm';
import { queryCount } from '@/api/data-collect/dashboard';
import { defaultParams, statusData } from './tool';

const getNumberData = () => {
    statusData.value.forEach(async (item) => {
        const res = await queryCount(item[0].type, {});
        const resp = await queryCount(item[0].type, defaultParams);
        item[0].total = res.result || 0;
        item[0].value = resp.result || 0;
    });
};
getNumberData();
</script>

<style lang="less" scoped></style>
