<template>
  <!--    <a-input-->
  <!--        :placeholder="$t('Save.SelectDevices.386303-0')"-->
  <!--        v-model:value="checkAble"-->
  <!--        :disabled="true"-->
  <!--    >-->
  <!--        <template #addonAfter>-->
  <!--            <AIcon-->
  <!--                :class="data.view ? 'disabled' : ''"-->
  <!--                type="EditOutlined"-->
  <!--                @click="onVisible"-->
  <!--            />-->
  <!--        </template>-->
  <!--    </a-input>-->
  <a-button :type="selected ? 'link' : 'text'" @click="onVisible">
    <AIcon type="EditOutlined"/>
  </a-button>
  <Modal :data="modelValue" :productId="productId" :type="selectType" v-if="visible" @close="visible = false" @save="handleOk"/>
</template>
<script setup>
// import {useI18n} from 'vue-i18n';
import Modal from './Modal.vue';
import {Form} from "ant-design-vue";

// const {t: $t} = useI18n();
const emit = defineEmits(['update:modelValue', 'change']);
const formItemContext = Form.useInjectFormItemContext();

const props = defineProps({
  modelValue: {
    type: Object,
    default: undefined
  },
  data: {
    type: Object,
    default: () => ({}),
  },
  productId: {
    type: String,
    default: '',
  },
});

const selectType = ref('Self')
const visible = ref(false);
const selected = computed(() => {
  return props.modelValue
})
const handleOk = (dt, type) => {
  let terms = {}
  selectType.value = type
  if (type === 'Self') {
    terms = [
      {
        column: "id",
        termType: "in",
        value: dt
      }
    ]
  } else if (type === 'All') {
    terms = dt?.terms || []
  } else if (type === 'Org') {
    terms = [
      {
        column: "id$dim-assets",
        value: JSON.stringify({
          assetType: 'device',
          targets: [
            {
              type: 'org',
              id: dt,
            },
          ],
        })
      }
    ]
  }

  emit('update:modelValue', terms);
  emit('change', terms);
  formItemContext.onFieldChange()
  visible.value = false;
};

const onVisible = () => {
  !props.data.view && (visible.value = true);
};

</script>

<style lang="less" scoped>
.disabled {
  pointer-events: auto !important;
  cursor: not-allowed !important;
}
</style>
