class ComplexNumber {
    constructor(real, imaginary) {
        this.real = real;
        this.imaginary = imaginary;
    }

    toString() {
        if (this.imaginary === 0) {
            return `${this.real}`;
        }

        if (this.real === 0) {
            return `${this.imaginary}i`;
        }

        if (this.imaginary > 0) {
            return `${this.real} + ${this.imaginary}i`;
        }

        return `${this.real} - ${Math.abs(this.imaginary)}i`;
    }
}

class LinearEquation {
    constructor(equationStr) {
        this.a = 0;
        this.b = 0;
        this.equation = equationStr;
        this.variable = '';
        this.ref = [];

        this.detectVar();
        this.parse();
        this.simplify();
    }

    detectVar() {
        for (const char of this.equation) {
            if (/[a-zA-Z]/.test(char)) {
                this.variable = char;
                return;
            }
        }
    }

    parseTerm(term, isRightSide) {
        if (!term) return;

        if (term.startsWith('+')) {
            term = term.slice(1);
        }

        if (term.startsWith(this.variable)) {
            term = '1' + term;
        } else if (term.startsWith('-' + this.variable)) {
            term = '-1' + term.replace('-', '');
        }

        if (term.includes(this.variable)) {
            const value = Number(term.slice(0, term.indexOf(this.variable)));

            this.ref.push({
                type: 'variable',
                coefficient: isRightSide ? -value : value,
            });
        } else {
            const value = Number(term);

            this.ref.push({
                type: 'number',
                value: isRightSide ? -value : value,
            });
        }
    }

    parseSide(side, isRightSide) {
        let currentTerm = '';

        for (const char of side) {
            if (char === '-' || char === '+') {
                this.parseTerm(currentTerm, isRightSide);
                currentTerm = char;
            } else {
                currentTerm += char;
            }
        }

        if (currentTerm !== '') {
            this.parseTerm(currentTerm, isRightSide);
        }
    }

    parse() {
        const [leftSide, rightSide] = this.equation.replace(/\s+/g, '').split('=');
        this.ref = [];

        this.parseSide(leftSide, false);
        this.parseSide(rightSide, true);
    }

    simplify() {
        this.a = 0;
        this.b = 0;

        for (const term of this.ref) {
            if (term?.type === 'variable') {
                this.a += term?.coefficient;
            } else {
                this.b += term?.value;
            }
        }

        this.b = -this.b;
    }

    solve() {
        if (this.a === 0 && this.b === 0) {
            return 'Infinite Solutions';
        }

        if (this.a === 0) {
            return 'No Solution';
        }

        return `${this.variable} = ${this.b / this.a}`;
    }
}

class QuadraticEquation {
    constructor(equationStr) {
        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.equation = equationStr;
        this.variable = '';
        this.ref = [];

        this.detectVar();
        this.parse();
        this.simplify();
    }

    detectVar() {
        for (const char of this.equation) {
            if (/[a-zA-Z]/.test(char)) {
                this.variable = char;
                return;
            }
        }
    }

    parseTerm(term, isRightSide) {
        if (!term) return;

        if (term.startsWith('+')) {
            term = term.slice(1);
        }

        if (term.startsWith(this.variable)) {
            term = '1' + term;
        } else if (term.startsWith('-' + this.variable)) {
            term = '-1' + term.replace('-', '');
        }

        const coefficient = (isRightSide ? -1 : 1) * Number(term.slice(0, term.indexOf(this.variable)));

        if (term.includes('^')) {
            this.ref.push({
                degree: Number(term.slice(term.indexOf('^') + 1)),
                coefficient,
            });
        } else if (term.includes(this.variable)) {
            this.ref.push({
                degree: 1,
                coefficient,
            });
        } else {
            this.ref.push({
                degree: 0,
                value: isRightSide ? -Number(term) : Number(term),
            });
        }
    }

    parseSide(side, isRightSide) {
        let currentTerm = '';

        for (const char of side) {
            if (char === '-' || char === '+') {
                this.parseTerm(currentTerm, isRightSide);
                currentTerm = char;
            } else {
                currentTerm += char;
            }
        }

        if (currentTerm !== '') {
            this.parseTerm(currentTerm, isRightSide);
        }
    }

    parse() {
        const [leftSide, rightSide] = this.equation.replace(/\s+/g, '').split('=');
        this.ref = [];

        this.parseSide(leftSide, false);
        this.parseSide(rightSide, true);
    }

    simplify() {
        this.a = 0;
        this.b = 0;
        this.c = 0;

        for (const term of this.ref) {
            if (term?.degree === 2) {
                this.a += term?.coefficient;
            } else if (term?.degree === 1) {
                this.b += term?.coefficient;
            } else if (term?.degree === 0) {
                this.c += term?.value;
            } else {
                throw new Error('Unsupported Equation');
            }
        }
    }

