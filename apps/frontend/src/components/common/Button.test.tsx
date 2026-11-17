import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button Component', () => {
  it('renders button with correct text and variant', () => {
    render(<Button variant="primary">Tasdiqlash</Button>);
    const button = screen.getByRole('button', { name: /tasdiqlash/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-indigo-600');
  });

  it('is disabled when disabled prop is passed', () => {
    render(<Button disabled>Nofaol</Button>);
    const button = screen.getByRole('button', { name: /nofaol/i });
    expect(button).toBeDisabled();
  });
});
