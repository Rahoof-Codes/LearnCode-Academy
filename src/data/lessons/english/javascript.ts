import { HandcraftedLesson } from "../types";

export const javascriptData: Record<string, HandcraftedLesson> = {
  "js-var-data": {
    title: "Variables (let, const) & Data Types",
    content: [
      "In JavaScript, variables are used to store data values. Before ES6, 'var' was the only way to declare variables, but modern JavaScript uses 'let' and 'const'.",
      "Use 'let' when you know the value of a variable will change over time (like a counter in a loop). Use 'const' for variables that should never be reassigned after their initial creation.",
      "JavaScript has several primitive data types: Strings for text, Numbers for numeric values (both integers and decimals), Booleans for true/false logic, null for intentional absence of value, and undefined for variables that have been declared but not assigned."
    ],
    quiz: [
      {
        question: "Which keyword declares a variable that cannot be reassigned?",
        options: ["var","let","const","static"],
        correctOption: 2,
        explanation: "const stands for constant and cannot be reassigned."
      },
      {
        question: "What data type is used for true or false values?",
        options: ["String","Boolean","Number","Null"],
        correctOption: 1,
        explanation: "Booleans represent truth values: true or false."
      },
      {
        question: "What is the value of an unassigned variable in JavaScript?",
        options: ["0","null","undefined","NaN"],
        correctOption: 2,
        explanation: "Variables declared but not assigned are undefined by default."
      },
      {
        question: "Which is not a primitive data type in JS?",
        options: ["String","Object","Number","Boolean"],
        correctOption: 1,
        explanation: "Object is a reference type, not a primitive."
      },
      {
        question: "When should you use 'let'?",
        options: ["For constants","For global constants only","For variables that will be reassigned","Never"],
        correctOption: 2,
        explanation: "let is block-scoped and allows reassignment."
      },
    ],
    task: {
      description: "Declare a const named 'score' and set it to 100.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-operators-logic": {
    title: "Operators & Conditional Logic",
    content: [
      "Operators allow you to manipulate data. Arithmetic operators (+, -, *, /) perform math, while comparison operators (==, ===, !=, !==, >, <) compare values. Always use '===' (strict equality) instead of '==' to avoid unexpected type coercion.",
      "Logical operators (&& for AND, || for OR, ! for NOT) are used to combine multiple conditions together.",
      "Conditional logic allows your program to make decisions. The 'if', 'else if', and 'else' statements execute different blocks of code based on whether a specific condition evaluates to true or false."
    ],
    quiz: [
      {
        question: "Which operator checks both value and data type?",
        options: ["=","==","===","!="],
        correctOption: 2,
        explanation: "=== is the strict equality operator."
      },
      {
        question: "What does the '&&' operator mean?",
        options: ["OR","NOT","AND","XOR"],
        correctOption: 2,
        explanation: "&& returns true only if both operands are true."
      },
      {
        question: "Which statement executes if the 'if' condition is false?",
        options: ["then","catch","else","finally"],
        correctOption: 2,
        explanation: "The else block executes when the if condition fails."
      },
      {
        question: "What is the result of 5 > 3?",
        options: ["true","false","undefined","null"],
        correctOption: 0,
        explanation: "5 is greater than 3, so it evaluates to true."
      },
      {
        question: "Which operator is used for assignment?",
        options: ["==","===","=","=>"],
        correctOption: 2,
        explanation: "A single equals sign (=) assigns a value."
      },
    ],
    task: {
      description: "Write a function comparing two numbers and returning true if they are strictly equal.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-loops-scope": {
    title: "Loops & Scope",
    content: [
      "Loops are used to run a block of code multiple times. A 'for' loop is great when you know exactly how many times you want to iterate. It has an initializer, a condition, and an incrementer.",
      "The 'while' loop runs as long as a condition is true, and the modern 'for...of' loop is the easiest way to iterate over arrays and strings.",
      "Scope determines where your variables are accessible. Variables declared with 'var' have function scope, while 'let' and 'const' have block scope (meaning they only exist within the closest {} brackets). Global scope means the variable is accessible everywhere."
    ],
    quiz: [
      {
        question: "Which loop runs as long as a condition is true?",
        options: ["for","while","do...for","foreach"],
        correctOption: 1,
        explanation: "A while loop continues until the condition becomes false."
      },
      {
        question: "What defines block scope in JavaScript?",
        options: ["( )","< >","[ ]","{ }"],
        correctOption: 3,
        explanation: "Curly braces {} define a block in JavaScript."
      },
      {
        question: "Which loop is best for iterating over an array's values?",
        options: ["for...in","for...of","while","do...while"],
        correctOption: 1,
        explanation: "for...of loops directly over the iterable values."
      },
      {
        question: "Variables declared with 'let' are:",
        options: ["Global scoped","Function scoped","Block scoped","Unscoped"],
        correctOption: 2,
        explanation: "let is restricted to the block {} it was defined in."
      },
      {
        question: "If a variable is declared outside all functions, it is in:",
        options: ["Local scope","Global scope","Block scope","Module scope"],
        correctOption: 1,
        explanation: "Outside variables are global."
      },
    ],
    task: {
      description: "Write a for loop that prints numbers from 1 to 5.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-func-declarations": {
    title: "Function Declarations & Arrow Functions",
    content: [
      "Functions are reusable blocks of code. A Function Declaration starts with the 'function' keyword and is hoisted, meaning you can call it before it's defined in the code.",
      "Function Expressions assign a function to a variable. They are not hoisted.",
      "Arrow Functions (introduced in ES6) provide a much shorter, cleaner syntax using '=>'. They also behave differently with the 'this' keyword, making them incredibly popular in modern frameworks like React."
    ],
    quiz: [
      {
        question: "Which function type is hoisted?",
        options: ["Arrow function","Function expression","Function declaration","Anonymous function"],
        correctOption: 2,
        explanation: "Declarations are hoisted to the top of their scope."
      },
      {
        question: "What symbol defines an Arrow Function?",
        options: ["->","=>","~>",">>"],
        correctOption: 1,
        explanation: "=> is the fat arrow syntax."
      },
      {
        question: "Can arrow functions have a name?",
        options: ["Yes, natively","No, they are always anonymous","Only in strict mode","Only in classes"],
        correctOption: 1,
        explanation: "Arrow functions are inherently anonymous, though they can be assigned to a variable."
      },
      {
        question: "What keyword defines a standard function?",
        options: ["func","method","function","def"],
        correctOption: 2,
        explanation: "The 'function' keyword is used."
      },
      {
        question: "Why use arrow functions?",
        options: ["They are faster","Shorter syntax and lexical 'this'","They replace loops","To use less memory"],
        correctOption: 1,
        explanation: "They are concise and don't rebind 'this'."
      },
    ],
    task: {
      description: "Create an arrow function that returns true.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-params-returns": {
    title: "Parameters and Return Values",
    content: [
      "Parameters act as placeholders for the data you pass into a function. When you call the function and provide actual values, those values are called arguments.",
      "You can define default parameters in modern JavaScript. For example, 'function greet(name = \"Guest\")' will use \"Guest\" if no name is provided.",
      "The 'return' statement stops the function's execution and outputs a value. If a function doesn't have a return statement, it implicitly returns 'undefined'."
    ],
    quiz: [
      {
        question: "What do we call the actual values passed to a function?",
        options: ["Parameters","Arguments","Variables","Returns"],
        correctOption: 1,
        explanation: "Arguments are the actual values passed in."
      },
      {
        question: "What does a function return if there is no return statement?",
        options: ["0","null","undefined","false"],
        correctOption: 2,
        explanation: "It implicitly returns undefined."
      },
      {
        question: "What statement ends a function execution?",
        options: ["break","stop","end","return"],
        correctOption: 3,
        explanation: "return outputs a value and exits the function."
      },
      {
        question: "Can a function have multiple parameters?",
        options: ["No, only one","Yes, separated by commas","Yes, separated by spaces","Only in objects"],
        correctOption: 1,
        explanation: "Multiple parameters are comma-separated."
      },
      {
        question: "What is a default parameter?",
        options: ["A parameter that cannot change","A fallback value if none is provided","A parameter typed as integer","The first parameter"],
        correctOption: 1,
        explanation: "It provides a default value if undefined is passed."
      },
    ],
    task: {
      description: "Write a function that takes 'num' as a parameter and returns its double.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-objects": {
    title: "Objects (Properties & Methods)",
    content: [
      "Objects are collections of key-value pairs. They allow you to group related data and functions together. The keys are called properties, and if a property is a function, it is called a method.",
      "You can access object properties using dot notation (object.property) or bracket notation (object['property']). Dot notation is more common, but bracket notation is required if the key is dynamic or contains spaces.",
      "JavaScript provides built-in methods like Object.keys(), Object.values(), and Object.entries() to iterate over object properties easily."
    ],
    quiz: [
      {
        question: "What is a function inside an object called?",
        options: ["Property","Method","Variable","Key"],
        correctOption: 1,
        explanation: "Functions attached to objects are called methods."
      },
      {
        question: "Which notation is used to access dynamic keys?",
        options: ["Dot notation","Arrow notation","Bracket notation","Parenthesis"],
        correctOption: 2,
        explanation: "Bracket notation allows variables to be used as keys."
      },
      {
        question: "What does Object.keys() return?",
        options: ["An array of keys","An array of values","The object size","A string"],
        correctOption: 0,
        explanation: "It returns an array of the object's property names."
      },
      {
        question: "How do you add a new property to an object?",
        options: ["obj.add('key')","obj.key = value","obj.insert(key, value)","obj.push(key)"],
        correctOption: 1,
        explanation: "You can simply assign a value to a new key."
      },
      {
        question: "Are objects passed by value or reference?",
        options: ["Value","Reference","Both","Neither"],
        correctOption: 1,
        explanation: "Objects are reference types in JavaScript."
      },
    ],
    task: {
      description: "Create an object with a 'name' and 'age' property.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-arrays-methods": {
    title: "Arrays & Core Methods",
    content: [
      "Arrays are special objects used to store multiple values in a single variable. They are zero-indexed, meaning the first element is at index 0.",
      "Modern JavaScript relies heavily on functional array methods like map, filter, and reduce. Unlike traditional for-loops, these methods do not mutate the original array but instead return a new one.",
      "'map' transforms every element, 'filter' removes elements that don't match a condition, and 'reduce' accumulates array values into a single result."
    ],
    quiz: [
      {
        question: "What is the index of the first array element?",
        options: ["1","0","-1","A"],
        correctOption: 1,
        explanation: "Arrays are zero-indexed."
      },
      {
        question: "Which method creates a new array with transformed elements?",
        options: ["map()","filter()","reduce()","forEach()"],
        correctOption: 0,
        explanation: "map() transforms each element and returns a new array."
      },
      {
        question: "Which method removes elements based on a condition?",
        options: ["map()","filter()","reduce()","pop()"],
        correctOption: 1,
        explanation: "filter() keeps elements that pass a test condition."
      },
      {
        question: "Which method adds an element to the end of an array?",
        options: ["shift()","unshift()","push()","pop()"],
        correctOption: 2,
        explanation: "push() appends an element."
      },
      {
        question: "Does forEach() return a new array?",
        options: ["Yes","No, it returns undefined","No, it returns the original array","Only in strict mode"],
        correctOption: 1,
        explanation: "forEach executes a function but returns undefined."
      },
    ],
    task: {
      description: "Use map on [1, 2, 3] to return [2, 4, 6].",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-dom-selection-manipulation": {
    title: "DOM Selection & Manipulation",
    content: [
      "The Document Object Model (DOM) is an interface that represents HTML as a tree structure of objects. JavaScript can access and manipulate this tree to dynamically change the page.",
      "You select elements using methods like document.querySelector() or document.getElementById(). querySelector is the most powerful as it allows CSS-style selection.",
      "Once selected, you can manipulate elements by changing their textContent, innerHTML, styles, or by using classList to add/remove CSS classes."
    ],
    quiz: [
      {
        question: "What does DOM stand for?",
        options: ["Document Object Model","Data Object Module","Dynamic Object Model","Document Oriented Model"],
        correctOption: 0,
        explanation: "DOM is Document Object Model."
      },
      {
        question: "Which method selects an element using CSS selectors?",
        options: ["getElementById","querySelector","getElement","select"],
        correctOption: 1,
        explanation: "querySelector uses standard CSS selectors."
      },
      {
        question: "How do you safely change the text inside an element?",
        options: ["element.text","element.innerHTML","element.textContent","element.value"],
        correctOption: 2,
        explanation: "textContent safely sets text without parsing HTML."
      },
      {
        question: "How do you add a CSS class to an element?",
        options: ["element.className += 'cls'","element.classList.add('cls')","element.style.class = 'cls'","element.css('cls')"],
        correctOption: 1,
        explanation: "classList.add() is the safest and modern way."
      },
      {
        question: "Which selects all elements with a specific class?",
        options: ["querySelectorAll","querySelector","getElementsByName","selectAll"],
        correctOption: 0,
        explanation: "querySelectorAll returns a NodeList of all matching elements."
      },
    ],
    task: {
      description: "Select an element with id 'title' and change its text.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-event-listeners": {
    title: "Event Listeners & Event Bubbling",
    content: [
      "Events are actions that happen in the browser, such as a user clicking a button or typing in an input. You can use addEventListener() to listen for these events.",
      "When an event occurs, it doesn't just trigger on the target element; it 'bubbles up' through its ancestors in the DOM tree. This is called Event Bubbling.",
      "You can stop event bubbling by calling event.stopPropagation() inside your event handler function."
    ],
    quiz: [
      {
        question: "Which method attaches an event handler?",
        options: ["attachEvent","addEventListener","onEvent","listen"],
        correctOption: 1,
        explanation: "addEventListener is the modern standard."
      },
      {
        question: "What is Event Bubbling?",
        options: ["Events propagating downwards","Events propagating upwards","Events repeating infinitely","Events firing twice"],
        correctOption: 1,
        explanation: "Bubbling means events propagate upwards through ancestors."
      },
      {
        question: "How do you stop event bubbling?",
        options: ["event.preventDefault()","event.stop()","event.stopPropagation()","return false"],
        correctOption: 2,
        explanation: "stopPropagation halts the bubbling phase."
      },
      {
        question: "Which of these is a valid event name?",
        options: ["onpress","click","hovering","pushed"],
        correctOption: 1,
        explanation: "'click' is a standard DOM event."
      },
      {
        question: "What does event.preventDefault() do?",
        options: ["Stops bubbling","Stops default browser behavior","Deletes the element","Refreshes the page"],
        correctOption: 1,
        explanation: "It prevents default browser actions, like form submission."
      },
    ],
    task: {
      description: "Add a click event listener to a button.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-ui-transitions": {
    title: "Triggering Smooth UI Transitions",
    content: [
      "Instead of animating directly via JavaScript intervals, the best practice is to use JavaScript to add or remove CSS classes that have transitions defined.",
      "Using element.classList.toggle('active') is a perfect way to trigger an animation, like opening a menu or expanding an accordion.",
      "CSS handles the performance-heavy lifting (often GPU accelerated), while JavaScript just handles the logic."
    ],
    quiz: [
      {
        question: "What is the best way to animate UI?",
        options: ["JS setInterval","JS requestAnimationFrame","Toggle CSS classes","jQuery animate"],
        correctOption: 2,
        explanation: "Toggling CSS classes lets the browser optimize the animation."
      },
      {
        question: "Which method safely adds a class?",
        options: ["className +=","classList.add()","style.class","setAttribute"],
        correctOption: 1,
        explanation: "classList.add is safe and won't overwrite other classes."
      },
      {
        question: "Which method adds a class if missing, or removes it if present?",
        options: ["toggle()","switch()","swap()","replace()"],
        correctOption: 0,
        explanation: "classList.toggle() flips the state."
      },
      {
        question: "Why use CSS for transitions over JS?",
        options: ["It's older","It's GPU accelerated","JS cannot animate","CSS is synchronous"],
        correctOption: 1,
        explanation: "CSS transitions are often hardware-accelerated."
      },
      {
        question: "What property defines animation speed in CSS?",
        options: ["speed","velocity","transition-duration","animation-time"],
        correctOption: 2,
        explanation: "transition-duration sets how long it takes."
      },
    ],
    task: {
      description: "Write JS to toggle an 'active' class on an element.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-templates-destructuring": {
    title: "Template Literals & Destructuring",
    content: [
      "Template literals use backticks (`) and allow you to embed expressions directly inside strings using ${expression}. This completely eliminates the need for messy string concatenation using '+'.",
      "Destructuring assignment allows you to unpack values from arrays, or properties from objects, into distinct variables.",
      "For example, 'const { name, age } = user;' extracts the name and age properties from the user object into separate variables in a single line."
    ],
    quiz: [
      {
        question: "Which character defines a Template Literal?",
        options: ["'","\"","`","~"],
        correctOption: 2,
        explanation: "Backticks (`) define template literals."
      },
      {
        question: "How do you embed a variable inside a template literal?",
        options: ["#{var}","${var}","&{var}","+ var +"],
        correctOption: 1,
        explanation: "${var} embeds the variable."
      },
      {
        question: "What does Destructuring do?",
        options: ["Destroys an object","Unpacks values into variables","Deletes array elements","Parses JSON"],
        correctOption: 1,
        explanation: "It extracts data from arrays or objects into variables."
      },
      {
        question: "How to destructure 'name' from an object 'user'?",
        options: ["const name = user{}","const {name} = user","const [name] = user","let name = user.get()"],
        correctOption: 1,
        explanation: "Curly braces {} are used for object destructuring."
      },
      {
        question: "Can you destructure an array?",
        options: ["Yes, using []","Yes, using {}","No","Only in TypeScript"],
        correctOption: 0,
        explanation: "Array destructuring uses square brackets []."
      },
    ],
    task: {
      description: "Use destructuring to extract 'id' from an object.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-spread-rest": {
    title: "Spread and Rest Operators",
    content: [
      "The Spread operator (...) allows an iterable (like an array or string) to be expanded in places where zero or more arguments or elements are expected. It is commonly used to copy arrays or merge objects.",
      "The Rest parameter syntax (...) looks exactly the same as spread but does the opposite: it collects multiple elements and condenses them into a single array.",
      "Spread 'unpacks' elements, while Rest 'packs' them into an array. They are essential tools for modern JavaScript, especially in functional programming and state management."
    ],
    quiz: [
      {
        question: "What is the syntax for the Spread operator?",
        options: ["---","...","***","###"],
        correctOption: 1,
        explanation: "Three dots (...) represent the spread operator."
      },
      {
        question: "What does Spread do to an array?",
        options: ["Deletes it","Unpacks its elements","Sorts it","Reverses it"],
        correctOption: 1,
        explanation: "Spread expands the array into individual elements."
      },
      {
        question: "What does Rest do?",
        options: ["Packs elements into an array","Stops function execution","Pauses the loop","Deletes the last element"],
        correctOption: 0,
        explanation: "Rest collects remaining arguments into an array."
      },
      {
        question: "Can Spread be used on Objects?",
        options: ["Yes","No","Only in strict mode","Only with classes"],
        correctOption: 0,
        explanation: "Yes, you can spread object properties into new objects."
      },
      {
        question: "Where must the Rest parameter be placed in a function?",
        options: ["First","Middle","Last","Anywhere"],
        correctOption: 2,
        explanation: "Rest must be the last parameter."
      },
    ],
    task: {
      description: "Merge two arrays using the spread operator.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-modules": {
    title: "ES6 Modules (Import/Export)",
    content: [
      "ES6 Modules allow you to break your JavaScript code into multiple files. This makes your codebase easier to maintain, test, and understand.",
      "You use the 'export' keyword to make variables, functions, or classes available to other files. There are two types of exports: named exports and default exports.",
      "You use the 'import' keyword to bring those exposed modules into another file. Using modules requires a build step in older environments or type='module' in the HTML script tag."
    ],
    quiz: [
      {
        question: "What keyword exposes code to other files?",
        options: ["give","send","export","import"],
        correctOption: 2,
        explanation: "export makes the code available."
      },
      {
        question: "What keyword brings code into a file?",
        options: ["require","import","include","fetch"],
        correctOption: 1,
        explanation: "import brings exported code in."
      },
      {
        question: "How many default exports can a file have?",
        options: ["Zero","One","Unlimited","Two"],
        correctOption: 1,
        explanation: "A file can have only one default export."
      },
      {
        question: "How do you import a named export?",
        options: ["import default","import { name }","import name","import *"],
        correctOption: 1,
        explanation: "Named exports require curly braces {}."
      },
      {
        question: "What HTML attribute is needed to load a module script?",
        options: ["type='module'","src='module'","module='true'","defer='module'"],
        correctOption: 0,
        explanation: "The script tag needs type='module'."
      },
    ],
    task: {
      description: "Export a function using 'export default'.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-promises-async": {
    title: "Promises & Async/Await",
    content: [
      "JavaScript is single-threaded, meaning it executes one command at a time. Promises help manage asynchronous operations (like fetching data) without freezing the browser.",
      "A Promise has three states: Pending, Fulfilled (resolved), or Rejected (error). You handle results using .then() and .catch().",
      "Async/Await (ES8) is syntactic sugar built on top of Promises. It allows you to write asynchronous code that looks and behaves like synchronous code, making it much easier to read."
    ],
    quiz: [
      {
        question: "What is the initial state of a Promise?",
        options: ["Fulfilled","Rejected","Pending","Finished"],
        correctOption: 2,
        explanation: "A promise starts in the Pending state."
      },
      {
        question: "Which method handles a resolved Promise?",
        options: [".catch()",".then()",".finally()",".done()"],
        correctOption: 1,
        explanation: ".then() runs when resolved."
      },
      {
        question: "Which method handles a rejected Promise?",
        options: [".catch()",".then()",".error()",".fail()"],
        correctOption: 0,
        explanation: ".catch() handles errors."
      },
      {
        question: "What keyword pauses an async function?",
        options: ["stop","pause","await","wait"],
        correctOption: 2,
        explanation: "await pauses execution until the promise settles."
      },
      {
        question: "Where can you use the 'await' keyword?",
        options: ["Anywhere","Inside loops","Inside async functions","Inside objects"],
        correctOption: 2,
        explanation: "await is only valid inside async functions."
      },
    ],
    task: {
      description: "Create an async function that uses await.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-fetch-json": {
    title: "Fetch API & JSON Data",
    content: [
      "The Fetch API provides a modern, global fetch() method to make network requests (like calling a backend API). It returns a Promise that resolves to the Response.",
      "JSON (JavaScript Object Notation) is the standard format for sending data across the web. It looks like a JavaScript object but is strictly a string.",
      "To use JSON data from fetch, you must call response.json(), which itself returns another Promise that resolves with the parsed data."
    ],
    quiz: [
      {
        question: "What does fetch() return?",
        options: ["Data","A Promise","A String","JSON"],
        correctOption: 1,
        explanation: "fetch() returns a Promise."
      },
      {
        question: "What format is the standard for web data?",
        options: ["XML","CSV","JSON","HTML"],
        correctOption: 2,
        explanation: "JSON is the standard format."
      },
      {
        question: "How do you parse a fetch response as JSON?",
        options: ["JSON.parse(res)","res.json()","res.toJSON()","parse(res)"],
        correctOption: 1,
        explanation: "res.json() parses the response body."
      },
      {
        question: "Is JSON a string or an object?",
        options: ["String","Object","Array","Boolean"],
        correctOption: 0,
        explanation: "JSON is fundamentally a text string format."
      },
      {
        question: "What method converts a JS object to a JSON string?",
        options: ["JSON.stringify()","JSON.parse()","toString()","String()"],
        correctOption: 0,
        explanation: "JSON.stringify() converts objects to JSON strings."
      },
    ],
    task: {
      description: "Write a fetch request to get data from a URL.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-error-handling": {
    title: "Error Handling (try/catch)",
    content: [
      "Errors happen. If an error is not caught, your JavaScript program will crash entirely. Try/Catch blocks prevent this.",
      "You place risky code inside the 'try' block. If an error occurs, execution immediately jumps to the 'catch' block where you can handle the error gracefully.",
      "You can also use the 'finally' block, which executes regardless of whether an error occurred or not. It's useful for cleanup tasks like hiding a loading spinner."
    ],
    quiz: [
      {
        question: "Which block contains the risky code?",
        options: ["catch","try","finally","error"],
        correctOption: 1,
        explanation: "The try block holds code that might fail."
      },
      {
        question: "Which block executes if an error occurs?",
        options: ["catch","try","finally","error"],
        correctOption: 0,
        explanation: "The catch block handles the error."
      },
      {
        question: "Which block always executes?",
        options: ["catch","try","finally","error"],
        correctOption: 2,
        explanation: "The finally block executes no matter what."
      },
      {
        question: "How do you manually create an error?",
        options: ["make Error","throw new Error()","return Error","catch Error"],
        correctOption: 1,
        explanation: "The 'throw' keyword generates a new Error."
      },
      {
        question: "Why use try/catch?",
        options: ["To speed up code","To prevent app crashes","To loop data","To style UI"],
        correctOption: 1,
        explanation: "It prevents unhandled errors from crashing the app."
      },
    ],
    task: {
      description: "Create a try/catch block that logs an error.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-localstorage": {
    title: "LocalStorage & SessionStorage",
    content: [
      "The Web Storage API allows browsers to store key-value pairs locally. It is much more intuitive than using cookies.",
      "localStorage stores data with no expiration date. The data persists even when the browser is closed and reopened.",
      "sessionStorage stores data for one session. The data is deleted when the browser tab is closed. Both APIs use .setItem(), .getItem(), and .removeItem()."
    ],
    quiz: [
      {
        question: "Which storage persists after closing the browser?",
        options: ["Cookies","sessionStorage","localStorage","React state"],
        correctOption: 2,
        explanation: "localStorage persists permanently until cleared."
      },
      {
        question: "Which storage clears when the tab is closed?",
        options: ["Cookies","sessionStorage","localStorage","Database"],
        correctOption: 1,
        explanation: "sessionStorage clears on tab close."
      },
      {
        question: "How do you save data to localStorage?",
        options: ["localStorage.add()","localStorage.setItem()","localStorage.save()","localStorage.push()"],
        correctOption: 1,
        explanation: "setItem(key, value) is used to save data."
      },
      {
        question: "How do you read data from localStorage?",
        options: ["localStorage.getItem()","localStorage.read()","localStorage.fetch()","localStorage.pull()"],
        correctOption: 0,
        explanation: "getItem(key) retrieves the data."
      },
      {
        question: "Web Storage can only store what data type?",
        options: ["Objects","Strings","Numbers","Arrays"],
        correctOption: 1,
        explanation: "It can only store strings. You must stringify objects."
      },
    ],
    task: {
      description: "Save a 'theme' string to localStorage.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-external-apis": {
    title: "Consuming External APIs",
    content: [
      "In modern web development, your frontend code frequently needs to communicate with external APIs to fetch real-time data, like weather, stocks, or user profiles.",
      "When using fetch() to call external APIs, you must often handle authentication via headers (like Authorization: Bearer token).",
      "It's also critical to handle network failures properly. The fetch API only rejects a promise on network failure, not on HTTP errors (like 404 or 500). You must check response.ok to verify the request was successful."
    ],
    quiz: [
      {
        question: "What is an external API?",
        options: ["A local database","A third-party web service","A JavaScript object","A React component"],
        correctOption: 1,
        explanation: "External APIs provide data from external services."
      },
      {
        question: "Does fetch() reject on a 404 Error?",
        options: ["Yes","No","Only on POST","Only in strict mode"],
        correctOption: 1,
        explanation: "Fetch only rejects on network failures, not HTTP errors."
      },
      {
        question: "Which property indicates a successful HTTP response?",
        options: ["response.status === 'OK'","response.good","response.ok","response.success"],
        correctOption: 2,
        explanation: "response.ok is true for statuses in the 200-299 range."
      },
      {
        question: "How do you send a token to an API?",
        options: ["In the URL only","Via HTTP Headers","Inside localStorage","In the response"],
        correctOption: 1,
        explanation: "Tokens are generally sent in the Authorization header."
      },
      {
        question: "What format do most modern APIs return?",
        options: ["XML","JSON","HTML","YAML"],
        correctOption: 1,
        explanation: "JSON is the standard format for modern APIs."
      },
    ],
    task: {
      description: "Write a function that checks if 'response.ok' is true.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-state-strategies": {
    title: "State Management Strategies",
    content: [
      "State represents the data that your application needs to remember at any given point in time, such as whether a user is logged in or what items are in their cart.",
      "In Vanilla JavaScript, state is often stored in global variables or attached to DOM elements. This can become messy as the app grows.",
      "Modern strategies involve keeping state separate from the UI (like using a single state object), and updating the UI automatically when the state changes. This concept powers libraries like React and Redux."
    ],
    quiz: [
      {
        question: "What is 'state' in an application?",
        options: ["A CSS framework","The server's location","Data the app remembers over time","The HTML structure"],
        correctOption: 2,
        explanation: "State holds the current data/status of the app."
      },
      {
        question: "Why is attaching state to the DOM bad for large apps?",
        options: ["It looks ugly","It's hard to sync and scale","Browsers block it","It requires jQuery"],
        correctOption: 1,
        explanation: "It creates tightly coupled, difficult to maintain code."
      },
      {
        question: "What is a single source of truth?",
        options: ["A central place for all state","A database table","The HTML file","A single variable declaration"],
        correctOption: 0,
        explanation: "It means all UI derives from one central state object."
      },
      {
        question: "Which library is famous for State Management?",
        options: ["Bootstrap","Redux","Lodash","Moment.js"],
        correctOption: 1,
        explanation: "Redux is a popular state management library."
      },
      {
        question: "How should the UI react to state changes?",
        options: ["Manually updated by user","Automatically re-rendered","By reloading the page","By deleting elements"],
        correctOption: 1,
        explanation: "Modern apps re-render UI automatically when state changes."
      },
    ],
    task: {
      description: "Create a state object with 'isLoggedIn: true'.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-clean-debug": {
    title: "Clean Code & Debugging Techniques",
    content: [
      "Writing clean code means writing code that is easy for humans to read and maintain. This involves using descriptive variable names, keeping functions small, and adding helpful comments.",
      "Debugging is the process of finding and fixing errors. While console.log() is popular, modern browsers have powerful DevTools. You can use 'debugger;' in your code to pause execution.",
      "Always format your code properly and use linting tools (like ESLint) to catch potential errors before you even run the code."
    ],
    quiz: [
      {
        question: "What does writing 'clean code' mean?",
        options: ["Using no comments","Writing code humans can easily read","Writing shortest possible code","Writing in Assembly"],
        correctOption: 1,
        explanation: "Clean code prioritizes human readability and maintainability."
      },
      {
        question: "Which keyword pauses JS execution in DevTools?",
        options: ["pause;","halt;","debugger;","break;"],
        correctOption: 2,
        explanation: "The 'debugger' statement triggers a breakpoint."
      },
      {
        question: "What is ESLint?",
        options: ["A browser","A linting tool to catch errors","A state manager","A database"],
        correctOption: 1,
        explanation: "ESLint analyzes code to find and fix problems."
      },
      {
        question: "Is console.log the only debugging tool?",
        options: ["Yes","No, DevTools has breakpoints","No, HTML has debuggers","Yes, in Chrome"],
        correctOption: 1,
        explanation: "Browser DevTools offer advanced debugging features."
      },
      {
        question: "How should functions be sized ideally?",
        options: ["As long as possible","Exactly 10 lines","Small and focused on one task","In a single line"],
        correctOption: 2,
        explanation: "Functions should do one thing and do it well."
      },
    ],
    task: {
      description: "Add a debugger statement inside a function.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-docs-reviews": {
    title: "Reading Docs & Code Reviews",
    content: [
      "A large part of a developer's job is not just writing code, but reading documentation. MDN Web Docs is the gold standard for JavaScript.",
      "Code reviews are when team members read your code before it is merged into the main project. They help catch bugs, ensure coding standards, and share knowledge.",
      "When reviewing others' code, be constructive and polite. When receiving reviews, don't take critiques personally—they are meant to improve the code."
    ],
    quiz: [
      {
        question: "What is MDN?",
        options: ["Mozilla Developer Network","Modern Data Node","Master Document Node","Microsoft Developer Network"],
        correctOption: 0,
        explanation: "MDN Web Docs is the standard reference for web tech."
      },
      {
        question: "What is the primary purpose of a code review?",
        options: ["To delay the project","To catch bugs and share knowledge","To rewrite everything","To judge the developer"],
        correctOption: 1,
        explanation: "Reviews improve code quality and team knowledge."
      },
      {
        question: "How should you handle code review feedback?",
        options: ["Ignore it","Argue every point","Accept constructive criticism","Quit"],
        correctOption: 2,
        explanation: "Feedback is for the code, not the person."
      },
      {
        question: "Where should you go first to learn an API?",
        options: ["StackOverflow","Official Documentation","Twitter","A random blog"],
        correctOption: 1,
        explanation: "Docs are the most reliable and up-to-date source."
      },
      {
        question: "What does 'LGTM' stand for in code reviews?",
        options: ["Looks Good To Me","Let's Get To Merging","Leaving, Going To Meeting","Looks Great, Thanks Much"],
        correctOption: 0,
        explanation: "LGTM is standard review shorthand."
      },
    ],
    task: {
      description: "Add a helpful comment to explain what a function does.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-team-credit": {
    title: "Teamwork & Giving Credit",
    content: [
      "Software development is a team sport. Whether you're working with other developers, designers, or product managers, communication is key.",
      "Always give credit where it's due. If you use code from StackOverflow or an open-source library, mention it in your comments or readmes.",
      "Open-source software thrives on collaboration and attribution. Being a good team player will advance your career faster than just being a good coder."
    ],
    quiz: [
      {
        question: "What is crucial for software teamwork?",
        options: ["Isolation","Communication","Speed","Secrecy"],
        correctOption: 1,
        explanation: "Communication ensures everyone is aligned."
      },
      {
        question: "What should you do if you use someone else's code?",
        options: ["Claim it as your own","Give proper credit/attribution","Hide it","Change variable names to disguise it"],
        correctOption: 1,
        explanation: "Always attribute code to its original author."
      },
      {
        question: "What powers open-source software?",
        options: ["Money","Collaboration and attribution","Corporations","Governments"],
        correctOption: 1,
        explanation: "Open source relies on community collaboration."
      },
      {
        question: "Why is being a good team player important?",
        options: ["It's not","It builds trust and career growth","It lets you work less","It hides your bugs"],
        correctOption: 1,
        explanation: "Soft skills are vital for career advancement."
      },
      {
        question: "Where can you document attributions?",
        options: ["In code comments or README files","You don't need to","In a secret file","Only in the database"],
        correctOption: 0,
        explanation: "Comments and READMEs are standard places for credit."
      },
    ],
    task: {
      description: "Write a comment giving credit to StackOverflow for a snippet.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-variables": {
    title: "Variables Overview",
    content: [
      "Variables are named storage locations in memory. They hold data that your application can modify and read.",
      "In JavaScript, variables are dynamically typed, meaning the same variable can hold a string, then later hold a number.",
      "Naming your variables clearly (e.g., 'userAge' instead of 'x') is a fundamental best practice."
    ],
    quiz: [
      {
        question: "What is a variable?",
        options: ["A function","A named storage location","An HTML tag","A CSS style"],
        correctOption: 1,
        explanation: "Variables store data in memory."
      },
      {
        question: "Does JS require strict typing for variables?",
        options: ["Yes","No","Only in ES5","Only for arrays"],
        correctOption: 1,
        explanation: "JavaScript is dynamically typed."
      },
      {
        question: "Which is a good variable name?",
        options: ["x","data","usr1","userAge"],
        correctOption: 3,
        explanation: "Descriptive names improve code readability."
      },
      {
        question: "Can 'let' variables be updated?",
        options: ["Yes","No","Only once","Only in objects"],
        correctOption: 0,
        explanation: "let allows reassignment."
      },
      {
        question: "What case is standard for JS variables?",
        options: ["snake_case","PascalCase","camelCase","kebab-case"],
        correctOption: 2,
        explanation: "camelCase is the JS standard."
      },
    ],
    task: {
      description: "Declare a variable named 'userName' and assign it a string.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-promises": {
    title: "Understanding Promises",
    content: [
      "A Promise represents the eventual completion (or failure) of an asynchronous operation.",
      "Promises solve the problem of 'Callback Hell' by chaining asynchronous tasks clearly.",
      "You can combine multiple promises using Promise.all() to run them in parallel and wait until all of them are finished."
    ],
    quiz: [
      {
        question: "What problem do Promises solve?",
        options: ["CSS styling","Callback Hell","HTML parsing","Variable scoping"],
        correctOption: 1,
        explanation: "Promises flatten deeply nested callbacks."
      },
      {
        question: "Which method runs multiple promises in parallel?",
        options: ["Promise.any()","Promise.race()","Promise.all()","Promise.group()"],
        correctOption: 2,
        explanation: "Promise.all waits for all promises to resolve."
      },
      {
        question: "What does a promise return immediately?",
        options: ["The data","An error","A pending Promise object","undefined"],
        correctOption: 2,
        explanation: "It returns a Promise object representing the future state."
      },
      {
        question: "Can a fulfilled promise change state?",
        options: ["Yes","No","Only if rejected","Only by force"],
        correctOption: 1,
        explanation: "Once settled, a promise's state cannot change."
      },
      {
        question: "Which method catches promise errors?",
        options: [".catch()",".error()",".fail()",".finally()"],
        correctOption: 0,
        explanation: ".catch() is used for error handling."
      },
    ],
    task: {
      description: "Return a resolved Promise.",
      starterCode: "function initChallenge() {\n  // Return 42\n  return 42;\n}",
      language: "javascript",
      expectedOutput: "42",
      expectedOutputDisplay: "1. Return value is 42.\n2. Valid JavaScript syntax.",
      validate: (code) => {
        let isPassed = false;
        let logs = ["Evaluating user code..."];
        try {
          const userFn = new Function(code + "\nreturn initChallenge;")();
          const res = userFn();
          isPassed = res === 42;
          logs.push("Assert: returns 42 -> " + (isPassed ? "PASSED" : "FAILED"));
        } catch(e: any) {
          logs.push("Error: " + e.message);
        }
        return { isPassed, logs };
      }
    }
  },
};
