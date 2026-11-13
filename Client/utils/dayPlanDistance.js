const EARTH_RADIUS_METERS = 6371000;

const isValidCoordinate = (value, min, max) =>
  Number.isFinite(value) && value >= min && value <= max;

export function calculateDistanceMeters(from, to) {
  const fromLatitude = from?.latitude;
  const fromLongitude = from?.longitude;
  const toLatitude = to?.latitude;
  const toLongitude = to?.longitude;

  if (
    !isValidCoordinate(fromLatitude, -90, 90)
    || !isValidCoordinate(toLatitude, -90, 90)
    || !isValidCoordinate(fromLongitude, -180, 180)
    || !isValidCoordinate(toLongitude, -180, 180)
  ) {
    return null;
  }

  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(toLatitude - fromLatitude);
  const longitudeDelta = toRadians(toLongitude - fromLongitude);
  const startLatitude = toRadians(fromLatitude);
  const endLatitude = toRadians(toLatitude);
  const haversine = Math.min(1, Math.max(0,
    Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(startLatitude) * Math.cos(endLatitude) * Math.sin(longitudeDelta / 2) ** 2
  ));

  return 2 * EARTH_RADIUS_METERS * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function formatDistance(meters) {
  if (!Number.isFinite(meters) || meters < 0) return null;
  if (meters < 1000) return `${Math.round(meters)} м`;
  return `${(meters / 1000).toFixed(1)} км`;
}