    solve() {
        if (this.a === 0 && this.b === 0 && this.c === 0) {
            return 'Infinite Solutions';
        }

        if (this.a === 0 && this.b === 0) {
            return 'No Solution';
        }

        if (this.a === 0) {
            return 'Not A Quadratic Equation';
        }

        const discriminant = this.b ** 2 - 4 * this.a * this.c;

        if (discriminant > 0) {
            const posRoot = (-this.b + Math.sqrt(discriminant)) / (2 * this.a);
            const negRoot = (-this.b - Math.sqrt(discriminant)) / (2 * this.a);

            return `x1 = ${posRoot}\nx2 = ${negRoot}`;
        } else if (discriminant === 0) {
            const root = (-this.b + Math.sqrt(discriminant)) / (2 * this.a);

            return `x = ${root}`;
        } else {
            const real = -this.b / (2 * this.a);
            const imaginary = Math.sqrt(-discriminant) / (2 * this.a);

            const z1 = new ComplexNumber(real, imaginary);
            const z2 = new ComplexNumber(real, -imaginary);

            return `x1 = ${z1}\nx2 = ${z2}`;
        }
    }
}

class SystemOfEquations {
    constructor(equations) {
        this.equations = equations;
        this.variables = new Set();
        this.ref = [];
        this.result = {};

        this.detectVar();
        this.parse();
    }

    detectVar() {
        for (const equation of this.equations) {
            for (const char of equation) {
                if (/[a-zA-Z]/.test(char)) {
                    this.variables.add(char);
                }
            }
        }
    }

    parseTerm(term, isRightSide, equationIndex) {
        if (!term) return;

        let termVar = null;

        for (const variable of this.variables) {
            if (term[term.length - 1] === variable) {
                termVar = variable;
            }
        }

        if (term.startsWith('+')) {
            term = term.slice(1);
        }

        if (term.startsWith(termVar)) {
            term = '1' + term;
        } else if (term.startsWith('-' + termVar)) {
            term = '-1' + term.replace('-', '');
        }

        if (termVar !== null) {
            const coefficient = (isRightSide ? -1 : 1) * Number(term.slice(0, term.indexOf(termVar)));
            this.ref[equationIndex][termVar] += coefficient;
        } else {
            this.ref[equationIndex].constant += isRightSide ? -Number(term) : Number(term);
        }
    }

    parseSide(side, isRightSide, equationIndex) {
        let currentTerm = '';

        for (const char of side) {
            if (char === '-' || char === '+') {
                this.parseTerm(currentTerm, isRightSide, equationIndex);
                currentTerm = char;
            } else {
                currentTerm += char;
            }
        }

        if (currentTerm !== '') {
            this.parseTerm(currentTerm, isRightSide, equationIndex);
        }
    }

    parse() {
        this.ref = [];

        for (let i = 0; i < this.equations.length; i++) {
            const [leftSide, rightSide] = this.equations[i].replace(/\s+/g, '').split('=');

            this.ref.push({});

            for (const variable of this.variables) {
                this.ref[i][variable] = 0;
            }

            this.ref[i].constant = 0;

            this.parseSide(leftSide, false, i);
            this.parseSide(rightSide, true, i);
        }
    }

    toMatrix() {
        const matrix = [];

        for (const equation of this.ref) {
            const row = [];

            for (const variable of this.variables) {
                row.push(equation[variable]);
            }

            row.push(-equation.constant);
            matrix.push(row);
        }

        return matrix;
    }

    solve() {
        const vars = [...this.variables];

        const matrix = this.toMatrix();
        const n = matrix.length;

        let returnContainer = '';

        for (let pivot = 0; pivot < n - 1; pivot++) {
            for (let i = pivot + 1; i < n; i++) {
                const factor = matrix[i][pivot] / matrix[pivot][pivot];

                for (let j = pivot; j < matrix[i].length; j++) {
                    matrix[i][j] = matrix[i][j] - factor * matrix[pivot][j];
                }
            }
        }

        for (let i = n - 1; i >= 0; i--) {
            let temp = matrix[i][matrix[i].length - 1];

            for (let j = i + 1; j < matrix[i].length - 1; j++) {
                const currentVar = vars[j];
                if (this.result[currentVar] !== null) {
                    temp -= this.result[currentVar] * matrix[i][j];
                }
            }

            const result = temp / matrix[i][i];
            this.result[vars[i]] = result;
        }

        for (const row of matrix) {
            const constant = row[row.length - 1];
            const coefficients = row.slice(0, row.length - 1);

            const allZero = coefficients.every(coefficient => coefficient === 0);

            if (allZero && constant === 0) {
                return 'Infinite Solutions';
            }

            if (allZero) {
                return 'No Solution';
            }
        }

        const resultsArray = Object.entries(this.result);

        returnContainer = resultsArray.map(([variable, value]) => `${variable} = ${value}`).join('\n');

        return returnContainer;
    }
}
