// utils/formatDate.js

export function formatDate(isoString) {
	const date = new Date(isoString);

	const datePart = date.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		timeZone: "Asia/Kolkata",
	});

	const timePart = date.toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
		timeZone: "Asia/Kolkata",
	});

	return `${datePart} ${timePart}`
}
