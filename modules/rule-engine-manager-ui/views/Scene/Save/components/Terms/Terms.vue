<template>
    <div class="actions-terms">
        <TitleComponent :data="$t('Terms.Terms.9093429-0')" style="font-size: 14px">
        </TitleComponent>
        <!--    <template v-if='open'>-->
        <div>
            <a-tabs
                :type="isNoCommunity ? 'editable-card' : 'card'"
                v-model:activeKey="activeKey"
                @edit="addGroup"
                @tabClick="showEditCondition"
            >
                <a-tab-pane
                    v-for="(b, i) in group"
                    :key="b.id"
                    :closable="false"
                    :forceRender="forceRenderStatus"
                >
                    <template #tab>
                        <TermsTabPane
                            :showClose="group.length > 1"
                            @close="() => addGroup(b.id, 'close')"
                        >
                            {{ b.branchName || $t('Terms.Terms.9093429-1', [i + 1]) }}
                        </TermsTabPane>
                    </template>
                    <div class="filterConditionSwitch">
                        <span>{{ $t('Terms.Terms.9093429-2') }}</span>
                        <a-switch
                            v-model:checked="b.openFilter"
                            @change="(e) => change(e, b, i)"
                            :checkedChildren="$t('Terms.Terms.9093429-3')"
                            :unCheckedChildren="$t('Terms.Terms.9093429-4')"
                            style="margin-left: 4px"
                        />
                    </div>
                    <template v-for="(item, index) in data.branches">
                        <template
                            v-if="index >= b.start && index < b.start + b.len"
                        >
                            <Branches
                                :data="item"
                                :isFirst="index === b.start"
                                :name="index"
                                :branches_Index="item.branches_Index"
                                :groupLen="b.start + b.len"
                                :groupIndex="i + 1"
                                :key="item.key"
                                :showGroupDelete="group.length !== 1"
                                @delete="branchesDelete(index)"
                                @deleteAll="branchesDeleteAll"
                                @add="branchesAdd"
                            />
                            <div
                                class="actions-terms-warp"
                                v-if="b.len === 1 || (index === (b.start + b.len - 1) && group.length >= 1 && item.when.length > 0)"
                                :style="{
                                    marginTop:
                                        data.branches.length === 2 ? 0 : 24,
                                }"
                                :key="index"
                            >
                                <div
                                    class="actions-terms-title"
                                    style="padding: 0; margin-bottom: 24px"
                                >
                                    {{ $t('Terms.Terms.9093429-5') }}
                                </div>
                                <div class="actions-terms-options no-when">
                                    <AIcon
                                        type="PlusOutlined"
                                        class="when-add-button"
                                        @click="
                                            () => addBranches(b.start + b.len)
                                        "
                                    />
                                </div>
                            </div>
                        </template>
                    </template>
                </a-tab-pane>
            </a-tabs>
        </div>

        <!--    </template>-->
        <!--    <div v-else class='actions-branches-item'>-->
        <!--      <a-form-item-->
        <!--        :name='["branches", 0, "then"]'-->
        <!--        :rules='thenRules'-->
        <!--      >-->
        <!--        <Action-->
        <!--          :name='0'-->
        <!--          :openShakeLimit="true"-->
        <!--          :thenOptions='data.branches[0]?.then'-->
        <!--        />-->
        <!--      </a-form-item>-->
        <!--    </div>-->
    </div>
    <BranchesNameEdit
        v-if="editConditionVisible"
        :name="conditionName"
        @cancel="editConditionVisible = false"
        @ok="changeBranchName"
    />
</template>

<script setup lang="ts" name="Terms">
import { storeToRefs } from 'pinia';
import { useSceneStore } from '../../../../../store/scene';
import { cloneDeep } from 'lodash-es';
import { provide } from 'vue';
import { ColumnOptionsMapKey, ContextKey, handleParamsData, handleParamsDataMap } from './util'
import { getParseTerm } from '../../../../../api/scene';
import type { FormModelType } from '../../../typings';
import Branches from './Branches.vue';
import { randomNumber, randomString } from '@jetlinks-web/utils';
import TermsTabPane from './TermsTabPane.vue';
import BranchesNameEdit from './BranchesNameEdit.vue';
import { Modal } from 'ant-design-vue';
import {
    queryBindScene,
    unBindAlarmMultiple,
} from '../../../../../api/configuration';
import { isNoCommunity } from '@jetlinks-web-core/utils/utils'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n()
const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);
const columnOptions = ref<any>([]);
const columnOptionsMap = ref<any>(new Map());
const group = ref<Array<{ id: string; len: number }>>([]);
const activeKey = ref('');
const editConditionVisible = ref(false);
const conditionName = ref<any>();
const forceRenderStatus = ref(false)

