import { MetadataItem } from "../Product/typings";

export type DeviceInstance = {
  id: string;
  name: string;
  describe: string;
  description: string;
  productId: string;
  productName: string;
  protocolName: string;
  security: any;
  deriveMetadata: string;
  productMetadata: string;
  metadata: string;
  binds: any;
  state: {
    value: string;
    text: string;
  };
  creatorId: string;
  creatorName: string;
  createTime: number;
  registryTime: string;
  disabled?: boolean;
  aloneConfiguration?: boolean;
  deviceType: {
    value: string;
    text: string;
  };
  transportProtocol: string;
  messageProtocol: string;
  orgId: string;
  orgName: string;
  configuration: Record<string, any>;
  relations?: any[];
  cachedConfiguration: any;
  transport: string;
  protocol: string;
  address: string;
  registerTime: number;
  onlineTime: string | number;
  offlineTime: string | number;
  tags: any;
  photoUrl: string;
  independentMetadata?: boolean;
  accessProvider?: string;
  accessId?: string;
  features?: any[];
  parentId?: string;
  classifiedName?: string;
};

type Unit = {
  id: string;
  name: string;
  symbol: string;
  text: string;
  type: string;
  value: string;
  description: string;
};

type PropertyData = {
  data: {
    value?:
      | {
          formatValue: string;
          property: string;
          value: any;
        }
      | any;
    timeString: string;
    timestamp: number;
    formatValue: string;
    property: string;
  };
};

type InstanceModel = {
  current: Partial<DeviceInstance>;
  detail: Partial<DeviceInstance>;
  config: any;
  metadataItem: MetadataItem;
  params: Set<string>; // 处理无限循环Card
  active?: string; // 当前编辑的Card
  selectedRows: Map<string, any>;
}

export interface ActionsType {
  key: string;
  text?: string;
  disabled?: boolean;
  permission?: boolean;
  onClick?: (data: any) => void;
  style?: CSSProperties;
  tooltip?: TooltipProps;
  popConfirm?: PopconfirmProps;
  icon?: string;
  children?: ActionsType[];
}