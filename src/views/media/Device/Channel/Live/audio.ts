import mediaApi from '@/api/media/channel'

let localStream: MediaStream | null
let eventSource: any
let volumeTimer: any
let localPc: RTCPeerConnection | null
export const openAudio = (deviceId: string, channelId: string, options: { volume: (value: number) => void }) => {
    localPc = new RTCPeerConnection()
    localPc.createDataChannel('chat');

    const getUserMedia = navigator.mediaDevices.getUserMedia || navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia

    getUserMedia({
        audio: true
    }).then(async stream => {
        console.log(stream)
        let audioTransceiver
        localStream = stream
        const AudioTransceiverInit: any = {
            direction: 'sendrecv',
            sendEncodings:[]
        };

        if (stream.getAudioTracks().length > 0) {
            audioTransceiver = localPc!.addTransceiver(stream.getAudioTracks()[0],
                AudioTransceiverInit);
        } else {
            AudioTransceiverInit.direction = 'recvonly';
            audioTransceiver = localPc!.addTransceiver('audio', AudioTransceiverInit);
        }

        //  创建Offer，开始推流
        localPc!.createOffer().then((desc)=>{
            localPc!.setLocalDescription(desc).then(() => {
                mediaApi.broadcastPush(deviceId, channelId, desc.sdp).then(resp => {
                    let anwser: any = {};
                    anwser.sdp = resp.sdp;
                    anwser.type = 'answer';

                    localPc!.setRemoteDescription(anwser).then(()=>{
                        setTimeout(() => {
                            mediaApi.broadcastStart(deviceId, channelId)
                        }, 30)
                    })

                })
            });
        })

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
    if (localPc) {
        localPc.close()
        localPc = null
    }

    if (localStream) {
        localStream.getTracks().forEach(function(track) {
            track.stop(); // 停止所有的轨道，从而关闭麦克风
            // 关闭推流
            if (eventSource) {
                eventSource.onclose()
            }
        });
        window.clearInterval(volumeTimer)
        volumeTimer = null
        localStream = null; // 重置mediaStream
    }
}
