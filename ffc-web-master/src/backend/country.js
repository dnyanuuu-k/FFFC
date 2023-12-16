import { perform } from "./request";
import cache from "./cache";

export const getAll = async () => {
	const key = "country/getAll";
	if(cache.has(key))return cache.get(key);
	const data = await perform('country/get_all', {}, false);
	if(data?.success){
		cache.set(key, data);
	}
	return data;
};