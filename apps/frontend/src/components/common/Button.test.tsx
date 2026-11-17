import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../../design-system/components/Button';

describe('Design System Button Component', () => {
  it('renders button with correct text and primary variant', () => {
    render(<Button variant="primary">Tasdiqlash</Button>);
    const button = screen.getByRole('button', { name: /tasdiqlash/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-indigo-600');
  });

  it('renders disabled state accurately', () => {
    render(<Button disabled>Nofaol</Button>);
    const button = screen.getByRole('button', { name: /nofaol/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('renders loading spinner when isLoading is true', () => {
    render(<Button isLoading>Yuklanmoqda</Button>);
    const button = screen.getByRole('button', { name: /yuklanmoqda/i });
    expect(button).toBeDisabled();
  });
});
