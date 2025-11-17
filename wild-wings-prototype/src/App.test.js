import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Wild Wings title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Wild Wings/i);
  expect(titleElement).toBeInTheDocument();
});
