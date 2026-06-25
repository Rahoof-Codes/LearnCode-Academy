# Responsive Design & Media Queries

Media queries allow you to apply CSS styles depending on a device's general type (such as print vs. screen) or specific characteristics and parameters (such as screen resolution or browser viewport width).

## Basic Syntax

```css
@media media-type and (media-feature-rule) {
  /* CSS rules go here */
}
```

Example of a media query for mobile devices:

```css
.container {
  width: 100%;
}

@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}
```
