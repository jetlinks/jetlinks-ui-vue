<!-- 新增编辑弹窗 -->
<template>
    <a-modal
        :title="props.title"
        :maskClosable="false"
        destroy-on-close
        v-model:visible="visible"
        @ok="submitData"
        @cancel="close"
        okText="确定"
        cancelText="取消"
        v-bind="layout"
    >
        <a-form
            layout="vertical"
            v-model="formModel"
            :rules="rules"
            ref="formRef"
        >
            <a-form-item label="名称" name="name" v-bind="validateInfos.name">
                <a-input v-model:value="formModel.name" :maxlength="64" />
            </a-form-item>
            <a-form-item
                label="排序"
                name="sortIndex"
                v-bind="validateInfos.sortIndex"
            >
                <a-input-number
                    style="width: 100%"
                    id="inputNumber"
                    v-model:value="formModel.sortIndex"
                    :min="1"
                />
            </a-form-item>
            <a-form-item label="说明">
                <a-textarea
                    v-model:value="formModel.description"
                    show-count
                    :maxlength="200"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script setup lang="ts" name="modifyModal">
import { PropType } from 'vue';
import { Form } from 'ant-design-vue';
import { queryTree } from '@/api/device/category';
import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
import { list } from '@/api/iot-card/home';
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
        type: Boolean,
        default: false,
    },
});
interface formState {
    name: string;
    sortIndex: number;
    description: string;
}
const listData = ref([]);
/**
 * 表单数据
 */
const formModel = ref<formState>({
    name: '',
    sortIndex: 1,
    description: '',
});
const rules = ref({
    name: [{ required: true, message: '请输入名称' }],
    sortIndex: [{ required: true, message: '请输入排序' }],
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
    validate()
        .then(async () => {})
        .catch((error: ValidateErrorEntity<formState>) => {});
};
/**
 * 显示弹窗
 */
const show = (row: any) => {
    if (props.isAdd === 0) {
        //新增
        if (props.isChild) {
            //存在子类
            if (row.children && row.children.length > 0) {
                let childArr = [];
                childArr = row.children.sort(compare('sortIndex'));
                formModel.value = {
                    name: '',
                    sortIndex: childArr[childArr.length - 1].sortIndex + 1,
                    description: '',
                };
            } else {
                formModel.value = {
                    name: '',
                    sortIndex: 1,
                    description: '',
                };
            }
        } else {
            let arr = [];
            arr = listData.value.sort(compare('sortIndex'));
            if (arr.length > 0) {
                formModel.value = {
                    name: '',
                    sortIndex: arr[arr.length - 1].sortIndex + 1,
                    description: '',
                };
            } else {
                formModel.value = {
                    name: '',
                    sortIndex: 1,
                    description: '',
                };
            }
        }

        visible.value = true;
    } else if (props.isAdd === 2) {
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
 * 判断是新增还是编辑
 */
const judgeIsAdd = () => {};
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
            console.log(listData.value, 'listData.value');
        }
    };
/**
 * 关闭弹窗
 */
const close = () => {
    visible.value = false;
    resetFields();
};
getTableData();
//监听项目ID
watch([() => props.isAdd], () => {}, { immediate: false, deep: true });
defineExpose({
    show: show,
});
</script>
<style></style>
