import { useState, useEffect } from 'react';
import Places from './Places.jsx';
import Error from './Error.jsx';
import { sortPlacesByDistance } from '../loc.js';
import { fetchAvailablePlaces } from '../http.js';

export default function AvailablePlaces({ onSelectPlace }) {
	const [availablePlaces, setAvailablePlaces] = useState([]);
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState();

	useEffect(() => {
		// fetch('http://localhost:3000/places')
		// 	.then(response => response.json())
		// 	.then(resData => {
		// 		setAvailablePlaces(resData.places);
		// 	});

		const fetchPlaces = async () => {
			setIsFetching(true);

			try {
				const places = await fetchAvailablePlaces();
				// wyznaczanie lokalizacji użytkownika i sotowanie miejsc ze względu na odległość
				navigator.geolocation.getCurrentPosition(position => {
					const sortedPlaces = sortPlacesByDistance(places, position.coords.latitude, position.coords.longitude);
					setAvailablePlaces(sortedPlaces);
					setIsFetching(false); //wykonuje się tuż po pobraniu posortowanej tablicy miejsc
				});
			} catch (error) {
				setError({ message: error.message });
				setIsFetching(false); // gdy wyświetli jakiś błąd to też kończymy wyświetlanie informacji o pobieraniu danych
			}
			// to zostawiamy poza blokiem try catch bo ma być false niezależnie czy juz zakończy się pobierania czy wyrzuci jakiś błąd
		};
		fetchPlaces();
	}, []);

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
