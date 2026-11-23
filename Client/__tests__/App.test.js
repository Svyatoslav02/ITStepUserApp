import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import App from '../App';

const KEY = '@ITStepUserApp:savedPlaces:v1';

jest.mock('react-native-gesture-handler', () => ({}));
jest.mock('@expo/vector-icons', () => ({ Feather: () => null }));
jest.mock('@react-navigation/native', () => ({ NavigationContainer: ({ children }) => children }));
jest.mock('@react-navigation/stack', () => ({
  createStackNavigator: () => ({
    Navigator: ({ children, initialRouteName }) => {
      const React = require('react');
      const route = React.Children.toArray(children).find((child) => child.props.name === initialRouteName);
      return React.createElement(route.props.component, {
        route: { params: route.props.initialParams },
        navigation: { reset: jest.fn(), navigate: jest.fn() },
      });
    },
    Screen: () => null,
  }),
}));
jest.mock('../services/useDayPlan', () => () => ({ stops: [], isReady: true }));
jest.mock('../services/cityService', () => ({ getCities: jest.fn(async () => ['City']) }));
jest.mock('../services/useCities', () => () => ({ cities: ['City'], isLoading: false }));
jest.mock('../pages/Saved', () => () => null);
jest.mock('../pages/PlaceDetails', () => () => null);
jest.mock('../pages/DayPlan', () => () => null);
jest.mock('../pages/Contacts', () => () => null);
jest.mock('../pages/MainPage', () => {
  const React = require('react');
  const { Text, Button, View } = require('react-native');
  const AppContext = require('../AppContext').default;

  return function FavoriteControls() {
    const { likedPlaces, setLikedPlaces, selectedCity } = React.useContext(AppContext);
    return (
      <View>
        <Text>{selectedCity}</Text>
        <Text testID="favorites">{JSON.stringify([...likedPlaces])}</Text>
        <Button title="Save place" onPress={() => setLikedPlaces((ids) => new Set([...ids, 'place-2']))} />
        <Button title="Remove place" onPress={() => setLikedPlaces((ids) => new Set([...ids].filter((id) => id !== 'place-1')))} />
      </View>
    );
  };
});

beforeEach(async () => {
  await AsyncStorage.setItem('selectedCity', 'City');
});

test('restores favorites before persisting and opens the saved city', async () => {
  await AsyncStorage.setItem(KEY, '["place-1"]');
  const { unmount } = render(<App />);

  expect(await screen.findByText('City')).toBeOnTheScreen();
  expect(screen.getByTestId('favorites')).toHaveTextContent('["place-1"]');
  await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(KEY, '["place-1"]'));
  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(KEY, '[]');
  unmount();
});

test('waits for saved favorites before opening the city or writing to storage', async () => {
  let resolveFavorites;
  AsyncStorage.getItem.mockResolvedValueOnce('City');
  AsyncStorage.getItem.mockImplementationOnce(() => new Promise((resolve) => { resolveFavorites = resolve; }));
  render(<App />);

  await act(async () => {});
  expect(screen.queryByTestId('favorites')).not.toBeOnTheScreen();
  expect(AsyncStorage.setItem.mock.calls.filter(([key]) => key === KEY)).toEqual([]);

  await act(async () => resolveFavorites('["place-1"]'));
  expect(await screen.findByTestId('favorites')).toHaveTextContent('["place-1"]');
  expect(AsyncStorage.setItem).not.toHaveBeenCalledWith(KEY, '[]');
});

test('persists saving, duplicate prevention and removal through app state', async () => {
  await AsyncStorage.setItem(KEY, '["place-1"]');
  const { unmount } = render(<App />);
  await screen.findByText('City');

  fireEvent.press(screen.getByText('Save place'));
  fireEvent.press(screen.getByText('Save place'));
  await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(KEY, '["place-1","place-2"]'));

  fireEvent.press(screen.getByText('Remove place'));
  await waitFor(() => expect(AsyncStorage.setItem).toHaveBeenLastCalledWith(KEY, '["place-2"]'));
  unmount();
  render(<App />);
  await screen.findByText('City');
  expect(screen.getByTestId('favorites')).toHaveTextContent('["place-2"]');
});

test('does not overwrite existing favorites if restoring storage fails', async () => {
  const errorLog = jest.spyOn(console, 'error').mockImplementation(() => {});
  AsyncStorage.getItem.mockImplementationOnce(async () => 'City');
  AsyncStorage.getItem.mockRejectedValueOnce(new Error('Storage unavailable'));
  render(<App />);

  await screen.findByText('City');
  fireEvent.press(screen.getByText('Save place'));
  await waitFor(() => expect(errorLog).toHaveBeenCalled());
  expect(AsyncStorage.setItem.mock.calls.filter(([key]) => key === KEY)).toEqual([]);
});

test('returns to city selection if the saved city is no longer available', async () => {
  await AsyncStorage.setItem('selectedCity', 'Removed city');
  render(<App />);
  expect(await screen.findByText('Оберіть місто')).toBeOnTheScreen();
  expect(screen.queryByTestId('favorites')).not.toBeOnTheScreen();
});
