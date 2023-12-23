import { useEffect, useState } from 'react';

export const useFetch = (fetchFn, initialValue) => {
	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState();
	const [fetchedData, setFetchedData] = useState(initialValue);

	useEffect(() => {
		const fetchData = async () => {
			setIsFetching(true);

			try {
				const data = await fetchFn();
				setFetchedData(data);
			} catch (error) {
				setError({ message: error.message || 'Failed to fetch data.' });
			}
			setIsFetching(false);
		};
		fetchData();
	}, [fetchFn]);

	return { isFetching, fetchedData, error, setFetchedData };
};
