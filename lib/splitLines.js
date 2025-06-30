export function splitLines(paragraph, maxChars) {
	const words = paragraph.split(' ');
	const lines = [];
	let currentLine = '';

	for (const word of words) {
		if ((currentLine + (currentLine ? ' ' : '') + word).length <= maxChars) {
			currentLine += (currentLine ? ' ' : '') + word;
		} else {
			if (currentLine) lines.push(currentLine);
			currentLine = word;
		}
	}

	if (currentLine) lines.push(currentLine);

	return lines;
}