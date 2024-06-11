import { saveProductMetadata } from "@/api/device/product";
import { saveMetadata } from "@/api/device/instance";
import type { DeviceInstance } from "../../Instance/typings";
import type { DeviceMetadata, MetadataItem, MetadataType, ProductItem } from "../../Product/typings";
import { differenceBy , cloneDeep } from "lodash-es";

const filterProductMetadata = (data: any[], productMetaData: any[]) => {
  const ids = productMetaData.map((item: any) => item.id)
  const idsSet = new Set(ids)
  return data.filter((a) => !idsSet.has(a.id))
}
/**
 * 更新物模型
 * @param type 物模型类型 "events" | "functions" | "properties" | "tags"
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
  // let productMetaData

  // if ((data as DeviceInstance).productMetadata) {
  //   productMetaData = JSON.parse((data as DeviceInstance).productMetadata)
  // }
  //
  // if (productMetaData) {
  //   if (productMetaData.properties && productMetaData.properties.length) {
  //     metadata.properties = filterProductMetadata(item, productMetaData.properties)
  //   }
  //   if (productMetaData.functions && productMetaData.functions.length) {
  //     metadata.functions = filterProductMetadata(item, productMetaData.functions)
  //   }
  //   if (productMetaData.events && productMetaData.events.length) {
  //     metadata.events = filterProductMetadata(item, productMetaData.events)
  //   }
  //   if (productMetaData.tags && productMetaData.tags.length) {
  //     metadata.tags = filterProductMetadata(item, productMetaData.tags)
  //   }
  // } else {
  //   metadata[type] = item as any
  // }
  // console.log(metadata, type)
  metadata[type] = (item || []).sort((a, b) => b?.sortsIndex - a?.sortsIndex) as any[]
  console.log('useMetadata', metadata)
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
      const metadata = JSON.parse(data.metadata || '{}')
      const productMetaData = JSON.parse(data?.productMetadata || '{}')
      const dealMetadata = JSON.parse(data.metadata || '{}')
      // 筛选出产品的物模型 剔除不传递给接口保存
      const productMetaDataMap = new Map()

      Object.keys(productMetaData).forEach((key:any)=>{
        if(Array.isArray(productMetaData[key])){
           const ids = productMetaData[key].map((item:any)=>{
            return item.id
          })
          productMetaDataMap.set(key,ids)
        }
      })
      Object.keys(metadata).forEach((key:any)=>{
        if(Array.isArray(metadata[key])){
          dealMetadata[key] =  metadata[key].filter((item:any,index:number)=>{
            //判断产品物模型是否有该id
            return !(productMetaDataMap.get(key) && productMetaDataMap.get(key).includes(item.id))
          })
        }
      })

      const newMetadata = Object.keys(metadata).reduce((prev, key) => {
        const productIds = new Set(productMetaData[key].map(item => item.id))
        console.log(metadata[key])
        prev[key] = metadata[key].filter(item => !productIds.has(item.id))
        return prev
      }, { })

      console.log(dealMetadata, newMetadata)

      return saveMetadata(data.id, newMetadata);
  }
};

/**
 * 删除物模型数据
 * @param type 物模型类型
 * @param item 删除的数据
 * @param data 设备/产品数据
 * @param onEvent 回调
 */
export const removeMetadata = (
  type: MetadataType,
  item: MetadataItem[],
  data: ProductItem | DeviceInstance,
  onEvent?: (type: 'remove', item: MetadataItem) => void,
): ProductItem | DeviceInstance => {
  const metadata = JSON.parse(data.metadata || '{}') as DeviceMetadata;
  const config = (metadata[type] || []) as MetadataItem[];
  // @ts-ignore
  metadata[type] = config.filter((i) => !item.map((r) => r.id).includes(i.id));
  onEvent?.('remove', item);
  data.metadata = JSON.stringify(metadata);
  return data;
};
