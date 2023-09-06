'use strict';
import '../scss/style.scss';

let htmlDisplay = document.querySelector('.calculator__display');
let htmlButtons = document.querySelectorAll('.button');
let digitButtons = document.querySelectorAll('.button-digit');
let operatorButtons = document.querySelectorAll('.button-operator');
let pointButton = document.querySelector('.button-point');
let clearButton = document.querySelector('.button-clear');
let allClearButton = document.querySelector('.button-all-clear');
let equalityButton = document.querySelector('.button-equality');

let states = ['A'];
let displayChars = ['0'];
let expressionChars = ['0'];

let lastState = () => states.at(-1);
let lastExpressionChar = () => expressionChars.at(-1);
let render = () => htmlDisplay.innerHTML = displayChars.join('');
let reset = () => {
	states = ['A'];
	expressionChars = ['0'];
	displayChars = ['0'];
}

let stateTable = {
	'S': {
		'digit': 'A'
	},
	'A': {
		'digit': 'A',
		'operator': 'B',
		'point': 'C'
	},
	'B': {
		'digit': 'A'
	},
	'C': {
		'digit': 'D'
	},
	'D': {
		'digit': 'D',
		'operator': 'B'
	}
};

digitButtons.forEach(el => {
	el.addEventListener('click', event => {
		let state = lastState();
		let value = el.dataset.value;
		let symbol = el.textContent;

		if (stateTable[state].hasOwnProperty('digit')) {
			if (states.length === 1 && lastExpressionChar() === '0') {
				expressionChars = [value];
				displayChars = [symbol];
			} else {
				expressionChars.push(value);
				displayChars.push(symbol);
				states.push(stateTable[state]['digit']);
			}
		}
	});
});

operatorButtons.forEach(el => {
	el.addEventListener('click', event => {
		let state = lastState();
		let value = el.dataset.value;
		let symbol = el.textContent;

		if (stateTable[state].hasOwnProperty('operator')) {
			expressionChars.push(value);
			displayChars.push(symbol);
			states.push(stateTable[state]['operator']);
		}
	});
});

pointButton.addEventListener('click', event => {
	let el = event.target;
	let state = lastState();
	let value = el.dataset.value;
	let symbol = el.textContent;

	if (stateTable[state].hasOwnProperty('point')) {
		expressionChars.push(value);
		displayChars.push(symbol);
		states.push(stateTable[state]['point']);
	}
});

clearButton.addEventListener('click', event => {
	if (states.length > 1) {
		states.pop();
		expressionChars.pop();
		displayChars.pop();
	} else if (states.length === 1) {
		reset();
	}
});

allClearButton.addEventListener('click', reset);

equalityButton.addEventListener('click', event => {
	try {
		let result = eval(expressionChars.join('')).toFixed(6);

		if (result % 1 === 0) {
			result = Math.round(result);
		}

		result = result.toString();
		states = ['A'];
		expressionChars = [result];
		displayChars = [result];
	} catch {
		alert('Invalid expression!');
	}
});

htmlButtons.forEach(el => el.addEventListener('click', render));
