# CSS Variables (Custom Properties)

Custom properties (sometimes referred to as CSS variables or cascading variables) are entities defined by CSS authors that contain specific values to be reused throughout a document.

## Syntax

They are set using custom property notation (e.g., `--main-color: black;`) and are accessed using the `var()` function (e.g., `color: var(--main-color);`).

```css
:root {
  --main-bg-color: brown;
}

.box {
  background-color: var(--main-bg-color);
  color: white;
}
```

CSS variables are subject to the cascade and inherit their value from their parent.
