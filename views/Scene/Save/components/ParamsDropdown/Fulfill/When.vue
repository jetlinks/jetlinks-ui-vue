<script setup name="When">
import DropdownButton from "../../DropdownButton";
import {useMouseEvent,} from "./hooks";
import {useI18n} from "vue-i18n";
import TermsItem from './Terms.vue'
import {
  defaultTermsValue
} from "./util";
import {isArray, isNil} from "lodash-es";

const props = defineProps({
  isLast: {
    type: Boolean,
    default: true,
  },
  isFirst: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Object,
    default: () => ({
      column: undefined,
      termType: 'eq',
      value: undefined,
      type: 'and'
    }),
  },
  whenIndex: {
    type: Number,
    default: 0
  },
  termsName: {
    type: Number,
    default: 0
  },
  showDeleteBtn: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['update:data', 'add', 'delete'])
const {show, mouseover, mouseout} = useMouseEvent(toRefs(props).showDeleteBtn)
const { t: $t} = useI18n()
const termsData = computed(() => props.data.terms)

const rules = [
  {
    validator: async (_, v) => {
      if (v !== undefined && !v.error) {
        if (!Object.keys(v).length) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-0')));
        }
        if (!v.column) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-1')));
        }
        if (!v.termType) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-2')));
        }
        if (isNil(v.value?.value)) {
          if (v.value?.filter?.length) {
            return Promise.resolve();
          }
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-3')));
        }
        if (
          isArray(v.value.value) &&
          v.value.value.some((_v) => _v === undefined)
        ) {
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-3')));
        }
      } else {
        if (v?.error) { // 数据发生变化
          return Promise.reject(new Error($t('Terms.TermsItem.9093428-0')))
        }
        return Promise.reject(new Error($t('Terms.TermsItem.9093428-1')));
      }
      return Promise.resolve();
    },
  }
]

const paramsValue = reactive({
  type: props.data.type || 'and'
})

const typeSelect = () => {
  props.data.type = paramsValue.type
}

const addWhen = () => {
  emit('add')
}

const onDelete = () => {
  emit('delete')
}

const termsItemAdd = () => {
  props.data.terms.push(defaultTermsValue())
  emit('update:data', toRaw(props.data))
}

const termsItemDelete = (index) => {
  props.data.terms.splice(index, 1)
  emit('update:data', toRaw(props.data))
}

</script>

<template>
  <div class="terms-params">
    <div class="terms-params-warp">
      <div v-if="!isFirst" class="term-type-warp">
      <DropdownButton
        :options="[
          { label: $t('Terms.ParamsItem.9093430-0'), value: 'and' },
          { label: $t('Terms.ParamsItem.9093430-1'), value: 'or' },
        ]"
        type="type"
        v-model:value="paramsValue.type"
        @select="typeSelect"
      />
      </div>
      <div
        class="terms-params-content"
        @mouseover="mouseover"
        @mouseout="mouseout"
      >
        <ConfirmModal
          :title="$t('Terms.WhenItem.9093425-2')"
          :onConfirm="onDelete"
          :show="show"
          className="terms-params-delete"
        >
          <AIcon type="CloseOutlined" />
        </ConfirmModal>
        <a-form-item
          v-for="(item, index) in termsData"
          :name="[whenIndex, 'terms', index]"
          :rules="rules"
          >
          <TermsItem
            :key="item.key"
            :value="item"
            :isFirst="index === 0"
            :isLast="termsData.length - 1 === index"
            :whenIndex="whenIndex"
            :index="index"
            :showDeleteBtn="termsData.length !== 1"
            @add="termsItemAdd"
            @delete="() => termsItemDelete(index)"
          />
        </a-form-item>
      </div>
      <div class="terms-group-add" @click="addWhen" v-if="isLast">
        <div class="terms-content">
          <AIcon type="PlusOutlined" />
          <span>{{ $t('Terms.WhenItem.9093425-3') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">

</style>
