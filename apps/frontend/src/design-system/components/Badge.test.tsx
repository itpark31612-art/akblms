import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';
import { UserRole } from '@ems/shared';

describe('Design System Badge Component', () => {
  it('renders correctly with specific role', () => {
    render(<Badge role={UserRole.SUPER_ADMIN} />);
    expect(screen.getByText('Super Admin')).toBeInTheDocument();
  });

  it('renders status badge with dot', () => {
    render(
      <Badge variant="success" dot>
        Faol
      </Badge>
    );
    expect(screen.getByText('Faol')).toBeInTheDocument();
  });
});
