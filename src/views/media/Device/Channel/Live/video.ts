import mediaApi from "@/api/media/channel";

let pc: RTCPeerConnection | null
const createRtc = () => {
    pc = new RTCPeerConnection()
}

export const openVideo = (deviceId: string, channelId: string, element?: HTMLVideoElement) =>{
    const _tracks: any[] = []

    createRtc()

    navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    }).then(async stream => {
        //  创建Offer，开始推流
        pc!.createOffer().then((desc)=>{
            pc!.setLocalDescription(desc).then(() => {
                mediaApi.broadcastPush(deviceId, channelId, desc.sdp).then(resp => {
                    let anwser: any = {};
                    anwser.sdp = resp.sdp;
                    anwser.type = 'answer';
                    pc!.setRemoteDescription(anwser)
                })
            });
        })
    })

    pc!.ontrack = e => {
        _tracks.push(e.track)
        if (e.streams && e.streams.length>0) {
            element!.srcObject = e.streams[0];
        } else {
            if(pc!.getReceivers().length === _tracks.length){
                element!.srcObject = new MediaStream(_tracks);
            }
        }
    }
}

export const closeVideo = () => {
    if (pc) {
        pc.close()
        pc = null
    }
}
