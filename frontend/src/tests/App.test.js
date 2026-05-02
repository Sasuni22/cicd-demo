import { render, screen } from '@testing-library/react';
import App from '../App';

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ success: true, data: [] }),
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders the app title', async () => {
  render(<App />);
  expect(screen.getByText('CI/CD Demo App')).toBeInTheDocument();
});

test('shows empty message when no items', async () => {
  render(<App />);
  const empty = await screen.findByText('No items yet. Add one above!');
  expect(empty).toBeInTheDocument();
});