provide(ContextKey, columnOptions);
provide(ColumnOptionsMapKey, columnOptionsMap);

const change = (e: boolean, groupItem: any, index: number) => {
    // group.value = []
    // activeKey.value = ''
    // if (!e) {
    //   data.value.branches!.length = 1
    //   data.value.branches![0].when = []
    // } else {
    //   data.value.branches!.push(null as any)
    //   data.value.branches![0].when = [
    //     {
    //       terms: [
    //         {
    //           column: undefined,
    //           value: {
    //             source: 'fixed',
    //             value: undefined
    //           },
    //           termType: undefined,
    //           key: `params_${randomString()}`,
    //           type: 'and',
    //         },
    //       ],
    //       type: 'and',
    //       key: `terms_${randomString()}`,
    //     },
    //   ]
    // }
    const start = groupItem.start;
    const len = groupItem.len;
    if (!e) {
        data.value.branches?.splice(start + 1, len - 1);
        data.value.branches![start].when = [];
        // data.value.options!.when.splice(start,len - 1)
        data.value.options!.when[start].terms = [
            {
                terms: [['', 'eq', '', 'and']],
            },
        ];
    } else {
        // data.value.branches!.splice(start + 1, 0, null);
        data.value.branches![start].when = [
            {
                terms: [
                    {
                        column: undefined,
                        value: {
                            source: 'fixed',
                            value: undefined,
                        },
                        termType: undefined,
                        key: `params_${randomString()}`,
                        type: 'and',
                    },
                ],
                type: 'and',
                key: `terms_${randomString()}`,
            },
        ];
    }
};

const queryColumn = (dataModel: FormModelType) => {
    const cloneDevice = cloneDeep(dataModel);
    cloneDevice.branches = cloneDevice.branches?.filter((item) => !!item);
    getParseTerm(cloneDevice).then((res) => {
        columnOptions.value = handleParamsData(
            res.result as any[],
            'column',
            '0',
        );
      columnOptionsMap.value = handleParamsDataMap(res.result)
    });
};

const addBranches = (len: number) => {
    const key = randomNumber();
    const branchesItem = {
        when: [],
        key: key,
        shakeLimit: {
            enabled: false,
            time: 1,
            threshold: 1,
            alarmFirst: true,
        },
        then: [],
        branchId: key,
    };
    // const lastIndex = data.value.branches!.length - 1 || 0
    data.value.branches?.splice(len, 0, branchesItem);
    // branch有分组所以是插入，而不是替换

    data.value.options!.when.splice(len, 0, {
        terms: [],
        key,
    });
};

const branchesDelete = (index: any) => {
    groupDelete(
        {
            start: index,
            len: 1,
        },
        -1,
    );
};

const addGroup = (targetKey: string, action: string) => {
    if (action === 'add') {
        const lastGroup = group.value[group.value.length - 1];
        const lastIndex = (lastGroup?.groupIndex || group.value.length) + 1;
        const key = randomNumber();

        const branchesItem: any = {
            when: [
                {
                    terms: [
                        {
                            column: undefined,
                            value: {
                                source: 'fixed',
                                value: undefined,
                            },
                            termType: undefined,
                            key: `params_${randomString()}`,
                            type: 'and',
                        },
                    ],
                    type: 'and',
                    key: `terms_${randomString()}`,
                },
            ],
            key: key,
            shakeLimit: {
                enabled: false,
                time: 1,
                threshold: 1,
                alarmFirst: true,
            },
            then: [],
            executeAnyway: true,
            branchId: key,
            branchName: '',
        };
        // data.value.branches?.push(branchesItem, null);
        data.value.branches?.push(branchesItem);
        // data.value.branches?.push(null as any)
        activeKey.value = key;
        data.value.options!.when.push({
            terms: [
                {
                    terms: [['', 'eq', '', 'and']],
                },
            ],
            branchName: '',
            key,
            executeAnyway: true,
            groupIndex: lastIndex,
        });
    } else {
        const index = group.value.findIndex(
            (item) => item.branchId === targetKey,
        );
        groupDelete(group.value[index], index);
    }
};

