import FlvPlugin from 'xgplayer-flv'
import HlsPlugin from "xgplayer-hls"
export const settingEnum = {
    mp4: {
        isLive: false,
    },
    flv: {
        plugins: [FlvPlugin],
    },
    m3u8: {
        plugins: [HlsPlugin],
    }
}
