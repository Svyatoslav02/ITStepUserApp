import { act, renderHook, waitFor } from '@testing-library/react-native';
import usePlace from '../../services/usePlace';
import { getPlace } from '../../services/cityService';

jest.mock('../../services/cityService', () => ({ getPlace: jest.fn() }));

beforeEach(() => getPlace.mockReset());

test('loads details and exposes the loading state', async () => {
  const place = { id: 1, name: 'Cafe' };
  getPlace.mockResolvedValue(place);
  const { result } = renderHook(() => usePlace('City', 1));
  expect(result.current.isLoading).toBe(true);
  await waitFor(() => expect(result.current.place).toEqual(place));
  expect(result.current).toMatchObject({ isLoading: false, error: null });
  expect(getPlace).toHaveBeenCalledWith('City', 1, 'uk');
});

test('shows a request error and loads the place after retrying', async () => {
  const error = new Error('Offline');
  const place = { id: 1, name: 'Cafe' };
  getPlace.mockRejectedValueOnce(error).mockResolvedValueOnce(place);
  const { result } = renderHook(() => usePlace('City', 1));
  await waitFor(() => expect(result.current.error).toBe(error));
  expect(result.current.isLoading).toBe(false);
  act(() => result.current.retry());
  await waitFor(() => expect(result.current.place).toEqual(place));
  expect(result.current.error).toBeNull();
  expect(getPlace).toHaveBeenCalledTimes(2);
});

test('represents a missing place without treating it as a request error', async () => {
  getPlace.mockResolvedValue(null);
  const { result } = renderHook(() => usePlace('City', 'missing'));
  await waitFor(() => expect(result.current.isLoading).toBe(false));
  expect(result.current).toMatchObject({ place: null, error: null });
});

test('ignores an old response after switching to a different place', async () => {
  let resolveOldRequest;
  getPlace.mockImplementationOnce(() => new Promise((resolve) => { resolveOldRequest = resolve; }));
  getPlace.mockResolvedValueOnce({ id: 2 });
  const { result, rerender } = renderHook(({ id }) => usePlace('City', id), { initialProps: { id: 1 } });
  rerender({ id: 2 });
  await waitFor(() => expect(result.current.place).toEqual({ id: 2 }));
  await act(async () => resolveOldRequest({ id: 1 }));
  expect(result.current.place).toEqual({ id: 2 });
});
