<!-- 新增编辑弹窗 -->
<template>
  <a-modal
    v-if="visible"
    :title="props.title"
    :maskClosable="false"
    destroy-on-close
    open
    @ok="submitData"
    @cancel="close"
    :confirmLoading="loading"
    :okText="$t('modifyModal.index.177674-0')"
    :cancelText="$t('modifyModal.index.177674-1')"
    v-bind="layout"
  >
    <a-form layout="vertical" ref="formRef" :rules="rules" :model="formModel">
      <a-form-item :label="$t('modifyModal.index.177674-2')" name="name">
        <a-input
          v-model:value="formModel.name"
          :placeholder="$t('modifyModal.index.177674-3')"
        />
      </a-form-item>
      <a-form-item :label="$t('modifyModal.index.177674-4')" name="sortIndex">
        <a-input-number
          style="width: 100%"
          id="inputNumber"
          v-model:value="formModel.sortIndex"
          :min="1"
          :max="9999"
          :precision="0"
          :placeholder="$t('modifyModal.index.177674-5')"
        />
      </a-form-item>
      <a-form-item :label="$t('modifyModal.index.177674-6')">
        <a-textarea
          v-model:value="formModel.description"
          show-count
          :maxlength="200"
          :placeholder="$t('modifyModal.index.177674-7')"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts" name="modifyModal">
import { PropType } from "vue";
import { Form } from "ant-design-vue";
import { queryTree, saveTree, updateTree } from "../../../../../api/category";
import { onlyMessage } from "@jetlinks-web-core/utils/comm";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const emits = defineEmits(["refresh"]);
const formRef = ref();
const useForm = Form.useForm;
const props = defineProps({
  formData: {
    type: Object as PropType<Record<string, any>>,
    default: () => {},
  },
  title: {
    type: String,
    default: "",
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
const loading = ref(false);
/**
 * 表单数据
 */
const formModel = ref<formState>({
  name: "",
  sortIndex: 1,
  description: "",
});
const rules = ref({
  name: [
    {
      required: true,
      message: $t("modifyModal.index.177674-3"),
    },
    {
      max: 64,
      message: $t("modifyModal.index.177674-8"),
    },
  ],
  sortIndex: [
    {
      required: true,
      message: $t("modifyModal.index.177674-5"),
    },
  ],
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
    loading.value = true;
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
      const res = await saveTree(addParams.value).finally(() => {
        loading.value = false;
      });
      if (res.status === 200) {
        onlyMessage($t("modifyModal.index.177674-10"));
        visible.value = false;
        emits("refresh");
      } else {
        onlyMessage($t("modifyModal.index.177674-11"), "error");
      }
    } else if (props.isAdd === 2) {
      const id = updateObj.value.id;
      const updateParams = {
        ...formModel.value,
        id: updateObj.value.id,
        key: updateObj.value.key,
        parentId: updateObj.value.parentId,
      };
      const res = await updateTree(id, updateParams).finally(() => {
        loading.value = false;
      });
      if (res.status === 200) {
        onlyMessage($t("modifyModal.index.177674-10"));
        visible.value = false;
        emits("refresh");
      } else {
        onlyMessage($t("modifyModal.index.177674-11"), "error");
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
      if (row._children && row._children.length > 0) {
        childArr.value = row._children.sort(compare("sortIndex"));
        formModel.value = {
          name: "",
          sortIndex:
            childArr.value[childArr.value.length - 1].sortIndex === 9999
              ? childArr.value[childArr.value.length - 1].sortIndex
              : childArr.value[childArr.value.length - 1].sortIndex + 1,
          description: "",
        };
        visible.value = true;
      }
    } else if (props.isChild === 3) {
      const res = await getTableData();
      arr.value = listData.value.sort(compare("sortIndex"));
      if (arr.value.length > 0) {
        formModel.value = {
          name: "",
          sortIndex:
            arr.value[arr.value.length - 1].sortIndex === 9999
              ? arr.value[arr.value.length - 1].sortIndex
              : arr.value[arr.value.length - 1].sortIndex + 1,
          description: "",
        };
      }
      visible.value = true;
    } else if (props.isChild === 2) {
      if (row.level === 5) {
        onlyMessage($t("modifyModal.index.177674-12"), "warning");
        visible.value = false;
      } else {
        addObj.value = row;
        formModel.value = {
          name: "",
          sortIndex: 1,
          description: "",
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
  console.log(formModel.value, 'formModel.value')
};

/**
 * 排序
 */
const compare = (property: any) => {
  return function (obj1: any, obj2: any) {
    const value1 = obj1[property];
    const value2 = obj2[property];
    return value1 - value2; // 升序
  };
};

/**
 * 获取列表数据
 */
const getTableData = async () => {
  const params = {
    paging: false,
    sorts: [
      { name: "sortIndex", order: "asc" },
      {
        name: "createTime",
        order: "desc",
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
