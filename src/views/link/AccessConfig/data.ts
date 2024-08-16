import { getImage } from '@/utils/comm';
import i18n from '@/i18n'

const $t = i18n.global.t
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

const NetworkTypeMapping = new Map();
NetworkTypeMapping.set('websocket-server', 'WEB_SOCKET_SERVER');
NetworkTypeMapping.set('http-server-gateway', 'HTTP_SERVER');
NetworkTypeMapping.set('udp-device-gateway', 'UDP');
NetworkTypeMapping.set('coap-server-gateway', 'COAP_SERVER');
NetworkTypeMapping.set('mqtt-client-gateway', 'MQTT_CLIENT');
NetworkTypeMapping.set('mqtt-server-gateway', 'MQTT_SERVER');
NetworkTypeMapping.set('tcp-server-gateway', 'TCP_SERVER');
NetworkTypeMapping.set('official-edge-gateway', 'MQTT_SERVER');

const BackMap = new Map();
BackMap.set('mqtt-server-gateway', getImage('/access/mqtt.png'));
BackMap.set('websocket-server', getImage('/access/websocket.png'));
BackMap.set('modbus-tcp', getImage('/access/modbus.png'));
BackMap.set('coap-server-gateway', getImage('/access/coap.png'));
BackMap.set('tcp-server-gateway', getImage('/access/tcp.png'));
BackMap.set('Ctwing', getImage('/access/ctwing.png'));
BackMap.set('plugin_gateway', getImage('/access/plugin.png'));
BackMap.set('child-device', getImage('/access/child-device.png'));
BackMap.set('opc-ua', getImage('/access/opc-ua.png'));
BackMap.set('http-server-gateway', getImage('/access/http.png'));
BackMap.set('fixed-media', getImage('/access/video-device.png'));
BackMap.set('udp-device-gateway', getImage('/access/udp.png'));
BackMap.set('OneNet', getImage('/access/onenet.png'));
BackMap.set('OneNet-platform', getImage('/access/onenet.png'));
BackMap.set('gb28181-2016', getImage('/access/gb28181.png'));
BackMap.set('mqtt-client-gateway', getImage('/access/mqtt-broke.png'));
BackMap.set('edge-child-device', getImage('/access/child-device.png'));
BackMap.set('official-edge-gateway', getImage('/access/edge.png'));
BackMap.set('collector-gateway', getImage('/access/collector-gateway.png'));
BackMap.set('onvif',getImage('/access/onvif.png'));
BackMap.set('media-plugin',getImage('/access/media-plugin.png'))

const descriptionList = {
    'udp-device-gateway':
        $t('AccessConfig.data.428291-0'),
    'tcp-server-gateway':
        $t('AccessConfig.data.428291-1'),
    'websocket-server':
        $t('AccessConfig.data.428291-2'),
    'mqtt-client-gateway':
        $t('AccessConfig.data.428291-3'),
    'http-server-gateway':
        $t('AccessConfig.data.428291-4'),
    'mqtt-server-gateway':
        $t('AccessConfig.data.428291-5'),
    'coap-server-gateway':
        $t('AccessConfig.data.428291-6'),
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
        title: $t('AccessConfig.data.428291-7'),
        dataIndex: 'stream',
        key: 'stream',
        ellipsis: true,
        align: 'center',
        width: 100,
        scopedSlots: { customRender: 'stream' },
    },
    {
        title: $t('AccessConfig.data.428291-8'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
];

const ColumnsHTTP = [
    {
        title: $t('AccessConfig.data.428291-9'),
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
    },
    {
        title: $t('AccessConfig.data.428291-10'),
        dataIndex: 'example',
        key: 'example',
        ellipsis: true,
    },
    {
        title: $t('AccessConfig.data.428291-8'),
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
