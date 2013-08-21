;(function (scope) {
	/*
	 * Функция поиска разницы числа и суммы его факториалов
	 * @name calculateDiff
	 * @param {Number} n Число > 0, для которого ищется разница
	 * @returns {Number}
	 */
	var calculateDiff = (function () {
		/**
		 * Массив факториалов цифр от 0 до 9
		 * Хранится в замыкании
		 * @constant {Number}[]
		 */
		var DIGIT_FACTORIALS = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];

		return function calculateDiff(n) {
			for (i = n; i; i = Math.floor(i / 10)) {
				n = n - DIGIT_FACTORIALS[i % 10];
			}

			return n;
		};
	})();

	/**
	 * Функция поиска факторионов
	 * Факторион — такое натуральное число, которое равно сумме факториалов своих цифр.
	 * @name findFactorions
	 * @param {Number}	[endValue = 2540160] Конечное значение диапазона, в котором происходит поиск
	 * @param {Number}	[number = 1] Число, начиная с которого необходимо начать поиск
	 * @returns {Number}[]
	 * @global
	 */
	function findFactorions(endValue, number) {

		var output = [],
			/**
			 * Массив разниц факториалов цифр, увеличенный на разницу цифр
			 * Например 3! - 4! + (4 - 3) = -17, a нулевой элемент массива 
			 * расчитывается исходя из 9! - 1! - 0! + (10 - 9)
			 * 
			 * Таким образом при помощи этого массива можно найти 
			 * разницу числа и суммы факториалов одного значения, зная эту разницу у предыдущего
			 * @constant {Number}[]
			 */
			DIGIT_FACTORIALS_DIFFS = [362879, 1, 0, -3, -17, -95, -599, -4319, -35279, -322559],
			cached,	lastDigit, numberTemp;

		/** Проверка параметров */
		if ((endValue && typeof endValue !== 'number') || (number && typeof number !== 'number')) {
			throw new TypeError('Wrong argument');
		}
		if (endValue - number < 0) return output;

		/** Установка значений по умолчанию */
		// Если верить википедии, факторионы меньше 2540160
		endValue = endValue || 2540160;
		// Бессмысленно искать факторионы среди отрицательных чисел
		number = number > 0 ? number : 1;
		// Кэшируем разницу числа, предшествующего стартовому
		cached = number === 1 ? -1 : calculateDiff(number - 1);

		/** Запуск цикла перебора чисел */
		for (; number <= endValue; number = number + 1) {
			/**
			 * Запуск цикла анализа изменения цифр числа (по сравнению с предшествующим) 
			 * и прибавления разницы, согласно массиву констант
			 * 
			 * Для 116 цикл отработает один раз, т.к. по сравнению со 115 изменилась одна цифра (5)
			 * Для 120 цикл отработает два раза, т.к. по сравнению со 119 изменились 2 цифры (1 и 9)
			 * Для 110 цикл отработает один раз, хоть и изменились 2 цифры (0 и 9), но 0! === 1!
			 */
			for (numberTemp = number;;) {
				lastDigit = numberTemp % 10;
				cached = cached + DIGIT_FACTORIALS_DIFFS[lastDigit];

				if (lastDigit !== 0 || (numberTemp /= 10) === 1) break;
			}

			// Если разница нулевая, то текущее число - факторион
			if (cached === 0) output.push(number);
		}

		return output;
	}

	scope.findFactorions = findFactorions;

})(this);