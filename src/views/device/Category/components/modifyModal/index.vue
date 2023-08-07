<!-- 新增编辑弹窗 -->
<template>
    <j-modal
        v-if="visible"
        :title="props.title"
        :maskClosable="false"
        destroy-on-close
        visible
        @ok="submitData"
        @cancel="close"
        okText="确定"
        cancelText="取消"
        v-bind="layout"
    >
        <j-form
            layout="vertical"
            ref="formRef"
            :rules="rules"
            :model="formModel"
        >
            <j-form-item label="名称" name="name">
                <j-input
                    v-model:value="formModel.name"
                    placeholder="请输入名称"
                />
            </j-form-item>
            <j-form-item label="排序" name="sortIndex">
                <j-input-number
                    style="width: 100%"
                    id="inputNumber"
                    v-model:value="formModel.sortIndex"
                    :min="1"
                    :max="9999"
                    placeholder="请输入排序"
                />
            </j-form-item>
            <j-form-item label="说明">
                <j-textarea
                    v-model:value="formModel.description"
                    show-count
                    :maxlength="200"
                    placeholder="请输入说明"
                />
            </j-form-item>
        </j-form>
    </j-modal>
</template>
<script setup lang="ts" name="modifyModal">
import { PropType } from 'vue';
import { Form } from 'jetlinks-ui-components';
import { queryTree, saveTree, updateTree } from '@/api/device/category';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { list } from '@/api/iot-card/home';
import { number } from 'echarts';
import { onlyMessage } from '@/utils/comm';

const emits = defineEmits(['refresh']);
const formRef = ref();
const useForm = Form.useForm;
const props = defineProps({
    formData: {
        type: Object as PropType<Record<string, any>>,
        default: () => {},
    },
    title: {
        type: String,
        defult: '',
    },
    isAdd: {
        type: Number,
        default: 0,
    },
    isChild: {
        type: Number,
        default: 0,
    },
});
interface formState {
    name: string;
    sortIndex: number;
    description: string;
}
const listData = ref([]);
const childArr = ref([]);
const arr = ref([]);
const updateObj = ref({});
const addObj = ref({});
const addParams = ref({});
/**
 * 表单数据
 */
const formModel = ref<formState>({
    name: '',
    sortIndex: 1,
    description: '',
});
const rules = ref({
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        {
            max: 64,
            message: '最多可输入64个字符',
        },
    ],
    sortIndex: [{ required: true, message: '请输入排序', trigger: 'blur' },{
        pattern:/^\d+$/,
        message:'请输入正整数',
        trigger:'change'
    }],
});
const visible = ref(false);
const { resetFields, validate, validateInfos } = useForm(
    formModel.value,
    rules.value,
);
/**
 * 提交数据
 */
const submitData = async () => {
    formRef.value.validate().then(async () => {
        addParams.value = {};
        if (props.isAdd === 0) {
            if (props.isChild === 1) {
                addParams.value = {
                    ...formModel.value,
                    // sortIndex:
                    //     childArr.value[childArr.value.length - 1].sortIndex + 1,
                    parentId: addObj.value.id,
                };
            } else if (props.isChild === 2) {
                addParams.value = {
                    parentId: addObj.value.id,
                    ...formModel.value,
                    // sortIndex: 1,
                };
            } else if (props.isChild === 3) {
                addParams.value = {
                    ...formModel.value,
                    // sortIndex: arr.value[arr.value.length - 1].sortIndex + 1,
                };
            }
            const res = await saveTree(addParams.value);
            if (res.status === 200) {
                onlyMessage('操作成功！');
                visible.value = false;
                emits('refresh');
            } else {
                onlyMessage('操作失败！', 'error');
            }
        } else if (props.isAdd === 2) {
            const id = updateObj.value.id;
            const updateParams = {
                ...formModel.value,
                id: updateObj.value.id,
                key: updateObj.value.key,
                parentId: updateObj.value.parentId,
            };
            const res = await updateTree(id, updateParams);
            if (res.status === 200) {
                onlyMessage('操作成功！');
                visible.value = false;
                emits('refresh');
            } else {
                onlyMessage('操作失败！', 'error');
            }
        }
    });
};
/**
 * 显示弹窗
 */
const show = async (row: any) => {
    //新增
    if (props.isAdd === 0) {
        if (props.isChild === 1) {
            addObj.value = row;
            if (row.children && row.children.length > 0) {
                childArr.value = row.children.sort(compare('sortIndex'));
                formModel.value = {
                    name: '',
                    sortIndex:childArr.value[childArr.value.length - 1].sortIndex === 9999 ? childArr.value[childArr.value.length - 1].sortIndex :
                        childArr.value[childArr.value.length - 1].sortIndex + 1,
                    description: '',
                };
                visible.value = true;
            }
        } else if (props.isChild === 3) {
            const res = await getTableData();
            arr.value = listData.value.sort(compare('sortIndex'));
            if (arr.value.length > 0) {
                formModel.value = {
                    name: '',
                    sortIndex: arr.value[arr.value.length - 1].sortIndex === 9999 ? arr.value[arr.value.length - 1].sortIndex : arr.value[arr.value.length - 1].sortIndex + 1,
                    description: '',
                };
            }
            visible.value = true;
        } else if (props.isChild === 2) {
            if (row.level === 5) {
                onlyMessage('树形结构最多添加5层', 'warning');
                visible.value = false;
            } else {
                addObj.value = row;
                formModel.value = {
                    name: '',
                    sortIndex: 1,
                    description: '',
                };
                visible.value = true;
            }
        }
    } else if (props.isAdd === 2) {
        updateObj.value = row;
        // 编辑
        formModel.value = {
            name: row.name,
            sortIndex: row.sortIndex,
            description: row.description,
        };
        visible.value = true;
    }
};

/**
 * 排序
 */
const compare = (property: any) => {
        return function (obj1: any, obj2: any) {
            var value1 = obj1[property];
            var value2 = obj2[property];
            return value1 - value2; // 升序
        };
    },
    /**
     * 获取列表数据
     */
    getTableData = async () => {
        const params = {
            paging: false,
            sorts: [
                { name: 'sortIndex', order: 'asc' },
                {
                    name: 'createTime',
                    order: 'desc',
                },
            ],
        };
        const res = await queryTree(params);
        if (res.status === 200) {
            listData.value = res.result;
        }
    };
/**
 * 关闭弹窗
 */
const close = () => {
    visible.value = false;
    resetFields();
};
//监听项目ID
watch([() => props.isAdd], () => {}, { immediate: false, deep: true });
defineExpose({
    show: show,
});
</script>
<style></style>
