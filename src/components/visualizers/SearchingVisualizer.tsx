import { useState, useRef, useEffect } from 'react';
import { Search, Shuffle, RotateCcw } from 'lucide-react';

interface Step {
  left: number | null;
  right: number | null;
  mid: number | null;
  foundAt?: number;
  notFound?: boolean;
}

const ITEM_COUNT = 12;
const STEP_MS = 700;

function randomSortedArray(): number[] {
  const set = new Set<number>();
  while (set.size < ITEM_COUNT) {
    set.add(Math.floor(Math.random() * 99) + 1);
  }
  return Array.from(set).sort((a, b) => a - b);
}

function recordBinarySearch(items: number[], target: number): Step[] {
  const steps: Step[] = [];
  let left = 0;
  let right = items.length - 1;
  steps.push({ left, right, mid: null });

  while (left <= right) {
    const mid = left + Math.floor((right - left) / 2);
    steps.push({ left, right, mid });
    if (items[mid] > target) {
      right = mid - 1;
    } else if (items[mid] < target) {
      left = mid + 1;
    } else {
      steps.push({ left, right, mid, foundAt: mid });
      return steps;
    }
    if (left <= right) {
      steps.push({ left, right, mid: null });
    }
  }

  steps.push({ left: null, right: null, mid: null, notFound: true });
  return steps;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export default function SearchingVisualizer() {
  const [items, setItems] = useState<number[]>(() => randomSortedArray());
  const [targetInput, setTargetInput] = useState('');
  const [state, setState] = useState<Step>({
    left: 0,
    right: ITEM_COUNT - 1,
    mid: null,
  });
  const [result, setResult] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepCount, setStepCount] = useState<number | null>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    return () => {
      cancelRef.current = true;
    };
  }, []);

  const reset = (newItems?: number[]) => {
    cancelRef.current = true;
    const next = newItems ?? items;
    if (newItems) setItems(newItems);
    setState({ left: 0, right: next.length - 1, mid: null });
    setResult('');
    setStepCount(null);
  };

  const shuffle = () => reset(randomSortedArray());

  const parseTarget = (): number => {
    const n = parseInt(targetInput, 10);
    if (Number.isFinite(n)) return n;
    // If empty/invalid, pick a value from the array so the demo never no-ops
    return items[Math.floor(Math.random() * items.length)];
  };

  const search = async () => {
    if (isPlaying) return;
    const target = parseTarget();
    const steps = recordBinarySearch(items, target);

    cancelRef.current = false;
    setIsPlaying(true);
    setStepCount(null);
    setResult(`BinarySearch(${target}) …`);

    let comparisons = 0;
    for (let s = 0; s < steps.length; s++) {
      if (cancelRef.current) break;
      const step = steps[s];
      if (step.mid !== null) comparisons++;
      setState({ left: step.left, right: step.right, mid: step.mid });
      await sleep(STEP_MS);

      if (step.foundAt !== undefined) {
        setResult(`BinarySearch(${target}) → ${step.foundAt}`);
        setStepCount(comparisons);
      } else if (step.notFound) {
        setResult(`BinarySearch(${target}) → -1  (not found)`);
        setStepCount(comparisons);
      }
    }
    setIsPlaying(false);
  };

  const { left, right, mid } = state;

  return (
    <div className="my-10 not-prose">
      <div className="border border-rule dark:border-graphite/60 rounded-lg p-6 lg:p-8 bg-paper dark:bg-graphite/20 brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:shadow-brutal">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input
            type="number"
            value={targetInput}
            onChange={(e) => setTargetInput(e.target.value)}
            placeholder="target"
            disabled={isPlaying}
            className="w-24 px-3 py-2 font-mono text-sm border border-rule dark:border-graphite/60 bg-transparent text-ink dark:text-paper rounded focus:outline-none focus:border-ember disabled:opacity-50 brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:text-brutal-ink brutal:font-bold brutal:shadow-brutal-sm"
          />
          <button onClick={search} disabled={isPlaying} className="btn-viz">
            <Search size={13} strokeWidth={2} /> Search
          </button>
          <button onClick={shuffle} disabled={isPlaying} className="btn-viz">
            <Shuffle size={13} strokeWidth={2} /> Shuffle
          </button>
          <button onClick={() => reset()} disabled={isPlaying} className="btn-viz ml-auto">
            <RotateCcw size={13} strokeWidth={2} /> Reset
          </button>
        </div>

        {/* Caption */}
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40 mb-4 brutal:text-brutal-ink brutal:font-bold">
          Sorted input · L / R bound the live search range · M is the current pivot
        </p>

        {/* Array rendering */}
        <div className="min-h-[160px] flex items-center overflow-x-auto py-2">
          <div className="flex items-end gap-1.5 flex-shrink-0 mx-auto">
            {items.map((value, idx) => {
              const inRange =
                left !== null && right !== null && idx >= left && idx <= right;
              const isMid = mid === idx;
              const isLeft = left === idx;
              const isRight = right === idx;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-center min-w-[34px]"
                >
                  {/* Marker row above cell */}
                  <div className="flex items-center gap-0.5 h-4 mb-1 font-mono text-[10px] font-bold tracking-tight text-ember brutal:text-brutal-ink">
                    {isLeft && <span>L</span>}
                    {isMid && <span>M</span>}
                    {isRight && <span>R</span>}
                  </div>
                  {/* Cell */}
                  <div
                    className={`w-9 h-10 rounded flex items-center justify-center font-mono text-sm transition-all duration-200 border brutal:rounded-none brutal:border-2 brutal:border-brutal-ink ${
                      isMid
                        ? 'bg-signal border-signal text-ink font-bold brutal:bg-brutal-yellow brutal:text-black brutal:shadow-brutal-sm'
                        : inRange
                        ? 'border-ink/70 dark:border-paper/70 text-ink dark:text-paper bg-paper dark:bg-graphite/30 brutal:bg-brutal-paper brutal:text-brutal-ink'
                        : 'border-rule dark:border-graphite/40 text-ink/30 dark:text-paper/25 bg-transparent brutal:bg-brutal-mute brutal:text-brutal-ink/40 brutal:border-brutal-ink/30'
                    }`}
                  >
                    {value}
                  </div>
                  {/* Index */}
                  <span className="font-mono text-[9px] text-ink/40 dark:text-paper/40 mt-1 tabular-nums brutal:text-brutal-ink brutal:font-bold">
                    {idx}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Result + status line */}
        <div className="mt-6 pt-4 border-t border-rule dark:border-graphite/60 flex justify-between items-center font-mono text-[11px] text-ink/50 dark:text-paper/50 brutal:border-t-2 brutal:border-brutal-ink">
          <span className="text-ink/80 dark:text-paper/80 min-h-[1em] brutal:text-brutal-ink brutal:font-bold">
            {result}
          </span>
          <span className="brutal:text-brutal-ink brutal:font-bold">
            {stepCount !== null
              ? `${stepCount} ${stepCount === 1 ? 'comparison' : 'comparisons'}`
              : `${items.length} elements`}
          </span>
        </div>
      </div>
    </div>
  );
}
