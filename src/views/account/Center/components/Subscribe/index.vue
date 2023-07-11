<template>
    <j-spin :spinning="loading">
        <div style="padding: 0 10px">
            <div class="alert">
                <AIcon type="InfoCircleOutlined" />
                注意：接收人需要有告警配置页面的查询权限，才能收到告警类通知
            </div>
            <div class="content-collapse">
                <template v-if="dataSource.length">
                    <j-collapse :bordered="false" v-model:activeKey="activeKey" expand-icon-position="right">
                        <template #expandIcon="{ isActive }">
                            <AIcon
                                type="CaretRightOutlined"
                                :style="{
                                    transform: `rotate(${
                                        isActive ? 90 : 0
                                    }deg)`,
                                }"
                            />
                        </template>
                        <j-collapse-panel
                            v-for="item in dataSource"
                            :key="item.provider"
                            class="custom"
                            :header="item.name"
                        >
                            <div class="child">
                                <template
                                    v-for="child in item.children"
                                    :key="child.id"
                                >
                                    <Item
                                        @refresh="handleSearch"
                                        :data="child"
                                        :subscribe="
                                            subscribe.find(
                                                (i) =>
                                                    i?.topicProvider ===
                                                    child?.provider,
                                            )
                                        "
                                    />
                                </template>
                            </div>
                        </j-collapse-panel>
                    </j-collapse>
                </template>
                <j-empty style="margin: 200px 0" v-else />
            </div>
        </div>
    </j-spin>
</template>

<script lang="ts" setup>
import { getAllNotice } from '@/api/account/center';
import { getNoticeList_api } from '@/api/account/notificationSubscription';
import { initData } from '../data';
import Item from './components/Item.vue';

const subscribe = ref<any[]>([]);
const dataSource = ref<any[]>([]);
const activeKey = ref<string[]>(['alarm', 'system-monitor', 'system-business']);
const loading = ref<boolean>(false)

const handleSearch = () => {
    loading.value = true
    getAllNotice().then((resp: any) => {
        if (resp.status === 200) {
            const arr = initData
                .map((item: any) => {
                    const _child = item.children.map((i: any) => {
                        const _item = (resp.result || []).find(
                            (t: any) => t?.provider === i?.provider,
                        );
                        return {
                            ...i,
                            ..._item,
                        };
                    });
                    return {
                        ...item,
                        children: _child,
                    };
                })
                .filter((it: any) => {
                    return it.children.filter((lt: any) => lt?.id)?.length;
                })
                .map((item) => {
                    return {
                        ...item,
                        children: item.children.filter((lt: any) => lt?.id),
                    };
                });
            dataSource.value = arr;
        }
    });
    getNoticeList_api().then((resp: any) => {
        if (resp.status === 200) {
            subscribe.value = resp?.result?.data || [];
        }
    }).finally(() => {
        loading.value = false
    })
};

onMounted(() => {
    handleSearch();
});
</script>

<style lang="less" scoped>
.alert {
    height: 40px;
    padding-left: 10px;
    margin-bottom: 10px;
    color: #999999;
    line-height: 40px;
}
.custom {
    background: #F7F8FA;
    border: 0;
    overflow: hidden;
    color: #333333;
}
.child {
    background-color: white;
    padding-bottom: 24px;
}

.content-collapse {
    :deep(.ant-collapse-content > .ant-collapse-content-box) {
        padding: 0;
    }
}
</style>