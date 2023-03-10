<template>
    <div class="channel-tree">
        <div class="channel-tree-query">
            <j-input @change="queryTree" placeholder="请输入目录名称">
                <template #suffix>
                    <AIcon type="SearchOutlined" />
                </template>
            </j-input>
        </div>
        <div class="channel-tree-content">
            <j-tree
                :height="500"
                :selectedKeys="selectedKeys"
                :treeData="treeData"
                :onSelect="(keys:any) => {
                    if (keys.length) {
                    selectedKeys = keys
                    if (props.onSelect) {
                        props.onSelect(keys[0]);
                    }
                    }
                }"
                :fieldNames="{ key: 'id', title: 'name' }"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { debounce } from 'lodash';
import ChannelApi from '@/api/media/channel';
import DeviceApi from '@/api/media/device';

interface TreeProps {
    deviceId: string;
    onSelect: (id: string) => void;
    onTreeLoad: (type: boolean) => void;
}

const props = defineProps<TreeProps>();

const treeData = ref<any[]>([]);
const selectedKeys = ref<string[]>([]);

const getTreeData = async (id: string, data?: any) => {
    const { result } = await ChannelApi.queryTree(id, data);
    treeData.value[0].children = result || [];
    props.onTreeLoad(treeData.value[0].children.length > 10);
    treeData.value = treeData.value;
};

/**
 * 获取设备详情
 * @param id
 */
const getDeviceDetail = async (id: string) => {
    const deviceResp = await DeviceApi.detail(id);
    if (deviceResp.status === 200) {
        treeData.value = [
            {
                id,
                name: deviceResp.result.name,
                children: [],
            },
        ];
        selectedKeys.value = [id];
        getTreeData(props.deviceId, {});
    }
};

const queryTree = debounce((e: any) => {
    getTreeData(props.deviceId, {
        terms: [
            { column: 'name', termType: 'like', value: `%${e.target.value}%` },
        ],
    });
}, 300);

watchEffect(() => {
    getDeviceDetail(props.deviceId);
});
</script>

<style lang="less" scoped>
.channel-tree {
    height: 100%;

    .channel-tree-query {
        margin-bottom: 16px;
    }

    .channel-tree-content {
        min-height: calc(100% - 50px);
    }
}
</style>
