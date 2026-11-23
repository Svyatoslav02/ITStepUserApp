import { getCities, getCityHistory, getPlace, getPlaces } from '../../services/cityService';

jest.mock('../../data/cityData', () => ({
  City: {
    places: { uk: [{ id: 1, name: 'Кафе' }] },
    hotels: { uk: [{ id: 2, title: 'Готель', image: 'hotel.jpg', reviews: ['good'] }] },
    history: { uk: [{ title: 'Історія' }] },
  },
}));

test('lists available cities from the data source', async () => {
  await expect(getCities()).resolves.toEqual(['City']);
});

test('combines places and accommodation with normalized hotel fields', async () => {
  const places = await getPlaces('City');
  expect(places).toHaveLength(2);
  expect(places[1]).toMatchObject({
    id: 2, name: 'Готель', category: 'hotels', photos: ['hotel.jpg'], reviewCount: 1,
  });
});

test('finds numeric IDs received as strings from navigation', async () => {
  await expect(getPlace('City', '1')).resolves.toEqual({ id: 1, name: 'Кафе' });
});

test('returns null for an unknown place', async () => {
  await expect(getPlace('City', 'missing')).resolves.toBeNull();
});

test('falls back to Ukrainian when a translation is missing', async () => {
  await expect(getCityHistory('City', 'en')).resolves.toEqual([{ title: 'Історія' }]);
});

test('returns empty lists for an unavailable city', async () => {
  await expect(getPlaces('Removed')).resolves.toEqual([]);
  await expect(getCityHistory('Removed')).resolves.toEqual([]);
});
