import { getImage } from "@/utils/comm";

export const imgMap = new Map<any, any>();
imgMap.set('txt', getImage('/running/txt.png'));
imgMap.set('doc', getImage('/running/doc.png'));
imgMap.set('xls', getImage('/running/xls.png'));
imgMap.set('ppt', getImage('/running/ppt.png'));
imgMap.set('docx', getImage('/running/docx.png'));
imgMap.set('xlsx', getImage('/running/xlsx.png'));
imgMap.set('pptx', getImage('/running/pptx.png'));
imgMap.set('pdf', getImage('/running/pdf.png'));
imgMap.set('img', getImage('/running/img.png'));
imgMap.set('error', getImage('/running/error.png'));
imgMap.set('video', getImage('/running/video.png'));
imgMap.set('other', getImage('/running/other.png'));
imgMap.set('obj', getImage('/running/obj.png'));

export const imgList = ['.jpg', '.png', '.swf', '.tiff'];
export const videoList = ['.m3u8', '.flv', '.mp4', '.rmvb', '.mvb'];
export const fileList = ['.txt', '.doc', '.xls', '.pdf', '.ppt', '.docx', '.xlsx', '.pptx'];

export const getType = (url: string) => {
    let t: string = '';
    [...imgList, ...videoList, ...fileList].map((item) => {
        const str = item.slice(1, item.length);
        if (url && String(url).indexOf(str) !== -1) {
            if (imgList.includes(item)) {
                t = 'img';
            } else if (videoList.includes(item)) {
                t = 'video';
            } else {
                t = str;
            }
        }
    });
    return t;
};