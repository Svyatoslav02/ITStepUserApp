import { calculateDistanceMeters, formatDistance } from '../../utils/dayPlanDistance';

test('returns zero for the same point', () => {
  const point = { latitude: 48.9, longitude: 24.7 };
  expect(calculateDistanceMeters(point, point)).toBe(0);
});

test('calculates a known distance along the equator', () => {
  const distance = calculateDistanceMeters({ latitude: 0, longitude: 0 }, { latitude: 0, longitude: 1 });
  expect(distance).toBeCloseTo(111194.93, 1);
});

test('calculates equal distances in either direction', () => {
  const from = { latitude: 48.9, longitude: 24.7 };
  const to = { latitude: 49.8, longitude: 24.0 };
  expect(calculateDistanceMeters(from, to)).toBeCloseTo(calculateDistanceMeters(to, from), 6);
});

test.each([null, {}, { latitude: 91, longitude: 0 }, { latitude: 0, longitude: -181 }, { latitude: NaN, longitude: 0 }])(
  'returns null for unavailable or invalid coordinates: %j', (point) => {
    expect(calculateDistanceMeters(point, { latitude: 0, longitude: 0 })).toBeNull();
    expect(calculateDistanceMeters({ latitude: 0, longitude: 0 }, point)).toBeNull();
  }
);

test.each([[0, '0 м'], [125.6, '126 м'], [999, '999 м'], [1000, '1.0 км'], [1520, '1.5 км']])(
  'formats %s meters as %s', (meters, expected) => {
    expect(formatDistance(meters)).toBe(expected);
  }
);

test.each([null, undefined, -1, NaN, Infinity])('does not format invalid distances: %s', (meters) => {
  expect(formatDistance(meters)).toBeNull();
});
