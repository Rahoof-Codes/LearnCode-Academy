# Transitions and Animations

CSS animations make it possible to animate transitions from one CSS style configuration to another.

## Transitions

Transitions provide a way to control animation speed when changing CSS properties.

```css
.button {
  background-color: blue;
  transition: background-color 0.3s ease;
}

.button:hover {
  background-color: red;
}
```

## Keyframe Animations

For more complex animations, `@keyframes` rules let you control the intermediate steps in a CSS animation sequence.

```css
@keyframes slidein {
  from {
    transform: translateX(0%);
  }

  to {
    transform: translateX(100%);
  }
}

.element {
  animation: slidein 3s ease-in 1s infinite reverse both running;
}
```
