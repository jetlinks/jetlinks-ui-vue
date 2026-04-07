/**
 * 并发控制类
 */

export class ConcurrencyControl {
  private readonly maxConcurrency: number;
  private running: number = 0;
  private queue: Array<() => Promise<any>> = [];

  constructor(maxConcurrency: number = 6) {
    this.maxConcurrency = maxConcurrency; // 最大并发数
  }

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const wrappedTask = async () => {
        try {
          this.running++;
          const result = await task();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.running--;
          this.processNext();
        }
      };

      if (this.running < this.maxConcurrency) {
        wrappedTask();
      } else {
        this.queue.push(wrappedTask);
      }
    });
  }

  private processNext() {
    if (this.queue.length > 0 && this.running < this.maxConcurrency) {
      const nextTask = this.queue.shift();
      if (nextTask) {
        nextTask().then();
      }
    }
  }
}
