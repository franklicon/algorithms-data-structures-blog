import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Plus, Trash2, Eye, Search, RotateCcw } from 'lucide-react';

interface Node {
  id: number;
  value: number;
}

let nextId = 4000;
const makeNode = (value: number): Node => ({ id: nextId++, value });

const initial: Node[] = [makeNode(7), makeNode(3), makeNode(12)];

export default function QueueVisualizer() {
  // nodes[0] is the head (front); nodes[length-1] is the tail (back)
  const [nodes, setNodes] = useState<Node[]>(initial);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string>('');

  const parsedValue = () => {
    const n = parseInt(input, 10);
    return Number.isFinite(n) ? n : Math.floor(Math.random() * 99) + 1;
  };

  const enqueue = () => {
    const v = parsedValue();
    setNodes((prev) => [...prev, makeNode(v)]);
    setResult(`Enqueue(${v}) → void`);
    setInput('');
  };

  const dequeue = () => {
    if (!nodes.length) {
      setResult('Dequeue() → throws InvalidOperationException');
      return;
    }
    const front = nodes[0].value;
    setNodes((prev) => prev.slice(1));
    setResult(`Dequeue() → ${front}`);
  };

  const peek = () => {
    if (!nodes.length) {
      setResult('Peek() → throws InvalidOperationException');
      return;
    }
    setResult(`Peek() → ${nodes[0].value}`);
  };

  const contains = () => {
    const v = parsedValue();
    const found = nodes.some((n) => n.value === v);
    setResult(`Contains(${v}) → ${found}`);
  };

  const reset = () => {
    setNodes(initial.map((n) => ({ ...n, id: nextId++ })));
    setResult('');
  };

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
          <button onClick={enqueue} className="btn-viz">
            <Plus size={13} strokeWidth={2} /> Enqueue
          </button>
          <button onClick={dequeue} className="btn-viz" disabled={!nodes.length}>
            <Trash2 size={13} strokeWidth={2} /> Dequeue
          </button>
          <button onClick={peek} className="btn-viz">
            <Eye size={13} strokeWidth={2} /> Peek
          </button>
          <button onClick={contains} className="btn-viz">
            <Search size={13} strokeWidth={2} /> Contains
          </button>
          <button onClick={reset} className="btn-viz ml-auto">
            <RotateCcw size={13} strokeWidth={2} /> Reset
          </button>
        </div>

        {/* Flow caption */}
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40 mb-4 brutal:text-brutal-ink brutal:font-bold">
          Dequeue ← front · back ← Enqueue
        </p>

        {/* Queue rendering */}
        <div className="min-h-[140px] flex items-center overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0 py-1">
            {/* HEAD pointer */}
            <motion.div
              layout
              className="flex flex-col items-center mr-1"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember mb-1 brutal:text-black brutal:bg-brutal-yellow brutal:px-2 brutal:py-0.5 brutal:border-2 brutal:border-brutal-ink brutal:font-bold">
                head
              </span>
              <ArrowRight size={16} strokeWidth={1.8} className="text-ember brutal:text-brutal-ink" />
            </motion.div>

            <AnimatePresence mode="popLayout">
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: 10 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex border border-ink dark:border-paper rounded overflow-hidden bg-paper dark:bg-ink brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:shadow-brutal-sm">
                    <div className="px-4 py-3 font-display text-lg text-ink dark:text-paper border-r border-ink/30 dark:border-paper/30 brutal:font-sans brutal:font-bold brutal:text-brutal-ink brutal:border-r-2 brutal:border-brutal-ink">
                      {node.value}
                    </div>
                    <div className="px-3 py-3 flex items-center justify-center bg-rule/40 dark:bg-graphite/40 brutal:bg-brutal-mute">
                      {idx === nodes.length - 1 ? (
                        <span className="font-mono text-[10px] text-ink/60 dark:text-paper/60 brutal:text-brutal-ink brutal:font-bold">
                          null
                        </span>
                      ) : (
                        <ArrowRight size={14} strokeWidth={1.8} className="text-sage brutal:text-brutal-ink" />
                      )}
                    </div>
                  </div>
                  {idx < nodes.length - 1 && (
                    <ArrowRight size={16} strokeWidth={1.6} className="text-ink/40 dark:text-paper/40 brutal:text-brutal-ink" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* TAIL pointer */}
            {nodes.length > 0 && (
              <motion.div
                layout
                className="flex flex-col items-center ml-1"
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember mb-1 brutal:text-black brutal:bg-brutal-yellow brutal:px-2 brutal:py-0.5 brutal:border-2 brutal:border-brutal-ink brutal:font-bold">
                  tail
                </span>
                <ArrowLeft size={16} strokeWidth={1.8} className="text-ember brutal:text-brutal-ink" />
              </motion.div>
            )}

            {nodes.length === 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm text-ink/50 dark:text-paper/50 italic brutal:text-brutal-ink brutal:font-bold brutal:not-italic"
              >
                empty queue — head → null
              </motion.span>
            )}
          </div>
        </div>

        {/* Result + status line */}
        <div className="mt-6 pt-4 border-t border-rule dark:border-graphite/60 flex justify-between items-center font-mono text-[11px] text-ink/50 dark:text-paper/50 brutal:border-t-2 brutal:border-brutal-ink brutal:text-brutal-ink brutal:font-bold">
          <span className="text-ink/80 dark:text-paper/80 min-h-[1em] brutal:text-brutal-ink">{result}</span>
          <span>Count = {nodes.length}</span>
        </div>
      </div>
    </div>
  );
}
