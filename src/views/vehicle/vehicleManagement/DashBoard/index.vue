<template>
    <page-container>
        <div class="DashBoardBox">
            <j-row :gutter="24">
                <j-col :span="8"><TopCard title="车辆资产"></TopCard></j-col>
                <j-col :span="8"><TopCard title="在线车辆"></TopCard></j-col>
                <j-col :span="8"><TopCard title="离线车辆"></TopCard></j-col>
            </j-row>
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import TopCard from './components/TopCard.vue';
</script>
<style scoped></style>
