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
        if (term.startsWith('+')) {
            term = term.slice(1);
        }
        
        if (term === this.variable) {
            term = '1' + this.variable;
        } else if (term === '-' + this.variable) {
            term = '-1' + this.variable;
        }
        
        if (!term) return;
        const lastChar = term[term.length - 1];
                
        if (lastChar === this.variable) {
            const value = Number(term.slice(0, -1));
                    
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
            console.log('Infinite Solutions');
            return;
        }
        
        if (this.a === 0) {
            console.log('No Solution');
            return;
        }
        
        console.log(`${this.variable} = ${this.b / this.a}`)
    }
}

const test = new LinearEquation("2x + 5 = 11");
test.solve();
