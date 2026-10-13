import { Linking, Share } from 'react-native';

const getMapQuery = (place, city) => {
  const latitude = place?.latitude ?? place?.coordinates?.latitude;
  const longitude = place?.longitude ?? place?.coordinates?.longitude;
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    return `${latitude},${longitude}`;
  }

  return [place?.name, place?.address, city].filter(Boolean).join(', ');
};

export const getMapUrl = (place, city) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(getMapQuery(place, city))}`;

export const openPlaceInMaps = (place, city) => Linking.openURL(getMapUrl(place, city));

export const sharePlace = (place, city) => {
  const name = place?.name || place?.title || 'Місце';
  const address = place?.address || city;
  const details = [name, address, getMapUrl(place, city)].filter(Boolean).join('\n');
  return Share.share({ title: name, message: details });
};
