import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Shuffle, RotateCcw } from 'lucide-react';

type Algorithm = 'BubbleSort' | 'InsertionSort' | 'MergeSort' | 'QuickSort';

interface Item {
  id: number;
  value: number;
}

interface Step {
  items: Item[];
  active?: number[];
}

let nextId = 5000;

const ITEM_COUNT = 12;
const MIN_VALUE = 8;
const MAX_VALUE = 100;
const TARGET_DURATION_MS = 5000;
const MIN_STEP_MS = 30;
const MAX_STEP_MS = 220;

function randomItems(): Item[] {
  return Array.from({ length: ITEM_COUNT }, () => ({
    id: nextId++,
    value: Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE,
  }));
}

// ---------- Recorders (mirror the C# implementations exactly) ----------

function recordBubbleSort(initial: Item[]): Step[] {
  const items = [...initial];
  const steps: Step[] = [{ items: [...items] }];
  for (let i = 0; i < items.length; i++) {
    let swapped = false;
    for (let j = 1; j < items.length - i; j++) {
      steps.push({ items: [...items], active: [j - 1, j] });
      if (items[j - 1].value > items[j].value) {
        [items[j - 1], items[j]] = [items[j], items[j - 1]];
        swapped = true;
        steps.push({ items: [...items], active: [j - 1, j] });
      }
    }
    if (!swapped) break;
  }
  steps.push({ items: [...items] });
  return steps;
}

function recordInsertionSort(initial: Item[]): Step[] {
  const items = [...initial];
  const steps: Step[] = [{ items: [...items] }];
  for (let i = 1; i < items.length; i++) {
    let j = i;
    while (j > 0 && items[j].value < items[j - 1].value) {
      [items[j], items[j - 1]] = [items[j - 1], items[j]];
      steps.push({ items: [...items], active: [j - 1, j] });
      j--;
    }
  }
  steps.push({ items: [...items] });
  return steps;
}

function recordMergeSort(initial: Item[]): Step[] {
  const items = [...initial];
  const steps: Step[] = [{ items: [...items] }];
  mergeSortAux(items, 0, items.length - 1, steps);
  steps.push({ items: [...items] });
  return steps;
}

function mergeSortAux(items: Item[], left: number, right: number, steps: Step[]) {
  if (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    mergeSortAux(items, left, mid, steps);
    mergeSortAux(items, mid + 1, right, steps);
    merge(items, left, mid, right, steps);
  }
}

function merge(items: Item[], left: number, mid: number, right: number, steps: Step[]) {
  const leftArr = items.slice(left, mid + 1);
  const rightArr = items.slice(mid + 1, right + 1);
  let i = 0;
  let j = 0;
  let k = left;
  while (i < leftArr.length && j < rightArr.length) {
    if (leftArr[i].value <= rightArr[j].value) {
      items[k] = leftArr[i];
      i++;
    } else {
      items[k] = rightArr[j];
      j++;
    }
    steps.push({ items: [...items], active: [k] });
    k++;
  }
  while (i < leftArr.length) {
    items[k] = leftArr[i];
    steps.push({ items: [...items], active: [k] });
    i++;
    k++;
  }
  while (j < rightArr.length) {
    items[k] = rightArr[j];
    steps.push({ items: [...items], active: [k] });
    j++;
    k++;
  }
}

function recordQuickSort(initial: Item[]): Step[] {
  const items = [...initial];
  const steps: Step[] = [{ items: [...items] }];
  quickSortAux(items, 0, items.length - 1, steps);
  steps.push({ items: [...items] });
  return steps;
}

function quickSortAux(items: Item[], left: number, right: number, steps: Step[]) {
  if (left < right) {
    const pivotIndex = partition(items, left, right, steps);
    quickSortAux(items, left, pivotIndex - 1, steps);
    quickSortAux(items, pivotIndex + 1, right, steps);
  }
}

function partition(items: Item[], left: number, right: number, steps: Step[]): number {
  const mid = left + Math.floor((right - left) / 2);
  let indexOfInsertion = left - 1;
  [items[mid], items[right]] = [items[right], items[mid]];
  steps.push({ items: [...items], active: [mid, right] });
  const pivotValue = items[right].value;
  for (let i = left; i < right; i++) {
    if (items[i].value < pivotValue) {
      indexOfInsertion++;
      [items[indexOfInsertion], items[i]] = [items[i], items[indexOfInsertion]];
      steps.push({ items: [...items], active: [indexOfInsertion, i] });
    }
  }
  [items[indexOfInsertion + 1], items[right]] = [items[right], items[indexOfInsertion + 1]];
  steps.push({ items: [...items], active: [indexOfInsertion + 1, right] });
  return indexOfInsertion + 1;
}

