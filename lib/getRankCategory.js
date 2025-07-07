export const getRankCategory = (rank) => {
	if (rank <= 10) return 'diamond';
	if (rank <= 100) return 'golden';
	if (rank <= 1000) return 'silver';
	if (rank <= 10000) return 'bronze';
	return 'unranked';
}
