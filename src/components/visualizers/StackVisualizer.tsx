import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDownToLine, ArrowUpFromLine, Eye, Search, RotateCcw, ArrowRight } from 'lucide-react';

interface Node {
  id: number;
  value: number;
}

let nextId = 3000;
const makeNode = (value: number): Node => ({ id: nextId++, value });

const initial: Node[] = [makeNode(7), makeNode(3), makeNode(12)];

export default function StackVisualizer() {
  // nodes[0] is the top of the stack
  const [nodes, setNodes] = useState<Node[]>(initial);
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string>('');

  const parsedValue = () => {
    const n = parseInt(input, 10);
    return Number.isFinite(n) ? n : Math.floor(Math.random() * 99) + 1;
  };

  const push = () => {
    const v = parsedValue();
    setNodes((prev) => [makeNode(v), ...prev]);
    setResult(`Push(${v}) → void`);
    setInput('');
  };

  const pop = () => {
    if (!nodes.length) return;
    const popped = nodes[0].value;
    setNodes((prev) => prev.slice(1));
    setResult(`Pop() → ${popped}`);
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
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="value"
            className="w-24 px-3 py-2 font-mono text-sm border border-rule dark:border-graphite/60 bg-transparent text-ink dark:text-paper rounded focus:outline-none focus:border-ember brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:text-brutal-ink brutal:font-bold brutal:shadow-brutal-sm"
          />
          <button onClick={push} className="btn-viz">
            <ArrowDownToLine size={13} strokeWidth={2} /> Push
          </button>
          <button onClick={pop} className="btn-viz" disabled={!nodes.length}>
            <ArrowUpFromLine size={13} strokeWidth={2} /> Pop
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

        {/* Stack rendering — vertical, top at top */}
        <div className="min-h-[280px] flex justify-center">
          <div className="flex flex-col items-center gap-1">
            {/* TOP pointer */}
            <motion.div
              layout
              className="flex items-center gap-2 mb-1"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember brutal:text-black brutal:bg-brutal-yellow brutal:px-2 brutal:py-0.5 brutal:border-2 brutal:border-brutal-ink brutal:font-bold">
                top
              </span>
              <ArrowRight size={14} strokeWidth={1.8} className="text-ember rotate-90 brutal:text-brutal-ink" />
            </motion.div>

            <AnimatePresence mode="popLayout">
              {nodes.map((node, idx) => (
                <motion.div
                  key={node.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.6, y: -20 }}
                  transition={{ type: 'spring', stiffness: 320, damping: 26 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex border border-ink dark:border-paper rounded overflow-hidden bg-paper dark:bg-ink min-w-[120px] brutal:rounded-none brutal:border-2 brutal:border-brutal-ink brutal:bg-brutal-paper brutal:shadow-brutal-sm">
                    <div className="px-5 py-2.5 font-display text-lg text-ink dark:text-paper flex-1 text-center border-r border-ink/30 dark:border-paper/30 brutal:font-sans brutal:font-bold brutal:text-brutal-ink brutal:border-r-2 brutal:border-brutal-ink">
                      {node.value}
                    </div>
                    <div className="px-3 py-2.5 flex items-center justify-center bg-rule/40 dark:bg-graphite/40 min-w-[40px] brutal:bg-brutal-mute">
                      {idx === nodes.length - 1 ? (
                        <span className="font-mono text-[10px] text-ink/60 dark:text-paper/60 brutal:text-brutal-ink brutal:font-bold">
                          null
                        </span>
                      ) : (
                        <ArrowRight size={14} strokeWidth={1.8} className="text-sage rotate-90 brutal:text-brutal-ink" />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {nodes.length === 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm text-ink/50 dark:text-paper/50 italic mt-4 brutal:text-brutal-ink brutal:font-bold brutal:not-italic"
              >
                empty stack — top → null
              </motion.span>
            )}

            {nodes.length > 0 && (
              <motion.span
                layout
                className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 dark:text-paper/40 mt-2 brutal:text-brutal-ink brutal:font-bold"
              >
                bottom
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
