<template>
    <ResizeObserver @resize="onResize">
        <div class="tag-box" ref="box">
            <div v-for="(item, i) in value" :key="item.id" ref="tags">
                <div v-if="i !== _index" class="tag">
                    {{ item?.name }}
                </div>
                <div
                    v-else
                    class="tag-ellipsis"
                    :style="
                        i === _index
                            ? (offWidth
                                ? {
                                      width: `${offWidth}px`,
                                  }
                                : {
                                      background: 'none',
                                      color: 'white',
                                  })
                            : {}
                    "
                >
                    {{ offWidth ? item?.name + (_index < value.length ? '...' : '') : '...' }}
                </div>
            </div>
        </div>
    </ResizeObserver>
</template>

<script lang="ts" setup>
import { default as ResizeObserver } from 'ant-design-vue/lib/vc-resize-observer';
const props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
});

const tags = ref<any>([]);
const box = ref<any>(null);
const _index = ref<number>(-1);
const offWidth = ref<number>(0);

const onResize = ({ width }: { width: number }) => {
    let total = 0;
    for (let i = 0; i < tags.value.length; i++) {
        const item = tags.value[i];
        total += item?.scrollWidth || 0;
        const val = item?.offsetWidth - (total - width);
        if (total >= width) {
            _index.value = i;
            offWidth.value = val > 40 ? val : 0;
            console.log(i, offWidth.value)
            break;
        }
    }
};
</script>

<style lang="less" scoped>
.tag-box {
    margin-top: 15px;
    display: flex;
    width: 100%;
    overflow: hidden;

    .tag {
        background-color: #f7f8fa;
        border-radius: 32px;
        margin-right: 8px;
        padding: 0 14px;
        color: #333333;
        white-space: nowrap;
    }
    .tag-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-color: #f7f8fa;
        border-radius: 32px;
        margin-right: 8px;
        padding: 0 14px;
        color: #333333;
        text-align: center;
    }
}
</style>