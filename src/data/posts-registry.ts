import { ComponentType } from 'react';
import LinkedListPost from '../posts/data-structures/linked-list';
import DoublyLinkedListPost from '../posts/data-structures/doubly-linked-list';
import StackPost from '../posts/data-structures/stack';
import QueuePost from '../posts/data-structures/queue';
import SortingPost from '../posts/algorithms/sorting';

export type Category = 'data-structures' | 'algorithms';

export interface PostMeta {
  slug: string;
  title: string;
  subtitle: string;
  category: Category;
  tags: string[];
  date: string; // ISO
  readingTime: number; // minutes
  complexity: {
    access?: string;
    search?: string;
    insertion?: string;
    deletion?: string;
    time?: string;
    space?: string;
  };
  component: ComponentType;
}

export const posts: PostMeta[] = [
  {
    slug: 'linked-list',
    title: 'Singly Linked Lists',
    subtitle: 'The humble building block of dynamic memory.',
    category: 'data-structures',
    tags: ['linked-list', 'pointers', 'fundamentals'],
    date: '2026-05-22',
    readingTime: 9,
    complexity: {
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1) head / O(n) tail',
      space: 'O(n)',
    },
    component: LinkedListPost,
  },
  {
    slug: 'doubly-linked-list',
    title: 'Doubly Linked Lists',
    subtitle: 'Trading a pointer per node for symmetric O(1) operations at both ends.',
    category: 'data-structures',
    tags: ['linked-list', 'pointers', 'fundamentals'],
    date: '2026-05-22',
    readingTime: 9,
    complexity: {
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1)',
      space: 'O(n)',
    },
    component: DoublyLinkedListPost,
  },
  {
    slug: 'stack',
    title: 'Stacks (Linked-List Backed)',
    subtitle: 'LIFO discipline with worst-case O(1) push and pop at a single end.',
    category: 'data-structures',
    tags: ['stack', 'linked-list', 'fundamentals'],
    date: '2026-05-22',
    readingTime: 8,
    complexity: {
      access: 'O(1) top',
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1)',
      space: 'O(n)',
    },
    component: StackPost,
  },
  {
    slug: 'queue',
    title: 'Queues (Linked-List Backed)',
    subtitle: 'FIFO ordering with worst-case O(1) enqueue and dequeue at opposite ends.',
    category: 'data-structures',
    tags: ['queue', 'linked-list', 'fundamentals'],
    date: '2026-05-22',
    readingTime: 9,
    complexity: {
      access: 'O(1) front',
      search: 'O(n)',
      insertion: 'O(1)',
      deletion: 'O(1)',
      space: 'O(n)',
    },
    component: QueuePost,
  },
  {
    slug: 'sorting',
    title: 'Sorting Algorithms',
    subtitle: 'Four comparison sorts in C# — when to reach for each, and what each one really costs.',
    category: 'algorithms',
    tags: ['sorting', 'comparison-sort', 'fundamentals'],
    date: '2026-05-22',
    readingTime: 15,
    complexity: {
      time: 'O(n log n) – O(n²)',
      space: 'O(1) – O(n)',
    },
    component: SortingPost,
  },
];

export function getPost(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getPostsByCategory(category: Category): PostMeta[] {
  return posts.filter((p) => p.category === category);
}

export const CATEGORY_LABEL: Record<Category, string> = {
  'data-structures': 'Data Structures',
  algorithms: 'Algorithms',
};
