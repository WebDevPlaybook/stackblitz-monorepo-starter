import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { Button } from './button';

describe(Button, () => {
  it('should render ', () => {
    render(<Button>Hello</Button>);
    const button = screen.getByText('Hello');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });
});
