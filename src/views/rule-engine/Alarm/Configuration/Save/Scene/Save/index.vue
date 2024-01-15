<template>
  <j-modal
    visible
    title="新增"
    okText="确定"
    cancelText="取消"
    :width="1000"
    @cancel="closeModal"
    @ok="saveCorrelation"
    :maskClosable="false"
  >
    <div v-if="type !== 'other'" style="padding: 0 24px">
      <j-steps :current="current" >
        <j-step title="选择场景"></j-step>
        <j-step title="选择条件"></j-step>
      </j-steps>
    </div>
    <template v-if="current === 0 || type === 'other' ">
      <pro-search :columns="columns" type="simple" @search="handleSearch"/>
      <div style="height: 500px; overflow-y: auto">
        <JProTable
          model="CARD"
          :request="query"
          :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                    onChange: onSelectChange
                }"
          :gridColumns="[1, 1, 1]"
          :defaultParams="{
                    sorts: [
                        {
                            name: 'createTime',
                            order: 'desc',
                        },
                    ],
                    terms,
                }"
          :params="params"
        >
          <template #card="slotProps">
            <CardBox
              :value="slotProps"
              :status="slotProps.state?.value"
              :statusText="slotProps.state?.text"
              :active="_selectedRowKeys.includes(slotProps.id)"
              @click="handleClick"
              :statusNames="{
                            started: 'processing',
                            disable: 'error',
                        }"
            >
              <template #type>
                            <span
                            ><img
                              :height="16"
                              :src="
                                        typeMap.get(slotProps.triggerType)?.icon
                                    "
                              style="margin-right: 5px"
                            />{{
                                typeMap.get(slotProps.triggerType)?.text
                              }}</span
                            >
              </template>
              <template #img>
                <img
                  :src="typeMap.get(slotProps.triggerType)?.img"
                />
              </template>
              <template #content>
                <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                </Ellipsis>
                <Ellipsis :lineClamp="2">
                  <div class="subTitle">
                    说明：{{
                      slotProps?.description ||
                      typeMap.get(slotProps.triggerType)?.tip
                    }}
                  </div>
                </Ellipsis>
              </template>
            </CardBox>
          </template>
        </JProTable>
      </div>
    </template>
    <template v-if="current === 1">
      <div class="branch-terms-items">
        <j-tree
          v-if="branchGroup.length"
          defaultExpandAll
          checkable
          :treeData="branchGroup"
          @check="branchCheck"
        >

        </j-tree>
<!--        <CardBox-->
<!--          v-for="(item, index) in branchGroup.branches"-->
<!--          :showStatus="false"-->
<!--          :active="branchActiveKey.includes(item.id)"-->
<!--          @click="() => branchClick(item.id)"-->
<!--        >-->
<!--          <template #content>-->
<!--            <div class="condition-name">-->
<!--              条件 {{ index + 1 }}-->
<!--            </div>-->
<!--            <div style="height: 80px">-->
<!--              <j-scrollbar >-->
<!--                <div v-for="(b, bIndex) in item">-->
<!--                  <div style="font-weight: bold">-->
<!--                    <span v-if="bIndex === 0">当</span>-->
<!--                    <span v-else>否则</span>-->
<!--                    <span>{{ b.condition }}</span>-->
<!--                  </div>-->
<!--                  <div style="padding-left: 16px" v-for="action in b.actions">-->
<!--                    执行 {{ action }}-->
<!--                  </div>-->
<!--                </div>-->
<!--              </j-scrollbar>-->
<!--            </div>-->
<!--          </template>-->
<!--        </CardBox>-->
      </div>
    </template>
    <template #footer>
      <j-button v-if="current === 0" @click="closeModal">取消</j-button>
      <j-button v-if="current === 0" type="primary" @click="next">下一步</j-button>
      <j-button v-if="current === 1" @click="prev">上一步</j-button>
      <j-button v-if="current === 1" type="primary" @click="saveCorrelation">完成</j-button>
    </template>
  </j-modal>
</template>

<script lang="ts" setup>
import {query} from '@/api/rule-engine/scene';
import {bindScene} from '@/api/rule-engine/configuration';
import {getImage, onlyMessage} from '@/utils/comm';
import {handleSceneBranches} from './utils'

