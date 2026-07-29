# equationjs

A small JavaScript library that parses and solves algebraic equations written as plain strings — no formulas, no manual coefficient extraction. It supports **linear equations**, **quadratic equations** (including complex roots), and **systems of linear equations** with any number of variables.

This was built as a personal project to practice problem solving and algorithm design — parsing raw math expressions into structured data, then solving them numerically (including Gaussian elimination for systems and the quadratic formula with complex number support).

> **Note:** This is a demo/portfolio project, not a published package. It's meant to showcase the parsing and solving logic rather than serve as a production-ready library.

## Features

- **Linear equations** — parses and solves `ax + b = cx + d` style equations for any single variable
- **Quadratic equations** — solves `ax^2 + bx + c = 0`, handling real, repeated, and complex roots
- **Systems of linear equations** — solves any number of equations with multiple variables using Gaussian elimination
- **Automatic variable detection** — no need to specify which letter is the variable
- **Complex number support** — quadratics with negative discriminants return proper `a + bi` results
- Tested against 200 generated test cases (see `test.txt`) covering all three solvers

## How It Works

Each solver takes the equation as a string, tokenizes it into terms, classifies each term (constant vs. variable, and degree for quadratics), then reduces everything to standard coefficient form before solving:

- `LinearEquation` reduces to `ax = b` and solves directly
- `QuadraticEquation` reduces to `ax^2 + bx + c = 0` and applies the quadratic formula, falling back to a `ComplexNumber` class when the discriminant is negative
- `SystemOfEquations` builds an augmented matrix from all equations and solves it with Gaussian elimination and back-substitution

## Usage

The library is a single script (`index.js`) exposing three classes. Since it isn't published as an npm package, drop `index.js` into your project and use the classes directly (or add your own `module.exports` if you want to `require` it in Node).

### Linear Equation

```js
const eq = new LinearEquation('2x + 3 = 11');
console.log(eq.solve()); // "x = 4"
```

### Quadratic Equation

```js
const eq = new QuadraticEquation('x^2 - 5x + 6 = 0');
console.log(eq.solve());
// "x1 = 3
// x2 = 2"
```

Equations with a negative discriminant return complex roots:

```js
const eq = new QuadraticEquation('x^2 + 2x + 5 = 0');
console.log(eq.solve());
// "x1 = -1 + 2i
// x2 = -1 - 2i"
```

### System of Equations

```js
const system = new SystemOfEquations(['x + y = 10', 'x - y = 2']);
console.log(system.solve());
// { x: 6, y: 4 }
```

## Testing

`test.txt` contains the output of a 200-case test run across all three solvers (80 linear, 80 quadratic, 40 systems), comparing expected vs. actual results. All 200 cases pass.

## Built With

- Vanilla JavaScript — no dependencies

## Author

**Jasser Amir**
GitHub: [@jasseramir](https://github.com/jasseramir)

## License

MIT License — see [LICENSE](LICENSE) for details.