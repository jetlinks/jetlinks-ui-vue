import SparkMD5 from 'spark-md5';

const CHUNK_SIZE = 1024 * 1024 * 5; // 5MB
const THREAD_COUNT = navigator.hardwareConcurrency || 4; // cpu内核数

const getFileHash = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    const spark = new SparkMD5.ArrayBuffer();
    
    fileReader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      if (result instanceof ArrayBuffer) {
        spark.append(result);
        const hash = spark.end();
        resolve(hash);
      } else {
        reject(new Error('文件hash计算失败'));
      }
    };
    
    fileReader.onerror = () => {
      reject(new Error('文件读取出错'));
    };
    
    fileReader.readAsArrayBuffer(file);
  });
}

export async function handleSliceUploadFile(file: File, chunkSize?: number) {
  return new Promise(async (resolve, reject) => {
    const chunkCount = Math.ceil(file.size / CHUNK_SIZE);
    const threadChunkCounts = Math.ceil(chunkCount / THREAD_COUNT);
    
    const result: any[] = [];
    let completedWorkers = 0;
    
    const fileHash = await getFileHash(file);
    
    const createAndConfigureWorker = (workerIndex: number) => {
      const start = workerIndex * threadChunkCounts;
      let end = (workerIndex + 1) * threadChunkCounts;
      
      if (end > chunkCount) {
        end = chunkCount;
      }
      
      const worker = new Worker(new URL('./worker.ts', import.meta.url), {type: 'module'});
      
      worker.onerror = (err) => console.error(`Worker error: ${workerIndex}`, err);
      
      worker.postMessage({
        start,
        end,
        file,
        fileHash,
        chunkSize: chunkSize || CHUNK_SIZE,
        chunkCount,
        fileSize: file.size, // 文件大小
        fileName: file.name, // 文件name
      });
      
      worker.onmessage = (e) => {
        for (let i = start; i < end; i++) {
          result[i] = e.data[i - start];
        }
        
        completedWorkers++;
        // 立即终止
        worker.terminate();
        
        if (completedWorkers === THREAD_COUNT) {
          resolve(result);
        }
      };
    };
    
    Array.from({length: THREAD_COUNT}, (_, index) => createAndConfigureWorker(index));
  });
}