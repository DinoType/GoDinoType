import React from 'react'

export default function RenderText({ quote, input, charsRef }) {
	const inputLength = input.length;
	const LINE_SIZE = 43;
	const NUM_VISIBLE_LINES = 3;
	const CHUNK_SIZE = LINE_SIZE * NUM_VISIBLE_LINES;

	let visibleStart = 0;

	while (
		visibleStart + LINE_SIZE * 2 < quote.length &&
		inputLength > visibleStart + LINE_SIZE * 2
	) {
		visibleStart += LINE_SIZE;
		while (quote[visibleStart] !== " " && visibleStart > 0) {
			visibleStart--;
		}
	}

	const renderEnd = visibleStart + CHUNK_SIZE;

	return quote.split("").map((char, i) => {
		let className = "untyped";

		if (i < input.length) {
			className = input[i] === char ? "correct" : "incorrect";
		} else if (i === input.length) {
			className = "active";
		}

		if (i < visibleStart || i >= renderEnd) {
			className += " hidden";
		}

		return (
			<span
				ref={(el) => (charsRef.current[i] = el)}
				key={i}
				className={className}
			>
				{char}
			</span>
		);
	});
}