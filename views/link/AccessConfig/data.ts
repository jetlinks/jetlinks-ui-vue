import { access } from '../../../assets'
import i18n from '@jetlinks-web-core/locales';
const ProtocolMapping = new Map();
ProtocolMapping.set('websocket-server', 'WebSocket');
ProtocolMapping.set('http-server-gateway', 'HTTP');
ProtocolMapping.set('udp-device-gateway', 'UDP');
ProtocolMapping.set('coap-server-gateway', 'CoAP');
ProtocolMapping.set('mqtt-client-gateway', 'MQTT');
ProtocolMapping.set('mqtt-server-gateway', 'MQTT');
ProtocolMapping.set('tcp-server-gateway', 'TCP');
ProtocolMapping.set('child-device', '');
ProtocolMapping.set('OneNet', 'HTTP');
ProtocolMapping.set('OneNet-platform', 'HTTP');
ProtocolMapping.set('Ctwing', 'HTTP');
ProtocolMapping.set('modbus-tcp', 'MODBUS_TCP');
ProtocolMapping.set('opc-ua', 'OPC_UA');
ProtocolMapping.set('edge-child-device', 'EdgeGateway');
ProtocolMapping.set('collector-gateway', 'collector-gateway');
ProtocolMapping.set('official-edge-gateway', 'MQTT');
ProtocolMapping.set('agent-device-gateway', 'MQTT');
ProtocolMapping.set('agent-media-device-gateway', 'MQTT');

const NetworkTypeMapping = new Map();
NetworkTypeMapping.set('websocket-server', 'WEB_SOCKET_SERVER');
NetworkTypeMapping.set('http-server-gateway', ['HTTP_SERVER']);
NetworkTypeMapping.set('udp-device-gateway', 'UDP');
NetworkTypeMapping.set('coap-server-gateway', 'COAP_SERVER');
NetworkTypeMapping.set('mqtt-client-gateway', 'MQTT_CLIENT');
NetworkTypeMapping.set('mqtt-server-gateway', 'MQTT_SERVER');
NetworkTypeMapping.set('tcp-server-gateway', 'TCP_SERVER');
NetworkTypeMapping.set('official-edge-gateway', 'MQTT_SERVER');
NetworkTypeMapping.set('agent-device-gateway', ['MQTT_SERVER', 'HTTP_SERVER']);
NetworkTypeMapping.set('agent-media-device-gateway', ['MQTT_SERVER', 'HTTP_SERVER']);

const BackMap = new Map();
BackMap.set('mqtt-server-gateway', access.Mqtt);
BackMap.set('websocket-server', access.Websocket);
BackMap.set('modbus-tcp', access.Modbus);
BackMap.set('coap-server-gateway', access.Coap);
BackMap.set('tcp-server-gateway', access.Tcp);
BackMap.set('Ctwing', access.Ctwing);
BackMap.set('plugin_gateway', access.Plugin);
BackMap.set('child-device', access.ChildDevice);
BackMap.set('opc-ua',access.OpcUa);
BackMap.set('http-server-gateway', access.Http);
BackMap.set('fixed-media', access.VideoDevice);
BackMap.set('udp-device-gateway', access.Udp);
BackMap.set('OneNet', access.Onenet);
BackMap.set('OneNet-platform', access.Onenet);
BackMap.set('gb28181-2016', access.Gb28181);
BackMap.set('mqtt-client-gateway', access.MqttBroke);
BackMap.set('edge-child-device', access.ChildDevice);
BackMap.set('official-edge-gateway', access.Edge);
BackMap.set('collector-gateway', access.CollectorGateway);
BackMap.set('onvif', access.Onvif);
BackMap.set('media-plugin', access.MediaPlugin)
BackMap.set('agent-device-gateway', access.AgentDevice)
BackMap.set('agent-media-device-gateway', access.MediaPlugin)
BackMap.set('composite-device-gateway', access.Composite)

const descriptionList = {
    'udp-device-gateway':
        i18n.global.t('AccessConfig.data.192545-0'),
    'tcp-server-gateway':
        i18n.global.t('AccessConfig.data.192545-1'),
    'websocket-server':
        i18n.global.t('AccessConfig.data.192545-2'),
    'mqtt-client-gateway':
        i18n.global.t('AccessConfig.data.192545-3'),
    'http-server-gateway':
        i18n.global.t('AccessConfig.data.192545-4'),
    'mqtt-server-gateway':
        i18n.global.t('AccessConfig.data.192545-5'),
    'coap-server-gateway':
        i18n.global.t('AccessConfig.data.192545-6'),
};

const ColumnsMQTT = [
    // {
    //     title: '分组',
    //     dataIndex: 'group',
    //     key: 'group',
    //     ellipsis: true,
    //     align: 'center',
    //     width: 100,
    //     scopedSlots: { customRender: 'group' },
    // },
    {
        title: 'topic',
        dataIndex: 'topic',
        key: 'topic',
        ellipsis: true,
    },
    {
        title: i18n.global.t('DeviceAccess.index.594346-22'),
        dataIndex: 'stream',
        key: 'stream',
        ellipsis: true,
        align: 'center',
        width: 100,
        scopedSlots: { customRender: 'stream' },
    },
    {
        title: i18n.global.t('DeviceAccess.index.594346-23'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
];

const ColumnsHTTP = [
    {
        title: i18n.global.t('DeviceAccess.index.594346-24'),
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
    },
    {
        title: i18n.global.t('DeviceAccess.index.594346-25'),
        dataIndex: 'example',
        key: 'example',
        ellipsis: true,
    },
    {
        title: i18n.global.t('DeviceAccess.index.594346-23'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
];

export {
    NetworkTypeMapping,
    ProtocolMapping,
    BackMap,
    descriptionList,
    ColumnsMQTT,
    ColumnsHTTP,
};
