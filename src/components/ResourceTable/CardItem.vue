<script setup>
import { resource } from '@/assets'
  const props = defineProps({
    record: Object,
    active: Boolean,
    showCharge: {
      type:Boolean,
      default: true
    }
  })

  const classNames = computed(() =>{
    return {
      'resource-table-item': true,
      'active': props.active
    }
  })

  const typeColor = {
      device: '#1677FF',
      collector: '#52C41A', // 数采
      protocol: '#FAAD14', // 协议
  }
</script>

<template>
  <div :class="classNames">
    <div class="item-center">
      <div class="table-item-img">
        <img :src="record.photoUrl?.url || resource.defaultImage" />
      </div>
      <div class="item-center-bottom">
        <div class="table-item-title fz-16">
          <j-ellipsis >
            {{ record.name }}
          </j-ellipsis>
        </div>
        <div class="table-item-tag">
          <a-space>
            <AIcon type="FireFilled" :style="{ color: typeColor[record.type?.value]}" />
            <span class="fc-600">
              {{ record.type?.text || '-' }}
            </span>
          </a-space>
        </div>
        <div class="table-item-desc fz-12">
          <j-ellipsis :lineClamp="2">
            {{ record.describe }}
          </j-ellipsis>
        </div>
      </div>
    </div>

    <div
      v-if="showCharge"
      class="table-item-version item-position-absolute"
      :class="{'charge': record.charge}"
    >
      {{ record.charge ?  '付费资源' : '限时免费' }}
    </div>
  </div>
</template>

<style scoped lang="less">
.resource-table-item {
  position: relative;
  width: 100%;
  transition: all .2s;
  border-radius: 8px;
  cursor: pointer;
  height: 348px;
  border: 2px solid transparent;
  color: @font-gray-900;
  background-color: #fff;
  border: 1px solid #EFF0F1;
  .item-center {
    padding: 12px;
  }

  &.active {
    border-color: @primary-color;
  }

  .item-position-absolute {
    position: absolute;
  }

  .table-item-title {
    font-weight: bold;
  }

  .item-center-bottom {
    padding: 0 4px;
    margin-top: 16px;
  }

  .table-item-tag {
    border-radius: 4px;
    background-color: @font-gray-50;
    display: inline-block;
    padding: 4px 8px;
    margin: 8px 0;
  }

  .p-12 {
    padding: 0 12px;
  }

  .table-item-img {
    background-color: @font-gray-50;
    height: 194px;
    width: 258px;
    border-radius: 4px;
    overflow: hidden;

    >img {
      height: 194px;
      width: 100%;
    }
  }

  .table-item-version {
    top: 12px;
    left: 12px;
    border-radius: 4px;
    padding: 4px 12px;
    background-color: #ffeded;
    color: #ff4d4f;

    .charge {
      background-color: #FBEBD1;
      color: #A6845F;
    }
  }
}
</style>
