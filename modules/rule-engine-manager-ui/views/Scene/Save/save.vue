<template>
  <a-modal
    open
    :title="title"
    :width="810"
    :confirm-loading="loading"
    :maskClosable="false"
    @cancel="emit('close')"
    @ok="handleOk"
  >
    <a-form
      layout="vertical"
      name="scene-save"
      ref="formRef"
      :model="formModel"
    >
      <a-form-item
        name="name"
        :label="$t('Save.save.811745-0')"
        :rules="[
          { required: true, message: $t('Save.save.811745-1') },
          { max: 64, message: $t('Save.save.811745-2') },
        ]"
      >
        <a-input v-model:value="formModel.name" :placeholder="$t('Save.save.811745-1')" />
      </a-form-item>
      <a-form-item
        :name="['trigger', 'type']"
        :label="$t('Save.save.811745-3')"
        :rules="[{ required: true, message: $t('Save.save.811745-4') }]"
      >
        <TriggerWay
          v-model:modelValue="formModel.trigger.type"
          :options="typeOptions"
          :disabled="disabled"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { SceneItem } from "../typings";
import TriggerWay from "./components/TriggerWay.vue";
import type { PropType } from "vue";
import type { FormInstance } from "ant-design-vue";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import { useI18n } from 'vue-i18n'
import { modify, save } from "../../../api/scene";

type Emit = {
  (e: "close"): void;
};

const { t: $t } = useI18n()
const menuStory = useMenuStore();
const loading = ref(false);
const formModel = reactive({
  name: "",
  trigger: {
    type: "device",
  },
});

const formRef = ref<FormInstance>();

const props = defineProps({
  data: {
    type: Object as PropType<Partial<SceneItem>>,
    default: () => ({}),
  },
  typeOptions: {
    type: Array,
    default: () => ([]),
  }
});

watchEffect(() => {
  Object.assign(formModel, props.data);
});

const emit = defineEmits<Emit>();

const title = computed(() => {
  return props.data?.id ? $t('Save.save.811745-5') : $t('Save.save.811745-6');
});

const disabled = computed(() => {
  return !!props.data?.id;
});

const handleOk = async () => {
  if (formRef.value) {
    const values = await formRef.value.validateFields();
    let modelObj = { ...values };
    if (props.data.id) {
      modelObj = {
        ...props.data,
        name: values.name,
      };
    }
    loading.value = true;
    const resp = props.data.id
      ? await modify(props.data.id, modelObj)
      : await save(modelObj);
    loading.value = false;
    if (resp.success) {
      emit("close");
      const _id = props.data?.id || (resp.result as any).id;
      menuStory.jumpPage("rule-engine/Scene/Save", {
        query: { triggerType: values.trigger.type, id: _id },
      });
    }
  }
};
</script>

<style scoped></style>
