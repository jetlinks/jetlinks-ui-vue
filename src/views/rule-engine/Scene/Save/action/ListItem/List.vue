<template>
    <div class="action-list-content">
        <template v-for="(item, index) in actions" :key="item.key">
            <Item
                :parallel="parallel"
                :data="item"
                :branchesName="branchesName"
                :thenName="thenName"
                :name="index"
                :type="type"
                :isLast="index === actions.length - 1"
                :options="item.options"
                @delete="_delete(item.key || '')"
            />
        </template>
        <div class="actions-add-list" :class="{ 'border': props.actions.length }">
            <j-button type="primary" ghost style="width: 100%" @click="onAdd">
                <template #icon><AIcon type="PlusOutlined" /></template>
                添加执行动作
            </j-button>
        </div>
        <Modal
            v-if="visible"
            @cancel="onCancel"
            :parallel="parallel"
            :name="actions.length"
            :branchGroup="thenName"
            @save="onSave"
            :branchesName="branchesName"
        />
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { ActionsType, ParallelType } from '../../../typings';
import Modal from '../Modal/index.vue';
import Item from './Item.vue';
import { useSceneStore } from '@/store/scene';
import { storeToRefs } from 'pinia';

const sceneStore = useSceneStore();
const { data: _data } = storeToRefs(sceneStore);

interface ListProps {
    branchesName: number;
    type: ParallelType;
    actions: ActionsType[];
    parallel: boolean;
}

const props = defineProps({
    branchesName: {
      type: Number,
      default: 0
    },
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

const emit = defineEmits(['delete', 'add']);

const visible = ref<boolean>(false);

const thenName = computed(() => {
  return _data.value.branches![props.branchesName].then.findIndex(item => item.parallel === props.parallel)
})

const onAdd = () => {
    visible.value = true;
};

const onSave = (data: any, options?: any) => {
    const { type, ...extra } = data;
    const item: ActionsType = {
        ...extra,
        key: data.key,
        options: {
          ...options,
          columns: options.otherColumns?.filter((item?: string) => item) || []
        },
    };
    emit('add', item)
    visible.value = false
};

const onCancel = () => {
  visible.value = false
}

const _delete = (_key: string) => {
  emit('delete', _key)
}

const _update = () => {
  visible.value = false
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