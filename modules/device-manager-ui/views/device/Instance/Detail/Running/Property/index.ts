import { running } from "../../../../../../assets";

export const imgMap = new Map<any, any>();
imgMap.set('txt', running.txt);
imgMap.set('doc', running.doc);
imgMap.set('xls', running.xls);
imgMap.set('ppt', running.ppt);
imgMap.set('docx', running.docx);
imgMap.set('xlsx', running.xlsx);
imgMap.set('pptx', running.pptx);
imgMap.set('pdf', running.pdf);
imgMap.set('img', running.img);
imgMap.set('error', running.error);
imgMap.set('video', running.video);
imgMap.set('other', running.other);
imgMap.set('obj', running.obj);

export const imgList = ['.jpg', '.png', '.swf', '.tiff'];
export const videoList = ['.m3u8', '.flv', '.mp4', '.rmvb', '.mvb'];
export const fileList = ['.txt', '.doc', '.xls', '.pdf', '.ppt', '.docx', '.xlsx', '.pptx'];

// export const getType = (url: string) => {
//     let t: string = '';
//     [...imgList, ...videoList, ...fileList].map((item) => {
//         const str = item.slice(1, item.length);
//         if (url && String(url).indexOf(str) !== -1) {
//             if (imgList.includes(item)) {
//                 t = 'img';
//             } else if (videoList.includes(item)) {
//                 t = 'video';
//             } else {
//                 t = str;
//             }
//         }
//     });
//     return t;
// };

/**
 * 根据base64字符串判断文件格式
 * @param base64String base64字符串
 * @returns 文件类型：'img', 'video', 'pdf', 'doc' 等，如果无法识别返回 'other'
 */
export const getType = (base64String: string): string => {
    if (!base64String || typeof base64String !== 'string') {
        return 'other';
    }

    // 去除data URL前缀，只保留base64数据部分
    const cleanBase64 = base64String.replace(/^data:([a-zA-Z]+\/[a-zA-Z0-9-.+]+).*,/, '');

    // 如果有MIME类型，优先使用MIME类型判断
    const mimeTypeMatch = base64String.match(/^data:([a-zA-Z]+\/[a-zA-Z0-9-.+]+);/);
    if (mimeTypeMatch) {
        const mimeType = mimeTypeMatch[1];
        if (mimeType.startsWith('image/')) {
            return 'img';
        } else if (mimeType.startsWith('video/')) {
            return 'video';
        } else if (mimeType.includes('pdf')) {
            return 'pdf';
        } else if (mimeType.includes('word') || mimeType.includes('document')) {
            return 'docx';
        } else if (mimeType.includes('sheet') || mimeType.includes('excel')) {
            return 'xlsx';
        } else if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) {
            return 'pptx';
        } else if (mimeType.includes('text')) {
            return 'txt';
        }
    }

    // 根据base64头部字节判断文件类型
    const fileTypeSignatures: { [key: string]: string } = {
        // 图片格式
        'IVBORw0KGgo': 'png',      // PNG
        '/9j/': 'jpg',             // JPEG
        'R0lGOD': 'gif',           // GIF
        'UklGR': 'webp',           // WebP
        'iVBORw0KGgoAAAANSUhEUg': 'png', // PNG (更完整的匹配)

        // 视频格式
        'AAAAIGZ0eXB': 'mp4',     // MP4
        'BAAAAHUAAAAAAAAAAAAAA': 'avi', // AVI

        // 文档格式
        'JVBERi0xLjc': 'pdf',     // PDF
        '0M8R4KGxGuE': 'doc',     // DOC (旧版)
        'UEsDBBQ': 'docx',        // DOCX/PPTX/XLSX (ZIP格式)

        // 其他格式
        'GIF89a': 'gif',          // GIF
        'AAABAAEA': 'ico',        // ICO
    };

    // 检查文件头签名
    for (const [signature, fileType] of Object.entries(fileTypeSignatures)) {
        if (cleanBase64.startsWith(signature)) {
            // 根据文件类型返回通用分类
            if (['png', 'jpg', 'gif', 'webp'].includes(fileType)) {
                return 'img';
            } else if (['mp4', 'avi'].includes(fileType)) {
                return 'video';
            } else if (fileType === 'pdf') {
                return 'pdf';
            } else if (['doc', 'docx'].includes(fileType)) {
                return 'docx';
            } else if (fileType === 'xlsx') {
                return 'xlsx';
            } else if (fileType === 'pptx') {
                return 'pptx';
            } else if (fileType === 'txt') {
                return 'txt';
            } else {
                return fileType;
            }
        }
    }

    // 如果都没有匹配到，尝试通过文件扩展名判断（如果base64包含文件名信息）
    const extensionMatch = base64String.match(/data:.*;name=.*\.(\w+);/);
    if (extensionMatch) {
        const extension = extensionMatch[1].toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) {
            return 'img';
        } else if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(extension)) {
            return 'video';
        } else if (['pdf'].includes(extension)) {
            return 'pdf';
        } else if (['doc', 'docx'].includes(extension)) {
            return 'docx';
        } else if (['xls', 'xlsx'].includes(extension)) {
            return 'xlsx';
        } else if (['ppt', 'pptx'].includes(extension)) {
            return 'pptx';
        } else if (['txt'].includes(extension)) {
            return 'txt';
        } else {
            return extension;
        }
    }

    return 'other';
};
