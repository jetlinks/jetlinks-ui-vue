<template>
  <div class="debug-container">
    <div class="left">
      <div class="header">
        <div>
          <div class="title">
            属性赋值
            <div class="description">请对上方规则使用的属性进行赋值</div>
          </div>
          <div v-if="!isBeginning && virtualRule?.type === 'window'" class="action" @click="runScriptAgain">
            <a style="margin-left: 75px;">发送数据</a>
          </div>
        </div>
      </div>
      <j-table :columns="columns" :data-source="property" :pagination="false" bordered size="small">
        <template #bodyCell="{ column, record, index }">
          <template v-if="column.key === 'id'">
            <j-auto-complete :options="options" v-model:value="record.id" size="small" width="130px"/>
          </template>
          <template v-if="column.key === 'current'">
            <j-input v-model:value="record.current" size="small"></j-input>
          </template>
          <template v-if="column.key === 'last'">
            <j-input v-model:value="record.last" size="small"></j-input>
          </template>
          <template v-if="column.key === 'action'">
            <AIcon type="DeleteOutlined" @click="deleteItem(index)" />
          </template>
        </template>
      </j-table>
      <j-button type="dashed" block style="margin-top: 5px" @click="addItem">
        <template #icon>
          <AIcon type="PlusOutlined" />
        </template>
        添加条目
      </j-button>
    </div>
    <div class="right">
      <div class="header">
        <div class="title">
          <div>运行结果</div>
        </div>
        <div class="action">
          <div>
            <a v-if="isBeginning" @click="beginAction">
              开始运行
            </a>
            <a v-else @click="stopAction">
              停止运行
            </a>
          </div>
          <div>
            <a @click="clearAction">
              清空
            </a>
          </div>
        </div>
      </div>
      <div class="log">
        <j-descriptions>
          <j-descriptions-item v-for="item in ruleEditorStore.state.log" :label="moment(item.time).format('HH:mm:ss')"
            :key="item.time" :span="3">
            <j-tooltip placement="top" :title="item.content">
              {{ item.content }}
            </j-tooltip>
          </j-descriptions-item>
        </j-descriptions>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts" name="Debug">
import { PropType } from 'vue';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { useProductStore } from '@/store/product';
import { message } from 'ant-design-vue';
import { useRuleEditorStore } from '@/store/ruleEditor';
import moment from 'moment';
import { getWebSocket } from '@/utils/websocket';
import { PropertyMetadata } from '@/views/device/Product/typings';


const props = defineProps({
  virtualRule: Object as PropType<Record<any, any>>,
  id: String,
})

const isBeginning = ref(true)

const runScriptAgain = () => { }

type propertyType = {
  id?: string,
  current?: string,
  last?: string
}
const property = ref<propertyType[]>([])

const columns = [{
  title: '属性ID',
  dataIndex: 'id',
  key: 'id'
}, {
  title: '当前值',
  dataIndex: 'current',
  key: 'current'
}, {
  title: '上一值',
  dataIndex: 'last',
  key: 'last'
}, {
  title: '',
  key: 'action'
}]

const addItem = () => {
  property.value.push({})
}
const deleteItem = (index: number) => {
  property.value.splice(index, 1)
}

const ws = ref()

const virtualIdRef = ref(new Date().getTime());

const productStore = useProductStore()
const ruleEditorStore = useRuleEditorStore()
const runScript = () => {
  const metadata = productStore.current.metadata || '{}';
  const propertiesList = JSON.parse(metadata).properties || [];
  const _properties = property.value.map((item: any) => {
    const _item = propertiesList.find((i: any) => i.id === item.id);
    return { ...item, type: _item?.valueType?.type };
  });

  if (ws.value) {
    ws.value.unsubscribe?.();
  }
  if (!props.virtualRule?.script) {
    isBeginning.value = true;
    message.warning('请编辑规则');
    return;
  }
  ws.value = getWebSocket(`virtual-property-debug-${props.id}-${new Date().getTime()}`,
    '/virtual-property-debug',
    {
      virtualId: `${virtualIdRef.value}-virtual-id`,
      property: props.id,
      virtualRule: {
        ...props.virtualRule,
      },
      properties: _properties || [],
    })
  ws.value.subscribe((data: any) => {
    ruleEditorStore.state.log.push({ time: new Date().getTime(), content: JSON.stringify(data.payload) });
  })
}
const beginAction = () => {
  isBeginning.value = false;
  runScript();
}
const stopAction = () => {
  isBeginning.value = true;
  if (ws.value) {
    ws.value.unsubscribe?.();
  }
}
const clearAction = () => {
  ruleEditorStore.set('log', []);
}

onUnmounted(() => {
  if (ws.value) {
    ws.value.unsubscribe?.();
  }
})

const options = ref<{ label: string, value: string }[]>()
const getProperty = () => {
  const metadata = productStore.current.metadata || '{}';
  const _p: PropertyMetadata[] = JSON.parse(metadata).properties || [];
  options.value = _p.filter((p) => p.id !== props.id).map((item) => ({
    label: item.name,
    value: item.id,
  }));
}
getProperty()
</script>
<style lang="less" scoped>
.debug-container {
  display: flex;
  width: 100%;
  height: 340px;
  margin-top: 20px;

  .left {
    flex: 1;
    min-width: 0;
    max-width: 550px;
    overflow-y: auto;
    border: 1px solid lightgray;

    .header {
      display: flex;
      align-items: center;
      width: 100%;
      height: 40px;
      border-bottom: 1px solid lightgray;
      //justify-content: space-around;

      div {
        display: flex;
        //width: 100%;
        align-items: center;
        justify-content: flex-start;
        height: 100%;

        .title {
          margin: 0 10px;
          font-weight: 600;
          font-size: 16px;
        }

        .description {
          margin-left: 10px;
          color: lightgray;
          font-size: 12px;
        }
      }

      .action {
        width: 150px;
        font-size: 14px;
      }
    }
  }

  .right {
    flex: 1;
    min-width: 0;
    border: 1px solid lightgray;
    border-left: none;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 40px;
      border-bottom: 1px solid lightgray;

      .title {
        display: flex;

        div {
          margin: 0 10px;
        }
      }

      .action {
        display: flex;

        div {
          margin: 0 10px;
        }
      }
    }

    .log {
      height: 290px;
      padding: 5px;
      overflow: auto;
    }
  }
}
</style>