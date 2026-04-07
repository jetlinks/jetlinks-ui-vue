<template>
  <slot></slot>
</template>

<script setup lang="ts" name="CheckItem">
import { storeToRefs } from "pinia";
import { useSceneStore } from "@rule-engine-manager-ui/store/scene";
import { Form } from "ant-design-vue";
import {
  queryProductList,
  detail as deviceDetailQuery,
  queryNoPagingPost,
} from "@rule-engine-manager-ui/api/others";
import { getTreeData_api } from "@rule-engine-manager-ui/api/department";
import {query as channelQuery} from '@rule-engine-manager-ui/api/channel'
import {queryCollector, queryPointNoPagingV2} from '@rule-engine-manager-ui/api/collector'

const sceneStore = useSceneStore();
const { data } = storeToRefs(sceneStore);
const formItemContext = Form.useInjectFormItemContext();

const formTouchOff = () => {
  formItemContext.onFieldChange();
};

const check = async (): Promise<boolean> => {
  const deviceTrigger = data.value.trigger!.device!;
  const productId = deviceTrigger.productId;

  // 判断产品是否删除
  const proResp = await queryProductList({
    terms: [{ terms: [{ column: "id", termType: "eq", value: productId }] }],
  });
  if (proResp.success && (proResp.result as any)?.total === 0) {
    data.value.trigger!.device!.productId = "";
    return false;
  }

  const productDetail = proResp?.result?.data?.[0];
  const selectorValues = deviceTrigger.selectorValues?.map(
    (item) => item.value
  );
  let metadata = JSON.parse(productDetail?.metadata || "{}"); // 获取当前产品物模型

  // 判断设备是否删除
  if (deviceTrigger.selector === "fixed") {
    // 设备
    // const deviceResp = await queryDetailListNoPaging({
    //   terms: [{ column: 'id', termType: 'in', value: selectorValues?.toString() }],
    //   context: {
    //     "includeTags": false,
    //     "includeBind": false,
    //     "includeRelations": false,
    //     "includeFirmwareInfos": false
    //   }
    // })
    const deviceResp = await queryNoPagingPost({
      terms: [
        {
          terms: [
            { column: "id", termType: "in", value: selectorValues?.toString() },
          ],
        },
      ],
      paging: false,
    });

    if (
      deviceResp.success &&
      deviceResp.result.length !== selectorValues!.length
    ) {
      data.value.trigger!.device!.selectorValues = undefined;
      return false;
    }

    if (selectorValues!.length === 1) {
      const deviceDetailResp = await deviceDetailQuery(selectorValues![0]);
      const deviceDetail = deviceDetailResp?.result;
      // const deviceDetail = deviceResp.result[0]
      metadata = JSON.parse(deviceDetail?.metadata || "{}"); // 只选中一个设备，以设备物模型为准
    }
  } else if (deviceTrigger.selector === "org") {
    // 组织
    const orgResp = await getTreeData_api({
      paging: false,
      terms: [{ column: "id", termType: "eq", value: selectorValues![0] }],
    });

    if (
      orgResp.success &&
      (orgResp.result as any[]).length !== selectorValues!.length
    ) {
      data.value.trigger!.device!.selectorValues = undefined;
      return false;
    }
  }

  // 判断物模型
  if (
    ["readProperty", "writeProperty"].includes(
      deviceTrigger.operation?.operator!
    )
  ) {
    let hasProperties = false;
    if (metadata.properties?.length) {
      if (
        deviceTrigger.operation?.readProperties &&
        deviceTrigger.operation?.readProperties.length
      ) {
        // hasProperties = metadata.properties.every((item: any) => deviceTrigger.operation!.readProperties!.includes(item.id))
        hasProperties = deviceTrigger.operation!.readProperties.every((_id) =>
          metadata.properties.some((item: any) => item.id === _id)
        );
      } else if (
        deviceTrigger.operation?.writeProperties &&
        Object.keys(deviceTrigger.operation?.writeProperties).length
      ) {
        const key = Object.keys(deviceTrigger.operation?.writeProperties)[0];
        hasProperties = metadata.properties.some(
          (item: any) => key === item.id
        );
      }
    }

    if (!hasProperties) {
      if (deviceTrigger.operation?.operator === "readProperty") {
        deviceTrigger.operation!.readProperties = [];
      } else {
        deviceTrigger.operation!.writeProperties = {};
      }
      return false;
    }
  }

  if (deviceTrigger.operation?.operator === "invokeFunction") {
    let hasProperties = false;
    if (metadata.functions.length) {
      const functionId = deviceTrigger.operation?.functionId;
      hasProperties = metadata.functions.some(
        (item: any) => functionId === item.id
      );
    }

    if (!hasProperties) {
      deviceTrigger.operation.functionId = undefined;
      deviceTrigger.operation.functionParameters = [];
      return false;
    }
  }

  if (deviceTrigger.operation?.operator === "reportEvent") {
    let hasProperties = false;
    if (metadata.events.length) {
      const eventId = deviceTrigger.operation.eventId;
      hasProperties = metadata.events.some((item: any) => eventId === item.id);
    }

    if (!hasProperties) {
      deviceTrigger.operation.eventId = undefined;
      return false;
    }
  }

  return true;
};

const checkCollector = async (): Promise<boolean> => {

  const channelResp = await channelQuery({ terms: [{ column: 'id', value: data.value.options.channelId }] })

  if (channelResp.success && !channelResp.result.data.length) {
    data.value.options.channelId = ""
    return false
  }

  const collectorResp = await queryCollector({ terms: [{ column: 'id', value: data.value.trigger!.collector!.pointSelectInfo.collectorId }] });

  if (collectorResp.success && !collectorResp.result.data.length) {
    data.value.trigger!.collector!.pointSelectInfo.collectorId = ''
    return true
  }

  const pointResp = await queryPointNoPagingV2({
    terms: [
      {
        column: 'collectorId',
        value: data.value.trigger!.collector!.pointSelectInfo.collectorId,
      }
    ]
  })

  if (pointResp.success && data.value.trigger?.collector) {
    const pointSet = new Set(pointResp.result.map((item: any) => item.id))
    const result = data.value.trigger?.collector?.pointSelectInfo.pointIds.every(p => pointSet.has(p))

    if (!result) {
      data.value.trigger.collector!.pointSelectInfo.pointIds = []
    }

    return !!result
  }

  return true
}

const checkInit = async () => {
  let checkStatus = true
  if (data.value.trigger?.device) {
    checkStatus = await check();

  } else if (data.value.trigger?.collector) {
    checkStatus = await checkCollector();
  }
  console.log('checkStatus', checkStatus)
  if (!checkStatus) {
    formTouchOff();
  }
};

checkInit();
</script>

<style scoped></style>
