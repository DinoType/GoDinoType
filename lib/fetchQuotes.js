export const fetchQuotes = async (setQuote) => {
	const skip = Math.floor(Math.random() * 1000);
	const res = await fetch(`https://dummyjson.com/quotes?limit=10&skip=${skip}`, {
		cache: "no-store",
	});
	const data = await res.json();
	const combined = data.quotes.map(q => q.quote).join(" ");
	setQuote(combined);
}