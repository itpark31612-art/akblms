import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CounterAnimation } from './CounterAnimation';

describe('CounterAnimation Component', () => {
  it('renders numeric target correctly', () => {
    render(<CounterAnimation value={2450} />);
    // Initial or final render contains numeric element
    const el = screen.getByText(/[0-9]+/);
    expect(el).toBeInTheDocument();
  });
});
