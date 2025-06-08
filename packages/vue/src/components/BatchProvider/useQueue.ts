import { computed, ref, watchEffect } from 'vue';
import { Queue, QueueItem } from './types';

/**
 * This function returns a queue that can be used to batch updates.
 *
 * @param runQueue - a function that gets called when the queue is flushed
 * @internal
 *
 * @returns a Queue object
 */
export function useQueue<T>(runQueue: (items: QueueItem<T>[]) => void) {
  /*
   * Using a ref to track queue changes and trigger the watchEffect
   */
  const serial = ref(BigInt(0));

  /*
   * Create queue with callback to increment serial ref
   */
  const queue = createQueue<T>(() => {
    serial.value = serial.value + BigInt(1);
  });

  /*
   * Watch for changes to serial ref and process queue
   */
  watchEffect(() => {
    const queueItems = queue.get();

    if (queueItems.length) {
      runQueue(queueItems);
      queue.reset();
    }
  });

  return queue;
}

function createQueue<T>(cb: () => void): Queue<T> {
  let queue: QueueItem<T>[] = [];

  return {
    get: () => queue,
    reset: () => {
      queue = [];
    },
    push: (item) => {
      queue.push(item);
      cb();
    },
  };
}