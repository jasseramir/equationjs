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

            return 'x = ' + posRoot + '\n' + 'x = ' + negRoot;
        } else if (discriminant === 0) {
            const root = (-this.b + Math.sqrt(discriminant)) / (2 * this.a);

            return 'x = ' + root;
        } else {
            return 'Complex Solutions';
        }
    }
}
