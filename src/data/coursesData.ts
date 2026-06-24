export interface Question {
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface Quiz {
  passingScore: number; // percentage
  questions: Question[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  xp: number;
  contentFile: string;
  quiz?: Quiz;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  trackId: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  popularity: number; // score from 1-100
  newest: boolean;
  image: string;
  objectives: string[];
  modules: Module[];
}

export interface Track {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

export const tracks: Track[] = [
  {
    id: "web-dev",
    title: "Web Development",
    description: "Master modern front-end and back-end development, from basic markup to full-stack applications.",
    icon: "Globe",
    color: "blue",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    id: "ai-ml",
    title: "AI & Machine Learning",
    description: "Dive into data science, machine learning models, neural networks, and computer vision with Python.",
    icon: "Cpu",
    color: "purple",
    gradient: "from-purple-500 to-pink-600",
  },
  {
    id: "systems",
    title: "Systems Programming",
    description: "Write ultra-fast, memory-safe, low-level systems software with C, C++, Rust, and Go.",
    icon: "Terminal",
    color: "emerald",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    id: "mobile",
    title: "Mobile Development",
    description: "Build beautiful, native cross-platform iOS and Android apps using Flutter and React Native.",
    icon: "Smartphone",
    color: "amber",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    description: "Automate builds, deploy cloud infrastructure, manage container orchestration, and run CI/CD systems.",
    icon: "Server",
    color: "cyan",
    gradient: "from-cyan-500 to-blue-600",
  },
];

// Helper to generate a standardized quick quiz
const createQuickQuiz = (topic: string, questionText: string, options: string[], correct: number, explanation: string): Quiz => ({
  passingScore: 100,
  questions: [
    {
      question: questionText,
      options,
      correctOption: correct,
      explanation,
    }
  ]
});

export const defaultCourses: Course[] = [
  // ================= WEB DEVELOPMENT TRACK (9 Courses) =================
  {
    id: "html",
    title: "HTML5 Fundamentals",
    description: "Learn the foundational markup language of the web. Structure layouts, tables, forms, media, and modern HTML5 APIs.",
    trackId: "web-dev",
    difficulty: "Beginner",
    duration: "8 hours",
    popularity: 95,
    newest: false,
    image: "/images/courses/html.jpg",
    objectives: [
      "Understand standard HTML document structure and boilerplate",
      "Use semantic elements like <section>, <article>, and <aside>",
      "Create accessible links, images, list formats, and tables",
      "Build forms with input validation for user inputs",
      "Master HTML attributes, meta tags, and head elements",
      "Embed external content with iframes and multimedia elements",
      "Use HTML5 APIs like localStorage and Drag & Drop"
    ],
    modules: [
      {
        id: "html-intro",
        title: "Introduction to HTML",
        lessons: [
          {
            id: "html-basics",
            title: "HTML Syntax and Structure",
            duration: "20 mins",
            xp: 100,
            contentFile: "html-basics.md",
            quiz: createQuickQuiz(
              "HTML Basics",
              "Which element is correct for creating the largest heading?",
              ["<head>", "<h6>", "<heading>", "<h1>"],
              3,
              "<h1> defines the most important and largest heading in HTML hierarchy."
            ),
          },
          {
            id: "semantic-html",
            title: "Semantic Markup and Accessibility",
            duration: "25 mins",
            xp: 120,
            contentFile: "semantic-html.md",
            quiz: createQuickQuiz(
              "Semantic HTML",
              "Which of the following is a semantic element that represents independent, self-contained content?",
              ["<div>", "<article>", "<span>", "<section>"],
              1,
              "<article> is designed for independent, self-contained contents that could be syndicated independently."
            )
          },
          {
            id: "html-doc-structure",
            title: "HTML Document Structure",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-doc-structure.md",
            quiz: createQuickQuiz(
              "Document Structure",
              "What is the purpose of <!DOCTYPE html>?",
              ["It creates the root element", "It tells the browser to use standards mode", "It links CSS", "It defines language"],
              1,
              "<!DOCTYPE html> instructs the browser to render the page using modern HTML5 standards mode."
            )
          },
          {
            id: "html-attributes",
            title: "HTML Attributes & Global Attributes",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-attributes.md",
            quiz: createQuickQuiz(
              "HTML Attributes",
              "Which attribute provides a unique identifier for an HTML element?",
              ["class", "name", "id", "key"],
              2,
              "The id attribute gives an element a unique identifier that must not be repeated on the same page."
            )
          }
        ]
      },
      {
        id: "html-media-lists",
        title: "Links, Images and Lists",
        lessons: [
          {
            id: "html-links-images",
            title: "Hyperlinks and Images",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-links-images.md",
            quiz: createQuickQuiz(
              "Links & Images",
              "Which attribute specifies the destination URL of a hyperlink?",
              ["src", "link", "href", "url"],
              2,
              "href (Hypertext Reference) specifies the link destination."
            )
          },
          {
            id: "html-lists",
            title: "Lists (Ordered & Unordered)",
            duration: "15 mins",
            xp: 100,
            contentFile: "html-lists.md",
            quiz: createQuickQuiz(
              "HTML Lists",
              "Which tag creates a numbered (ordered) list?",
              ["<ul>", "<ol>", "<li>", "<list>"],
              1,
              "<ol> creates an Ordered List with numbered items."
            )
          },
          {
            id: "html-block-inline",
            title: "Block vs Inline Elements",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-block-inline.md",
            quiz: createQuickQuiz(
              "Block vs Inline",
              "Which of the following is a block-level element?",
              ["<span>", "<a>", "<div>", "<strong>"],
              2,
              "<div> is a block-level element that starts on a new line and takes full width."
            )
          },
          {
            id: "html-meta-head",
            title: "Meta Tags & Head Elements",
            duration: "25 mins",
            xp: 120,
            contentFile: "html-meta-head.md",
            quiz: createQuickQuiz(
              "Meta Tags",
              "Which meta tag is essential for responsive mobile design?",
              ["<meta name=\"description\">", "<meta name=\"viewport\">", "<meta charset=\"UTF-8\">", "<meta name=\"keywords\">"],
              1,
              "The viewport meta tag controls how the page scales and fits on mobile screens."
            )
          }
        ]
      },
      {
        id: "html-advanced-elements",
        title: "Tables and Forms",
        lessons: [
          {
            id: "html-tables",
            title: "HTML Tabular Data",
            duration: "25 mins",
            xp: 120,
            contentFile: "html-tables.md",
            quiz: createQuickQuiz(
              "HTML Tables",
              "Which tag defines a new row in an HTML table?",
              ["<td>", "<tr>", "<th>", "<table>"],
              1,
              "<tr> stands for Table Row and creates a new row in the table."
            )
          },
          {
            id: "html-form-elements",
            title: "Building Forms and Input Types",
            duration: "30 mins",
            xp: 150,
            contentFile: "html-forms.md",
            quiz: createQuickQuiz(
              "HTML Forms",
              "What attribute is used on an input element to make it required before submission?",
              ["required", "needed", "validate", "must-fill"],
              0,
              "The 'required' attribute specifies that an input field must be filled out before submitting the form."
            )
          },
          {
            id: "html-entities",
            title: "HTML Entities & Special Characters",
            duration: "15 mins",
            xp: 100,
            contentFile: "html-entities.md",
            quiz: createQuickQuiz(
              "HTML Entities",
              "Which HTML entity displays the less-than symbol (<)?",
              ["&less;", "&lt;", "&lte;", "&<;"],
              1,
              "&lt; (less than) is the named entity for the < character."
            )
          }
        ]
      },
      {
        id: "html-embedding-apis",
        title: "Multimedia & Embedding",
        lessons: [
          {
            id: "html-multimedia",
            title: "Multimedia Audio and Video",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-multimedia.md",
            quiz: createQuickQuiz(
              "Multimedia",
              "Which attribute must be added to <video> to display play/pause buttons?",
              ["buttons", "controls", "play", "media"],
              1,
              "The controls attribute is required to show standard browser playback controls."
            )
          },
          {
            id: "html-iframes",
            title: "Iframes & Embedding Content",
            duration: "20 mins",
            xp: 120,
            contentFile: "html-iframes.md",
            quiz: createQuickQuiz(
              "Iframes",
              "Which attribute specifies the URL of content to embed in an iframe?",
              ["href", "link", "src", "url"],
              2,
              "The src attribute specifies the URL of the document to display inside the iframe."
            )
          },
          {
            id: "html5-apis",
            title: "HTML5 APIs (Storage & Drag/Drop)",
            duration: "25 mins",
            xp: 130,
            contentFile: "html5-apis.md",
            quiz: createQuickQuiz(
              "HTML5 APIs",
              "What is the difference between localStorage and sessionStorage?",
              ["localStorage is faster", "sessionStorage persists after close", "localStorage persists after close, sessionStorage does not", "They are identical"],
              2,
              "localStorage data persists indefinitely until cleared, while sessionStorage is cleared when the tab is closed."
            )
          }
        ]
      }
    ]
  },
  {
    id: "css",
    title: "CSS3 Styling & Flexbox",
    description: "Style websites with layout engines, variables, selectors, grids, and responsive media queries.",
    trackId: "web-dev",
    difficulty: "Beginner",
    duration: "6 hours",
    popularity: 90,
    newest: false,
    image: "/images/courses/css.jpg",
    objectives: [
      "Master CSS selectors and the Box Model",
      "Build complex responsive layouts with Flexbox and CSS Grid",
      "Apply styles using Custom Properties (CSS variables)",
      "Create fluid media queries for mobile responsiveness"
    ],
    modules: [
      {
        id: "css-box-model",
        title: "Selectors & Box Model",
        lessons: [
          {
            id: "css-selectors",
            title: "CSS Selectors and Specificity",
            duration: "20 mins",
            xp: 100,
            contentFile: "css-selectors.md",
            quiz: createQuickQuiz(
              "CSS Selectors",
              "Which selector has the highest specificity?",
              ["Class selector (.btn)", "ID selector (#submit)", "Element selector (button)", "Inline styles"],
              3,
              "Inline styles written directly in HTML have the highest specificity (excluding !important)."
            )
          }
        ]
      },
      {
        id: "css-layouts",
        title: "Flexbox and CSS Grid",
        lessons: [
          {
            id: "flexbox-layout",
            title: "Flexbox Layout Mechanics",
            duration: "30 mins",
            xp: 150,
            contentFile: "flexbox-layout.md",
            quiz: createQuickQuiz(
              "Flexbox",
              "Which property aligns flex items along the main-axis?",
              ["align-items", "justify-content", "align-content", "flex-direction"],
              1,
              "justify-content defines the alignment along the main axis of the flex container."
            )
          }
        ]
      }
    ]
  },
  {
    id: "javascript",
    title: "Modern JavaScript (ES6+)",
    description: "Core programming topics: logic, loops, DOM manipulation, asynchronous flow, fetch requests, and closures.",
    trackId: "web-dev",
    difficulty: "Beginner",
    duration: "10 hours",
    popularity: 98,
    newest: false,
    image: "/images/courses/javascript.jpg",
    objectives: [
      "Understand variable scope, variables hoisting, and Closures",
      "Write modern ES6 syntax (arrow functions, template strings, destructuring)",
      "Understand Promises, Async/Await and asynchronous AJAX calls",
      "Manipulate the DOM hierarchy and register events safely"
    ],
    modules: [
      {
        id: "js-fundamentals",
        title: "ES6 fundamentals",
        lessons: [
          {
            id: "js-variables",
            title: "Scope: let, const, and var",
            duration: "25 mins",
            xp: 100,
            contentFile: "js-variables.md",
            quiz: createQuickQuiz(
              "JS Variables",
              "Which variable declarations are block-scoped?",
              ["var only", "let and const", "const only", "let, const, and var"],
              1,
              "let and const are block-scoped declarations, whereas var is function-scoped."
            )
          }
        ]
      },
      {
        id: "js-async",
        title: "Asynchronous Javascript",
        lessons: [
          {
            id: "js-promises",
            title: "Promises & Async/Await",
            duration: "40 mins",
            xp: 180,
            contentFile: "js-promises.md",
            quiz: createQuickQuiz(
              "Async JS",
              "What state does a Promise enter when it completes successfully?",
              ["Pending", "Rejected", "Fulfilled", "Resolved"],
              2,
              "A Promise is in the 'fulfilled' state when the asynchronous operation completes successfully."
            )
          }
        ]
      }
    ]
  },
  {
    id: "typescript",
    title: "TypeScript Essentials",
    description: "Write robust code using static types, interfaces, generics, type guards, and compile configurations.",
    trackId: "web-dev",
    difficulty: "Intermediate",
    duration: "5 hours",
    popularity: 88,
    newest: true,
    image: "/images/courses/typescript.jpg",
    objectives: ["Define static types", "Use interfaces and type aliases", "Implement generics", "Configure tsconfig.json"],
    modules: [
      {
        id: "ts-basics",
        title: "Typing System",
        lessons: [
          {
            id: "ts-types",
            title: "Interfaces vs Type Aliases",
            duration: "30 mins",
            xp: 120,
            contentFile: "ts-types.md",
            quiz: createQuickQuiz(
              "TypeScript",
              "Which of the following can be extended using the 'extends' keyword?",
              ["An Interface", "A Type Alias", "A Primitive", "A Union"],
              0,
              "Interfaces can extend other interfaces using the extends keyword; type aliases use intersection types (&) instead."
            )
          }
        ]
      }
    ]
  },
  {
    id: "react",
    title: "React Components & Hooks",
    description: "Build component-driven interfaces with state, effects, refs, context, and custom hooks.",
    trackId: "web-dev",
    difficulty: "Intermediate",
    duration: "12 hours",
    popularity: 96,
    newest: false,
    image: "/images/courses/react.jpg",
    objectives: ["Understand JSX and Virtal DOM", "Use useState, useEffect, and useRef hooks", "Prop drilling resolution with useContext", "Build stateful UI components"],
    modules: [
      {
        id: "react-core",
        title: "React Fundamentals",
        lessons: [
          {
            id: "react-hooks",
            title: "The useEffect Hook lifecycle",
            duration: "35 mins",
            xp: 150,
            contentFile: "react-hooks.md",
            quiz: createQuickQuiz(
              "React Hooks",
              "How do you run a useEffect hook exactly once when a component mounts?",
              ["Pass no dependency array", "Pass an empty array []", "Pass null", "Call useEffect() directly inside a conditional"],
              1,
              "An empty dependency array [] tells React to run the effect callback only once upon component mounting."
            )
          }
        ]
      }
    ]
  },
  {
    id: "nextjs",
    title: "Next.js App Router",
    description: "Develop production-ready apps using Next.js Server Components, page routing, server actions, and caching.",
    trackId: "web-dev",
    difficulty: "Advanced",
    duration: "8 hours",
    popularity: 94,
    newest: true,
    image: "/images/courses/nextjs.jpg",
    objectives: ["Configure App Router routes", "Understand React Server Components", "Use Server Actions for database writes", "Optimize pages for SEO"],
    modules: [
      {
        id: "next-routing",
        title: "App Routing & Data Fetching",
        lessons: [
          {
            id: "next-rsc",
            title: "Server Components vs Client Components",
            duration: "40 mins",
            xp: 200,
            contentFile: "next-rsc.md",
            quiz: createQuickQuiz(
              "Next.js RSC",
              "Which directive declares a file to be a Client Component in Next.js?",
              ['"use client"', '"client side"', '"use state"', '"use react"'],
              0,
              "Adding the 'use client' string at the top of a file tells Next.js to compile it as a React Client Component."
            )
          }
        ]
      }
    ]
  },
  {
    id: "nodejs",
    title: "Node.js Architecture",
    description: "Explore the V8 engine, event loop, child processes, buffers, streams, and built-in FS/HTTP modules.",
    trackId: "web-dev",
    difficulty: "Intermediate",
    duration: "8 hours",
    popularity: 85,
    newest: false,
    image: "/images/courses/nodejs.jpg",
    objectives: ["Understand the Event Loop", "Work with the File System", "Handle Streams", "Understand V8 memory heaps"],
    modules: [
      {
        id: "node-core",
        title: "Node.js Internals",
        lessons: [
          {
            id: "event-loop",
            title: "The Event Loop Phases",
            duration: "30 mins",
            xp: 150,
            contentFile: "event-loop.md",
            quiz: createQuickQuiz(
              "Event Loop",
              "Which microtask queue has higher execution priority: Promise callbacks or process.nextTick?",
              ["process.nextTick", "Promise callbacks", "They are identical", "It is random"],
              0,
              "Callbacks scheduled using process.nextTick execute immediately after the current operation, before other microtasks."
            )
          }
        ]
      }
    ]
  },
  {
    id: "expressjs",
    title: "REST APIs with Express.js",
    description: "Build robust REST APIs using router parameters, middlewares, error-handling pipelines, and validation.",
    trackId: "web-dev",
    difficulty: "Intermediate",
    duration: "6 hours",
    popularity: 84,
    newest: false,
    image: "/images/courses/expressjs.jpg",
    objectives: ["Write HTTP endpoints", "Create express middleware", "Implement error validation", "Set up CORS policies"],
    modules: [
      {
        id: "express-routing",
        title: "Express Basics",
        lessons: [
          {
            id: "express-middleware",
            title: "Custom Middleware functions",
            duration: "25 mins",
            xp: 130,
            contentFile: "express-middleware.md",
            quiz: createQuickQuiz(
              "Express Middleware",
              "What argument must you call in middleware to pass control to the next handler?",
              ["next()", "send()", "resolve()", "continue()"],
              0,
              "Invoking the next() parameter passes execution to the next middleware function in the stack."
            )
          }
        ]
      }
    ]
  },
  {
    id: "sql",
    title: "SQL & Relational Databases",
    description: "Write queries, handle joins, indices, design schemas, database normalization, and execute transactions.",
    trackId: "web-dev",
    difficulty: "Beginner",
    duration: "7 hours",
    popularity: 89,
    newest: false,
    image: "/images/courses/sql.jpg",
    objectives: ["Design relational schemas", "Write SELECT queries with INNER/LEFT joins", "Understand Database Indexes", "Implement ACID transactions"],
    modules: [
      {
        id: "sql-queries",
        title: "SQL Queries & Joins",
        lessons: [
          {
            id: "sql-joins",
            title: "INNER, LEFT, and RIGHT Joins",
            duration: "35 mins",
            xp: 140,
            contentFile: "sql-joins.md",
            quiz: createQuickQuiz(
              "SQL Joins",
              "Which JOIN returns all rows from the left table even if there are no matches in the right table?",
              ["INNER JOIN", "CROSS JOIN", "LEFT JOIN", "RIGHT JOIN"],
              2,
              "LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table, and matching records from the right."
            )
          }
        ]
      }
    ]
  },

  // ================= AI & MACHINE LEARNING TRACK (8 Courses) =================
  {
    id: "python",
    title: "Python for Data Science",
    description: "Learn Python foundations. Work with lists, dicts, list comprehensions, classes, and file processing.",
    trackId: "ai-ml",
    difficulty: "Beginner",
    duration: "8 hours",
    popularity: 97,
    newest: false,
    image: "/images/courses/python.jpg",
    objectives: ["Master Python syntax", "Use standard data structures", "Write functional code", "Process data files"],
    modules: [
      {
        id: "py-core",
        title: "Python Core concepts",
        lessons: [
          {
            id: "py-lists",
            title: "List Comprehensions & Lambdas",
            duration: "30 mins",
            xp: 120,
            contentFile: "py-lists.md",
            quiz: createQuickQuiz(
              "Python Lists",
              "Which is the correct list comprehension to filter even numbers from lists?",
              ["[x for x in nums if x % 2 == 0]", "[x if x % 2 == 0 for x in nums]", "[x for x in nums while x % 2 == 0]", "filter(even, nums)"],
              0,
              "[x for x in nums if x % 2 == 0] is the correct list comprehension structure in Python."
            )
          }
        ]
      }
    ]
  },
  {
    id: "numpy",
    title: "Numerical Python (NumPy)",
    description: "Work with N-dimensional arrays, matrix math operations, linear algebra, and vectorization methods.",
    trackId: "ai-ml",
    difficulty: "Beginner",
    duration: "4 hours",
    popularity: 80,
    newest: false,
    image: "/images/courses/numpy.jpg",
    objectives: ["Manipulate ND-arrays", "Use vectorized mathematical actions", "Execute matrix multiplications", "Index & slice arrays"],
    modules: [
      {
        id: "np-arrays",
        title: "Array Manipulation",
        lessons: [
          {
            id: "np-indexing",
            title: "Slicing and Vectorization",
            duration: "20 mins",
            xp: 110,
            contentFile: "np-indexing.md",
            quiz: createQuickQuiz(
              "NumPy",
              "What NumPy function returns the shape of an array?",
              ["arr.size()", "arr.dimension()", "arr.shape", "shapeOf(arr)"],
              2,
              "The 'shape' property returns a tuple containing the dimensions of the array."
            )
          }
        ]
      }
    ]
  },
  {
    id: "pandas",
    title: "Data Analysis with Pandas",
    description: "Master DataFrames, read CSV files, deal with missing values, group data, and compute aggregations.",
    trackId: "ai-ml",
    difficulty: "Intermediate",
    duration: "6 hours",
    popularity: 91,
    newest: false,
    image: "/images/courses/pandas.jpg",
    objectives: ["Read structured datasets", "Perform aggregations and groupings", "Clean missing data fields", "Merge/Join multiple DataFrames"],
    modules: [
      {
        id: "pandas-df",
        title: "DataFrames & Series",
        lessons: [
          {
            id: "pandas-filtering",
            title: "Data Filtering & GroupBy",
            duration: "30 mins",
            xp: 130,
            contentFile: "pandas-filtering.md",
            quiz: createQuickQuiz(
              "Pandas GroupBy",
              "Which method combines columns of DataFrames by indices?",
              ["pd.merge()", "df.groupby()", "df.agg()", "pd.concat()"],
              0,
              "pd.merge() is used to connect DataFrames based on keys or index matches."
            )
          }
        ]
      }
    ]
  },
  {
    id: "matplotlib",
    title: "Data Visualization: Matplotlib",
    description: "Create bar graphs, scatter plots, histograms, customize charts, and visualize statistical distributions.",
    trackId: "ai-ml",
    difficulty: "Beginner",
    duration: "4 hours",
    popularity: 75,
    newest: false,
    image: "/images/courses/matplotlib.jpg",
    objectives: ["Generate line and scatter plots", "Customize axis markers and legends", "Save figures to files", "Render subplots side by side"],
    modules: [
      {
        id: "plt-charts",
        title: "Plotting Basics",
        lessons: [
          {
            id: "plt-customization",
            title: "Styling and Custom Plots",
            duration: "25 mins",
            xp: 100,
            contentFile: "plt-customization.md",
            quiz: createQuickQuiz(
              "Matplotlib",
              "Which function adds a legend to a Matplotlib plot?",
              ["plt.legend()", "plt.axis()", "plt.showLegend()", "plt.label()"],
              0,
              "plt.legend() displays the labels of plotted datasets."
            )
          }
        ]
      }
    ]
  },
  {
    id: "scikit-learn",
    title: "Intro to Scikit-Learn",
    description: "Train models: regression, classification, clustering, validation splits, and feature engineering.",
    trackId: "ai-ml",
    difficulty: "Intermediate",
    duration: "8 hours",
    popularity: 88,
    newest: false,
    image: "/images/courses/scikit-learn.jpg",
    objectives: ["Split datasets for cross-validation", "Fit linear regressions and classifiers", "Calculate metrics like precision & recall", "Preprocess numerical categories"],
    modules: [
      {
        id: "sk-models",
        title: "Supervised Learning Models",
        lessons: [
          {
            id: "sk-classification",
            title: "Supervised Classification algorithms",
            duration: "35 mins",
            xp: 160,
            contentFile: "sk-classification.md",
            quiz: createQuickQuiz(
              "Scikit-Learn",
              "What method trains a Scikit-Learn model on training data?",
              ["model.train()", "model.fit()", "model.learn()", "model.execute()"],
              1,
              "All estimator models in Scikit-Learn utilize the '.fit()' method to train coefficients on datasets."
            )
          }
        ]
      }
    ]
  },
  {
    id: "tensorflow",
    title: "Deep Learning with TensorFlow",
    description: "Build artificial neural networks (ANNs, CNNs), set up custom loss functions, and train models.",
    trackId: "ai-ml",
    difficulty: "Advanced",
    duration: "12 hours",
    popularity: 85,
    newest: false,
    image: "/images/courses/tensorflow.jpg",
    objectives: ["Build Keras sequential models", "Write Convolutional Neural Networks", "Understand backpropagation and optimizers", "Prevent model overfitting"],
    modules: [
      {
        id: "tf-neural",
        title: "Neural Networks Setup",
        lessons: [
          {
            id: "tf-keras",
            title: "Building Sequential Models",
            duration: "40 mins",
            xp: 190,
            contentFile: "tf-keras.md",
            quiz: createQuickQuiz(
              "TensorFlow Keras",
              "Which activation function is most commonly used for binary output classification?",
              ["ReLU", "Softmax", "Sigmoid", "Tanh"],
              2,
              "Sigmoid squashes output values to a range between 0 and 1, making it ideal for binary probabilities."
            )
          }
        ]
      }
    ]
  },
  {
    id: "pytorch",
    title: "PyTorch Deep Learning",
    description: "Write custom neural architectures. Master tensors, dynamic computation graphs, autograd, and CUDA execution.",
    trackId: "ai-ml",
    difficulty: "Advanced",
    duration: "12 hours",
    popularity: 87,
    newest: true,
    image: "/images/courses/pytorch.jpg",
    objectives: ["Work with PyTorch Tensors", "Understand Autograd engines", "Train custom PyTorch training loops", "Load models to GPU (CUDA)"],
    modules: [
      {
        id: "pt-tensors",
        title: "Tensors & Autograd",
        lessons: [
          {
            id: "pt-training-loop",
            title: "Writing a PyTorch Training loop",
            duration: "45 mins",
            xp: 200,
            contentFile: "pt-training-loop.md",
            quiz: createQuickQuiz(
              "PyTorch Loop",
              "What command resets optimizer gradients to zero before backpropagation?",
              ["optimizer.zero_grad()", "optimizer.reset()", "loss.backward()", "torch.zero()"],
              0,
              "optimizer.zero_grad() clears previous gradients so they do not accumulate across mini-batches."
            )
          }
        ]
      }
    ]
  },
  {
    id: "opencv",
    title: "Computer Vision with OpenCV",
    description: "Process images, detect edges, filter colors, align perspectives, and track moving targets in real-time.",
    trackId: "ai-ml",
    difficulty: "Intermediate",
    duration: "6 hours",
    popularity: 78,
    newest: false,
    image: "/images/courses/opencv.jpg",
    objectives: ["Read and edit video/image files", "Apply Canny Edge detection", "Convert color spaces (BGR to RGB)", "Find structural contours"],
    modules: [
      {
        id: "cv-basics",
        title: "Image Processing Basics",
        lessons: [
          {
            id: "cv-filtering",
            title: "Thresholding and Edge Detection",
            duration: "30 mins",
            xp: 140,
            contentFile: "cv-filtering.md",
            quiz: createQuickQuiz(
              "OpenCV",
              "What is the default color space loading channel order in OpenCV?",
              ["RGB", "BGR", "YUV", "HSV"],
              1,
              "OpenCV reads images in BGR format (Blue, Green, Red) by default."
            )
          }
        ]
      }
    ]
  },

  // ================= SYSTEMS PROGRAMMING TRACK (4 Courses) =================
  {
    id: "c-lang",
    title: "C Systems Programming",
    description: "Write low-level code. Master pointer arithmetic, manual heap memory management, structure padding, and system calls.",
    trackId: "systems",
    difficulty: "Intermediate",
    duration: "10 hours",
    popularity: 82,
    newest: false,
    image: "/images/courses/c.jpg",
    objectives: ["Implement pointers and address logic", "Manage memory manually with malloc & free", "Read and write binary stream files", "Handle raw struct buffers"],
    modules: [
      {
        id: "c-memory",
        title: "Pointers & Memory Allocation",
        lessons: [
          {
            id: "c-pointers",
            title: "Pointer Arithmetic and Addresses",
            duration: "35 mins",
            xp: 160,
            contentFile: "c-pointers.md",
            quiz: createQuickQuiz(
              "C Pointers",
              "What function is used to dynamically allocate memory on the heap in C?",
              ["alloc()", "malloc()", "new()", "calloc_heap()"],
              1,
              "malloc() allocates a specified number of bytes and returns a pointer to the memory."
            )
          }
        ]
      }
    ]
  },
  {
    id: "cpp",
    title: "Modern C++ Programming",
    description: "Object-oriented programming in C++. Standard template libraries (STL), smart pointers, moves, and object lifetimes.",
    trackId: "systems",
    difficulty: "Advanced",
    duration: "12 hours",
    popularity: 86,
    newest: false,
    image: "/images/courses/cpp.jpg",
    objectives: ["Use object-oriented design mechanisms", "Use STL containers (vector, map)", "Understand smart pointers (unique_ptr, shared_ptr)", "Apply move semantics (&&)"],
    modules: [
      {
        id: "cpp-stl",
        title: "Standard Template Library",
        lessons: [
          {
            id: "cpp-smart-pointers",
            title: "Memory Safety with Smart Pointers",
            duration: "40 mins",
            xp: 180,
            contentFile: "cpp-smart-pointers.md",
            quiz: createQuickQuiz(
              "C++ Smart Pointers",
              "Which smart pointer allows shared ownership of a memory resource?",
              ["std::unique_ptr", "std::shared_ptr", "std::weak_ptr", "std::auto_ptr"],
              1,
              "std::shared_ptr uses reference counting to allow multiple owners of the same resource."
            )
          }
        ]
      }
    ]
  },
  {
    id: "rust",
    title: "Rust Memory Safety & Concurrency",
    description: "Write code with memory guarantees. Master variable ownership, borrowing mechanics, lifetime annotations, and concurrency.",
    trackId: "systems",
    difficulty: "Advanced",
    duration: "14 hours",
    popularity: 92,
    newest: true,
    image: "/images/courses/rust.jpg",
    objectives: ["Understand variables ownership & scoping", "Master borrowing rules", "Write concurrency with thread synchronization", "Implement Traits and Enums"],
    modules: [
      {
        id: "rust-ownership",
        title: "Ownership & Borrowing",
        lessons: [
          {
            id: "rust-borrowing",
            title: "References and Borrowing Rules",
            duration: "45 mins",
            xp: 220,
            contentFile: "rust-borrowing.md",
            quiz: createQuickQuiz(
              "Rust Borrowing",
              "How many mutable references to a piece of data can exist concurrently in the same block?",
              ["Zero", "Exactly one", "Infinite", "As many as immutable references"],
              1,
              "Rust allows either one mutable reference OR multiple immutable references to a variable, never both."
            )
          }
        ]
      }
    ]
  },
  {
    id: "go",
    title: "Go Concurrency & Web Services",
    description: "Learn Go syntax. Work with slices, interfaces, error handling, Goroutines, and channels for fast concurrent pipelines.",
    trackId: "systems",
    difficulty: "Intermediate",
    duration: "8 hours",
    popularity: 90,
    newest: false,
    image: "/images/courses/go.jpg",
    objectives: ["Write fast systems concurrent structures", "Communicate between Goroutines via channels", "Implement interfaces implicitly", "Design fast microservices"],
    modules: [
      {
        id: "go-concurrency",
        title: "Goroutines & Channels",
        lessons: [
          {
            id: "go-channels",
            title: "Synchronizing Data with Channels",
            duration: "30 mins",
            xp: 150,
            contentFile: "go-channels.md",
            quiz: createQuickQuiz(
              "Go Channels",
              "What keyword starts a concurrent thread of execution in Go?",
              ["thread", "async", "run", "go"],
              3,
              "The 'go' keyword starts a lightweight thread of execution controlled by the Go runtime (a Goroutine)."
            )
          }
        ]
      }
    ]
  },

  // ================= MOBILE DEVELOPMENT TRACK (3 Courses) =================
  {
    id: "flutter",
    title: "Flutter Mobile UI App development",
    description: "Build beautiful cross-platform mobile app layouts with Flutter. Understand stateless and stateful widget trees.",
    trackId: "mobile",
    difficulty: "Beginner",
    duration: "10 hours",
    popularity: 88,
    newest: false,
    image: "/images/courses/flutter.jpg",
    objectives: ["Structure widget tree layouts", "Manage application state structures", "Add screen animations", "Fetch API data feeds"],
    modules: [
      {
        id: "flutter-ui",
        title: "Widget Layout Architecture",
        lessons: [
          {
            id: "flutter-widgets",
            title: "Stateless vs Stateful Widgets",
            duration: "35 mins",
            xp: 130,
            contentFile: "flutter-widgets.md",
            quiz: createQuickQuiz(
              "Flutter Widgets",
              "Which method triggers a widget rebuild when altering state in a Stateful Widget?",
              ["rebuild()", "setState()", "update()", "notifyListeners()"],
              1,
              "Calling setState() schedules a rebuild of the widget's subtree with the updated properties."
            )
          }
        ]
      }
    ]
  },
  {
    id: "dart",
    title: "Dart Programming Foundations",
    description: "Learn Dart type declarations, collections, asynchronous futures, stream flows, and object-oriented features.",
    trackId: "mobile",
    difficulty: "Beginner",
    duration: "4 hours",
    popularity: 76,
    newest: false,
    image: "/images/courses/dart.jpg",
    objectives: ["Declare strong types", "Write Future functions", "Work with Streams", "Use object classes and mixins"],
    modules: [
      {
        id: "dart-core",
        title: "Dart Futures & Streams",
        lessons: [
          {
            id: "dart-async",
            title: "Asynchronous programming Futures",
            duration: "25 mins",
            xp: 100,
            contentFile: "dart-async.md",
            quiz: createQuickQuiz(
              "Dart Async",
              "Which object represents a delayed calculation value in Dart?",
              ["Promise", "Future", "Delayed", "Task"],
              1,
              "A 'Future' represents a computation that will complete at some point in the future."
            )
          }
        ]
      }
    ]
  },
  {
    id: "react-native",
    title: "React Native App Development",
    description: "Build iOS and Android mobile interfaces using React, JavaScript, native components, stylesheets, and expo tooling.",
    trackId: "mobile",
    difficulty: "Intermediate",
    duration: "10 hours",
    popularity: 89,
    newest: false,
    image: "/images/courses/react-native.jpg",
    objectives: ["Assemble React Native views", "Integrate device components", "Style with StyleSheet APIs", "Implement screen navigations"],
    modules: [
      {
        id: "rn-layouts",
        title: "React Native views & Styles",
        lessons: [
          {
            id: "rn-styling",
            title: "Styling Native components with Flexbox",
            duration: "30 mins",
            xp: 140,
            contentFile: "rn-styling.md",
            quiz: createQuickQuiz(
              "React Native",
              "Which component displays scrollable list datasets efficiently?",
              ["ScrollView", "FlatList", "ListView", "RecyclerField"],
              1,
              "FlatList is an optimized component for rendering long, scrollable lists of structured data."
            )
          }
        ]
      }
    ]
  },

  // ================= DEVOPS TRACK (6 Courses) =================
  {
    id: "linux",
    title: "Linux Command Line Essentials",
    description: "Learn standard terminal navigations, user groups, file permissions (chmod), network states, and config.",
    trackId: "devops",
    difficulty: "Beginner",
    duration: "5 hours",
    popularity: 90,
    newest: false,
    image: "/images/courses/linux.jpg",
    objectives: ["Navigate standard Linux filesystems", "Change file access permissions", "Analyze CPU and memory utilization", "Set configuration parameters"],
    modules: [
      {
        id: "linux-filesystem",
        title: "Shell File Management",
        lessons: [
          {
            id: "linux-permissions",
            title: "User Permissions and chmod settings",
            duration: "25 mins",
            xp: 110,
            contentFile: "linux-permissions.md",
            quiz: createQuickQuiz(
              "Linux Permissions",
              "What chmod octal value grants read, write, and execute permissions to user owner, and read to others?",
              ["744", "755", "700", "644"],
              0,
              "744 represents: owner gets 4(r)+2(w)+1(x) = 7, group gets 4(r) = 4, others get 4(r) = 4."
            )
          }
        ]
      }
    ]
  },
  {
    id: "bash",
    title: "Bash Shell Scripting",
    description: "Automate system actions. Write loops, variable arrays, logic cases, parse command lines, and handle output feeds.",
    trackId: "devops",
    difficulty: "Intermediate",
    duration: "4 hours",
    popularity: 82,
    newest: false,
    image: "/images/courses/bash.jpg",
    objectives: ["Write automate bash shell commands", "Implement variable flows and loops", "Work with stdout/stderr redirects", "Write automation routines"],
    modules: [
      {
        id: "bash-automation",
        title: "Automate Terminal Actions",
        lessons: [
          {
            id: "bash-redirects",
            title: "Streams and Redirections",
            duration: "20 mins",
            xp: 110,
            contentFile: "bash-redirects.md",
            quiz: createQuickQuiz(
              "Bash Scripting",
              "Which operator appends stdout output to an existing file?",
              [">", ">>", "2>", "|"],
              1,
              "The '>>' operator redirects output and appends it to the end of a file instead of overwriting."
            )
          }
        ]
      }
    ]
  },
  {
    id: "docker",
    title: "Docker Containers Setup",
    description: "Write Dockerfiles, build container images, manage networking, compile volumes, and structure Docker Compose configurations.",
    trackId: "devops",
    difficulty: "Intermediate",
    duration: "6 hours",
    popularity: 94,
    newest: false,
    image: "/images/courses/docker.jpg",
    objectives: ["Write Dockerfile directives", "Mount local storage volumes", "Network containers together", "Build docker-compose services"],
    modules: [
      {
        id: "docker-images",
        title: "Building Custom Containers",
        lessons: [
          {
            id: "dockerfile-basics",
            title: "Dockerfile Instructions and Layers",
            duration: "30 mins",
            xp: 140,
            contentFile: "dockerfile-basics.md",
            quiz: createQuickQuiz(
              "Dockerfiles",
              "Which directive sets the default execution command inside a Dockerfile?",
              ["RUN", "ENTRYPOINT", "CMD", "EXEC"],
              2,
              "CMD sets the default command that runs when starting a container from the image."
            )
          }
        ]
      }
    ]
  },
  {
    id: "kubernetes",
    title: "Kubernetes Cloud Deployment",
    description: "Orchestrate clusters. Manage Pod structures, deployment files, networking ingress, services, and configuration secrets.",
    trackId: "devops",
    difficulty: "Advanced",
    duration: "10 hours",
    popularity: 88,
    newest: true,
    image: "/images/courses/kubernetes.jpg",
    objectives: ["Configure Kubernetes Pod configs", "Set Service endpoints and LoadBalancers", "Deploy ConfigMaps and Secrets", "Manage scale replicas"],
    modules: [
      {
        id: "k8s-core",
        title: "Kubernetes Deployments",
        lessons: [
          {
            id: "k8s-pods",
            title: "Pods, Deployments, and Replicas",
            duration: "35 mins",
            xp: 180,
            contentFile: "k8s-pods.md",
            quiz: createQuickQuiz(
              "Kubernetes",
              "Which command lists all active pods in a namespace?",
              ["kubectl view pods", "kubectl list pods", "kubectl get pods", "kubectl show pods"],
              2,
              "kubectl get pods outputs a list of pods running in the target cluster."
            )
          }
        ]
      }
    ]
  },
  {
    id: "git",
    title: "Git Version Control",
    description: "Master repositories. Learn branches, commit history, merge conflicts resolution, rebasing, and remote synchronization.",
    trackId: "devops",
    difficulty: "Beginner",
    duration: "4 hours",
    popularity: 93,
    newest: false,
    image: "/images/courses/git.jpg",
    objectives: ["Manage commit history trees", "Resolve file merge conflicts", "Manage branches cleanly", "Synchronize remote repositories"],
    modules: [
      {
        id: "git-basics",
        title: "Branching and Staging",
        lessons: [
          {
            id: "git-commits",
            title: "Branch Merging and Conflicts",
            duration: "25 mins",
            xp: 100,
            contentFile: "git-commits.md",
            quiz: createQuickQuiz(
              "Git Version Control",
              "Which command downloads changes from a remote repo and merges them into the current branch?",
              ["git fetch", "git pull", "git sync", "git clone"],
              1,
              "git pull is a combination of git fetch followed by git merge."
            )
          }
        ]
      }
    ]
  },
  {
    id: "github-actions",
    title: "GitHub Actions CI/CD Pipelines",
    description: "Automate code testing, check build processes, deploy changes to hosts, and configure pipeline runs with YAML files.",
    trackId: "devops",
    difficulty: "Intermediate",
    duration: "5 hours",
    popularity: 86,
    newest: true,
    image: "/images/courses/github-actions.jpg",
    objectives: ["Write workflow YAML definitions", "Integrate automated unit tests", "Manage build artifacts", "Configure secure action secrets"],
    modules: [
      {
        id: "gha-workflows",
        title: "Workflow Automation Setup",
        lessons: [
          {
            id: "gha-jobs",
            title: "Workflow Events, Jobs, and Actions",
            duration: "30 mins",
            xp: 130,
            contentFile: "gha-jobs.md",
            quiz: createQuickQuiz(
              "GitHub Actions",
              "In what directory must GitHub Actions workflow YAML files be saved in a repo?",
              [".github/workflows/", ".github/actions/", "workflows/", "ci-cd/"],
              0,
              "GitHub workflows must be saved in the directory '.github/workflows/' at the root of the repository."
            )
          }
        ]
      }
    ]
  }
];
