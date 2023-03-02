<template>
    <div class="action-list-content">
        <div class="actions-add-list" :class="{'border': props.actions.length}">
            <j-button type="primary" ghost style="width: 100%" @click="onAdd">
                <template #icon><AIcon type="PlusOutlined" /></template>
                添加执行动作
            </j-button>
        </div>
        <Modal v-if="visible" @cancel="visible = false" />
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { ActionsType, ParallelType } from '../../../typings';
import Modal from '../Modal/index.vue'

interface ListProps {
    branchesName: number;
    type: ParallelType;
    actions: ActionsType[];
    parallel: boolean;
}

const props = defineProps({
    branchesName: Number,
    type: {
        type: String as PropType<ListProps['type']>,
        default: 'serial',
    },
    actions: {
        type: Array as PropType<ListProps['actions']>,
        default: () => [],
    },
    parallel: Boolean,
});

const visible = ref<boolean>(false)

const onAdd = () => {
    visible.value = true
}

</script>

<style lang="less" scoped>
.action-list-content {
  padding: 8px;

  .actions-list_form {
    .action-list-add {
      display: flex;
      justify-content: flex-end;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid @primary-color;
    }
  }

  .filter-add-button {
    width: 100%;
    color: rgba(0, 0, 0, 0.3);
    text-align: center;
    cursor: pointer;
  }

  .actions-add-list {
    &.border {
      padding-top: 16px;
      border-top: 1px solid @primary-color;
    }
  }
}
</style>