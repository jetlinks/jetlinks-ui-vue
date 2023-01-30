import { saveProductMetadata } from "@/api/device/product";
import { saveMetadata } from "@/api/device/instance";
import type { DeviceInstance } from "../../Instance/typings";
import type { DeviceMetadata, MetadataItem, MetadataType, ProductItem } from "../../Product/typings";

/**
 * 更新物模型
 * @param type 物模型类型 events
 * @param item 物模型数据 【{a},{b},{c}】
 // * @param target product、device
 * @param data product 、device [{event:[1,2,3]]
 * @param onEvent 数据更新回调：更新数据库、发送事件等操作
 *
 */
 export const updateMetadata = (
  type: MetadataType,
  item: MetadataItem[],
  // target: 'product' | 'device',
  data: ProductItem | DeviceInstance,
  onEvent?: (item: string) => void,
): ProductItem | DeviceInstance => {
  if (!data) return data;
  const metadata = JSON.parse(data.metadata || '{}') as DeviceMetadata;
  const config = (metadata[type] || []) as MetadataItem[];
  if (item.length > 0) {
    item.forEach((i) => {
      const index = config.findIndex((c) => c.id === i.id);
      if (index > -1) {
        config[index] = i;
        // onEvent?.('update', i);
      } else {
        config.push(i);
        // onEvent?.('add', i);
      }
    });
  } else {
    console.warn('未触发物模型修改');
  }
  // @ts-ignore
  metadata[type] = config.sort((a, b) => b?.sortsIndex - a?.sortsIndex);
  data.metadata = JSON.stringify(metadata);
  onEvent?.(data.metadata)
  return data;
};

/**
 * 保存物模型数据到服务器
 * @param type 类型
 * @param data 数据
 */
export const asyncUpdateMetadata = (
  type: 'product' | 'device',
  data: ProductItem | DeviceInstance,
): Promise<any> => {
  switch (type) {
    case 'product':
      return saveProductMetadata(data);
    case 'device':
      return saveMetadata(data.id, JSON.parse(data.metadata || '{}'));
  }
};