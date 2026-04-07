<template>
  <div class="actions-item-warp">
    <a-form-item
      :name="['branches', branchesName, 'then', thenName, 'actions', name]"
      :rules="rules"
    >
      <div class="actions-item">
        <CheckItem v-bind="props" ref="checkItemRef">
          <div class="item-options-warp">
            <div class="item-options-type" @click="onAdd">
              <AIcon
                :type="
                  iconMap.get(
                    data?.executor === 'alarm' ? data.alarm.mode : data.executor
                  )
                "
              />
            </div>
            <div class="item-options-content" v-if="data?.executor" @click="onType(data?.executor)">
              <template v-if="data.executor === 'delay'">
                {{ options?.name }}
              </template>
              <template v-else>
                <component :is="ComponentsMap[data.executor]" :data="data" :options="options" @visibleChange="(e) => triggerVisible = e"  />
              </template>
            </div>
            <a-button v-else @click="onAdd">{{ $t('ListItem.Item.637563-17') }}</a-button>
          </div>
          <div class="item-number">{{ name + 1 }}</div>
          <ConfirmModal
            :title="$t('ListItem.Item.637563-18')"
            :onConfirm="onDelete"
            className="actions-item-delete"
          >
            <AIcon type="DeleteOutlined" />
          </ConfirmModal>
        </CheckItem>
      </div>
    </a-form-item>
    <template v-if="!isLast && type === 'serial'">
      <div
        :class="[
          'actions-item-filter-warp',
          termsOptions.length ? 'filter-border' : '',
        ]"
      >
        <template v-if="termsOptions.length">
          <div class="actions-item-filter-warp-tip">
            {{ $t('ListItem.Item.637563-19') }}
          </div>
          <div class="actions-item-filter-overflow">
            <FilterGroup
              v-for="(item, index) in termsOptions"
              :key="item.key"
              :branchName="branchesName"
              :thenName="thenName"
              :actionName="name"
              :name="index"
              :isLast="index === termsOptions.length - 1"
              :isFirst="index === 0"
            />
          </div>
        </template>
        <div v-else class="filter-add-button" @click="addFilterParams">
          <AIcon type="PlusOutlined" style="padding-right: 4px" />
          <span>{{ $t('ListItem.Item.637563-20') }}</span>
        </div>
      </div>
    </template>

    <template v-if="visible">
      <EditModal
        :name="name"
        :branchGroup="thenName"
        :thenName="thenName"
        :branchesName="branchesName"
        :data="data"
        :options="
          _data.branches[branchesName].then[thenName].actions[name].options
        "
        @cancel="onClose"
        @save="onSave"
      />
    </template>
    <!-- 编辑 -->
    <ActionTypeComponent
      v-bind="props"
      v-if="!!actionType"
      :name="name"
      :branchGroup="thenName"
      :branchesName="branchesName"
      :thenName="thenName"
      :actionType="actionType"
      :options="
          _data.branches[branchesName].then[thenName].actions[name].options
        "
      @save="onPropsOk"
      @cancel="onPropsCancel"
    />
    <TriggerAlarm
      :id="_data.id"
      :branchId="_data.branches[branchesName].branchId"
      :actionId="
        _data.branches[branchesName].then[thenName].actions[name].actionId
      "
      :targetType="_data.triggerType"
      v-if="triggerVisible"
      @close="triggerVisible = false"
    />
  </div>
</template>

<script lang="ts" setup name="ActionItem">
import { PropType } from "vue";
import { ActionsType, ParallelType } from "../../../typings";
import EditModal from "../Modal/index.vue";
import ActionTypeComponent from "../Modal/ActionTypeComponent.vue";
import TriggerAlarm from "../TriggerAlarm/index.vue";
import { useSceneStore } from "@rule-engine-manager-ui/store/scene";
import { storeToRefs } from "pinia";
import { iconMap} from "./util";
import FilterGroup from "./FilterGroup.vue";
import { randomString } from "@jetlinks-web/utils";
import { EventEmitter, EventEmitterKeys, EventSubscribeKeys } from "../../util";
import CheckItem from "./CheckItem.vue";
import { useI18n } from 'vue-i18n'
import ComponentsMap from './detail'

const { t: $t } = useI18n()
const sceneStore = useSceneStore();
const { data: _data } = storeToRefs(sceneStore);

