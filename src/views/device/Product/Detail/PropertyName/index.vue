<template >
    <!-- btns -->
    <div class="header-btns">
        <j-button @click="handleAdd">新增</j-button>
        <j-button class="search-btn" type="primary" @click="handleSearch">搜索</j-button>
        <PermissionButton type="primary" :danger="false" :hasPermission="true" :popConfirm="{
            title: `确定下发？`,
            onConfirm: () => handleSend(),
        }">
            下发设备
        </PermissionButton>
    </div>
    <!-- table -->
    <j-pro-table ref="tableRef" model="TABLE" :columns="columns" :request="queryProperty" :defaultParams="{
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ value: _productId, termType: 'eq', column: 'productId' }]
    }" :params="params">
        <template #action="slotProps">
            <PermissionButton type="link" :tooltip="{
                title: '编辑',
            }" @click="handlEdit(slotProps)" :hasPermission="true">
                <AIcon type="EditOutlined" />
            </PermissionButton>

            <PermissionButton type="link" :tooltip="{
                title: '删除',
            }" :danger="true" :hasPermission="true" :popConfirm="{
    title: `确定删除？`,
    onConfirm: () => handlDelete(slotProps),
}">
                <AIcon type="DeleteOutlined" />
            </PermissionButton>

        </template>
    </j-pro-table>
    <j-modal :mask-closable="false" :visible="visible" width="40vw" :title="modalTitle === 'edit' ? '编辑' : '新增'"
        @cancel="handleCancel" :destroyOnClose="true">

        <j-form ref="formRef" layout="vertical" :model="formData">
            <j-form-item name="propertyId" label="物模型" :rules="[
                { required: true, message: '请选择' },
            ]">
                <j-select placeholder="请选择" v-model:value="formData.propertyId" :options="propertyOptions">
                </j-select>
            </j-form-item>
            <j-form-item name="propertyAlias" label="别名" :rules="[
                { required: true, message: '请输入别名' },
                { max: 32, message: '最多可输入32个字符' },
                {
                    pattern: /^[0-9\u4e00-\u9fa5]{1,32}$/,
                    message: '别名只能由数字、汉字组成',
                }
            ]">
                <j-input :maxLength="32" show-count v-model:value="formData.propertyAlias" placeholder="请输入别名"></j-input>
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button @click="handleCancel">取消</j-button>
            <j-button type="primary" @click="formConfim">确认</j-button>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import {
    queryProperty, addProperty, editProperty, dltProperty, detail, sendDevice
} from '@/api/device/product';
import { onlyMessage } from '@/utils/comm';
import { useRoute } from 'vue-router';
const route = useRoute();
const tableRef = ref<Record<string, any>>({});
const formRef = ref<any>(null)
const _productId = route.params.id
const formData = ref({
    propertyId: null,
    propertyAlias: '',
})
const params = ref();
const modalTitle = ref('add')
const visible = ref(false)

const propertyOptions = ref([])
const editId = ref('')
// 获取物模型数据
const getProperty = () => {
    detail(_productId).then(res => {
        if (res.status === 200) {
            const propertyArr = JSON.parse(res.result?.metadata)?.properties
            propertyOptions.value = propertyArr.map(itm => {
                return {
                    label: itm.name,
                    value: itm.id
                }
            })
        }
    })
}
const handleAdd = () => {
    modalTitle.value = 'add'
    getProperty()
    visible.value = true
}
const handleSearch = () => {
    tableRef.value?.reload()
}
const handleSend = async () => {
    const res = await sendDevice(_productId)
    if (res.status === 200) {
        onlyMessage('下发成功')
    }
}
// 编辑
const handlEdit = (data: any) => {
    editId.value = data.id
    modalTitle.value = 'edit'
    formData.value.propertyId = data.propertyId
    formData.value.propertyAlias = data.propertyAlias
    visible.value = true
}
// 删除
const handlDelete = (data: any) => {
    dltProperty(data.id).then(res => {
        if (res.status === 200) {
            onlyMessage('删除成功')
            tableRef.value?.reload()
        }
    })
}
// modal
const handleCancel = () => {
    visible.value = false
    formData.value = {
        propertyId: null,
        propertyAlias: ''
    }
}
const handleOk = () => {
    visible.value = false
}
const formConfim = () => {
    formRef.value!.validate().then(res => {
        if (res) {
            if (modalTitle.value === 'edit') {
                res.id = editId.value
            } else {
                delete res.id
            }
            addProperty({ ...res, productId: _productId }).then(resp => {
                if (resp.status === 200) {
                    onlyMessage(modalTitle.value === 'edit' ? '编辑成功' : '新增成功')
                    formData.value = {
                        propertyId: null,
                        propertyAlias: ''
                    }
                    visible.value = false
                    tableRef.value?.reload()
                }
            })
        }
    })
}
const columns = [
    {
        title: '物模型',
        dataIndex: 'propertyId',
        key: 'propertyId',
        // scopedSlots: true,
        // width: 400,
        ellipsis: true,
    },
    {
        title: '别名',
        dataIndex: 'propertyAlias',
        key: 'propertyAlias',
        // scopedSlots: true,
        // width: 400,
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        // width: 60,
        scopedSlots: true,
    },
]

</script>
<style scoped lang="less">
.header-btns {
    display: flex;
    justify-content: right;

    .search-btn {
        margin: 0 12px
    }
}
</style>