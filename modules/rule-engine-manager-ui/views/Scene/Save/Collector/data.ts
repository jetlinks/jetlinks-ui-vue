import { providerImages } from "@rule-engine-manager-ui/assets/data-collect";

export const imgMap = new Map();
imgMap.set('BACNetIp', providerImages.BACNetIp);
imgMap.set('snap7', providerImages.snap7);
imgMap.set('MODBUS_RTU', providerImages.MODBUS_RTU);
imgMap.set('serialPort', providerImages.serialPort);
imgMap.set('MODBUS_TCP', providerImages.MODBUS_TCP);
imgMap.set('OPC_DA', providerImages.OPC_DA);
imgMap.set('OPC_UA', providerImages.OPC_UA);
imgMap.set('EtherNetIp', providerImages.EtherNetIp);
imgMap.set('CJ188', providerImages.CJ188);
imgMap.set('MELSEC_TCP', providerImages.MELSEC_TCP);
imgMap.set('OMRON_FINS', providerImages.OMRON_FINS);
imgMap.set('virtual', providerImages.virtual);

/**协议列表 */
export const protocolList = [
  { label: 'OPC_UA', value: 'OPC_UA', alias: 'opc-ua' },
  { label: 'MODBUS_TCP', value: 'MODBUS_TCP', alias: 'Modbus/TCP' },
  { label: 'COLLECTOR_GATEWAY', value: 'COLLECTOR_GATEWAY', alias: 'GATEWAY' },
  { label: 'S7', value: 'snap7', alias: 'snap7' },
  { label: 'IEC104', value: 'iec104', alias: 'IEC104' },
  { label: 'BACNetIp', value: 'BACNetIp', alias: 'BACNet/IP' }
]

export const StatusColorEnum = {
  running: 'success',
  disabled: 'error',
  partialError: 'processing',
  failed: 'warning',
  stopped: 'default',
};