const props = defineProps({
  branchesName: {
    type: Number,
    default: 0,
  },
  thenName: {
    type: Number,
    default: 0,
  },
  name: {
    type: Number,
    default: 0,
  },
  branchesGroup: {
    type: Number,
    default: 0
  },
  data: {
    type: Object as PropType<ActionsType>,
  },
  type: {
    type: String,
  },
  parallel: {
    type: Boolean,
  },
  options: {
    type: Object,
  },
  isLast: {
    type: Boolean,
  },
});

const emit = defineEmits(["delete", "update"]);
const checkItemRef = ref();
const visible = ref<boolean>(false);
const triggerVisible = ref<boolean>(false);
const actionType = ref("");
const eventEmitterKey = ref(
  EventEmitterKeys({
    branch: props.branchesName,
    branchGroup: props.thenName,
    action: props.name,
  })
);

const triggerData = reactive({
  visible: false,
  actionId: undefined,
});

const termsOptions = computed(() => {
  if (!props.parallel) {
    // 串行
    return (
      _data.value.branches![props.branchesName].then?.[props.thenName]
        .actions?.[props.name].terms || []
    );
  }
  return [];
});

const onDelete = () => {
  const key =
    _data.value.branches![props.branchesName].then[props.thenName].actions[
      props.name
    ].key;
  EventEmitter.emit(key!, { isDelete: true }); // 发布消息
  if (props.name !== 0 && !props.parallel) {
    // 清空上一个串行执行动作中的options.termsColumns和terms
    _data.value.branches![props.branchesName].then[props.thenName].actions[
      props.name - 1
    ].options!.termsColumns = [];
    _data.value.branches![props.branchesName].then[props.thenName].actions[
      props.name - 1
    ].options!.terms = [];
    _data.value.branches![props.branchesName].then[props.thenName].actions[
      props.name - 1
    ].terms = [];
  }

  emit("delete");
};

const onClose = () => {
  visible.value = false;
};

/**
 * 添加过滤条件
 */
const addFilterParams = () => {
  const item: any = {
    type: "and",
    key: randomString(),
    terms: [
      {
        column: undefined,
        value: {
          type: "fixed",
          value: undefined,
        },
        termType: undefined,
        type: "and",
        key: randomString(),
      },
    ],
  };
  if (
    _data.value.branches![props.branchesName].then[props.thenName].actions[
      props.name
    ].terms
  ) {
    _data.value.branches![props.branchesName].then[props.thenName].actions[
      props.name
    ].terms!.push(item);
  } else {
    _data.value.branches![props.branchesName].then[props.thenName].actions[
      props.name
    ].terms = [item];
  }
  _data.value.branches![props.branchesName].then[props.thenName].actions[
    props.name
  ].options!.terms = [
    {
      terms: [["", "eq", "", "and"]],
      termType: $t('ListItem.Item.637563-21'),
    },
  ];
};

const onAdd = () => {
  visible.value = true;
};

const onType = (_type: string) => {

  actionType.value = _type;
};

/**
 * 添加执行动作
 * @param data
 * @param options
 */
const onSave = (data: ActionsType, options: any) => {
  const { key, actionId, terms } =
    _data.value.branches![props.branchesName].then?.[props.thenName].actions?.[
      props.name
    ];

  const columns = new Set([
    ...(props.options?.termsColumns || []),
    ...(options?.otherColumns?.filter?.((item?: string) => item) || []),
  ]);

  const actionItem: ActionsType = {
    ...data,
    options: {
      ...props.options,
      ...options,
      columns: [...columns.values()],
    },
    key,
    actionId,
    terms,
  };

  _data.value.branches![props.branchesName].then[props.thenName].actions.splice(
    props.name,
    1,
    actionItem
  );
  checkItemRef.value?.formTouchOff?.();
  visible.value = false;
  console.log('key', key)
  EventEmitter.emit(key!, data); // 发布消息
  const onKeys =  EventSubscribeKeys({
    branch: props.branchesName,
    branchGroup: props.thenName,
    action: props.name,
  })
  EventEmitter.emit(onKeys, data);
};

/**
 * 直接编辑执行栋数据
 * @param data
 * @param options
 */
