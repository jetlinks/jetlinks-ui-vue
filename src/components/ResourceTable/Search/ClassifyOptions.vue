<script setup name="ClassifyOptions">
const props = defineProps({
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['change'])

const selectKeys = ref(new Set())

const onChange = (record) => {
  const has = selectKeys.value.has(record.id)

  if (!has) {
    selectKeys.value.add(record.id)
  } else {
    selectKeys.value.delete(record.id)
  }

  emit('change', [...selectKeys.value.values()], !has, record)
}
</script>

<template>
  <div class="children-items">
    <div class="children-item" v-for="item in options">
      <a-space>
        <span> {{ item.name }} </span>
        <span> > </span>
        <div class="grandson-items" v-if="item.children?.length">
          <div
            :class="{
              'grandson-item': true,
              'active': selectKeys.has(gItem.id)
            }"
            v-for="gItem in item.children" @click.stop="onChange(gItem)"
          >
            {{ gItem.name }}
          </div>
        </div>
      </a-space>
    </div>
  </div>
</template>

<style scoped lang="less">
.children-items {
  .grandson-items {
    display: flex;
    gap: 12px;

    .grandson-item {
      cursor: pointer;

      &.active {
        color: @primary-color;
      }
    }
  }
}
</style>
