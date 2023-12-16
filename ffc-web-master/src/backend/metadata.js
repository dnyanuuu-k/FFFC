import { perform } from "./request";
import cache from "./cache";

export const getList = async () => {
	const key = "metadata/getList";
	if(cache.has(key))return cache.get(key);
	const data = await perform('metadata/list', {
		uiFriendly: true
	});
	if(data?.success){
		cache.set(key, data);
	}
	return data;
}