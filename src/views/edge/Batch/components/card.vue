<template>
  <div class="batch-item" @click.stop="onClick">
    <div class="item-content">
      <div class="item-avatar">
        <img :width="40" :height="40" :src="record.photoUrl || getImage('/device-gateway.png')" />
      </div>
      <div class="item-body">
        <div class="item-body-title">
          <div class="body-title-render" style="width: calc(100% - 80px);">
            <Ellipsis >
              {{ record.name }}
            </Ellipsis>
          </div>
          <div class="body-title-status">
            <BadgeStatus
              :text="record.state?.text"
              :status="record.state?.value"
              :statusNames="{
                            online: 'processing',
                            offline: 'error',
                            notActive: 'warning',
                        }"
            />
          </div>
        </div>
        <div class="item-body-alt">
          <div class="body-alt-title">产品名称</div>
          <div class="body-alt-value">
            <Ellipsis>
              {{ record.productName }}
            </Ellipsis>
          </div>
        </div>
      </div>
      <div class="item-action">
        <a-checkbox :checked="active" />
      </div>
    </div>
  </div>
</template>

<script setup name="BatchCard">
import { getImage } from '@/utils/comm';

const props = defineProps({
  record: {
    type: Object,
    default: () => ({})
  },
  active: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const onClick = () => {
  emit('click', props.record)
}
</script>

<style scoped lang="less">
.batch-item {
  border: 1px solid @font-gray-200;
  border-radius: 6px;
  background-color: @font-gray-50;
  padding: 16px;
  width: 100%;
  cursor: pointer;

  .item-content {
    display: flex;
    gap: 16px;
    align-items: center;

    .item-avatar {
      width: 40px;
      height: 40px;
    }

    .item-body {
      flex: 1 1 0;

      .item-body-title {
        margin-bottom: 8px;
        display: flex;
        gap: 8px;

        .body-title-status {
          width: 44px;
        }
      }


      .item-body-alt {
        display: flex;

        .body-alt-title {
          color: @font-gray-500;
          width: 62px;
        }

        .body-alt-value {
          flex: 1 1 0;
          color: @font-gray-600;
        }
      }
    }

    .item-action {

    }
  }
}
</style>
