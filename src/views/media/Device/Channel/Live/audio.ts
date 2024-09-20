import mediaApi from '@/api/media/channel'
import {getToken} from "@/utils/comm";
import { fetchEventSource } from '@microsoft/fetch-event-source';
import {TOKEN_KEY} from "@/utils/variable";


let localStream: MediaStream | null
let eventSource: any
let volumeTimer: any

const sendOffer = async (deviceId: string, channelId: string) => {

    const url = mediaApi.broadcastPushUrl(deviceId, channelId)

    // const eventSource = await fetchEventSource(url, {
    //     onmessage(ev) {
    //         console.log(ev.data);
    //     },
    //     headers: {
    //         [TOKEN_KEY]: getToken(),
    //     },
    //     method: 'POST'
    // });

    const localPc = new RTCPeerConnection()

    // const dc = localPc.createDataChannel("channel");
    //
    // dc.onmessage = (e) => console.log("Get Message：", e.data);


    //
    // // 添加RTC流
    localStream?.getTracks().forEach((track) => {
        localPc.addTrack(track)
        console.log('addTrack', track)
    })
    //
    // // 给当前RTC流设置监听事件(协议完成回调)
    localPc.onicegatheringstatechange  = (event) => {
        console.log('localPc:', eventSource, event, localPc.localDescription)
        // 回调时，将自己candidate发给对方，对方可以直接addIceCandidate(candidate)添加可以获取流
        // if (localPc.iceGatheringState === "complete" && eventSource) {
        //     eventSource.send(localPc.localDescription)
        //     mediaApi.broadcastStart(deviceId, channelId)
        // }
    }

    // // 发起方：创建offer(成功将offer的设置当前流，并发送给接收方)
    let offer = await localPc.createOffer()
    // // 建立连接，此时就会触发onicecandidate，然后注册ontrack
    await localPc.setLocalDescription(offer)
}

export const openAudio = (deviceId: string, channelId: string, options: { volume: (value: number) => void }) => {
    navigator.mediaDevices.getUserMedia({
        audio: true
    }).then(async stream => {
        console.log(stream)
        localStream = stream
        //  开始推流
        await sendOffer(deviceId, channelId)

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const context = new AudioContext();

        // 创建一个MediaStream源节点
        const mediaStreamSource = context.createMediaStreamSource(stream);

        // 连接节点并分析音量
        mediaStreamSource.connect(context.destination);

        // 创建一个分析器
        const analyser = context.createAnalyser();
        mediaStreamSource.connect(analyser);

        // 定义一个更新音量的函数
        function updateVolume() {
            // 创建一个缓冲区来分析音量
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            // 计算平均音量（可以根据需要调整）
            const volume = Math.sqrt(array.reduce((sum, value) => sum + value * value, 0) / array.length);
            console.log('updateVolume', volume)

            if (options.volume) {
                options.volume(volume)
            }
        }

        // 每隔50毫秒更新一次音量
        if (volumeTimer) {
            window.clearInterval(volumeTimer)
            volumeTimer = null
        }
        volumeTimer = setInterval(updateVolume, 50);
    })
}

export const closeAudio = () => {
    if (localStream) {
        localStream.getTracks().forEach(function(track) {
            track.stop(); // 停止所有的轨道，从而关闭麦克风
            // 关闭推流
            if (eventSource) {
                eventSource.onclose()
            }

            window.clearInterval(volumeTimer)
            volumeTimer = null
        });
        localStream = null; // 重置mediaStream
    }
}
