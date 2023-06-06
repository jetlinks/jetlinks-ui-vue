<!-- 平台对接 -->
<template>
    <page-container>
        <pro-search :columns="columns" target="platform-search" @search="handleSearch" />
        <FullPage>
          <j-pro-table ref="platformRef" :columns="columns" :request="queryList"
              :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }" :params="params" :gridColumn="3">
              <template #headerTitle>
                  <j-space>
                  <!-- <j-button type="primary" @click="handleAdd">
                          <AIcon type="PlusOutlined" />新增
                          </j-button> -->
                      <PermissionButton @click="handleAdd" :hasPermission="'iot-card/Platform:add'" type="primary">
                          <AIcon type="PlusOutlined" />新增
                      </PermissionButton>
                  </j-space>
              </template>
              <template #card="slotProps">
                  <CardBox :value="slotProps" :actions="getActions(slotProps, 'card')" v-bind="slotProps"
                      :status="slotProps.state.value" :statusText="slotProps.state.text" :statusNames="{
                          enabled: 'processing',
                          disabled: 'error',
                      }">
                      <template #img>
                          <slot name="img">
                              <img :src="getImage('/iot-card/iot-card-bg.png')" />
                          </slot>
                      </template>
                      <template #content>
                          <h3  style='font-size: 16px;width: calc(100% - 90px); margin-bottom: 18px;'>
                            <Ellipsis>
                              {{ slotProps.name }}
                            </Ellipsis>
                          </h3>
                          <j-row>
                              <j-col :span="12">
                                  <div class="card-item-content-text">
                                      平台类型
                                  </div>
                                  <div>{{ slotProps.operatorName }}</div>
                              </j-col>
                              <j-col :span="12">
                                  <div class="card-item-content-text">说明</div>
                                  <Ellipsis>{{ slotProps.explain }}</Ellipsis>
                              </j-col>
                          </j-row>
                      </template>
                      <template #actions="item">
                          <PermissionButton :disabled="item.disabled" :popConfirm="item.popConfirm" :tooltip="{
                              ...item.tooltip,
                          }" @click="item.onClick" :hasPermission="'iot-card/Platform:' + item.key">
                              <AIcon type="DeleteOutlined" v-if="item.key === 'delete'" />
                              <template v-else>
                                  <AIcon :type="item.icon" />
                                  <span>{{ item?.text }}</span>
                              </template>
                          </PermissionButton>
                      </template>
                  </CardBox>
              </template>
              <template #state="slotProps">
                  <j-badge :text="slotProps.state.text" :status="
                      slotProps.state.value === 'disabled'
                          ? 'error'
                          : 'success'
                  " />
              </template>
              <template #action="slotProps">
                  <j-space :size="16">
                      <template v-for="i in getActions(slotProps, 'table')" :key="i.key">
                          <PermissionButton :disabled="i.disabled" :popConfirm="i.popConfirm" :tooltip="{
                              ...i.tooltip,
                          }" @click="i.onClick" type="link" style="padding: 0px"
                              :hasPermission="'iot-card/Platform:' + i.key">
                              <template #icon>
                                  <AIcon :type="i.icon" />
                              </template>
                          </PermissionButton>
                      </template>
                  </j-space>
              </template>
          </j-pro-table>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import type { ActionsType } from '@/components/Table';
import { message } from 'jetlinks-ui-components';
import { queryList, update, del } from '@/api/iot-card/platform';
import { useMenuStore } from 'store/menu'
const menuStory = useMenuStore()
const router = useRouter()
const platformRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '平台类型',
        dataIndex: 'operatorName',
        key: 'operatorName',
        search: {
            type: 'select',
            options: [
                { label: '移动OneLink', value: 'onelink' },
                { label: '电信Ctwing', value: 'ctwing' },
                { label: '联通Unicom', value: 'unicom' },
            ],
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: [
                { label: '启用', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'explain',
        key: 'explain',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
    },
];

const statusUpdate = async (data: any) => {
    const res = await update(data);
    if (res.status === 200) {
        message.success('操作成功');
        platformRef.value?.reload();
    }
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                //   router.push(`/iot-card/Platform/detail/${data.id}`);
                menuStory.jumpPage('iot-card/Platform/Detail', { id: data.id });
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state.value === 'enabled' ? '禁用' : '启用',
            },
            icon:
                data.state.value === 'enabled'
                    ? 'StopOutlined'
                    : 'PlayCircleOutlined',
            popConfirm: {
                title: `确认${data.state.value === 'enabled' ? '禁用' : '启用'
                    }？`,
                okText: ' 确定',
                cancelText: '取消',
                onConfirm: () => {
                    if (data.state.value === 'enabled') {
                        statusUpdate({
                            id: data.id,
                            config: { ...data.config },
                            state: 'disabled',
                            operatorName: data.operatorName,
                        });
                    } else {
                        statusUpdate({
                            id: data.id,
                            config: { ...data.config },
                            state: 'enabled',
                            operatorName: data.operatorName,
                        });
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title:
                    data.state.value !== 'enabled' ? '删除' : '请先禁用再删除',
            },
            disabled: data.state.value === 'enabled',
            popConfirm: {
                title: '确认删除?',
                okText: ' 确定',
                cancelText: '取消',
                onConfirm: async () => {
                    const resp: any = await del(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        platformRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 新增
 */
const handleAdd = () => {
    menuStory.jumpPage('iot-card/Platform/Detail', { id: ':id' })
};
</script>

<style scoped lang="less"></style>
