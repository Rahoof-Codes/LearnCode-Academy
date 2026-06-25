import { HandcraftedLesson } from "../types";

export const cssData: Record<string, HandcraftedLesson> = {

  "css-selectors": {
    title: "CSS Selectors and Specificity",
    content: [
      "Cascading Style Sheets (CSS) style the visual appearance of HTML elements. To apply style rules, CSS uses selectors to match HTML components based on tag names, classes, IDs, or relationships.",
      "Element selectors target all tags of a type. Class selectors target elements with a specific class attribute, prefixed by a dot. ID selectors target a single element by its ID attribute, prefixed by a hash.",
      "Specificity is the algorithm browsers use to determine which style rule takes priority when multiple rules conflict. ID selectors have higher specificity than class selectors, which in turn have higher specificity than element selectors.",
      "By structuring selectors cleanly and understanding specificity rules, you can create cascading style systems that are scalable, maintainable, and free of style overrides."
    ],
    quiz: [
      {
        question: "What character is used to select elements by class name in CSS?",
        options: ["#", ".", "*", "@"],
        correctOption: 1,
        explanation: "Class selectors are prefixed with a dot (.)."
      },
      {
        question: "Which CSS selector has the highest specificity?",
        options: ["Element selector (h1)", "ID selector (#header)", "Class selector (.title)", "Universal selector (*)"],
        correctOption: 1,
        explanation: "ID selectors have the highest specificity ranking among standard stylesheet selectors."
      },
      {
        question: "How do you select all <p> tags inside a <div> element in CSS?",
        options: ["div, p", "div > p", "div p", "div.p"],
        correctOption: 2,
        explanation: "div p selects all <p> descendants inside any <div>."
      },
      {
        question: "How do you target an element with ID 'submit' in CSS?",
        options: [".submit", "id(submit)", "#submit", "*submit"],
        correctOption: 2,
        explanation: "ID selectors are prefixed with a hash (#) symbol."
      },
      {
        question: "What is the specificity score of a single class selector relative to an element selector?",
        options: ["Class selector is higher", "Element selector is higher", "They are equal", "It is random"],
        correctOption: 0,
        explanation: "Class selectors have higher weight than element selectors."
      }
    ],
    task: {
      description: "Style your h1 header to have a color of '#3b82f6'. Style any element with class '.card' to have a padding of '16px' and background color of '#1e293b'.",
      starterCode: `/* Style elements below */\n`,
      language: "css",
      expectedOutput: "h1 {\n  color: #3b82f6;\n}\n.card {\n  padding: 16px;\n  background-color: #1e293b;\n}",
      expectedOutputDisplay: "1. Selector styling h1 with text color #3b82f6\n2. Selector styling class .card with:\n   - padding of 16px\n   - background-color of #1e293b",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const cleanCode = clean(code);
        const hasH1 = /h1\{[^}]*color:\s*(#3b82f6|rgb\(59,130,246\))/i.test(cleanCode);
        const hasCard = /\.card\{[^}]*/i.test(cleanCode) && /padding:\s*16px/i.test(cleanCode) && /background(-color)?:\s*(#1e293b|rgb\(30,41,59\))/i.test(cleanCode);
        const logs = [
          "Checking CSS parser...",
          `Assert: h1 color selector matches #3b82f6 -> ${hasH1 ? "PASSED" : "FAILED"}`,
          `Assert: .card selector styling matches padding and background -> ${hasCard ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasH1 && hasCard, logs };
      }
    }
  },

  "css-box-model": {
    title: "CSS Box Model: Margin, Padding & Borders",
    content: [
      "The CSS Box Model is the foundation of design and layout on the web. Every element in HTML is represented as a rectangular box, consisting of four layers: Content, Padding, Border, and Margin.",
      "The Content layer contains the actual text or image. The Padding is the space directly surrounding the content inside the border. The Border wraps the padding and content. The Margin is the outermost space separating the element from its neighbors.",
      "By default, when you set width and height on an element, CSS only sets it on the Content box. Adding padding and border makes the element larger than its set width.",
      "To change this behavior, use `box-sizing: border-box;`. This forces the width and height to include the padding and border, making sizing highly predictable."
    ],
    quiz: [
      {
        question: "What are the four components of the CSS Box Model?",
        options: ["Content, Text, Border, Margin", "Content, Padding, Border, Margin", "Content, Margin, Outline, Gap", "Margin, Padding, Outline, Frame"],
        correctOption: 1,
        explanation: "Content, Padding, Border, and Margin form the CSS Box Model."
      },
      {
        question: "Which property includes border and padding inside an element's declared width and height?",
        options: ["box-sizing: content-box;", "box-sizing: border-box;", "layout-sizing: include;", "box-width: collapse;"],
        correctOption: 1,
        explanation: "box-sizing: border-box calculates width and height inclusive of border and padding."
      },
      {
        question: "What is the space between the element's content and its border called?",
        options: ["Margin", "Padding", "Outline", "Spacing"],
        correctOption: 1,
        explanation: "Padding is the inner space around the content."
      },
      {
        question: "What is the outermost layer of the CSS Box Model that separates elements?",
        options: ["Border", "Padding", "Margin", "Background"],
        correctOption: 2,
        explanation: "Margin is the outer space around the border."
      },
      {
        question: "If an element has width 100px, padding 20px, and margin 10px in content-box, what is its total visible rendered width?",
        options: ["100px", "120px", "140px", "160px"],
        correctOption: 2,
        explanation: "Visible width = width (100) + left padding (20) + right padding (20) = 140px."
      }
    ],
    task: {
      description: "Create a CSS layout for class '.box' that sets 'box-sizing' to 'border-box', a width of '300px', padding of '20px', and a solid border of '2px' with color '#6366f1'.",
      starterCode: `.box {\n  /* Add box properties */\n}`,
      language: "css",
      expectedOutput: ".box {\n  box-sizing: border-box;\n  width: 300px;\n  padding: 20px;\n  border: 2px solid #6366f1;\n}",
      expectedOutputDisplay: "1. box-sizing set to border-box in class .box.\n2. Width set to 300px.\n3. Padding set to 20px.\n4. Border set to 2px solid #6366f1.",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const cleanCode = clean(code);
        const hasBoxSizing = /\.box\{[^}]*box-sizing:\s*border-box/i.test(cleanCode);
        const hasWidth = /\.box\{[^}]*width:\s*300px/i.test(cleanCode);
        const hasPadding = /\.box\{[^}]*padding:\s*20px/i.test(cleanCode);
        const hasBorder = /\.box\{[^}]*border:\s*2px\s+solid\s+(#6366f1|rgb\(99,102,241\))/i.test(cleanCode);
        const logs = [
          "Evaluating CSS Box Model rules...",
          `Assert: box-sizing: border-box; in .box -> ${hasBoxSizing ? "PASSED" : "FAILED"}`,
          `Assert: width: 300px; in .box -> ${hasWidth ? "PASSED" : "FAILED"}`,
          `Assert: padding: 20px; in .box -> ${hasPadding ? "PASSED" : "FAILED"}`,
          `Assert: border: 2px solid #6366f1; in .box -> ${hasBorder ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasBoxSizing && hasWidth && hasPadding && hasBorder, logs };
      }
    }
  },

  "flexbox-layout": {
    title: "Flexbox Layout Mechanics",
    content: [
      "Flexbox (Flexible Box Layout) is a one-dimensional layout model in CSS, designed to lay out items in rows or columns easily. It handles item sizing, centering, and alignment without floating elements.",
      "A flexbox layout consists of a flex container (declared via display: flex; or display: inline-flex;) and flex items inside it. You can define the direction of items along the main axis using the flex-direction property (e.g., row or column).",
      "Centering elements has historically been tricky in CSS, but Flexbox resolves it with two core properties: justify-content aligns items along the main axis (usually horizontal), and align-items aligns them along the cross axis (usually vertical).",
      "With support for wrapping, distribution, and variable sizing, Flexbox is the primary tool for building modern, responsive, fluid navigation bars, card lists, and grids."
    ],
    quiz: [
      {
        question: "Which property initiates a flex container context?",
        options: ["flex: 1;", "layout: flex;", "display: flex;", "box-type: flexbox;"],
        correctOption: 2,
        explanation: "display: flex; establishes a new flex container."
      },
      {
        question: "Which property aligns flex items along the cross axis?",
        options: ["justify-content", "align-items", "flex-direction", "align-content"],
        correctOption: 1,
        explanation: "align-items defines the default behavior for how flex items are laid out along the cross axis."
      },
      {
        question: "What is the default direction of elements inside a flex container?",
        options: ["row", "column", "grid", "horizontal"],
        correctOption: 0,
        explanation: "The default value of flex-direction is row."
      },
      {
        question: "Which flex-direction value displays items vertically from top to bottom?",
        options: ["row", "row-reverse", "column", "column-reverse"],
        correctOption: 2,
        explanation: "column aligns flex items vertically from top to bottom."
      },
      {
        question: "Which property controls whether flex items should shrink when container space is tight?",
        options: ["flex-grow", "flex-shrink", "flex-wrap", "flex-basis"],
        correctOption: 1,
        explanation: "flex-shrink determines how much a flex item will shrink relative to other items."
      }
    ],
    task: {
      description: "Create a CSS layout for a container class '.navbar' that uses Flexbox, distributes items with space between them ('justify-content: space-between'), and vertically centers them ('align-items: center').",
      starterCode: `.navbar {\n  display: flex;\n  /* Add remaining properties */\n}`,
      language: "css",
      expectedOutput: ".navbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}",
      expectedOutputDisplay: "1. Flexbox layout declared in class .navbar.\n2. Spaced out distribution along the main horizontal axis.\n3. Centered alignment along vertical axis.",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const cleanCode = clean(code);
        const hasFlex = /\.navbar\{[^}]*display:\s*flex/i.test(cleanCode);
        const hasJustify = /\.navbar\{[^}]*justify-content:\s*space-between/i.test(cleanCode);
        const hasAlign = /\.navbar\{[^}]*align-items:\s*center/i.test(cleanCode);
        const logs = [
          "Evaluating CSS Flexbox rules...",
          `Assert: display: flex; in .navbar -> ${hasFlex ? "PASSED" : "FAILED"}`,
          `Assert: justify-content: space-between; in .navbar -> ${hasJustify ? "PASSED" : "FAILED"}`,
          `Assert: align-items: center; in .navbar -> ${hasAlign ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasFlex && hasJustify && hasAlign, logs };
      }
    }
  },

  "css-grid": {
    title: "CSS Grid Layout Mechanics",
    content: [
      "CSS Grid Layout is a two-dimensional grid-based layout system, designed to handle both columns and rows. Unlike Flexbox, which is primarily one-dimensional, Grid excels at aligning content in structured grids.",
      "A grid layout is created by defining a container with `display: grid;`. You specify columns using `grid-template-columns` and rows using `grid-template-rows`.",
      "Column and row sizing can use traditional pixels, percentages, or the modern fractional unit `fr` (e.g., `1fr 2fr` distributes the remaining space in a 1:2 ratio).",
      "Adding gaps between grid rows and columns is handled easily using the `gap` property. This replaces the old approach of using margins for spacing inside grid cards."
    ],
    quiz: [
      {
        question: "What dimension layout system is CSS Grid?",
        options: ["One-dimensional", "Two-dimensional", "Three-dimensional", "Zero-dimensional"],
        correctOption: 1,
        explanation: "CSS Grid is a two-dimensional layout system that handles both columns and rows."
      },
      {
        question: "Which unit is used in CSS Grid to represent a fraction of the free space in the container?",
        options: ["fr", "px", "%", "em"],
        correctOption: 0,
        explanation: "The 'fr' unit represents a fraction of the remaining space in the grid."
      },
      {
        question: "Which property sets the size of columns in a CSS Grid container?",
        options: ["grid-columns", "grid-template-columns", "columns-width", "grid-layout-columns"],
        correctOption: 1,
        explanation: "grid-template-columns defines the column structure of the grid."
      },
      {
        question: "Which property sets the spacing between columns and rows in CSS Grid?",
        options: ["margin", "padding", "gap", "grid-spacing"],
        correctOption: 2,
        explanation: "The gap property specifies the space between columns and rows."
      },
      {
        question: "How do you create a grid with columns of 100px, remaining space, and remaining space in 1:2 ratio?",
        options: ["grid-template-columns: 100px 1fr 2fr;", "grid-template-columns: 100px 50% 50%;", "grid-template-columns: 100px auto auto;", "grid-template-columns: 100px 1 2;"],
        correctOption: 0,
        explanation: "'100px 1fr 2fr' allocates 100px first, then divides remaining space in 1:2 ratio."
      }
    ],
    task: {
      description: "Create a CSS layout for class '.grid-container' that uses CSS Grid, defines three equal-width columns ('1fr 1fr 1fr'), and sets a gap of '16px'.",
      starterCode: `.grid-container {\n  display: grid;\n  /* Add template and gap */\n}`,
      language: "css",
      expectedOutput: ".grid-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 16px;\n}",
      expectedOutputDisplay: "1. display set to grid in class .grid-container.\n2. Columns set to three equal-width fractions (1fr 1fr 1fr).\n3. Grid gap set to 16px.",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const cleanCode = clean(code);
        const hasGrid = /\.grid-container\{[^}]*display:\s*grid/i.test(cleanCode);
        const hasColumns = /\.grid-container\{[^}]*grid-template-columns:\s*1fr\s+1fr\s+1fr/i.test(cleanCode);
        const hasGap = /\.grid-container\{[^}]*gap:\s*16px/i.test(cleanCode);
        const logs = [
          "Evaluating CSS Grid rules...",
          `Assert: display: grid; in .grid-container -> ${hasGrid ? "PASSED" : "FAILED"}`,
          `Assert: grid-template-columns: 1fr 1fr 1fr; in .grid-container -> ${hasColumns ? "PASSED" : "FAILED"}`,
          `Assert: gap: 16px; in .grid-container -> ${hasGap ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasGrid && hasColumns && hasGap, logs };
      }
    }
  }
};
