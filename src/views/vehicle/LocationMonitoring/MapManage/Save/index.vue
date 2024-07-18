<template>
    <j-modal
        title="报警速度"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @ok="submitData"
        @cancel="close"
        okText="确定"
        cancelText="取消"
        width="600px"
        :confirmLoading="loading"
    >
        <j-form layout="vertical" :model="form" :rules="rules" ref="formRef">
            <j-form-item label="名称" name="name">
                <j-input v-model:value="form.name" placeholder="请输入" />
            </j-form-item>
            <j-form-item label="地图数据源" name="mapDataSource">
                <j-radio-group
                    name="mapDataSource"
                    v-model:value="form.mapDataSource"
                    @change="mapChange"
                >
                    <j-radio value="0">高德地图</j-radio>
                    <j-radio value="1">第三方应用</j-radio>
                </j-radio-group>
            </j-form-item>
            <j-form-item label="第三方应用" name="mapType" v-if="isMap">
                <j-select
                    showSearch
                    v-model:value="form.mapType"
                    placeholder="请选择第三方应用"
                >
                    <j-select-option
                        v-for="item in mapTypeList"
                        :value="item.value"
                        :key="item.value"
                        :label="item.name"
                        >{{ item.name }}</j-select-option
                    >
                </j-select>
            </j-form-item>
            <j-form-item label="绑定组织" name="orgName">
                <j-tree-select
                    showSearch
                    v-model:value="form.orgName"
                    placeholder="请选择所属组织"
                    :tree-data="treeList"
                    @change="valueChange"
                    allow-clear
                    :fieldNames="{
                        label: 'name',
                        value: 'id',
                        children: 'children',
                    }"
                    :filterTreeNode="
                            (v:any, option:any) => filterSelectNode(v, option, 'name')
                        "
                >
                    <template> </template>
                </j-tree-select>
            </j-form-item>
            <j-form-item label="说明" name="describe">
                <j-input v-model:value="form.describe" placeholder="请输入" />
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { getDepartmentList } from '@/api/vehicle/vehicleManagement';
import { onlyMessage, filterSelectNode } from '@/utils/comm';

const visible = ref(false);
const loading = ref(false);
const formRef = ref();
const isMap = ref(false);
const treeList = ref<Record<string, any>[]>([]);

const form = ref<Partial<Record<string, any>>>({});

const reset = () => {
    form.value = {
        id: '',
        name: '',
        mapDataSource: '',
        mapType: '',
        orgId: '',
        orgName: '',
        describe: '',
    };
};

const rules = reactive({
    name: [
        { required: true, message: '请填写地图名称', trigger: 'blur' },
        { max: 32, message: '最多可输入64位字符', trigger: 'change' },
    ],
    mapDataSource: [
        { required: true, message: '请选择地图数据源', trigger: 'blur' },
        { max: 32, message: '最多可输入64位字符', trigger: 'change' },
    ],
    mapType: [
        { required: true, message: '请选择地图应用', trigger: 'blur' },
        { max: 32, message: '最多可输入64位字符', trigger: 'change' },
    ],
    orgName: [{ required: true, message: '请绑定组织', trigger: 'blur' }],
});

const mapTypeList = [
    {
        name: '百度地图',
        value: 'BaiduMaps',
    },
    {
        name: '谷歌地图',
        value: 'GoogleMaps',
    },
    {
        name: '腾讯地图',
        value: 'TencentMaps',
    },
];

/**
 * 显示弹窗
 */
const show = (data: any) => {
    visible.value = true;
    reset();
};

const mapChange = (e: any) => {
    if (e.target.value === '1') {
        isMap.value = true;
    } else {
        isMap.value = false;
        form.value.mapType = '';
    }
};

const valueChange = (value: string, label: string) => {
    form.value.orgName = label[0];
    form.value.orgId = value;
};

/**
 * 查询组织
 */
const queryOrgTree = async () => {
    getDepartmentList({ paging: false }).then((resp: any) => {
        if (resp.status === 200) {
            treeList.value = resp.result;
            treeList.value = dealOrgTree(treeList.value);
        }
    });
};

/**
 * 处理物模型分类key
 */
const dealOrgTree = (arr: any) => {
    return arr.map((element: any) => {
        element.key = element.id;
        if (element.children) {
            element.children = dealOrgTree(element.children);
        }
        return element;
    });
};

defineExpose({
    show: show,
});

const submitData = () => {
    loading.value = true;
    formRef.value.validate().then(async () => {
        console.log('form.value', form.value);
        onlyMessage('确定', 'warning');
    });

    setTimeout(() => {
        loading.value = false;
    }, 1000);
};

const close = () => {
    visible.value = false;
};

onMounted(() => {
    queryOrgTree();
});
</script>

<style scoped></style>
