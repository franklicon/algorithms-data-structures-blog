import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Search,
  RotateCcw,
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  GitBranch,
} from 'lucide-react';

interface TreeNode {
  id: number;
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

let nextId = 5000;
const makeNode = (value: number): TreeNode => ({
  id: nextId++,
  value,
  left: null,
  right: null,
});

// Immutable ops — every node on the touched path is rebuilt as a new object
// (preserving its id so framer-motion can animate position changes), and the
// untouched subtree is shared by reference. This mirrors the recursive C#
// implementation that reassigns `root.Right = Insert(root.Right, value)`.
function insertInto(root: TreeNode | null, value: number): TreeNode {
  if (root === null) return makeNode(value);
  if (root.value < value) return { ...root, right: insertInto(root.right, value) };
  if (root.value > value) return { ...root, left: insertInto(root.left, value) };
  return root;
}

function removeFrom(root: TreeNode | null, value: number): TreeNode | null {
  if (root === null) return null;
  if (root.value < value) return { ...root, right: removeFrom(root.right, value) };
  if (root.value > value) return { ...root, left: removeFrom(root.left, value) };
  if (root.left === null) return root.right;
  if (root.right === null) return root.left;
  // Both children exist: copy in-order successor's value, then remove it from
  // the right subtree. The successor's id is discarded; this node keeps its id
  // but adopts the successor's value (matches the C# `root.Value = minNode.Value`).
  const successor = minNodeOf(root.right);
  return {
    ...root,
    value: successor.value,
    right: removeFrom(root.right, successor.value),
  };
}

function minNodeOf(root: TreeNode): TreeNode {
  let cur = root;
  while (cur.left) cur = cur.left;
  return cur;
}

function inOrderOf(root: TreeNode | null): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (n: TreeNode | null) => {
    if (!n) return;
    walk(n.left);
    out.push(n);
    walk(n.right);
  };
  walk(root);
  return out;
}

function preOrderOf(root: TreeNode | null): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (n: TreeNode | null) => {
    if (!n) return;
    out.push(n);
    walk(n.left);
    walk(n.right);
  };
  walk(root);
  return out;
}

function postOrderOf(root: TreeNode | null): TreeNode[] {
  const out: TreeNode[] = [];
  const walk = (n: TreeNode | null) => {
    if (!n) return;
    walk(n.left);
    walk(n.right);
    out.push(n);
  };
  walk(root);
  return out;
}

function countOf(root: TreeNode | null): number {
  if (!root) return 0;
  return 1 + countOf(root.left) + countOf(root.right);
}

interface Positioned {
  node: TreeNode;
  x: number;
  y: number;
}

// In-order x assignment: every node gets a unique column index by visiting
// in-order. Depth is the row. The resulting layout reads left-to-right by value.
function layoutTree(root: TreeNode | null): Positioned[] {
  const result: Positioned[] = [];
  let idx = 0;
  const walk = (n: TreeNode | null, depth: number) => {
    if (!n) return;
    walk(n.left, depth + 1);
    result.push({ node: n, x: idx++, y: depth });
    walk(n.right, depth + 1);
  };
  walk(root, 0);
  return result;
}

const COL_W = 56;
const ROW_H = 80;
const NODE = 44;

function buildInitial(): TreeNode {
  let root: TreeNode | null = null;
  for (const v of [50, 25, 75, 10, 35, 60, 90]) {
    root = insertInto(root, v);
  }
  return root!;
}

