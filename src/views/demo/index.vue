<!-- test demo -->
<template>
    <div class="page-container">
        父级: {{ testValue }}
        <ViewItem v-model="testValue" />
        <!-- 卡片 -->
        <br />卡片组件：
        <a-row :gutter="20">
            <a-col :span="6">
                <CardBox
                    status="disable"
                    :statusNames="{ disable: StatusColorEnum.error }"
                    statusText="正常"
                    :showMask="false"
                    :actions="actions"
                >
                    <template #img>
                        <img :src="getImage('/device-product.png')" />
                    </template>
                    <template #content>
                        <div class="card-item-heard-name">设备名称</div>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    设备类型
                                </div>
                                <div>直连设备</div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    产品名称
                                </div>
                                <div>测试固定地址</div>
                            </a-col>
                        </a-row>
                    </template>
                </CardBox>
            </a-col>
        </a-row>
    </div>
</template>

<script setup lang="ts">
import ViewItem from '@/components/ValueItem/index.vue';
import CardBox from '@/components/CardBox/index.vue';
import { StatusColorEnum } from '@/utils/consts';
import { getImage } from '@/utils/comm';

const testValue = ref('');
// 卡片按钮
const actions = ref([
    {
        key: 'check',
        label: '查看',
    },
    {
        key: 'edit',
        label: '编辑',
        disabled: true,
        message: '暂无权限，请联系管理员',
    },
    {
        key: 'delete',
        label: '删除',
    },
]);
</script>

<style lang="less" scoped>
.card-item-heard-name {
    font-weight: 700;
    font-size: 16px;
    margin-bottom: 12px;
}

.card-item-content-text {
    color: rgba(0, 0, 0, 0.75);
    font-size: 12px;
}
</style>
