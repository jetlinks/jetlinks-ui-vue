<template>
  <Tooltip ref="tooltipRef" placement="top" v-bind="props.tooltip">
    <template v-if="props.tooltip" #title>
      <slot></slot>
      <slot name="tooltip"></slot>
    </template>
    <span
      ref="triggerRef"
      v-bind="triggerAttrs()"
      @click="handleClickRef"
      @mouseenter="
                [
                    props.expandTrigger === 'click'
                        ? getTooltipDisabled()
                        : undefined,
                ]
            "
    >
            <slot></slot>
        </span>
  </Tooltip>
</template>

<script lang="ts" setup>
import { Tooltip, TooltipProps } from 'ant-design-vue';

import { computed, mergeProps, PropType, ref, useAttrs } from 'vue';

// define class name
const jEllipsis = 'j-ellipsis';
const jEllipsisCursorClass = 'j-ellipsis-cursor';
const jEllipsisLineClampClass = 'j-ellipsis-line-clamp';

const props = defineProps({
  /** expand by */
  expandTrigger: {
    type: String as PropType<'click'>,
    default: undefined,
  },
  /** multiline ellipsis */
  lineClamp: {
    type: [Number, String] as PropType<string | number>,
    default: 1,
  },
  /** a-tooltip props */
  tooltip: {
    type: [Boolean, Object] as PropType<TooltipProps | boolean>,
    default: true,
  },
});

const attrs = useAttrs();

function triggerAttrs() {
  return {
    ...mergeProps(attrs, {
      class: [
        jEllipsis,
        props.lineClamp !== undefined
          ? jEllipsisLineClampClass
          : undefined,
        props.expandTrigger === 'click'
          ? jEllipsisCursorClass
          : undefined,
      ],
      style: ellipsisStyleRef.value,
    }),
  };
}

const expandedRef = ref(false);
const tooltipRef = ref<HTMLElement | null>(null);
const triggerRef = ref<HTMLElement | null>(null);

const ellipsisStyleRef = computed(() => {
  const { lineClamp } = props;
  const { value: expanded } = expandedRef;
  if (lineClamp !== undefined) {
    return {
      textOverflow: '',
      '-webkit-line-clamp': expanded ? '' : lineClamp,
    };
  } else {
    return {
      textOverflow: expanded ? '' : 'ellipsis',
      '-webkit-line-clamp': '',
    };
  }
});

function syncCursorStyle(trigger: HTMLElement, tooltipDisabled: boolean): void {
  if (props.expandTrigger === 'click' && !tooltipDisabled) {
    syncTriggerClass(trigger, jEllipsisCursorClass, 'add');
  } else {
    syncTriggerClass(trigger, jEllipsisCursorClass, 'remove');
  }
}

function getTooltipDisabled(): boolean {
  let tooltipDisabled = false;
  const { value: expanded } = expandedRef;
  if (expanded) return true;
  const { value: trigger } = triggerRef;
  if (trigger) {
    syncEllipsisStyle(trigger);
    tooltipDisabled = trigger.scrollHeight <= trigger.offsetHeight;

    syncCursorStyle(trigger, tooltipDisabled);
  }
  return tooltipDisabled;
}

const handleClickRef = computed(() => {
  return props.expandTrigger === 'click'
    ? () => {
      const { value: expanded } = expandedRef;
      expandedRef.value = !expanded;
    }
    : undefined;
});

function syncEllipsisStyle(trigger: HTMLElement): void {
  if (!trigger) return;
  const latestStyle = ellipsisStyleRef.value;
  const lineClampClass = jEllipsisLineClampClass;
  if (props.lineClamp !== undefined) {
    syncTriggerClass(trigger, lineClampClass, 'add');
  } else {
    syncTriggerClass(trigger, lineClampClass, 'remove');
  }
  for (const key in latestStyle) {
    if ((trigger.style as any)[key] !== (latestStyle as any)[key]) {
      (trigger.style as any)[key] = (latestStyle as any)[key];
    }
  }
}

function syncTriggerClass(
  trigger: HTMLElement,
  styleClass: string,
  action: 'add' | 'remove',
): void {
  if (action === 'add') {
    if (!trigger.classList.contains(styleClass)) {
      trigger.classList.add(styleClass);
    }
  } else {
    if (trigger.classList.contains(styleClass)) {
      trigger.classList.remove(styleClass);
    }
  }
}
</script>
<style scoped lang='less'>
.j-ellipsis {
  overflow: hidden;
  vertical-align: bottom;
}

.j-ellipsis-cursor {
  cursor: pointer;
}

.j-ellipsis-line-clamp {
  display: -webkit-box;
  -webkit-box-orient: vertical;
}
</style>