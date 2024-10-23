import mediaApi from "@/api/media/channel";

let pc: RTCPeerConnection | null
let _tracks: Array<MediaStreamTrack> = []
const createRtc = () => {
    pc = new RTCPeerConnection()
}

export const openVideo = (deviceId: string, channelId: string, cb: (e: MediaStream) => void) =>{

    createRtc()

    const  AudioTransceiverInit = {
        direction: 'recvonly',
        sendEncodings:[]
    };
    const VideoTransceiverInit= {
        direction: 'recvonly',
        sendEncodings:[],
    };

    pc!.addTransceiver('video',VideoTransceiverInit);
    pc!.addTransceiver('audio',AudioTransceiverInit);

    pc!.createOffer().then((desc)=>{
        pc!.setLocalDescription(desc).then(() => {
            mediaApi.ptzStartPlay(deviceId, channelId, 'rtc',desc.sdp).then(resp => {
                let anwser: any = {};
                anwser.sdp = resp.sdp;
                anwser.type = 'answer';

                pc!.setRemoteDescription(anwser)
            })
        });
    })

    pc!.ontrack = e => {
        console.log('[ontrack]',e)
        _tracks.push(e.track)
        if (e.streams && e.streams.length>0) {
            cb?.(e.streams[0])
        } else {
            if(pc!.getReceivers().length === _tracks.length){
                const url = new MediaStream(_tracks);
                cb?.(url)
            }
        }
    }
}

export const closeVideo = () => {
    if (pc) {
        pc.close()
        pc = null
    }

    if (_tracks.length) {
        _tracks.forEach(item => {
            item.stop()
        })
    }
}
