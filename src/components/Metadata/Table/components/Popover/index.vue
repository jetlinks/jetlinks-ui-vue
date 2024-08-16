<template>
  <a-popover
    trigger="click"
    :visible="visible"
    :overlay-class-name="{
      [warpClassNames]: true,
      'metadata-table-popover-warp': true
    }"
    :overlayStyle="{
      'zIndex': 1070
    }"
    :getPopupContainer="(node) => tableWrapperRef || node"
    @visibleChange="null"
  >
    <template #content>
      <div v-if="visible">
        <div :style="bodyStyle">
          <slot name="content"/>
        </div>
        <div class="footer">
          <a-space>
            <a-button v-if="showCancel" size="small" @click="cancel">{{ $t('Popover.index.4348677-0') }}</a-button>
            <a-button v-if="showOk" type="primary" size="small" @click="submit" :loading="confirmLoading">{{ $t('Popover.index.4348677-1') }}</a-button>
          </a-space>
        </div>
      </div>
    </template>
    <span @click="() => visibleChange(true)">
      <slot />
    </span>
  </a-popover>
</template>

<script setup name="MetadataPopover">
import { useMask } from '../utils'
import {useTableWrapper, useTableFullScreen} from "@/components/Metadata/Table/context";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  placement: {
    type: String,
    default: 'top'
  },
  confirmLoading: {
    type: Boolean,
    default: false
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showOk: {
    type: Boolean,
    default: true
  },
  bodyStyle: {
    type: [String, Object],
    default: undefined
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['ok', 'cancel', 'update:visible'])

const tableWrapperRef = useTableWrapper()
const fullScreen = useTableFullScreen()

const { warpClassNames, visibleChange, visible } = useMask(props.visible, {
  visibleChange(v) {
    emit('update:visible', v)
  }
})

const cancel = () => {
  emit('cancel')
  visibleChange(false)
}

const submit = async () => {
  emit('ok')
}

watch(() => props.visible, (newValue) => {
  visibleChange(newValue)
})

watch(() => fullScreen.value, (val) => {
  if (!val) {
    cancel()
  }
})

</script>

<style scoped lang="less">
.footer {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 8px;
}
</style>

<style lang="less">
.metadata-table-popover-warp {
  .ant-popover-arrow {
    display: none;
  }
}
</style>
