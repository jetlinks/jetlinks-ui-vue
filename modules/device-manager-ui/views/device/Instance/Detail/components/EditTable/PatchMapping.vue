<template>
  <a-modal
      width="1000px"
      :title="$t('EditTable.PatchMapping.974352-0')"
      open
      @ok="handleClick"
      @cancel="handleClose"
  >
    <div class="map-tree">
      <div class="map-tree-top">
        {{ $t('EditTable.PatchMapping.974352-1') }}
      </div>
      <a-spin :spinning="loading">
        <div class="map-tree-content">
          <a-card class="map-tree-content-card">
            <template #title>
              <div class="map-tree-header">
                <span>{{ $t('EditTable.PatchMapping.974352-2') }}</span>
                <div>
                  <a-input :placeholder="$t('EditTable.PatchMapping.974352-3')" v-model:value="searchValue"
                           @change="onSearch">
                    <template #suffix>
                      <AIcon type="SearchOutlined"/>
                    </template>
                  </a-input>
                </div>
              </div>
            </template>
            <a-tree
                v-if="dataSource.length"
                checkable
                v-model:expandedKeys="expandedKeys"
                :height="300"
                :tree-data="dataSource"
                :checkedKeys="checkedKeys"
                @check="onCheck"
            >
              <template #title="{ title }">
                                <span v-if="title.indexOf(searchValue) > -1">
                                    {{
                                    title.substring(
                                        0,
                                        title.indexOf(searchValue),
                                    )
                                  }}
                                    <span style="color: #f50">{{
                                        searchValue
                                      }}</span>
                                    {{
                                    title.substring(
                                        title.indexOf(searchValue) +
                                        searchValue.length,
                                    )
                                  }}
                                </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>
            <j-empty v-else style="margin-top: 16px"></j-empty>
          </a-card>
          <div>
            <a-button
                :disabled="rightList.length >= leftList.length"
                @click="onRight"
            >{{ $t('EditTable.PatchMapping.974352-4') }}
            </a-button
            >
          </div>
          <a-card class="map-tree-content-card" :title="$t('EditTable.PatchMapping.974352-5')">
            <!--            <a-list-->
            <!--                size="small"-->
            <!--                :data-source="rightList"-->
            <!--                class="map-tree-content-card-list"-->
            <!--            >-->
            <!--              <template #renderItem="{ item }">-->
            <!--                <a-list-item>-->
            <!--                  {{ item.title }}-->
            <!--                  <template #actions>-->
            <!--                    <ConfirmModal-->
            <!--                        :title="$t('EditTable.PatchMapping.974352-6')"-->
            <!--                        :onConfirm="() => _delete(item.key)"-->
            <!--                    >-->
            <!--                      <AIcon type="DeleteOutlined" />-->
            <!--                    </ConfirmModal>-->
            <!--                  </template>-->
            <!--                </a-list-item>-->
            <!--              </template>-->
            <!--            </a-list>-->
            <div style="height: 300px">
              <VirtualScroll :data="rightList" :itemHeight="40">
                <template #renderItem="item">
                  <div class="right-list-item">
                    <div>{{ item?.title }}</div>
                    <ConfirmModal
                        :title="$t('EditTable.PatchMapping.974352-6')"
                        :onConfirm="() => _delete(item.key)"
                    >
                      <AIcon type="DeleteOutlined"/>
                    </ConfirmModal>
                  </div>
                </template>
              </VirtualScroll>
            </div>
          </a-card>
        </div>
      </a-spin>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import {treeMapping, saveMapping} from '../../../../../../api/instance';
import {onlyMessage} from '@jetlinks-web-core/utils/comm';
import {useInstanceStore} from "../../../../../../store/instance";
import {debounce} from 'lodash-es';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();

const _props = defineProps({
  type: {
    type: String,
    default: 'MODBUS_TCP',
  },
  metaData: {
    type: Array,
    default: () => [],
  },
  deviceId: {
    type: String,
    default: '',
  },
});
const _emits = defineEmits(['close', 'save']);

