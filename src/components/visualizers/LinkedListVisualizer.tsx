import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, RotateCcw, ArrowRight } from 'lucide-react';

interface Node {
  id: number;
  value: number;
}

let nextId = 1000;
const makeNode = (value: number): Node => ({ id: nextId++, value });

const initial: Node[] = [makeNode(7), makeNode(3), makeNode(12)];

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>(initial);
  const [input, setInput] = useState('');

  const parsedValue = () => {
    const n = parseInt(input, 10);
    return Number.isFinite(n) ? n : Math.floor(Math.random() * 99) + 1;
  };

  const addFirst = () => {
    setNodes((prev) => [makeNode(parsedValue()), ...prev]);
    setInput('');
  };

  const addLast = () => {
    setNodes((prev) => [...prev, makeNode(parsedValue())]);
    setInput('');
  };

  const removeFirst = () => setNodes((prev) => prev.slice(1));
  const removeLast = () => setNodes((prev) => prev.slice(0, -1));
  const reset = () => setNodes(initial.map((n) => ({ ...n, id: nextId++ })));

  return (
    <div className="my-10 not-prose">
      <div className="border border-rule dark:border-graphite/60 rounded-lg p-6 lg:p-8 bg-paper dark:bg-graphite/20">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <input
            type="number"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="value"
            className="w-24 px-3 py-2 font-mono text-sm border border-rule dark:border-graphite/60 bg-transparent text-ink dark:text-paper rounded focus:outline-none focus:border-ember"
          />
          <button onClick={addFirst} className="btn-viz">
            <Plus size={13} strokeWidth={2} /> AddFirst
          </button>
          <button onClick={addLast} className="btn-viz">
            <Plus size={13} strokeWidth={2} /> AddLast
          </button>
          <button onClick={removeFirst} className="btn-viz" disabled={!nodes.length}>
            <Trash2 size={13} strokeWidth={2} /> RemoveFirst
          </button>
          <button onClick={removeLast} className="btn-viz" disabled={!nodes.length}>
            <Trash2 size={13} strokeWidth={2} /> RemoveLast
          </button>
          <button onClick={reset} className="btn-viz ml-auto">
            <RotateCcw size={13} strokeWidth={2} /> Reset
          </button>
        </div>

        {/* List rendering */}
        <div className="min-h-[140px] flex items-center overflow-x-auto">
          <div className="flex items-center gap-2 flex-shrink-0 py-1">
            {/* HEAD pointer */}
            <motion.div
              layout
              className="flex flex-col items-center mr-1"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ember mb-1">
                head
              </span>
              <ArrowRight size={16} strokeWidth={1.8} className="text-ember" />
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
                  <div className="flex border border-ink dark:border-paper rounded overflow-hidden bg-paper dark:bg-ink">
                    <div className="px-4 py-3 font-display text-lg text-ink dark:text-paper border-r border-ink/30 dark:border-paper/30">
                      {node.value}
                    </div>
                    <div className="px-3 py-3 flex items-center justify-center bg-rule/40 dark:bg-graphite/40">
                      {idx === nodes.length - 1 ? (
                        <span className="font-mono text-[10px] text-ink/60 dark:text-paper/60">
                          null
                        </span>
                      ) : (
                        <ArrowRight size={14} strokeWidth={1.8} className="text-sage" />
                      )}
                    </div>
                  </div>
                  {idx < nodes.length - 1 && (
                    <ArrowRight size={16} strokeWidth={1.6} className="text-ink/40 dark:text-paper/40" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {nodes.length === 0 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-mono text-sm text-ink/50 dark:text-paper/50 italic"
              >
                empty list — head → null
              </motion.span>
            )}
          </div>
        </div>

        {/* Status line */}
        <div className="mt-6 pt-4 border-t border-rule dark:border-graphite/60 flex justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 dark:text-paper/50">
          <span>Count = {nodes.length}</span>
          <span>tail = {nodes.length ? nodes[nodes.length - 1].value : 'null'}</span>
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
          border: 1px solid rgb(14 11 22 / 0.18);
          border-radius: 4px;
          color: rgb(14 11 22 / 0.72);
          background: transparent;
          transition: all 150ms;
        }
        html.dark .btn-viz {
          border-color: rgb(250 250 250 / 0.18);
          color: rgb(250 250 250 / 0.78);
        }
        .btn-viz:hover:not(:disabled) {
          color: #7C3AED;
          border-color: #7C3AED;
          background: rgba(124, 58, 237, 0.08);
        }
        html.dark .btn-viz:hover:not(:disabled) {
          color: #A78BFA;
          border-color: #A78BFA;
          background: rgba(167, 139, 250, 0.10);
        }
        .btn-viz:disabled {
          opacity: 0.35;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
}
