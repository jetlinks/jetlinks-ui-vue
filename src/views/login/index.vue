<template>
  <a-spin :spinning="loading" :delay="300">
    <div class="container">
      <div class="left">
        <img :src="systemInfo?.front?.background || bgImage" alt="" />
        <a
          v-if="basis?.showRecordNumber"
          href="https://beian.miit.gov.cn/#/Integrated/index"
          target="_blank"
          rel="noopener noreferrer"
          class="records"
        >
          {{ $t('login.index.102238-0') }}{{ basis?.recordNumber }}
        </a>
      </div>
      <div class="right">
        <Right
          :logo="systemInfo?.front?.logo"
          :title="layout?.title"
          :bindings="bindings"
          v-model:loading="loading"
        />
      </div>
    </div>
  </a-spin>
</template>
<script setup name="Login" lang="ts">
import { getImage, LocalStore } from "@jetlinks-web/utils";
import { useSystemStore } from "@/store/system";
import { storeToRefs } from "pinia";
import Right from "./right.vue";
import { bindInfo } from "@/api/login";
import {useI18n} from "vue-i18n";

const { t: $t } = useI18n();
const systemStore = useSystemStore();
const { systemInfo, layout } = storeToRefs(systemStore);
const loading = ref(false);

const bgImage = getImage("/login/login.png");
const bindings = ref([]);

const basis: any = computed(() => {
  return systemInfo.value.front || {};
});

const getOpen = async () => {
  await systemStore.queryVersion();
  const version = LocalStore.get("version_code");
  if (version !== "community") {
    bindInfo().then((res: any) => {
      if (res.success) {
        bindings.value = res.result
      }
    });
  }
  await systemStore.querySingleInfo("front");
};

getOpen();
</script>

<style scoped lang="less">
.container {
  display: flex;
  height: 100vh;
  background-color: #fff;
  > div {
    height: 100%;
  }

  .left {
    flex: 1;
    img {
      height: 100%;
      width: 100%;
    }
    .records {
      position: absolute;
      top: 96%;
      left: 35%;
      color: rgba(0, 0, 0, 0.35);
      font-size: 14px;
    }
  }

  .right {
    min-width: 400px;
    width: 27%;
    display: flex;
    padding-top: 10%;
    flex-direction: column;
    justify-content: space-between;
  }
}
</style>