export default function BSTVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(buildInitial());
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [busy, setBusy] = useState(false);
  const animTimers = useRef<number[]>([]);

  const positions = layoutTree(root);
  const positionById = new Map<number, Positioned>();
  positions.forEach((p) => positionById.set(p.node.id, p));
  const maxX = positions.length ? Math.max(...positions.map((p) => p.x)) : 0;
  const maxY = positions.length ? Math.max(...positions.map((p) => p.y)) : 0;
  const width = (maxX + 1) * COL_W + NODE;
  const height = (maxY + 1) * ROW_H + NODE;

  const cx = (p: Positioned) => p.x * COL_W + NODE / 2;
  const cy = (p: Positioned) => p.y * ROW_H + NODE / 2;

  const edges: { from: Positioned; to: Positioned }[] = [];
  const collectEdges = (n: TreeNode | null) => {
    if (!n) return;
    const fromPos = positionById.get(n.id);
    if (fromPos) {
      if (n.left) {
        const toPos = positionById.get(n.left.id);
        if (toPos) edges.push({ from: fromPos, to: toPos });
      }
      if (n.right) {
        const toPos = positionById.get(n.right.id);
        if (toPos) edges.push({ from: fromPos, to: toPos });
      }
    }
    collectEdges(n.left);
    collectEdges(n.right);
  };
  collectEdges(root);

  const clearAnim = () => {
    animTimers.current.forEach((t) => window.clearTimeout(t));
    animTimers.current = [];
    setHighlightedId(null);
    setBusy(false);
  };

  const parsedValue = () => {
    const n = parseInt(input, 10);
    return Number.isFinite(n) ? n : Math.floor(Math.random() * 99) + 1;
  };

  const insert = () => {
    clearAnim();
    const v = parsedValue();
    setRoot((prev) => insertInto(prev, v));
    setResult(`Insert(${v}) → void`);
    setSequence([]);
    setInput('');
  };

  const contains = () => {
    clearAnim();
    const v = parsedValue();
    setSequence([]);

    if (!root) {
      setResult(`Contains(${v}) → false`);
      return;
    }

    const path: TreeNode[] = [];
    let cur: TreeNode | null = root;
    while (cur) {
      path.push(cur);
      if (cur.value < v) cur = cur.right;
      else if (cur.value > v) cur = cur.left;
      else break;
    }
    const found = cur !== null;

    setBusy(true);
    path.forEach((n, i) => {
      animTimers.current.push(
        window.setTimeout(() => setHighlightedId(n.id), i * 380)
      );
    });
    animTimers.current.push(
      window.setTimeout(() => {
        setHighlightedId(null);
        setBusy(false);
        setResult(`Contains(${v}) → ${found}`);
      }, path.length * 380 + 500)
    );
  };

  const remove = () => {
    clearAnim();
    const v = parsedValue();
    setRoot((prev) => removeFrom(prev, v));
    setResult(`Remove(${v}) → void`);
    setSequence([]);
  };

  const runTraversal = (
    label: 'InOrder' | 'PreOrder' | 'PostOrder',
    nodes: TreeNode[]
  ) => {
    clearAnim();
    setSequence([]);
    setResult(`${label}() → IEnumerable<T>`);

    if (nodes.length === 0) return;

    setBusy(true);
    nodes.forEach((n, i) => {
      animTimers.current.push(
        window.setTimeout(() => {
          setHighlightedId(n.id);
          setSequence((prev) => [...prev, n.value]);
        }, i * 360)
      );
    });
    animTimers.current.push(
      window.setTimeout(() => {
        setHighlightedId(null);
        setBusy(false);
      }, nodes.length * 360 + 500)
    );
  };

  const inOrder = () => runTraversal('InOrder', inOrderOf(root));
  const preOrder = () => runTraversal('PreOrder', preOrderOf(root));
  const postOrder = () => runTraversal('PostOrder', postOrderOf(root));

  const reset = () => {
    clearAnim();
    setRoot(buildInitial());
    setResult('');
    setSequence([]);
    setInput('');
  };

  const count = countOf(root);

  return (
    <div className="my-10 not-prose">
      <div className="border border-rule dark:border-graphite/60 rounded-lg p-6 lg:p-8 bg-paper dark:bg-graphite/20 brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:shadow-brutal">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="value"
            className="w-24 px-3 py-2 font-mono text-sm border border-rule dark:border-graphite/60 bg-transparent text-ink dark:text-paper rounded focus:outline-none focus:border-ember brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:text-brutal-ink brutal:font-bold brutal:shadow-brutal-sm"
          />
          <button onClick={insert} className="btn-viz" disabled={busy}>
            <Plus size={13} strokeWidth={2} /> Insert
          </button>
          <button onClick={contains} className="btn-viz" disabled={busy}>
            <Search size={13} strokeWidth={2} /> Contains
          </button>
          <button onClick={remove} className="btn-viz" disabled={busy || !root}>
            <Trash2 size={13} strokeWidth={2} /> Remove
          </button>
          <button onClick={inOrder} className="btn-viz" disabled={busy || !root}>
            <ArrowDownNarrowWide size={13} strokeWidth={2} /> InOrder
          </button>
          <button onClick={preOrder} className="btn-viz" disabled={busy || !root}>
            <GitBranch size={13} strokeWidth={2} /> PreOrder
          </button>
          <button onClick={postOrder} className="btn-viz" disabled={busy || !root}>
            <ArrowUpNarrowWide size={13} strokeWidth={2} /> PostOrder
          </button>
          <button onClick={reset} className="btn-viz ml-auto">
            <RotateCcw size={13} strokeWidth={2} /> Reset
          </button>
        </div>

        {/* Legend / axis caption */}
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40 mb-4 brutal:text-brutal-ink brutal:font-bold">
          left subtree &lt; node · right subtree &gt; node
        </p>

        {/* Tree canvas */}
        <div className="min-h-[320px] overflow-x-auto flex justify-center">
          {root === null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-[260px] font-mono text-sm text-ink/50 dark:text-paper/50 italic brutal:text-brutal-ink brutal:font-bold brutal:not-italic"
            >
              empty tree — root → null
            </motion.div>
          ) : (
            <div
              className="relative mx-auto text-brutal-ink"
              style={{ width, height }}
            >
              {/* Edges layer */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={width}
                height={height}
              >
                {edges.map((e) => (
                  <motion.line
                    key={`${e.from.node.id}-${e.to.node.id}`}
                    initial={false}
                    animate={{
                      x1: cx(e.from),
                      y1: cy(e.from),
                      x2: cx(e.to),
                      y2: cy(e.to),
                    }}
                    transition={{ type: 'spring', stiffness: 280, damping: 28 }}
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="square"
                  />
                ))}
              </svg>

              {/* Nodes layer */}
              <AnimatePresence>
                {positions.map((p) => {
                  const isRoot = root && p.node.id === root.id;
                  const isHot = highlightedId === p.node.id;
                  return (
                    <motion.div
                      key={p.node.id}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        left: cx(p) - NODE / 2,
                        top: cy(p) - NODE / 2,
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                      className="absolute"
                      style={{ width: NODE, height: NODE }}
                    >
                      <div
                        className={[
                          'w-full h-full flex items-center justify-center',
                          'font-display text-lg border-2 rounded overflow-hidden',
                          'border-ink dark:border-paper',
                          'brutal:font-sans brutal:font-black brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:shadow-brutal-sm',
                          'transition-colors',
                          isHot
                            ? 'bg-ember text-ink brutal:bg-brutal-yellow brutal:text-black'
                            : 'bg-paper text-ink dark:bg-ink dark:text-paper brutal:bg-brutal-paper brutal:text-brutal-ink',
                        ].join(' ')}
                      >
                        {p.node.value}
                      </div>
                      {isRoot && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.18em] text-ember brutal:text-black brutal:bg-brutal-yellow brutal:px-2 brutal:py-0.5 brutal:border-2 brutal:border-brutal-ink brutal:font-bold whitespace-nowrap">
                          root
                        </span>
                      )}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Traversal sequence chips */}
        {sequence.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50 mr-1 brutal:text-brutal-ink brutal:font-bold">
              sequence →
            </span>
            <AnimatePresence>
              {sequence.map((v, i) => (
                <motion.span
                  key={`${i}-${v}`}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="font-mono text-xs font-bold px-2 py-1 bg-ember/15 text-ink dark:bg-ember/20 dark:text-paper border border-ember brutal:bg-brutal-yellow brutal:text-black brutal:border-2 brutal:border-brutal-ink brutal:rounded-none"
                >
                  {v}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Result + status line */}
        <div className="mt-6 pt-4 border-t border-rule dark:border-graphite/60 flex justify-between items-center font-mono text-[11px] text-ink/50 dark:text-paper/50 brutal:border-t-2 brutal:border-brutal-ink brutal:text-brutal-ink brutal:font-bold">
          <span className="text-ink/80 dark:text-paper/80 min-h-[1em] brutal:text-brutal-ink">
            {result}
          </span>
          <span>Count = {count}</span>
        </div>
      </div>
    </div>
  );
}
