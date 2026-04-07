<template>
  <div class="tab-select">
    <div
        class="tab-select-item"
        v-for="item in options"
        :key="item.value"
        :style="{
          'grid-template-columns': `repeat(${options.length}, 1fr)`
        }"
        :class="activeKey === item.value ? 'active' : ''"
        @click="onClick(item.value)"
    >
      <div>
        <img :src="item.img" />
      </div>
      <div>
        <div>{{item.label}}</div>
        <div>{{ item.desc}}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  activeKey: {
    type: String,
    default: undefined,
  },
})

const emits = defineEmits(['change', 'update:activeKey'])

const onClick = (key) => {
  emits('update:activeKey', key)
  emits('change', key)
}
</script>

<style lang="less" scoped>
.tab-select {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.tab-select-item {
  display: flex;
  align-items: center;
  gap: 16px;
  background: #F8F9FA;
  border-radius: 6px;
  padding: 12px 24px;
  cursor: pointer;

  &.active {
    border: 1px solid #1677FF;
  }
}
</style>
