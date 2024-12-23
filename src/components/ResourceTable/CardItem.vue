<script setup>


  const props = defineProps({
    record: Object,
    active: Boolean
  })

  const classNames = computed(() =>{
    return {
      'resource-table-item': true,
      'active': props.active
    }
  })
</script>

<template>
  <div :class="classNames">
    <div class="item-center">
      <div class="table-item-img">
        <img :src="record.photoUrl?.url" />
      </div>
      <div class="table-item-title p-12">
        <j-ellipsis >
          {{ record.name }}
        </j-ellipsis>
      </div>
      <div class="table-item-desc p-12">
        <j-ellipsis :lineClamp="2">
          {{ record.describe }}
        </j-ellipsis>
      </div>
    </div>
    <div class="table-item-tag item-position-absolute">
      {{ record.type?.text || '-' }}
    </div>
    <div class="table-item-version item-position-absolute">
      {{ record.charge === false ? '限时免费' : '付费资源' }}
    </div>
  </div>
</template>

<style scoped lang="less">
.resource-table-item {
  position: relative;
  width: 100%;
  transition: all .2s;
  border-radius: 12px;
  cursor: pointer;
  height: 320px;
  border: 2px solid transparent;

  &.active {
    border-color: @primary-color;
  }

  &:hover {
    box-shadow: 0 1px 16px rgba(0,0,0,.2);
  }

  .item-position-absolute {
    position: absolute;
  }

  .table-item-title {
    font-weight: bold;
  }

  .table-item-tag {
    top: 0;
    left: 12px;
    padding: 4px;
    background-color: @primary-color;
    color: #fff;
  }

  .p-12 {
    padding: 0 12px;
  }

  .table-item-img {
    background-color: #fff;
    height: 240px;
    padding: 12px;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;

    >img {
      height: 216px;
      width: 100%;
    }
  }

  .table-item-version {
    top: 0;
    right: 12px;
    padding: 2px 12px;
    text-align: center;
    border-radius: 20px;
    background-color: @primary-color;
    color: #fff;
  }
}
</style>
