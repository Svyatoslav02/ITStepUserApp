import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadSavedPlaceIds, saveSavedPlaceIds } from '../../services/savedPlacesStorage';

const KEY = '@ITStepUserApp:savedPlaces:v1';

test('returns an empty list on first launch', async () => {
  await expect(loadSavedPlaceIds()).resolves.toEqual([]);
});

test('saves favorites and restores them from storage', async () => {
  await saveSavedPlaceIds(['restaurant-1', 42]);

  expect(await AsyncStorage.getItem(KEY)).toBe('["restaurant-1",42]');
  await expect(loadSavedPlaceIds()).resolves.toEqual(['restaurant-1', 42]);
});

test('prevents duplicates when saving and loading', async () => {
  await saveSavedPlaceIds(['place-1', 'place-1', 2, 2]);
  expect(await AsyncStorage.getItem(KEY)).toBe('["place-1",2]');

  await AsyncStorage.setItem(KEY, '["place-1","place-1",2,2]');
  await expect(loadSavedPlaceIds()).resolves.toEqual(['place-1', 2]);
});

test('persists removal without changing the other favorites', async () => {
  await saveSavedPlaceIds(['place-1', 'place-2']);
  const favorites = await loadSavedPlaceIds();
  await saveSavedPlaceIds(favorites.filter((id) => id !== 'place-1'));

  await expect(loadSavedPlaceIds()).resolves.toEqual(['place-2']);
});

test('removes the last favorite by saving an empty list', async () => {
  await saveSavedPlaceIds(['place-1']);
  await saveSavedPlaceIds([]);
  await expect(loadSavedPlaceIds()).resolves.toEqual([]);
});

test('filters invalid IDs before saving', async () => {
  await saveSavedPlaceIds(['valid', 0, '', '  ', null, undefined, {}, NaN, Infinity]);
  await expect(loadSavedPlaceIds()).resolves.toEqual(['valid', 0]);
});

test('filters invalid IDs when reading existing data', async () => {
  await AsyncStorage.setItem(KEY, '["valid",0,"",null,{},false,"  "]');
  await expect(loadSavedPlaceIds()).resolves.toEqual(['valid', 0]);
});

test.each(['null', '{}', '"not a list"', '42'])('handles non-array storage data: %s', async (value) => {
  await AsyncStorage.setItem(KEY, value);
  await expect(loadSavedPlaceIds()).resolves.toEqual([]);
});

test('handles malformed JSON without crashing or overwriting it', async () => {
  const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  await AsyncStorage.setItem(KEY, '{broken');
  await expect(loadSavedPlaceIds()).resolves.toEqual([]);
  expect(warn).toHaveBeenCalled();
  expect(await AsyncStorage.getItem(KEY)).toBe('{broken');
});

test('reports a read failure to the caller', async () => {
  AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage unavailable'));
  await expect(loadSavedPlaceIds()).rejects.toThrow('Storage unavailable');
});

test('reports a write failure and allows a later retry', async () => {
  AsyncStorage.setItem.mockRejectedValueOnce(new Error('Storage full'));
  await expect(saveSavedPlaceIds(['place-1'])).rejects.toThrow('Storage full');
  await saveSavedPlaceIds(['place-1']);
  await expect(loadSavedPlaceIds()).resolves.toEqual(['place-1']);
});
