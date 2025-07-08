export const fetchQuotes = async (setQuote) => {
	const blockedWords = ["muslim",
		"islam",
		"islamic",
		"allah",
		"prophet",
		"muhammad",
		"quran",
		"hadith",
		"hijab",
		"mosque",
		"ummah",
		"halal",
		"haram",
		"ramadan",
		"eid",
		"sharia",
		"sunnah",
		"fasting",
		"zakat",
		"mecca",
		"medina",
		"kufr",
		"salat",
		"imam",
		"caliph",
		"jihad",
		"ayat",
		"surah",
		"tawhid",
		"shahada",
		"niqab",
		"burqa",
		"dhikr"];
	const totalQuotesNeeded = 10;
	let quotes = [];

	while (quotes.length < totalQuotesNeeded) {
		const skip = Math.floor(Math.random() * 1000);
		const res = await fetch(`https://dummyjson.com/quotes?limit=10&skip=${skip}`, {
			cache: "no-store",
		});
		const data = await res.json();

		// Filter out unwanted quotes
		const filtered = data.quotes.filter(q =>
			!blockedWords.some(word =>
				q.quote.toLowerCase().includes(word)
			)
		);

		// Add to quotes until we have enough
		for (let quote of filtered) {
			if (quotes.length < totalQuotesNeeded) {
				quotes.push(quote.quote);
			} else {
				break;
			}
		}
	}

	const combined = quotes.join(" ");
	setQuote(combined);
};
