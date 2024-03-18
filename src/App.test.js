import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Holiday Plans/i);
  expect(linkElement).toBeInTheDocument();
});
