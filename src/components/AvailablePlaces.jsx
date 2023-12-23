import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';
import { useFetch } from '../hooks/useFetch.js';

const fetchSortedPlaces = async () => {
	const places = await fetchAvailablePlaces();

	return new Promise((res, rej) => {
		navigator.geolocation.getCurrentPosition(position => {
			const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
			res(sortedPlaces);
		});
	});
};

export default function AvailablePlaces({ onSelectPlace }) {
	const { isFetching, error, fetchedData: availablePlaces } = useFetch(fetchSortedPlaces, []);

	if (error) {
		return (
			<Error
				title='An error occured!'
				message={error.message || 'Could not fetch places, please try again later.'}></Error>
		);
	}

	return (
		<Places
			title='Available Places'
			places={availablePlaces}
			isLoading={isFetching}
			loadingText='Fetching place data...'
			fallbackText='No places available.'
			onSelectPlace={onSelectPlace}
		/>
	);
}