const instanceStore = useInstanceStore();
const checkedKeys = ref<string[]>([]);
const searchValue = ref()
const leftList = ref<any[]>([]);
const rightList = ref<any[]>([]);
const expandedKeys = ref<any[]>([]);
const dataSource = ref<any[]>([]);
const loading = ref<boolean>(false);
let dataSourceCache

const handleData = (data: any[], type: string, provider?: string) => {
  data.forEach((item) => {
    item.key = item.id;
    item.title = item.name;
    item.checkable = type === 'collectors';

    if (provider) {
      item.provider = provider
    }

    if (
        item.collectors &&
        Array.isArray(item.collectors) &&
        item.collectors.length
    ) {
      item.children = handleData(
          item.collectors,
          'collectors',
          item.provider,
      );
    }

    if (item.points && Array.isArray(item.points) && item.points.length) {
      item.children = handleData(item.points, 'points');
    } else {
      item.disableCheckbox = true;
    }
  });
  return data as any[];
};

const handleSearch = async () => {
  loading.value = true;

  const params = {}

  const resp = await treeMapping(params);
  loading.value = false;
  if (resp.status === 200) {
    const _data = handleData(resp.result as any[], 'channel');
    dataSourceCache = JSON.stringify(_data)
    dataSource.value = _data
  }
}

const onCheck = (keys: string[], e: any) => {
  checkedKeys.value = [...keys];
  leftList.value = e?.checkedNodes || [];
};

const onRight = () => {
  leftList.value.forEach((i: any) => {
    i.disableCheckbox = true;
  });
  rightList.value = leftList.value;
};

const _delete = (_key: string) => {
  const _index = rightList.value.findIndex((i) => i.key === _key);
  leftList.value[_index].disableCheckbox = false;
  rightList.value.splice(_index, 1);
  checkedKeys.value = rightList.value.map((i) => i.key);
  leftList.value = rightList.value;
};

const handleClick = async () => {
  if (!rightList.value.length) {
    onlyMessage($t('EditTable.PatchMapping.974352-7'), 'warning');
  } else {
    const params: any[] = [];
    rightList.value.forEach((item: any) => {
      const array = (item.children || []).map((element: any) => ({
        channelId: item.parentId,
        collectorId: element.collectorId,
        pointId: element.id,
        metadataType: 'property',
        metadataId: (_props.metaData as any[]).find(
            (i: any) => i.name === element.name,
        )?.metadataId,
        provider: item.provider,
        state:
            instanceStore.current.state.value == 'notActive'
                ? 'disabled'
                : null,
      }));
      params.push(...array);
    });
    const filterParams = params.filter((item) => !!item.metadataId);
    if (filterParams?.length !== 0) {
        const res = await saveMapping(
            _props.deviceId,
            _props.type,
            filterParams,
        );
        if (res.status === 200) {
            onlyMessage($t('EditTable.PatchMapping.974352-8'));
            _emits('save');
        }
    } else {
        onlyMessage($t('EditTable.PatchMapping.974352-9'), 'error');
    }
  }
};
const handleClose = () => {
  _emits('close');
};

const treeFilter = (data: any[], value: any, key: string = 'name'): any[] => {
  if (!data) return []

  return data.filter((item) => {
    if (item[key].includes(value)) {
      if (item.parentId) {
        !expandedKeys.value.includes(item.parentId) &&
        expandedKeys.value.push(item.parentId);
      }
      return true;
    }

    // 排除点位的搜索
    if (
        item.children &&
        item.children.length &&
        !item.hasOwnProperty('points')
    ) {
      item.children = treeFilter(item.children || [], value, key);
      return !!item.children.length;
    }

    return false;
  });
}

const onSearch = debounce((e) => {
  // handleSearch()
  const _data = JSON.parse(dataSourceCache || '[]');
  const text = e.target.value;
  dataSource.value = text
      ? treeFilter(_data, e.target.value, 'title')
      : _data;
}, 300);

watchEffect(() => {
  if (_props.type) {
    handleSearch();
  }
});
</script>

<style lang="less" scoped>
.map-tree-content {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .map-tree-content-card {
    width: 350px;
    height: 400px;

    .map-tree-content-card-list {
      overflow-y: auto;
      height: 300px;
    }
  }
}

.map-tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.right-list-item {
  border-bottom: 1px solid #ddd;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
