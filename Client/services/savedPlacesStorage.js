import AsyncStorage from '@react-native-async-storage/async-storage';

const SAVED_PLACES_KEY = '@ITStepUserApp:savedPlaces:v1';

const isValidId = (id) =>
    (typeof id === 'string' && id.trim().length > 0) ||
    (typeof id === 'number' && Number.isFinite(id));

    
export const loadSavedPlaceIds = async () => {
    const storedPlaces = await AsyncStorage.getItem(SAVED_PLACES_KEY);

    if (!storedPlaces) {
        return [];
    }

    let parsedPlaces;

    try {
        parsedPlaces = JSON.parse(storedPlaces);
    } catch (error) {
        console.warn('Некоректні дані збережених місць:', error);
        return [];
    }

    if (!Array.isArray(parsedPlaces)) {
        return [];
    }

    return [...new Set(parsedPlaces.filter(isValidId))];
};


export const saveSavedPlaceIds = async (placeIds) => {
    const uniqueIds = [...new Set(placeIds)].filter(isValidId);

    await AsyncStorage.setItem(
        SAVED_PLACES_KEY,
        JSON.stringify(uniqueIds)
    );
};