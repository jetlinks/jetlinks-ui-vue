<template>
    <div class="notice-info-container">
        <img v-if="props.data.length" :src="NoData" alt="" />
        <a-tabs v-else :activeKey="'default'">
            <a-tab-pane key="default" tab="未读消息"> 
                <ul class="list">
                    <li class="list-item" v-for="item in props.data" @click="read(item.id)">
                        <h5>{{ item.topicName }}</h5>
                        <p>{{ item.message }}</p>
                    </li>
                </ul>   
                <div class="btns">
                    <span @click="read()">当前标记为已读</span>
                    <span @click="jumpPage('account/NotificationRecord')">查看更多</span>
                </div> 
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup lang="ts">
import { changeStatus_api } from '@/api/account/notificationRecord';
import { useMenuStore } from '@/store/menu';
import NoData from './nodata.svg';

const emits = defineEmits(['onAction'])
const props = defineProps<{
    data: any[];
}>();
const { jumpPage } = useMenuStore();

const read = (id?:string)=>{
    const ids = id ? [id]: props.data.map(item=>item.id)
    changeStatus_api('_read',ids).then(resp=>{
        if(resp.status === 200) emits('onAction')
    })
}


</script>

<style lang="less" scoped>
.notice-info-container {
    width: 336px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 6px 16px -8px rgb(0 0 0 / 8%), 0 9px 28px 0 rgb(0 0 0 / 5%),
        0 12px 48px 16px rgb(0 0 0 / 3%);

    :deep(.ant-tabs-nav-wrap) {
        display: flex;
        justify-content: center;
    }

    .list {
        .list-item {
            border-bottom: 1px solid #f0f0f0;
            padding: 24px;
        }
    }
    .btns {
        display: flex;
        span {
            display: block;
            width: 50%;
            text-align: center;
            cursor: pointer;

            &:first-child{
                border-right: 1px solid #f0f0f0;
            }
        }
    }
}
</style>