const columns = [
  {
    title: '场景名称',
    dataIndex: 'name',
    key: 'name',
    search: {
      type: 'select',
      options: async () => {
        const res = await query(
          {
            sorts: [
              {
                name: 'createTime',
                order: 'desc',
              },
            ],
            terms: [
              {
                column: 'id',
                termType: 'alarm-bind-rule$not',
                value: props.id,
                type: 'and',
              },
              {
                column: 'triggerType',
                termType: 'eq',
                value: props.type === 'other' ? undefined : 'device',
              },
            ]
          }
        );
        if (res.status === 200) {
          return res.result.data.map((item: any) => ({
            label: item.name,
            value: item.id,
          }));
        }
        return []
      }
    },
  },
  {
    title: '触发方式',
    dataIndex: 'triggerType',
    key: 'triggerType',
    search: {
      type: 'select',
      options: [
        {
          label: '手动触发',
          value: 'manual',
        },
        {
          label: '定时触发',
          value: 'timer',
        },
        {
          label: '设备触发',
          value: 'device',
        },
      ],
    },
  },
  {
    title: '状态',
    dataIndex: 'state',
    key: 'state',
    search: {
      type: 'select',
      options: [
        {
          label: '正常',
          value: 'started',
        },
        {
          label: '禁用',
          value: 'disable',
        },
      ],
    },
  },
];
const props = defineProps({
  id: {
    type: String,
  },
  type: {
    type: String,
  },
});

const current = ref(0)
const branchGroup = ref<any[]>([])
const branchActiveKey = ref([])
const branchCheckKeys = ref([])

const terms = [
  {
    terms: [
      // {
      //   column: 'id',
      //   termType: 'alarm-bind-rule$not',
      //   value: props.id,
      //   type: 'and',
      // },
      {
        column: 'triggerType',
        termType: 'eq',
        value: props.type === 'other' ? undefined : 'device',
      },
    ],
    type: 'and',
  },
];
const params = ref();
const typeMap = new Map();
typeMap.set('manual', {
  text: '手动触发',
  img: getImage('/scene/scene-hand.png'),
  icon: getImage('/scene/trigger-type-icon/manual.png'),
  tip: '适用于第三方平台向物联网平台下发指令控制设备',
});
typeMap.set('timer', {
  text: '定时触发',
  img: getImage('/scene/scene-timer.png'),
  icon: getImage('/scene/trigger-type-icon/timing.png'),
  tip: '适用于定期执行固定任务',
});
typeMap.set('device', {
  text: '设备触发',
  img: getImage('/scene/scene-device.png'),
  icon: getImage('/scene/trigger-type-icon/device.png'),
  tip: '适用于设备数据或行为满足触发条件时，执行指定的动作',
});
const _selectedRowKeys = ref<string[]>([]);
const handleClick = (dt: any) => {
  if (_selectedRowKeys.value.includes(dt.id)) {
      const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
      _selectedRowKeys.value.splice(_index, 1);
  } else {
      _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
  }
  // _selectedRowKeys.value = [dt.id]
};
/**
 * 取消选择事件
 */
const onSelectChange = (arr: any[]) => {
  _selectedRowKeys.value = arr
};

const branchClick = (id: string) => {
  const keys = new Set(branchActiveKey.value)


}

const handleSearch = (e: any) => {
  params.value = e;
};
const emit = defineEmits(['closeSave', 'saveScene']);

const next = () => {
  if (_selectedRowKeys.value.length) {
    query({
      pageSize: 99,
      terms: [{column: 'id', termType: 'in', value: _selectedRowKeys.value.join(',')}]
    }).then(res => {
      if (res.success) {
        branchGroup.value = handleSceneBranches(res.result.data) || []

        console.log(branchGroup.value)
      }
    })
    current.value += 1

  } else {
    onlyMessage('请选择场景', 'warning')
  }
}

const branchCheck = (checkedKeys: string[], { checkedNodes }) => {
  branchCheckKeys.value = checkedNodes.filter(item => item.branchId).map(item => ({
    branchIndex: item.branchId,
    ruleId: item.sceneId,
    alarmId: props.id,
  }))
}

const prev = () => {
  current.value -= 1
}
/**
 * 保存选中关联场景
 */
const saveCorrelation = async () => {
  if (_selectedRowKeys.value.length === 0 && branchCheckKeys.value.length === 0) {
    onlyMessage('请选择至少一条数据', 'error')
    return
  }

  const list = props.type === 'other' ?  _selectedRowKeys.value.map((item: any) => {
    return {
      alarmId: props.id,
      ruleId: item,
    };
  }) : branchCheckKeys.value

  const res = await bindScene([...list]);
  if (res.status === 200) {
    onlyMessage('操作成功');
    emit('saveScene');
  }
};
const closeModal = () => {
  emit('closeSave');
};
</script>
<style lang="less" scoped>
.subTitle {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-top: 10px;
}

.condition-name {
  font-size: 16px;
  font-weight: bold;
}

.branch-terms-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
}
</style>