const branchesDeleteAll = () => {};

const groupDelete = async (g: any, index: number) => {
    // 校验当前条件下是否有数据
    let actionLen = 0;
    let alarmTerms: Array<Record<string, string>> = [];

    for (let i = g.start; i < g.start + g.len; i++) {
        const item = data.value.branches[i];
        if (item) {
            item.then?.forEach((thenItem) => {
                actionLen += thenItem.actions.length;
                if (thenItem.actions) {
                    thenItem.actions.forEach((actionItem) => {
                        const _actionId = actionItem.actionId;
                        if (actionItem.executor === 'alarm') {
                            alarmTerms.push({
                                column: 'branchIndex',
                                value: _actionId || item.branchId,
                                type: 'or',
                            });
                        }
                    });
                }
            });
        }
    }

    if (actionLen) {
        if (alarmTerms.length) {
            const resp = await queryBindScene({
                terms: alarmTerms,
            });

            Modal.confirm({
                title: $t('Terms.Terms.9093429-6', [resp.result.total]),
                onOk() {
                    const _data = resp.result.data.map((item) => {
                        return {
                            alarmId: item.alarmId,
                            ruleId: item.ruleId,
                            branchIndex: item.branchIndex,
                        };
                    });
                    unBindAlarmMultiple(_data);
                    removeBranchesData(g, index);
                },
            });
        } else {
            Modal.confirm({
                title: $t('Terms.Terms.9093429-7'),
                onOk() {
                    removeBranchesData(g, index);
                },
            });
        }
    } else {
        removeBranchesData(g, index);
    }
};

const removeBranchesData = (g: any, index: number) => {
    const removeBranches = data.value.branches.splice(g.start, g.len);

    removeBranches.forEach((item) => {
        if (item) {
            let _index = data.value.options!.when.findIndex(
                (whenItem) => whenItem.key === item.branchId,
            );
            if (_index !== -1) {
                _index = item.branches_Index;
            }
            data.value.options!.when.splice(_index, 1);
        }
    });

    if (index >= 0) {
        // 删除整个条件组
        group.value.splice(index, 1);

        if (g.id === activeKey.value) {
            //
            let _moveIndex = index - 1;

            if (_moveIndex < 0) {
                // 左移
                _moveIndex = 0;
            }

            activeKey.value = group.value[_moveIndex].id;
        }
    } else {
        // 单个条件删除
        const groupItem = group.value.find(
            (item) => item.id === activeKey.value,
        ); // 获取当前条件组
        groupItem!.len -= 1;
        const branchesItem = data.value.branches[g.start];
        // if (branchesItem === undefined || branchesItem?.executeAnyway) {
        //     // 当前位置为undefined或者是下一个条件组的开始 就插入null
        //     data.value.branches?.splice(g.start, 0, null);
        // }
    }
};

const branchesAdd = () => {
    // const groupItem = group.value.find(item => item.id === activeKey.value) // 获取当前条件的组
    // groupItem!.len += 1
};

const showEditCondition = (key: any) => {
    if (key === activeKey.value) {
        editConditionVisible.value = true;
        conditionName.value = group.value.find((i: any) => {
            return i.branchId === key;
        })?.branchName;
    }
};

const changeBranchName = (name: string) => {
    let _activeKey = activeKey.value;

    data.value.branches?.forEach((item: any) => {
        if (item?.branchId === _activeKey) {
            item.branchName = name;
        }
    });

    let optionsItem = data.value.options!.when.find(
        (item) => item.key === _activeKey,
    );

    if (!optionsItem) {
        const _index = group.value.findIndex(
            (item) => item.branchId === _activeKey,
        );
        if (_index !== -1) {
            data.value.options!.when[_index].branchName = name;
        }
    } else {
        optionsItem.branchName = name;
    }

    editConditionVisible.value = false;
};

