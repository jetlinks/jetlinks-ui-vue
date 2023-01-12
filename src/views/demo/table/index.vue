<template>
    <div class="box">
        <JTable 
            :columns="columns"
            :request="request"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange
            }"
            @cancelSelect="cancelSelect"
        >
            <template #headerTitle>
                <a-button type="primary">新增</a-button>
            </template>
            <template #card="slotProps">
                <CardBox 
                    :value="slotProps" 
                    @click="handleClick" 
                    :actions="getActions(slotProps)" 
                    v-bind="slotProps" 
                    :active="_selectedRowKeys.includes(slotProps.id)"
                    :status="slotProps.state ? 'success' : 'error'"
                >
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/device-product.png')" />
                        </slot>
                    </template>
                    <template #content>
                         <h3>{{slotProps.name}}</h3>
                         <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    设备类型
                                </div>
                                <div>直连设备</div>
                            </a-col>
                        </a-row>
                    </template>
                    <!-- <template #actions="item">
                        <a-popconfirm  v-if="item.popConfirm" v-bind="item.popConfirm">
                            <a-button :disabled="item.disabled">
                                <DeleteOutlined v-if="item.key === 'delete'" />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </template>
                            </a-button>
                        </a-popconfirm>
                        <template v-else>
                            <a-button :disabled="item.disabled">
                                <DeleteOutlined v-if="item.key === 'delete'" />
                                <template v-else>
                                    <AIcon :type="item.icon" />
                                    <span>{{ item.text }}</span>
                                </template>
                            </a-button>
                        </template>
                    </template> -->
                </CardBox>
            </template>
            <template #id="slotProps">
                <a>{{slotProps.id}}</a>
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip v-for="i in getActions(slotProps)" :key="i.key" v-bind="i.tooltip">
                        <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
                            <a-button :disabled="i.disabled" style="padding: 0" type="link"><AIcon :type="i.icon" /></a-button>
                        </a-popconfirm>
                        <a-button style="padding: 0" type="link" v-else @click="i.onClick && i.onClick(slotProps)">
                            <a-button :disabled="i.disabled" style="padding: 0" type="link"><AIcon :type="i.icon" /></a-button>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
        </JTable>
    </div>
</template>

<script setup lang="ts">
import server from "@/utils/request";
import type { ActionsType } from '@/components/Table/index.vue'
import { getImage } from '@/utils/comm';
import { DeleteOutlined } from '@ant-design/icons-vue'

const request = (data: any) => server.post(`/device-product/_query`, data)

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true
    },
    {
        title: '分类',
        dataIndex: 'classifiedName',
        key: 'classifiedName',
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true
    }   
]

const _selectedRowKeys = ref<string[]>([])

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys]
}

const cancelSelect = () => {
    _selectedRowKeys.value = []
}

const handleClick = (dt: any) => {
    // _selectedRowKeys.value = [dt.id] // 单选
    // _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id] // 多选
    if(_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex(i => i === dt.id)
        _selectedRowKeys.value.splice(_index, 1)
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id]
    }
}

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if(!data){
        return []
    }
    return [
        {
            key: 'edit',
            text: "编辑",
            tooltip: {
                title: '编辑'
            },
            icon: 'icon-rizhifuwu'
        },
        {
            key: 'import',
            text: "导入",
            tooltip: {
                title: '导入'
            },
            icon: 'icon-xiazai'
        },
        {
            key: 'delete',
            // disabled: true,
            text: "删除",
            disabled: !!data?.state,
            tooltip: {
                title: !!data?.state ? '正常的产品不能删除' : '删除'
            },
            // popConfirm: {
            //     title: '确认删除?'
            // },

            icon: 'icon-huishouzhan'
        }
    ]
}

const p = h('p', 'hi')

</script>


<style lang="less" scoped>
.box {
    padding: 20px;
    background: #f0f2f5;
}
</style>

