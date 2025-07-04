export const calculateResults = (timeInSeconds, quote, input, setWpm, setAccuracy, setCharTyped) => {
	const typed = input;
	const totalTypedChars = typed.length;
	setCharTyped(totalTypedChars);
	let correctChars = 0;

	for (let i = 0; i < typed.length; i++) {
		if (typed[i] === quote[i]) {
			correctChars++;
		}
	}

	const timeInMinutes = timeInSeconds / 60;
	const wordsTyped = correctChars / 5;
	const calculatedWPM = Math.round(wordsTyped / timeInMinutes);
	const calculatedAccuracy = Math.round((correctChars / totalTypedChars) * 100) || 0;

	setWpm(calculatedWPM);
	setAccuracy(calculatedAccuracy);
	console.log(timeInSeconds, timeInMinutes, wordsTyped, calculatedWPM, calculatedAccuracy)
};