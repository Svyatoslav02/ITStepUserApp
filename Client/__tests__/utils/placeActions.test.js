import { Linking, Share } from 'react-native';
import { getMapUrl, openPlaceInMaps, sharePlace } from '../../utils/placeActions';

test('uses coordinates in preference to the address', () => {
  const url = getMapUrl({ name: 'Cafe', coordinates: { latitude: 0, longitude: 24 } }, 'City');
  expect(url).toBe('https://www.google.com/maps/search/?api=1&query=0%2C24');
});

test('supports flat coordinates', () => {
  expect(getMapUrl({ latitude: 48, longitude: 24 })).toContain('query=48%2C24');
});

test('encodes the place, address and city if coordinates are missing', () => {
  const query = 'Кафе & бар, Вул. Шевченка, 1, Львів';
  expect(getMapUrl({ name: 'Кафе & бар', address: 'Вул. Шевченка, 1' }, 'Львів'))
    .toBe(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`);
});

test('opens the generated URL using native Linking', async () => {
  const openURL = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  await openPlaceInMaps({ name: 'Cafe' }, 'City');
  expect(openURL).toHaveBeenCalledWith(getMapUrl({ name: 'Cafe' }, 'City'));
});

test('shares the title, address and map link', async () => {
  const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.sharedAction });
  const place = { name: 'Cafe', address: 'Street 1' };
  await sharePlace(place, 'City');
  expect(share).toHaveBeenCalledWith({
    title: 'Cafe',
    message: `Cafe\nStreet 1\n${getMapUrl(place, 'City')}`,
  });
});

test('shares minimal records with a fallback title and city', async () => {
  const share = jest.spyOn(Share, 'share').mockResolvedValue({ action: Share.dismissedAction });
  await sharePlace({}, 'City');
  expect(share).toHaveBeenCalledWith({ title: 'Місце', message: `Місце\nCity\n${getMapUrl({}, 'City')}` });
});