const changePaneIndex = (index) => {
    const _groupItem = group.value[index - 1]
    if (_groupItem) {
        activeKey.value = _groupItem.branchId;
    }
};

watchEffect(() => {
    if (data.value.trigger?.type && !['timer', 'manual'].includes(data.value.trigger.type)) {
        queryColumn({ trigger: data.value.trigger });
    }
});

// watch(() => data.value.trigger, () => {
//   if (data.value.trigger?.type && !['timer', 'manual'].includes(data.value.trigger.type)) {
//     queryColumn({ trigger: data.value.trigger });
//   }
// }, { immediate: true})

watch(() => data.value.branches, () => {
  const branches = data.value.branches;
  let _group = [];
  let _branchesIndex = 0;
  if (data.value.branches.length > 10) { // 避免branches过多导致一次性渲染时ParamsItem -> watch卡顿
    forceRenderStatus.value = false
    setTimeout(() => {
      forceRenderStatus.value = true;
    }, 3000)
  } else {
    forceRenderStatus.value = true
  }
  if (branches) {
    const optionsMap = new Map(data.value.options!.when.map(whenItem => [whenItem.key, whenItem]))

    branches.forEach((item, index) => {
      const lastIndex = _group.length - 1;

      let whenItem = optionsMap.get(item?.branchId)

      if (!whenItem) {
        whenItem = data.value.options!.when[_branchesIndex];
      }

      if (index === 0 || item?.executeAnyway) {
        _group[lastIndex + 1] = {
          id: item.branchId,
          len: 1,
          start: index,
          branchKey: item.key,
          branchId: item.branchId,
          // branchName: item.branchName || whenItem?.branchName || `条件 ${_branchesIndex + 1}`,
          branchName:
            item.branchName || whenItem?.branchName || $t('Terms.Terms.9093429-8'),
          groupIndex: _branchesIndex,
          openFilter: !!item.when.length,
        };
      } else {
        _group[lastIndex].len += 1;
      }

      if (item) {
        item.branches_Index = _branchesIndex; // 真实branches中的下标位置
        _branchesIndex += 1;
      }
    });

    // branches.filter(item => item).forEach((item, index) => {
    //   item.branches_Index = index
    // })

    group.value = _group;
    if (!activeKey.value) {
      activeKey.value = _group[0].id;
    }
  }
}, { immediate: true, deep: true })
//
// watchEffect(() => {
//     const branches = data.value.branches;
//     let _group = [];
//     let _branchesIndex = 0;
//     if (branches) {
//         branches.forEach((item, index) => {
//             const lastIndex = _group.length - 1;
//
//             let whenItem = data.value.options!.when.find(
//                 (when) => item?.branchId === when.key,
//             );
//
//             if (!whenItem) {
//                 whenItem = data.value.options!.when[_branchesIndex];
//             }
//
//             if (index === 0 || item?.executeAnyway) {
//                 _group[lastIndex + 1] = {
//                     id: item.branchId,
//                     len: 1,
//                     start: index,
//                     branchKey: item.key,
//                     branchId: item.branchId,
//                     // branchName: item.branchName || whenItem?.branchName || `条件 ${_branchesIndex + 1}`,
//                     branchName:
//                         item.branchName || whenItem?.branchName || $t('Terms.Terms.9093429-8'),
//                     groupIndex: _branchesIndex,
//                     openFilter: !!item.when.length,
//                 };
//             } else {
//                 _group[lastIndex].len += 1;
//             }
//
//             if (item) {
//                 item.branches_Index = _branchesIndex; // 真实branches中的下标位置
//                 _branchesIndex += 1;
//             }
//         });
//
//         // branches.filter(item => item).forEach((item, index) => {
//         //   item.branches_Index = index
//         // })
//
//         group.value = _group;
//         if (!activeKey.value) {
//             activeKey.value = _group[0].id;
//         }
//     }
// });

defineExpose({
    changePaneIndex,
});
</script>

<style scoped lang="less">
.actions-terms {
    :deep(.ant-tabs-tab-active) {
        .ant-tabs-tab-remove {
            color: #fff;
        }
    }
}
.filterConditionSwitch {
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 16px;
    font-weight: 800;
    font-size: 14px;
    line-height: 32px;
}
</style>
