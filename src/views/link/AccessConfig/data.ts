import { getImage } from '@/utils/comm';

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
        'UDP可以让设备无需建立连接就可以与平台传输数据。在允许一定程度丢包的情况下，提供轻量化且简单的连接。',
    'tcp-server-gateway':
        'TCP服务是一种面向连接的、可靠的、基于字节流的传输层通信协议。设备可通过TCP服务与平台进行长链接，实时更新状态并发送消息。可自定义多种粘拆包规则，处理传输过程中可能发生的粘拆包问题。',
    'websocket-server':
        'WebSocket是一种在单个TCP连接上进行全双工通信的协议，允许服务端主动向客户端推送数据。设备通过WebSocket服务与平台进行长链接，实时更新状态并发送消息，且可以发布订阅消息',
    'mqtt-client-gateway':
        'MQTT是ISO 标准下基于发布/订阅范式的消息协议，具有轻量、简单、开放和易于实现的特点。平台使用指定的ID接入其他远程平台，订阅消息。也可添加用户名和密码校验。可设置最大消息长度。可统一设置共享的订阅前缀。',
    'http-server-gateway':
        'HTTP服务是一个简单的请求-响应的基于TCP的无状态协议。设备通过HTTP服务与平台进行灵活的短链接通信，仅支持设备和平台之间单对单的请求-响应模式',
    'mqtt-server-gateway':
        'MQTT是ISO 标准下基于发布/订阅范式的消息协议，具有轻量、简单、开放和易于实现的特点。提供MQTT的服务端，以供设备以长链接的方式接入平台。设备使用唯一的ID，也可添加用户名和密码校验。可设置最大消息长度。',
    'coap-server-gateway':
        'CoAP是针对只有少量的内存空间和有限的计算能力提供的一种基于UDP的协议。便于低功耗或网络受限的设备与平台通信，仅支持设备和平台之间单对单的请求-响应模式。',
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
        title: '上下行',
        dataIndex: 'stream',
        key: 'stream',
        ellipsis: true,
        align: 'center',
        width: 100,
        scopedSlots: { customRender: 'stream' },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
];

const ColumnsHTTP = [
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
    },
    {
        title: '示例',
        dataIndex: 'example',
        key: 'example',
        ellipsis: true,
    },
    {
        title: '说明',
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
