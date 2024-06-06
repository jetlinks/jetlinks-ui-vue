<template>
  <PopoverModal
    v-model:visible="visible"
    :placement="placement"
    @ok="onOk"
    @cancel="onCancel"
  >
    <template #content>
      <div style="width: 450px">
        <a-form ref="formRef" layout="vertical" :model="formData">
          <a-form-item label="元素类型" required name="type" :rules="rules" :validate-first="true">
            <TypeSelect v-model:value="formData.type" />
          </a-form-item>
          <ScaleItem v-if="showDouble" v-model:value="formData.scale" />
          <StringItem v-else-if="showString" v-model:value="formData.maxLength" />
          <BooleanItem v-else-if="showBoolean" v-model:value="formData.boolean" name="boolean"/>
          <DateItem v-else-if="showDate" v-model:value="formData.format"/>
          <EnumItem ref="enumTableRef" v-else-if="showEnum" v-model:value="formData.enum.elements"/>
          <a-form-item v-else-if="showArray" label="子元素类型" required :name="['elementType','type']" :rules="[{ required: true, message: '请选择子元素类型'}]">
            <TypeSelect  v-model:value="formData.elementType.type" :filter="['array']" />
          </a-form-item>
        </a-form>
      </div>
    </template>
    <slot>
      <a-button type="link" :disabled="disabled" style="padding: 0">
        <template #icon>
          <AIcon type="EditOutlined"/>
        </template>
      </a-button>
    </slot>
  </PopoverModal>
</template>

<script setup name="MetadataArray">
import { PopoverModal, TypeSelect } from '../index'
import ScaleItem from '../Double/ScaleItem.vue'
import StringItem from '../String/Item.vue'
import BooleanItem from '../Boolean/Item.vue'
import DateItem from '../Date/Item.vue'
import EnumItem from '../Enum/Item.vue'
import { pick } from 'lodash-es'

const emit = defineEmits(['update:value', 'cancel', 'confirm']);

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  unitOptions: {
    type: [Array, Function],
    default: () => []
  },
  placement: {
    type: String,
    default: 'top',
  },
  disabled: {
    type: Boolean,
    default:false
  }
});

const formRef = ref()
const enumTableRef = ref()
const visible = ref(false)
const formData = reactive({
  type: props.value?.type,
  scale: props.value?.scale,
  maxLength: props.value?.maxLength,
  boolean: {
    trueText: props.value?.trueText || '是',
    trueValue: props.value?.trueValue || 'true',
    falseText: props.value?.falseText || '否',
    falseValue: props.value?.falseValue || 'false',
  },
  format: props.value?.format,
  enum: {
    multiple: props.value?.multiple,
    elements: props.value?.elements || [],
  },
  elementType: {
    type: undefined
  }
});

const showDouble = computed(() => {
  return ['float', 'double'].includes(formData.type)
})

const showString = computed(() => {
  return ['string', 'password'].includes(formData.type)
})

const showBoolean = computed(() => {
  return formData.type === 'boolean'
})

const showDate = computed(() => {
  return formData.type === 'date'
})

const showEnum = computed(() => {
  return formData.type === 'enum'
})

const showArray = computed(() => {
  return formData.type === 'array'
})

const rules = [
  {
    validator(_, value) {
      if (!value) {
        return Promise.reject('请选择元素类型');
      }
      return Promise.resolve();
    },
    trigger: 'change',
  },
];

const typeChange = (e) => {
  if (['float', 'double'].includes(e)) {
    formData.scale = 2;
  }
};

const initValue = () => {
  formData.type = props.value?.type;
  formData.scale = props.value?.scale;
  formData.maxLength = props.value?.maxLength;
  formData.boolean = {
    trueText: props.value?.trueText || '是',
    trueValue: props.value?.trueValue || 'true',
    falseText: props.value?.falseText || '否',
    falseValue: props.value?.falseValue || 'false',
  };
  formData.format = props.value?.format;
  formData.enum = {
    multiple: props.value?.multiple,
    elements: props.value?.elements,
  };
  formData.elementType = {
    type: undefined
  }
};

const handleValue = (type, data) => {
  let newObject = {};
  switch (type) {
    case 'float':
    case 'double':
      newObject = pick(data, 'scale');
      break;
    case 'boolean':
      newObject = { ...data.boolean };
      break;
    case 'enum':
      newObject.elements = data.enum.elements;
      break;
    case 'string':
    case 'password':
      newObject = pick(data, 'maxLength');
      break;
    case 'date':
      newObject = pick(data, 'format');
      break;
    case 'array':
      newObject = pick(data, 'elementType')
  }

  return {
    type: type,
    ...newObject,
  };
};

const onOk = async () => {
  const data = await formRef.value.validate()
  let enumTable = true
  if (enumTableRef.value) {
    enumTable = !!(await enumTableRef.value.validate())
  }
  if (data && enumTable) {

    visible.value = false
    const _value = handleValue(formData.type, formData)
    emit('update:value', _value);
    emit('confirm', _value);
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  initValue();
  emit('cancel');
}

watch(() => JSON.stringify(props.value), () => {
  initValue()
})

</script>

<style scoped>

</style>
