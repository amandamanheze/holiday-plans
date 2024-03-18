import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from './components/Calendar';

describe('Calendar Component', () => {
  test('renders without crashing', () => {
    render(<Calendar />);
    const linkElement = screen.getByText(/ALL YOUR PLANS/i);
    expect(linkElement).toBeInTheDocument();
  });
});
