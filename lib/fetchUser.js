export const fetchUser = async (method, id) => {
	const res = await fetch(`/api/get-user?${method}=${id}`, {
		cache: "no-store",
	});
	const data = await res.json();
	return data;
}