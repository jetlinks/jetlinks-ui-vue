<template>
    <div class="left-contain">
        <j-input
            placeholder="请输入"
            v-model:value="searchValue"
            @pressEnter="search"
            @change="searchChange"
        >
            <template #suffix>
                <AIcon type="SearchOutlined" @click="search" />
            </template>
        </j-input>
        <div class="listBox">
            <j-tree
                :tree-data="listData"
                v-if="listData.length"
                :fieldNames="{ title: 'name', key: 'id', children: 'children' }"
                blockNode
                :selectedKeys="selectedKeys"
                :showLine="{ showLeafIcon: false }"
            >
                <template #title="item">
                    <div
                        class="treeItem"
                        @click="() => selectGroup(item.data.id)"
                    >
                        <template v-if="!item?.children">
                            <div class="itemText">
                                <Ellipsis>{{ item.name }}</Ellipsis>
                            </div>
                        </template>
                        <template v-else>
                            <Ellipsis>{{ item.name }}</Ellipsis>
                        </template>
                    </div>
                </template>
            </j-tree>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { queryRoleGroup } from '@/api/system/role';
const emit = defineEmits(['selectData']);
const listData: any = ref([
    {
        name: '全部',
        id: 'map_total',
        children: [],
    },
]);

const treeData = [
    {
        name: 'A分组',
        id: 'type_a',
        children: [
            { name: 'Aa企业(异常:20/100)', id: 'type_aa' },
            { name: 'Ab企业(异常:20/100)', id: 'type_ab' },
        ],
    },
    {
        name: 'B分组',
        id: 'type_b',
        children: [{ name: 'Ba企业(异常:20/100)', id: 'type_ba' }],
    },
    {
        name: 'C分组',
        id: 'type_c',
        children: [{ name: 'Ca企业(异常:20/100)', id: 'type_ca' }],
    },
    {
        name: 'D分组',
        id: 'type_d',
        children: [
            { name: 'Da企业(异常:20/100)', id: 'type_da' },
            { name: 'Db企业(异常:20/100)', id: 'type_db' },
        ],
    },
];

const selectedKeys = ref<string[]>(['map_total']);
const searchValue = ref();
const queryGroup = async (select?: Boolean, searchName?: string) => {
    const params = searchName
        ? {
              sorts: [{ name: 'createTime', order: 'desc' }],
              terms: [
                  {
                      terms: [
                          {
                              value: '%' + searchName + '%',
                              termType: 'like',
                              column: 'name',
                          },
                      ],
                  },
              ],
          }
        : { sorts: [{ name: 'createTime', order: 'desc' }] };
    const req: any = await queryRoleGroup(params);
    if (req.status === 200) {
        listData.value = [
            {
                name: '全部',
                id: 'map_total',
                children: [],
            },
            ...treeData,
        ];
        // if (req.result[req.result.length - 1].id === 'default_group') {
        //     req.result.unshift(req.result[req.result.length - 1]);
        //     req.result.pop();
        // }
        // if(req.result.length && select){
        //     selectGroup(req.result[0].id)
        // }
    }
};

const search = () => {
    queryGroup(true, searchValue.value);
};
const searchChange = () => {
    if (searchValue.value === '') {
        queryGroup();
    }
};
const selectGroup = (id: string) => {
    selectedKeys.value = [id];
    id === 'map_total'
        ? emit('selectData', '')
        : emit('selectData', selectedKeys.value);
};

onMounted(() => {
    queryGroup(true);
});
</script>
<style lang="less" scoped>
.controls {
    margin: 10px 0;
}

.treeItem {
    display: flex;
    justify-content: space-between;

    .itemText {
        line-height: 32px;
        max-width: 60%;
    }
}

.listBox {
    margin: 10px 0;
}
</style>
