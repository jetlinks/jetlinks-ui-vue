import VideoIcon from '@jetlinks-web-core/assets/knowledge-base/video-icon.png';
import DocIcon from '@jetlinks-web-core/assets/knowledge-base/doc-icon.png';
import ImageIcon from '@jetlinks-web-core/assets/knowledge-base/image-icon.png';
import AudioIcon from '@jetlinks-web-core/assets/knowledge-base/mp3-icon.png';

export const handleSetFileIcon = (type: string) => {
  if (!type) {
    return DocIcon;
  }

  type = type.toLowerCase();
  if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(type)) {
    return VideoIcon;
  }
  if (['pdf', 'docx', 'txt', 'md'].includes(type)) {
    return DocIcon;
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) {
    return ImageIcon;
  }
  if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma', 'aiff', 'opus'].includes(type)) {
    return AudioIcon;
  }
  return DocIcon;
};

/**
 * 计算文件大小
 * @param {number} bytes
 * @returns {string}
 */

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
