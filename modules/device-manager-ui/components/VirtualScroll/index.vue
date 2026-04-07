<template>
  <div ref="virtualRef" class="virtual-scroll-wrapper" @scroll="onScroll">
    <!-- 占位div -->
    <div
        :style="{ height: listHeight + 'px' }"
        class="virtual-scroll-phantom"
    ></div>
    <div :style="{ transform: getTransform }" class="virtual-scroll-content">
      <Item
          v-for="(item, index) in dataSource"
          :key="'virtual-scroll' + index"
          @onSizeChange="sizeChangeHandle"
      >
        <template #item>
          <slot name="item" v-bind="item"></slot>
        </template>
      </Item>
    </div>
  </div>
</template>

<script setup name="VirtualScroll">
import {computed, nextTick, onMounted, reactive, ref} from "vue";
import Item from './Item.vue'

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
const position = reactive({
  start: 0,
  end: 10,
});
const itemSize = ref(100);
const startOffset = ref(0);
const screenHeight = ref(500);
const virtualRef = ref();

const listHeight = computed(() => {
  return props.data.length * itemSize.value;
});

const dataSource = computed(() => {
  return props.data.slice(
      position.start,
      Math.min(position.end, props.data.length)
  );
});

const getTransform = computed(() => {
  return `translate3d(0,${startOffset.value}px,0)`;
});

const visibleCount = computed(() => {
  return Math.ceil(screenHeight.value / itemSize.value) + 1;
});

const onScroll = () => {
  const scrollTop = virtualRef.value?.scrollTop || 0;
  position.start = Math.floor(scrollTop / itemSize.value)
  position.end = position.start + visibleCount.value
  startOffset.value = scrollTop - (scrollTop % itemSize.value)
};

const sizeChangeHandle = (domNode) => {
  const height = domNode.offsetHeight;
  itemSize.value = height || 100
}

onMounted(() => {
  position.end = position.start + visibleCount.value
})

nextTick(() => {
  if (!virtualRef.value) return
  screenHeight.value = virtualRef.value?.offsetHeight || 500
})
</script>

<style scoped>
.virtual-scroll-wrapper {
  height: 100%;
  overflow-y: auto;
  position: relative;
}

.virtual-scroll-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
}
</style>
