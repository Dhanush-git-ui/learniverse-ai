import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConversationBox from '../components/ConversationBox';
import { Topic, Question } from '../models/Topic';

// Mock scrollToView which is not implemented in JSDOM
window.HTMLElement.prototype.scrollIntoView = vi.fn();

describe('ConversationBox Component', () => {
  const mockTopic: Topic = {
    id: '1',
    name: 'AVL Trees',
    slug: 'avl-trees',
    description: 'Self-balancing binary search trees.',
    icon: 'Tree',
    category: 'DSA',
    difficulty: 'Intermediate',
    order: 1,
    subtopics: []
  };

  const mockQuestion: Question = {
    id: 'q1',
    prompt: 'Explain AVL Tree balance factor.',
    solution: 'A balance factor of a node is the difference between heights of left and right subtrees.',
    hints: ['Height of left minus height of right.']
  };

  it('renders session header and initial messages correctly', () => {
    const initialMessages = [
      { id: '1', type: 'user' as const, content: 'Hello Teacher!' },
      { id: '2', type: 'teacher' as const, content: 'Hello Student! Let us learn AVL Trees.' }
    ];

    render(
      <ConversationBox
        initialMessages={initialMessages}
        sessionTitle="Testing Session"
        topic={mockTopic}
        currentQuestion={mockQuestion}
      />
    );

    // Verify session title is in the document
    expect(screen.getByText('Testing Session')).toBeInTheDocument();

    // Verify user message is rendered
    expect(screen.getByText('Hello Teacher!')).toBeInTheDocument();

    // Verify teacher message is rendered
    expect(screen.getByText('Hello Student! Let us learn AVL Trees.')).toBeInTheDocument();
  });
});
