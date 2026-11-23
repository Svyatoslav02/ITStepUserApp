import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { EmptyState, ErrorState, LoadingState } from '../../pages/components/StateViews';

const theme = { accent: '#ffd700', text: '#eeeeee', card: '#1f1f1f', favBtnText: '#000000' };

test('displays the loading message', () => {
  render(<LoadingState message="Завантаження місць…" theme={theme} />);
  expect(screen.getByText('Завантаження місць…')).toBeOnTheScreen();
});

test('retries when the user presses the retry button', () => {
  const onRetry = jest.fn();
  render(<ErrorState message="Немає інтернету" onRetry={onRetry} theme={theme} />);
  expect(screen.getByText('Немає інтернету')).toBeOnTheScreen();
  fireEvent.press(screen.getByText('Повторити'));
  expect(onRetry).toHaveBeenCalledTimes(1);
});

test('does not show a retry control without a retry handler', () => {
  render(<ErrorState theme={theme} />);
  expect(screen.queryByText('Повторити')).not.toBeOnTheScreen();
});

test('displays an empty saved list clearly', () => {
  render(<EmptyState message="Немає обраних місць" theme={theme} />);
  expect(screen.getByText('Немає обраних місць')).toBeOnTheScreen();
});
