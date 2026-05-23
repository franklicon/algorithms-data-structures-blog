import CodeFromRepo from '../../components/posts/CodeFromRepo';
import ComplexityTable from '../../components/posts/ComplexityTable';
import Callout from '../../components/posts/Callout';
import SortingVisualizer from '../../components/visualizers/SortingVisualizer';

const SORTING_PATH = 'src/Algorithms/Sorting/SortingAlgorithms.cs';

export default function SortingPost() {
  return (
    <article className="prose-editorial">
      <p className="font-display text-2xl leading-snug text-ink/90 dark:text-paper/90 mb-10 italic">
        Sorting is the most studied problem in computer science — and the one
        most likely to be the hidden hot path in everyday code. Four algorithms
        cover the landscape: two simple O(n²) sorts that earn their place on
        small or nearly-sorted inputs, and two O(n log n) sorts that anchor
        every production implementation.
      </p>

      <h2>The framework</h2>
      <p>
        All four algorithms in this post are <strong>comparison sorts</strong>:
        they order an array using only pairwise comparisons of its elements,
        which is reflected in the C# signatures —{' '}
        <code>where T : IComparable&lt;T&gt;</code>. Information-theoretically,
        any comparison-based sort must perform at least Ω(n log n) comparisons
        in the worst case to distinguish all n! possible permutations; this
        is the lower bound that MergeSort and QuickSort hit, and the bound
        that BubbleSort and InsertionSort exceed by a factor of n in their
        worst cases.
      </p>
      <p>
        Three secondary properties matter as much as the asymptotic cost when
        choosing an algorithm in practice. <strong>In-place</strong> sorts
        rearrange elements within the input array without allocating
        proportional auxiliary memory. <strong>Stable</strong> sorts preserve
        the original relative order of elements that compare equal — critical
        when sorting by a secondary key. And <strong>adaptive</strong> sorts
        detect partially-sorted input and finish faster than their worst case.
        The same Big-O can hide very different real-world behavior depending
        on which of these properties an algorithm has.
      </p>

      <h2>BubbleSort</h2>
      <p>
        BubbleSort makes repeated passes through the array, swapping each pair
        of adjacent elements that are out of order. After the first pass the
        largest element has “bubbled” to the final position; after the second
        pass the second-largest is in place; and so on. The implementation
        below carries one optimization worth highlighting: a{' '}
        <code>swapped</code> flag that allows the algorithm to exit early
        when an entire pass completes without a single swap, which happens
        the moment the array is sorted. This is what turns BubbleSort’s best
        case into O(n).
      </p>

      <CodeFromRepo
        path={SORTING_PATH}
        extractMethod="BubbleSort"
        filename="SortingAlgorithms.cs · BubbleSort"
        caption="BubbleSort — pulled live from the source repo"
      />

      <p>
        Best case is O(n) on an already-sorted array — the first pass does n−1
        comparisons and zero swaps, the early-exit fires, and the algorithm
        returns. Average and worst cases are both O(n²), driven by the nested
        loops over the array. Space is O(1): all work happens in place with a
        single auxiliary boolean. BubbleSort is stable, since it only swaps
        on strict inequality and therefore never crosses equal-keyed elements
        past one another.
      </p>
      <p>
        In production C# code BubbleSort is essentially never the right
        choice — InsertionSort dominates it on every input pattern. Its
        enduring value is pedagogical: it is the simplest correct sorting
        algorithm to read, write, and prove correct, which is why it
        continues to appear in introductory curricula.
      </p>

      <h2>InsertionSort</h2>
      <p>
        InsertionSort treats the array as two regions: a sorted prefix on the
        left and an unsorted suffix on the right. Starting at index 1, it
        takes each element from the unsorted region and walks it leftward
        through the sorted prefix, swapping with its left neighbor until the
        element reaches its correct position. The while loop’s short-circuit
        condition <code>array[j] &lt; array[j - 1]</code> means that an
        element already in place pays only a single comparison.
      </p>

      <CodeFromRepo
        path={SORTING_PATH}
        extractMethod="InsertionSort"
        filename="SortingAlgorithms.cs · InsertionSort"
        caption="InsertionSort — pulled live from the source repo"
      />

      <p>
        Best case is O(n) on a sorted array, since each element only needs
        one comparison against its left neighbor before the inner loop exits.
        Average and worst cases are O(n²), reached when each new element must
        travel all the way to the front of the sorted prefix. Space is O(1),
        and InsertionSort is stable for the same reason as BubbleSort —
        elements only swap on strict inequality.
      </p>
      <p>
        InsertionSort is the standard choice for two situations: very small
        arrays (typically under 16–32 elements, depending on cache behavior),
        where its low constant factors beat the per-call overhead of any{' '}
        O(n log n) algorithm; and nearly-sorted arrays, where its O(n)
        adaptive behavior is unbeatable. Most production sorts — including
        Java’s and .NET’s — switch to InsertionSort for the smallest
        subarrays inside their main recursion, precisely because of this.
      </p>

      <h2>MergeSort</h2>
      <p>
        MergeSort is the canonical divide-and-conquer sort. The public entry
        point delegates to a recursive helper that splits the array in half,
        sorts each half recursively, and then merges the two sorted halves
        back together. The recursion tree has depth O(log n); each level
        performs O(n) work in the merge step; the product is O(n log n)
        total — a bound that holds for best, average, and worst cases alike.
      </p>

      <CodeFromRepo
        path={SORTING_PATH}
        extractMethod="MergeSort"
        filename="SortingAlgorithms.cs · MergeSort"
        caption="The public entry point"
      />

      <CodeFromRepo
        path={SORTING_PATH}
        extractMethod="MergeSortAux"
        filename="SortingAlgorithms.cs · MergeSortAux"
        caption="The recursive split"
      />

      <CodeFromRepo
        path={SORTING_PATH}
        extractMethod="Merge"
        filename="SortingAlgorithms.cs · Merge"
        caption="The merge step — combining two sorted halves"
      />

      <p>
        The merge step is where the auxiliary memory comes in:{' '}
        <code>leftArray</code> and <code>rightArray</code> are O(n) copies
        that the algorithm consults while writing back into the original
        array. Total auxiliary space is O(n), plus O(log n) for the
        recursion stack. The merge uses <code>CompareTo(...) &lt;= 0</code> —
        a non-strict comparison that keeps elements from the left half in
        front of equal-valued elements from the right half — which is what
        makes MergeSort stable.
      </p>
      <p>
        MergeSort is the right choice when the worst case actually matters.
        Its O(n log n) bound is guaranteed regardless of input pattern, and
        its predictable, recursion-driven access pattern makes it the
        backbone of <em>external sorts</em> — sorting datasets too large to
        fit in memory, where data is read from and written to disk in
        contiguous runs. It is also the standard sort for linked lists,
        where its sequential access pattern incurs no penalty and its
        out-of-place nature is irrelevant.
      </p>

      <h2>QuickSort</h2>
      <p>
        QuickSort is the other canonical divide-and-conquer sort, but it
        divides differently. Instead of splitting the array in half
        unconditionally and merging sorted results, it chooses a{' '}
        <em>pivot</em>, partitions the array so that all elements smaller
        than the pivot precede all elements larger than it, and then recurses
        on the two sides. No merge step is needed — the partition itself
        does the ordering. This implementation uses a middle-element pivot
        moved to the end before partitioning, then applies the Lomuto
        partition scheme.
      </p>

      <CodeFromRepo
        path={SORTING_PATH}
        extractMethod="QuickSort"
        filename="SortingAlgorithms.cs · QuickSort"
        caption="The public entry point"
      />

      <CodeFromRepo
        path={SORTING_PATH}
        extractMethod="QuickSortAux"
        filename="SortingAlgorithms.cs · QuickSortAux"
        caption="The recursive partition"
      />

      <CodeFromRepo
        path={SORTING_PATH}
        extractMethod="Partition"
        filename="SortingAlgorithms.cs · Partition"
        caption="The Lomuto partition with a middle-element pivot"
      />

      <p>
        Best and average cases are O(n log n), achieved when the pivot
        consistently splits the array into two roughly equal halves. Worst
        case is O(n²), reached when the pivot is always the smallest or
        largest remaining element — for example, sorting an already-sorted
        array with a naïve first-element pivot. The middle-element pivot in
        this implementation defeats the most common adversarial inputs
        (sorted and reverse-sorted arrays), but does not eliminate the
        possibility of O(n²) in principle. Auxiliary space is O(log n) on
        average for the recursion stack, O(n) in the worst case.
      </p>
      <p>
        QuickSort is <strong>not stable</strong>: partitioning swaps
        non-adjacent elements, so the relative order of equal-valued
        elements is not preserved. In exchange, it has the best constant
        factors of any general-purpose comparison sort in practice, and its
        in-place character makes it ideal for sorting arrays in memory where
        every cache line matters.
      </p>

      <h2>Side by side</h2>
      <p>
        With the four algorithms in hand, the comparison clarifies why each
        survives in modern practice — and why no single algorithm dominates
        the others on every axis.
      </p>

      <ComplexityTable
        caption="Sorting algorithms — asymptotic costs"
        rows={[
          { operation: 'BubbleSort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', note: 'in-place, stable, adaptive via the swapped-flag early exit' },
          { operation: 'InsertionSort', best: 'O(n)', average: 'O(n²)', worst: 'O(n²)', note: 'in-place, stable, adaptive — the standard small-input sort' },
          { operation: 'MergeSort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n log n)', note: 'O(n) auxiliary memory, stable, guaranteed worst case — the standard external sort' },
          { operation: 'QuickSort', best: 'O(n log n)', average: 'O(n log n)', worst: 'O(n²)', note: 'in-place (O(log n) stack), not stable, lowest constant factors in practice' },
        ]}
      />

      <SortingVisualizer />

      <Callout variant="insight" title="What the visualizer reveals">
        Run the same input through each algorithm in turn. BubbleSort and
        InsertionSort produce dense, localized swaps that progress slowly
        from one end. MergeSort’s motion comes in bursts — long quiet
        stretches as it recurses, then visible reorderings as merge steps
        write whole runs back. QuickSort’s partitioning swaps reach across
        large spans of the array, finishing in dramatically fewer total
        steps than the O(n²) algorithms for the same input.
      </Callout>

      <Callout variant="warning" title="What production sorts actually do">
        No general-purpose library uses any of these four algorithms in
        isolation. .NET’s <code>Array.Sort</code> implements{' '}
        <strong>introsort</strong> — QuickSort as the primary engine, with
        a fallback to HeapSort when the recursion depth exceeds 2⌊log₂ n⌋
        (defeating QuickSort’s O(n²) worst case) and a switch to
        InsertionSort on subarrays under a threshold (avoiding the
        constant-factor overhead of recursion on tiny inputs). Java’s{' '}
        <code>Arrays.sort</code> for objects, Python’s <code>list.sort</code>,
        and JavaScript engines’ array sort all use <strong>Timsort</strong>:
        an adaptive merge sort that detects pre-existing runs in the input
        and merges them, providing O(n) on nearly-sorted data and O(n log n)
        worst-case guarantees. The simple algorithms in this post are the
        components those hybrids are built from.
      </Callout>

      <h2>When to actually reach for each</h2>
      <p>
        The choice between sorting algorithms in production C# is rarely
        between the four implementations above — <code>Array.Sort</code>{' '}
        and LINQ’s <code>OrderBy</code> almost always win on engineering
        merit alone. The decisions that matter are the ones the standard
        library has already made on your behalf:
      </p>
      <h3>Use <code>Array.Sort</code> or <code>List&lt;T&gt;.Sort</code></h3>
      <p>
        For nearly all in-memory sorting, the built-in introsort is the
        right tool: optimized constant factors, O(n log n) guaranteed worst
        case, and zero engineering cost. Reach for a custom implementation
        only when profiling has identified the standard sort as a measurable
        bottleneck — which, in practice, almost never happens.
      </p>
      <h3>Use LINQ <code>OrderBy</code> when stability matters</h3>
      <p>
        <code>OrderBy</code> and <code>OrderByDescending</code> use a stable
        sort (an internal implementation of quicksort with stability
        preserved via index tiebreaking), making them the correct choice
        when sorting by multiple keys or preserving original order among
        equal-keyed elements. <code>Array.Sort</code> does not guarantee
        stability.
      </p>
      <h3>Reach for MergeSort directly for external sorting</h3>
      <p>
        When the input does not fit in memory — sorting terabytes of log
        lines, for example — the divide-and-conquer structure of MergeSort
        translates directly to disk: sort chunks that fit in RAM, write them
        as sorted runs to disk, then merge the runs in a streaming fashion.
        This is the algorithm behind every distributed sort framework, from
        Unix <code>sort</code> with large inputs to MapReduce shuffles.
      </p>

      <h2>What’s next</h2>
      <p>
        Beyond the four comparison sorts in this post, two further
        directions are worth knowing. <strong>Non-comparison sorts</strong>{' '}
        — counting sort, radix sort, bucket sort — exploit additional
        structure in the input (for example, that all values are integers
        in a known range) to break the Ω(n log n) comparison-sort lower
        bound, achieving O(n) or O(nk) time in exchange for restricting
        the input domain. <strong>Parallel and external sorts</strong>{' '}
        — parallel MergeSort, sample sort, distributed sort — adapt the
        same fundamental ideas to multi-core hardware and to data that
        cannot fit in a single machine’s memory.
      </p>

      <hr className="hairline my-12" />

      <p className="font-mono text-xs text-ink/50 dark:text-paper/50">
        Source code, tests, and benchmarks live in the{' '}
        <a
          href="https://github.com/franklicon/algorithms-data-structures"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ember underline"
        >
          companion repository
        </a>
        .
      </p>
    </article>
  );
}