const RECORDERS: Record<Algorithm, (initial: Item[]) => Step[]> = {
  BubbleSort: recordBubbleSort,
  InsertionSort: recordInsertionSort,
  MergeSort: recordMergeSort,
  QuickSort: recordQuickSort,
};

// ---------- Component ----------

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function SortingVisualizer() {
  const [items, setItems] = useState<Item[]>(() => randomItems());
  const [algorithm, setAlgorithm] = useState<Algorithm>('BubbleSort');
  const [active, setActive] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepCount, setStepCount] = useState<number | null>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const shuffle = () => {
    cancelRef.current = true;
    setItems(randomItems());
    setActive([]);
    setStepCount(null);
  };

  const reset = () => {
    cancelRef.current = true;
    setItems(randomItems());
    setActive([]);
    setStepCount(null);
  };

  const sort = async () => {
    if (isPlaying) return;
    const steps = RECORDERS[algorithm](items);
    setStepCount(steps.length);
    const stepDelay = Math.max(
      MIN_STEP_MS,
      Math.min(MAX_STEP_MS, TARGET_DURATION_MS / steps.length)
    );

    cancelRef.current = false;
    setIsPlaying(true);
    for (let s = 0; s < steps.length; s++) {
      if (cancelRef.current) break;
      const step = steps[s];
      setItems(step.items);
      setActive(step.active ?? []);
      await sleep(stepDelay);
    }
    setActive([]);
    setIsPlaying(false);
  };

  return (
    <div className="my-10 not-prose">
      <div className="border border-rule dark:border-graphite/60 rounded-lg p-6 lg:p-8 bg-paper dark:bg-graphite/20">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <label className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50">
              Algorithm
            </span>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
              disabled={isPlaying}
              className="px-3 py-2 font-mono text-xs border border-rule dark:border-graphite/60 bg-transparent text-ink dark:text-paper rounded focus:outline-none focus:border-ember disabled:opacity-50"
            >
              <option value="BubbleSort">BubbleSort</option>
              <option value="InsertionSort">InsertionSort</option>
              <option value="MergeSort">MergeSort</option>
              <option value="QuickSort">QuickSort</option>
            </select>
          </label>
          <button onClick={sort} disabled={isPlaying} className="btn-viz">
            <Play size={13} strokeWidth={2} /> Sort
          </button>
          <button onClick={shuffle} className="btn-viz">
            <Shuffle size={13} strokeWidth={2} /> Shuffle
          </button>
          <button onClick={reset} className="btn-viz ml-auto">
            <RotateCcw size={13} strokeWidth={2} /> Reset
          </button>
        </div>

        {/* Bar chart */}
        <div className="min-h-[220px] flex items-end justify-center gap-2 overflow-x-auto py-2">
          <div className="flex items-end gap-2 flex-shrink-0">
            {items.map((item, idx) => {
              const isActive = active.includes(idx);
              const heightPx = Math.round((item.value / MAX_VALUE) * 180) + 12;
              return (
                <motion.div
                  key={item.id}
                  layout
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="flex flex-col items-center"
                >
                  <span className="font-mono text-[9px] text-ink/40 dark:text-paper/40 mb-1 tabular-nums">
                    {item.value}
                  </span>
                  <div
                    style={{ height: `${heightPx}px` }}
                    className={`w-5 rounded-t-sm transition-colors ${
                      isActive
                        ? 'bg-ember'
                        : 'bg-ink/80 dark:bg-paper/80'
                    }`}
                  />
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Status line */}
        <div className="mt-6 pt-4 border-t border-rule dark:border-graphite/60 flex justify-between items-center font-mono text-[11px] text-ink/50 dark:text-paper/50">
          <span className="text-ink/80 dark:text-paper/80">{algorithm}</span>
          <span>
            {stepCount !== null
              ? `${stepCount} ${stepCount === 1 ? 'step' : 'steps'}`
              : `${ITEM_COUNT} elements`}
          </span>
        </div>
      </div>

      <style>{`
        .btn-viz {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 12px;
          letter-spacing: 0.02em;
          border: 1px solid currentColor;
          border-radius: 4px;
          color: rgb(26 26 31 / 0.7);
          transition: all 150ms;
        }
        html.dark .btn-viz { color: rgb(250 247 242 / 0.7); }
        .btn-viz:hover:not(:disabled) {
          color: #C2410C;
          background: rgba(194, 65, 12, 0.06);
        }
        .btn-viz:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
