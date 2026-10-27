import cityData from '../data/cityData';

const categories = [
  { id: 'food', icon: 'silverware-fork-knife', uk: 'Їжа', en: 'Food' },
  { id: 'culture', icon: 'drama-masks', uk: 'Культура', en: 'Culture' },
  { id: 'nature', icon: 'tree', uk: 'Природа', en: 'Nature' },
  { id: 'shopping', icon: 'shopping', uk: 'Шопінг', en: 'Shopping' },
  { id: 'entertainment', icon: 'movie-open', uk: 'Розваги', en: 'Entertainment' },
  { id: 'hotels', icon: 'bed', uk: 'Готелі', en: 'Hotels' },
];

const getLocalized = (section, language) => section?.[language] ?? section?.uk;

export async function getCities() {
  return Object.keys(cityData);
}

export async function getCategories(language = 'uk') {
  return categories.map(({ id, icon, uk, en }) => ({ id, icon, name: language === 'en' ? en : uk }));
}

export async function getPlaces(city, language = 'uk') {
  const cityRecord = cityData[city];
  const places = getLocalized(cityRecord?.places, language) ?? [];
  const hotels = getLocalized(cityRecord?.hotels, language) ?? [];

  return [
    ...places,
    ...hotels.map((hotel) => ({ ...hotel, name: hotel.title, type: 'hotels', likes: hotel.likes ?? 0 })),
  ];
}

export async function getPlace(city, placeId, language = 'uk') {
  const places = await getPlaces(city, language);
  return places.find((place) => String(place.id) === String(placeId)) ?? null;
}

export async function getCityHistory(city, language = 'uk') {
  return getLocalized(cityData[city]?.history, language) ?? [];
}

export async function getCityContent(city, language = 'uk') {
  const cityRecord = cityData[city];
  return {
    weather: getLocalized(cityRecord?.weather, language) ?? null,
  };
}
