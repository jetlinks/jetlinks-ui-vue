<template>
    <div>

        <div class="dash-board">
          <j-select
              v-if="serverNodeOptions.length > 1"
              :options="serverNodeOptions"
              :value="serverId"
              style="width: 300px; margin-bottom: 20px"
              @change="serverIdChange"
          ></j-select>
          <div class="dash-board-items">
            <div class="dash-board-item">
              <TopEchartsItemNode :value="topValues.cpu" :title="$t('components.TopCard.542305-0')" />
            </div>
            <div class="dash-board-item">
              <TopEchartsItemNode
                  :bottom="$t('components.TopCard.542305-1', [topValues.jvmTotal])"
                  :max="topValues.jvmTotal"
                  :value="topValues.jvm"
                  formatter="G"
                  :title="$t('components.TopCard.542305-2')"
              />
            </div>
            <div class="dash-board-item">
              <TopEchartsItemNode
                  :bottom="$t('components.TopCard.542305-3', [topValues.usageTotal])"
                  :max="topValues.usageTotal"
                  :value="topValues.usage"
                  formatter="G"
                  :title="$t('components.TopCard.542305-4')"
              />
            </div>
            <div class="dash-board-item">
              <TopEchartsItemNode
                  :bottom="$t('components.TopCard.542305-5', [topValues.systemUsageTotal])"
                  :max="topValues.systemUsageTotal"
                  :value="topValues.systemUsage"
                  formatter="G"
                  :title="$t('components.TopCard.542305-6')"
              />
            </div>
          </div>

        </div>
    </div>
</template>

<script lang="ts" setup name="TopCard">
import { serverNode } from '@/api/link/dashboard';
import TopEchartsItemNode from './TopEchartsItemNode.vue';
import { getWebSocket } from '@/utils/websocket';
import { map } from 'rxjs/operators';
import { isNoCommunity } from '@/utils/utils'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const serverId = ref();
const serverNodeOptions = ref<Array<any>>([]);
const topValues = ref({
    cpu: 0,
    jvm: 0,
    jvmTotal: 0,
    usage: 0,
    usageTotal: 0,
    systemUsage: 0,
    systemUsageTotal: 0,
});
const wsRef = ref<any>()

const emit = defineEmits(['serviceChange'])

const serverIdChange = (val: string) => {
    serverId.value = val;
};

const unSub = () => {
  if (wsRef.value) {
    wsRef.value.unsubscribe()
  }
}

const getData = () => {
    const id = 'operations-statistics-system-info-realTime';
    const topic = '/dashboard/systemMonitor/stats/info/realTime';
    unSub()

    wsRef.value = getWebSocket(id, topic, {
        type: 'all',
        serverNodeId: serverId.value,
        interval: '1s',
        agg: 'avg',
    })
        .pipe(map((res: any) => res.payload))
        .subscribe((payload) => {
            const {
                value: { cpu, memory, disk },
            } = payload;
            topValues.value = {
                cpu: cpu.systemUsage,
                jvm: Number(
                    (
                        (memory.jvmHeapUsage / 100) *
                        (memory.jvmHeapTotal / 1024)
                    ).toFixed(1),
                ),
                jvmTotal: Math.ceil(memory.jvmHeapTotal / 1024),
                usage: Number(
                    ((disk.total / 1024) * (disk.usage / 100)).toFixed(1),
                ),
                usageTotal: Math.ceil(disk.total / 1024),
                systemUsage: Number(
                    (
                        (memory.systemTotal / 1024) *
                        (memory.systemUsage / 100)
                    ).toFixed(1),
                ),
                systemUsageTotal: Math.ceil(memory.systemTotal / 1024),
            };
        });
};

onMounted(() => {
  console.log('isNoCommunity')
    if (isNoCommunity) {
      serverNode().then((resp: any) => {
          if (resp.success) {
              serverNodeOptions.value = resp.result.map((item: any) => ({
                  label: item.name,
                  value: item.id,
              }));
              if (serverNodeOptions.value.length) {
                  serverId.value = serverNodeOptions.value[0]?.value;
              }
          }
      });
    } else {
      getData()
    }
});

onUnmounted(() => {
  unSub()
})

watch(
    () => serverId.value,
    (val) => {
        val && getData();
        emit('serviceChange', val)
    },
);

</script>

<style lang="less" scoped>
.dash-board {
    background-color: #fff;
  padding: 24px;
    .dash-board-items {
      display: flex;
      flex-wrap: wrap;
      border-radius: 2px;
      justify-content: space-between;

      gap: 24px;
    }
    .dash-board-item {
        flex: 1;
        //margin: 24px 12px;
        min-width: calc(25% - 24px);
    }
}

@media (max-width: 1400px) {
  .dash-board {
    .dash-board-item {
      min-width: calc(50% - 24px);
    }
  }
}
</style>
