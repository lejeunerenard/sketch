<img src="./screenshot.png" style="border: 1px solid black; width: 100%" alt="screenshot">

# Barnsley Fern

[Barnsley fern](https://en.wikipedia.org/wiki/Barnsley_fern) is an [Iterated Function System](https://en.wikipedia.org/wiki/Iterated_function_system) (AKA IFS) Fractal created using only affine matrix multiplication on a single point `[0, 0]`.

The process is as follows:

1. Select a single matrix from a set of rules at random.
2. Multiply the current point position (`[x,y,1]`) by that matrix.
3. Draw the point without clearing the previous frame.
4. Repeat

## Usage

[Go here](http://lejeunerenard.github.io/sketch/experiments/barnsley-fern/) and enjoy.

## Install

```bash
npm i
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Credits

- [Keith Peters's Coding Math Tutorial on this IFS fractals](https://www.youtube.com/watch?v=geqq63WFLr0)
