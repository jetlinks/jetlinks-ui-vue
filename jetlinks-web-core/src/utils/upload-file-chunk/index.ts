import CryptoJS from 'crypto-js'
import { createSliceWorker } from './create-slice-worker'

export const CHUNK_SIZE = 1024 * 1024 * 5
export const THREAD_COUNT = navigator.hardwareConcurrency || 4

export const getFileExtension = (filename: string) => {
  if (!filename) {
    return ''
  }

  const dotIndex = filename.lastIndexOf('.')

  if (dotIndex > -1 && dotIndex < filename.length - 1) {
    return filename.substring(dotIndex + 1).toLowerCase()
  }

  return ''
}

const arrayBufferToWordArray = (arrayBuffer: ArrayBuffer) => {
  return CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer))
}

const readBlobAsArrayBuffer = (blob: Blob): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result
      if (result instanceof ArrayBuffer) {
        resolve(result)
        return
      }
      reject(new Error('文件读取失败'))
    }
    fileReader.onerror = () => {
      reject(new Error('文件读取出错'))
    }
    fileReader.readAsArrayBuffer(blob)
  })
}

export const getFileHash = async (file: File): Promise<string> => {
  const md5 = CryptoJS.algo.MD5.create()
  const hashChunkSize = CHUNK_SIZE
  const chunkCount = Math.ceil(file.size / hashChunkSize)

  for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex++) {
    const start = chunkIndex * hashChunkSize
    const end = Math.min(start + hashChunkSize, file.size)
    const arrayBuffer = await readBlobAsArrayBuffer(file.slice(start, end))
    md5.update(arrayBufferToWordArray(arrayBuffer))
  }

  return md5.finalize().toString()
}

export async function handleSliceUploadFile(file: File, chunkSize?: number) {
  const currentChunkSize = chunkSize || CHUNK_SIZE
  const chunkCount = Math.ceil(file.size / currentChunkSize)

  if (!chunkCount) {
    return []
  }

  const workerCount = Math.min(THREAD_COUNT, chunkCount)
  const threadChunkCounts = Math.ceil(chunkCount / workerCount)
  const result: any[] = []
  const fileType = getFileExtension(file.name)
  const fileHash = await getFileHash(file)

  return new Promise((resolve, reject) => {
    let completedWorkers = 0
    let hasRejected = false

    const createAndConfigureWorker = (workerIndex: number) => {
      const start = workerIndex * threadChunkCounts
      let end = (workerIndex + 1) * threadChunkCounts

      if (end > chunkCount) {
        end = chunkCount
      }

      const worker = createSliceWorker()

      worker.onerror = (err) => {
        worker.terminate()
        if (hasRejected) {
          return
        }
        hasRejected = true
        reject(err)
      }

      worker.onmessage = (e) => {
        for (let i = start; i < end; i++) {
          result[i] = e.data[i - start]
        }

        completedWorkers++
        worker.terminate()

        if (!hasRejected && completedWorkers === workerCount) {
          resolve(result)
        }
      }

      worker.postMessage({
        start,
        end,
        file,
        fileHash,
        chunkSize: currentChunkSize,
        chunkCount,
        fileSize: file.size,
        fileName: file.name,
        fileType,
      })
    }

    Array.from({ length: workerCount }, (_, index) => createAndConfigureWorker(index))
  })
}