const onPropsOk = (data: ActionsType, options?: any) => {
  onSave(data, options);
  actionType.value = "";
};

const onPropsCancel = () => {
  actionType.value = "";
};

const rules = [
  {
    validator(_: any, v?: ActionsType) {
      if (v?.executor === "device") {
        const _device = v.device!;
        if (
          (_device?.selector === "fixed" &&
            (!_device?.productId || !_device?.selectorValues?.length)) ||
          (_device?.selector === "context" && !_device?.upperKey) ||
          (_device?.selector === "relation" &&
            !_device?.selectorValues?.length) ||
          _device?.changeData === true
        ) {
          return Promise.reject(new Error($t('ListItem.Item.637563-22')));
        }
      } else if (v?.executor === "notify") {
        const _notify = v.notify;
        if (
          !_notify?.notifierId ||
          !_notify?.templateId ||
          _notify?.changeData === true
        ) {
          return Promise.reject(new Error($t('ListItem.Item.637563-22')));
        }
      }
      return Promise.resolve();
    },
  },
];
</script>

<style lang="less" scoped>
.deleteBtn() {
  position: absolute;
  top: -10px;
  right: -10px;
  display: none;
  width: 20px;
  height: 20px;
  color: #999;
  line-height: 20px;
  text-align: center;
  background-color: #f1f1f1;
  border-radius: 50%;
  cursor: pointer;

  &.show {
    display: block;
  }

  &:hover {
    background-color: #f3f3f3;
  }
}

.actions-item {
  position: relative;
  //margin-bottom: 24px;
  padding: 16px;
  border: 1px dashed #999;
  border-radius: 2px;

  .item-options-warp {
    display: inline-flex;
    height: 48px;
    border: 1px solid #e0e0e0;
    border-radius: 6px;

    .item-options-type {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      background-color: #f0f0f0;
      border-radius: 6px 0 0 6px;
      cursor: pointer;
    }

    .item-options-content {
      display: flex;
      align-items: center;
      padding: 0 8px;
      background: #fafafa;
      border-radius: 0 6px 6px 0;
      cursor: pointer;

      div {
        padding: 6px 10px;
        color: #333;
        font-size: 14px;
        line-height: 22px;
        background-color: #fff;
        border-radius: 22px;

        .notify-text-highlight {
          margin-left: 5px;
          font-weight: bold;
        }

        .notify-img-highlight {
          margin: 0 10px;
          color: rgba(0, 0, 0, 0.8);
        }
      }
    }
  }

  .item-number {
    position: absolute;
    top: 0;
    left: 16px;
    font-weight: 800;
    transform: translateY(-50%);
  }
}

.actions-item-filter-warp {
  position: relative;
  margin-bottom: 24px;
  padding: 2px 0;
  border: 1px dashed #999;
  border-radius: 30px;

  &.filter-border {
    padding: 2px 16px;
    border-radius: 2px;
  }

  .actions-item-filter-warp-tip {
    position: absolute;
    top: 0;
    left: 16px;
    z-index: 2;
    color: rgba(0, 0, 0, 0.55);
    font-weight: 800;
    font-size: 14px;
    line-height: 1;
    background-color: #fff;
    transform: translateY(-50%);
  }

  .actions-item-filter-overflow {
    display: flex;
    padding-top: 4px;
    overflow-x: auto;
    overflow-y: visible;
    row-gap: 16px;
  }

  .filter-add-button {
    width: 100%;
    color: rgba(0, 0, 0, 0.3);
    text-align: center;
    cursor: pointer;
  }

  .terms-params {
    // display: inline-block;
    display: flex;
    flex-shrink: 0;

    // &:not(:first-child) {
    //   margin-bottom: 16px;
    // }

    .terms-params-warp {
      display: flex;
      align-items: baseline;
    }

    .term-type-warp {
      // display: inline-block;
      width: 50px;
      margin: 0 16px;

      .term-type {
        padding-top: 4px;
        padding-bottom: 4px;
        border-radius: 2px;
      }
    }
  }
}
</style>
<style lang="less">
.actions-item-delete {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: #e50012;
  background-color: rgba(229, 0, 18, 0.1);
  border-radius: 50%;
  transform: translate(50%, -50%);
  cursor: pointer;

  &:hover {
    background-color: rgba(#e50012, 0.2);
  }
}
</style>
