import { HandcraftedLesson } from "../types";

export const htmlData: Record<string, HandcraftedLesson> = {

  "html-basics": {
    title: "HTML Syntax and Structure",
    content: [
      "HyperText Markup Language (HTML) is the standard markup language for documents designed to be displayed in a web browser. It defines the content and structure of web pages. HTML consists of a series of elements, represented by tags, which tell the browser how to display the content.",
      "An HTML element is defined by a start tag, some content, and an end tag. For example, <h1>Welcome</h1> represents a first-level heading. Tags usually come in pairs like <p> and </p>, where the second tag has a forward slash to indicate the closing tag.",
      "The structure of an HTML document includes nesting elements inside other elements. The root element is always <html>, which contains a <head> element for metadata and a <body> element for the visible page content.",
      "Learning HTML syntax is the first step in web development. By mastering basic tags such as headings, paragraphs, links, and lists, you can create functional structure for any web interface."
    ],
    quiz: [
      {
        question: "Which HTML element is used for the largest heading?",
        options: ["<heading>", "<h6>", "<h1>", "<head>"],
        correctOption: 2,
        explanation: "<h1> is the standard tag for the main, largest heading of a page."
      },
      {
        question: "What is the correct tag for creating a paragraph?",
        options: ["<para>", "<p>", "<paragraph>", "<text>"],
        correctOption: 1,
        explanation: "<p> is used to wrap text in a paragraph element."
      },
      {
        question: "Which tag is used to create a hyperlink?",
        options: ["<link>", "<a>", "<href>", "<url>"],
        correctOption: 1,
        explanation: "<a> (anchor tag) is used with the href attribute to link to other pages."
      }
    ],
    task: {
      description: "Create an <h1> heading containing the text 'Welcome to LearnCode' and a <p> paragraph containing 'HTML is the skeleton of web applications.'. Ensure both have proper opening and closing tags.",
      starterCode: `<!-- Write your HTML structure here -->\n`,
      language: "html",
      expectedOutput: "<h1>Welcome to LearnCode</h1>\n<p>HTML is the skeleton of web applications.</p>",
      expectedOutputDisplay: "1. Heading element level 1 (h1) containing text:\n   \"Welcome to LearnCode\"\n2. Paragraph element (p) containing text:\n   \"HTML is the skeleton of web applications.\"",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const hasH1 = clean(code).includes(clean("<h1>Welcome to LearnCode</h1>"));
        const hasP = clean(code).includes(clean("<p>HTML is the skeleton of web applications.</p>"));
        const logs = [
          "Analyzing HTML elements...",
          `Assert: <h1> tag with correct text -> ${hasH1 ? "PASSED" : "FAILED"}`,
          `Assert: <p> tag with correct text -> ${hasP ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasH1 && hasP, logs };
      }
    }
  },

  "semantic-html": {
    title: "Semantic Markup and Accessibility",
    content: [
      "Semantic HTML refers to using HTML tags that convey the meaning of the content rather than just its appearance. Instead of nesting everything in generic <div> tags, we use tags like <header>, <article>, and <footer> to describe their purposes.",
      "Semantic elements help web browsers, search engines, and screen readers read web pages. For search engine optimization (SEO) and screen accessibility, semantic markup is a professional standard that cannot be skipped.",
      "Commonly used semantic containers include <main> for the dominant content area, <nav> for navigation link bars, <section> for grouping related articles, and <aside> for supplementary sidebar comments.",
      "By formatting your code semantically, you ensure that assistive technologies can read and navigate your content easily, making your website accessible to everyone."
    ],
    quiz: [
      {
        question: "Which of the following is a semantic HTML element?",
        options: ["<div>", "<span>", "<article>", "<b>"],
        correctOption: 2,
        explanation: "<article> defines self-contained independent content and has semantic meaning."
      },
      {
        question: "What is the primary purpose of semantic HTML elements?",
        options: ["To apply automatic styling", "To convey meaning to search engines and screen readers", "To link external CSS files", "To run scripts asynchronously"],
        correctOption: 1,
        explanation: "Semantic tags are about describing content meaning rather than appearance."
      },
      {
        question: "Which tag is best suited for wrapping the main navigation links?",
        options: ["<menu>", "<nav>", "<links>", "<section>"],
        correctOption: 1,
        explanation: "<nav> is designed specifically for navigation links."
      }
    ],
    task: {
      description: "Create a semantic layout containing a <main> container. Inside it, place a <nav></nav> navigation menu, an <article></article> post, and a <footer> containing the text '© 2026 LearnCode'.",
      starterCode: `<!-- Build a semantic webpage structure -->\n`,
      language: "html",
      expectedOutput: "<main>\n  <nav></nav>\n  <article></article>\n  <footer>© 2026 LearnCode</footer>\n</main>",
      expectedOutputDisplay: "1. Main wrapper element enclosing other semantic tags.\n2. Nested Navigation menu element (nav).\n3. Nested Article element (article).\n4. Nested Footer element containing text:\n   \"© 2026 LearnCode\"",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const hasMain = /<main\b[^>]*>([\s\S]*?)<\/main>/i.test(code);
        const hasNav = /<nav\b[^>]*>([\s\S]*?)<\/nav>/i.test(code);
        const hasArticle = /<article\b[^>]*>([\s\S]*?)<\/article>/i.test(code);
        const hasFooter = clean(code).includes(clean("<footer>© 2026 LearnCode</footer>"));
        const logs = [
          "Running semantic elements assertion...",
          `Assert: <main> wrapper found -> ${hasMain ? "PASSED" : "FAILED"}`,
          `Assert: <nav> tag found -> ${hasNav ? "PASSED" : "FAILED"}`,
          `Assert: <article> tag found -> ${hasArticle ? "PASSED" : "FAILED"}`,
          `Assert: <footer> tag with copyright text -> ${hasFooter ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasMain && hasNav && hasArticle && hasFooter, logs };
      }
    }
  },

  "html-links-images": {
    title: "Hyperlinks and Images",
    content: [
      "Hyperlinks are the pathways of the internet, connecting different web resources. In HTML, hyperlinks are created using the anchor tag <a>, which uses the href attribute to specify the URL destination.",
      "Images make webpages visually engaging. The <img> tag is an empty/self-closing element (meaning it has no closing tag) and requires two critical attributes: src to specify the image file path, and alt to provide a descriptive text fallback for accessibility and screen readers.",
      "Linking images is a common design pattern where you nest an <img> tag inside an <a> tag, allowing the user to click the image to navigate to a new page.",
      "By combining links and media elements, you can turn a static text document into an interactive, multimedia-rich browsing experience."
    ],
    quiz: [
      {
        question: "Which attribute specifies the destination URL of a hyperlink in an <a> tag?",
        options: ["src", "link", "href", "url"],
        correctOption: 2,
        explanation: "href (Hypertext Reference) specifies the link destination."
      },
      {
        question: "Why is the alt attribute important for <img> tags?",
        options: ["It provides a text description for screen readers and SEO", "It styles the image border", "It sets the image resolution", "It animates the image loading"],
        correctOption: 0,
        explanation: "The alt attribute provides an alternative text description for accessibility."
      },
      {
        question: "Which of the following is a self-closing/empty tag in HTML?",
        options: ["<a>", "<p>", "<img>", "<h1>"],
        correctOption: 2,
        explanation: "The <img> tag is self-closing and does not have an end tag."
      }
    ],
    task: {
      description: "Create an anchor link pointing to 'https://learncode.academy'. Inside the link, nest an image element displaying the source 'https://learncode.academy/logo.png' with the alt text 'LearnCode Logo'.",
      starterCode: `<!-- Create an image hyperlink below -->\n`,
      language: "html",
      expectedOutput: "<a href=\"https://learncode.academy\"><img src=\"https://learncode.academy/logo.png\" alt=\"LearnCode Logo\" /></a>",
      expectedOutputDisplay: "1. Anchor link (a) wrapping the image, with destination:\n   \"https://learncode.academy\"\n2. Nested Image (img) with source path:\n   \"https://learncode.academy/logo.png\"\n3. Image alternative text (alt) containing description:\n   \"LearnCode Logo\"",
      validate: (code: string) => {
        const hasAnchor = /<a\b[^>]*href=["']https:\/\/learncode\.academy["']/i.test(code);
        const hasImg = /<img\b[^>]*src=["']https:\/\/learncode\.academy\/logo\.png["']/i.test(code) && /alt=["']LearnCode Logo["']/i.test(code);
        const logs = [
          "Validating image and hyperlink structure...",
          `Assert: <a> tag with correct href attribute -> ${hasAnchor ? "PASSED" : "FAILED"}`,
          `Assert: <img> tag with src and alt properties -> ${hasImg ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasAnchor && hasImg, logs };
      }
    }
  },

  "html-lists": {
    title: "Lists (Ordered & Unordered)",
    content: [
      "HTML provides simple ways to organize items in lists. Lists are perfect for navigation menus, bulleted article points, or step-by-step tutorial guides.",
      "Unordered lists are used when the order of items does not matter. They are created using the <ul> tag and render as bullet points. Ordered lists are used when steps need to follow a sequence (like a recipe) and are created using the <ol> tag, rendering as numbered items.",
      "Inside both list containers, each list item is defined using the <li> tag (List Item). An <li> tag must be nested directly inside a <ul> or <ol> parent tag to compile correctly.",
      "Mastering list nesting allows you to build complex multi-level dropdown menus and detailed documentation structures."
    ],
    quiz: [
      {
        question: "Which tag is used to create an ordered (numbered) list?",
        options: ["<ul>", "<ol>", "<li>", "<list>"],
        correctOption: 1,
        explanation: "<ol> creates an Ordered List."
      },
      {
        question: "Which element represents an individual item inside a list?",
        options: ["<item>", "<ul>", "<li>", "<ol>"],
        correctOption: 2,
        explanation: "<li> (List Item) wraps each individual list item."
      },
      {
        question: "How do you create bulleted lists instead of numbered lists?",
        options: ["Use <ol> instead of <ul>", "Use <ul> instead of <ol>", "Add type='bullet' to <ol>", "Set list-style in body tag"],
        correctOption: 1,
        explanation: "Unordered list <ul> creates bulleted lists by default."
      }
    ],
    task: {
      description: "Create an unordered list containing three list items displaying the text 'HTML5', 'CSS3', and 'JavaScript' in that order.",
      starterCode: `<!-- Write your list below -->\n`,
      language: "html",
      expectedOutput: "<ul>\n  <li>HTML5</li>\n  <li>CSS3</li>\n  <li>JavaScript</li>\n</ul>",
      expectedOutputDisplay: "1. Unordered list wrapper (ul).\n2. First list item (li) containing \"HTML5\"\n3. Second list item (li) containing \"CSS3\"\n4. Third list item (li) containing \"JavaScript\"",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const cleanCode = clean(code);
        const hasUl = /<ul>([\s\S]*?)<\/ul>/i.test(code);
        const hasItem1 = cleanCode.includes("<li>html5</li>");
        const hasItem2 = cleanCode.includes("<li>css3</li>");
        const hasItem3 = cleanCode.includes("<li>javascript</li>");
        const logs = [
          "Analyzing list items...",
          `Assert: <ul> container exists -> ${hasUl ? "PASSED" : "FAILED"}`,
          `Assert: 'HTML5' list item -> ${hasItem1 ? "PASSED" : "FAILED"}`,
          `Assert: 'CSS3' list item -> ${hasItem2 ? "PASSED" : "FAILED"}`,
          `Assert: 'JavaScript' list item -> ${hasItem3 ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasUl && hasItem1 && hasItem2 && hasItem3, logs };
      }
    }
  },

  "html-tables": {
    title: "HTML Tabular Data",
    content: [
      "HTML tables allow you to arrange data (such as text, images, and links) into rows and columns of cells. Tables are constructed using the <table> element as the parent wrapper.",
      "Inside a table, rows are defined using the <tr> tag (Table Row). Within each row, headers are defined with the <th> tag (Table Header, which defaults to bold and centered text), and regular cells are defined with the <td> tag (Table Data).",
      "To organize large tables, you can group rows into a table header <thead>, table body <tbody>, and table footer <tfoot>. This makes table styles easier to coordinate.",
      "Proper use of tables is essential for tabular reporting. For page layouts, however, modern CSS Grid or Flexbox is preferred over tables."
    ],
    quiz: [
      {
        question: "Which tag defines a new row in an HTML table?",
        options: ["<td>", "<tr>", "<th>", "<table>"],
        correctOption: 1,
        explanation: "<tr> stands for Table Row."
      },
      {
        question: "What is the difference between <th> and <td> elements?",
        options: ["<th> is for headers, <td> is for regular cells", "<th> has no closing tag", "<td> only accepts numbers", "<th> cannot be styled in CSS"],
        correctOption: 0,
        explanation: "<th> represents a header cell (bold and centered by default), and <td> holds standard table cell data."
      },
      {
        question: "Which container groups the header content of a table?",
        options: ["<header>", "<thead>", "<tbody>", "<tfoot>"],
        correctOption: 1,
        explanation: "<thead> is specifically designed to group header rows in tables."
      }
    ],
    task: {
      description: "Create a table with one header row containing headers 'Course' and 'Duration', and one data row containing values 'HTML5' and '4 hours'.",
      starterCode: `<table>\n  <!-- Create headers and rows -->\n</table>`,
      language: "html",
      expectedOutput: "<table>\n  <tr>\n    <th>Course</th>\n    <th>Duration</th>\n  </tr>\n  <tr>\n    <td>HTML5</td>\n    <td>4 hours</td>\n  </tr>\n</table>",
      expectedOutputDisplay: "1. Table container (table).\n2. Header row (tr) with Header columns (th) \"Course\" and \"Duration\".\n3. Data row (tr) with Data cells (td) \"HTML5\" and \"4 hours\".",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const cleanCode = clean(code);
        const hasTable = /<table>([\s\S]*?)<\/table>/i.test(code);
        const hasHeader = cleanCode.includes("<th>course</th>") && cleanCode.includes("<th>duration</th>");
        const hasData = cleanCode.includes("<td>html5</td>") && (cleanCode.includes("<td>4hours</td>") || cleanCode.includes("<td>4hours</td>"));
        const logs = [
          "Scanning table structure...",
          `Assert: <table> tag found -> ${hasTable ? "PASSED" : "FAILED"}`,
          `Assert: Header cells "Course" and "Duration" -> ${hasHeader ? "PASSED" : "FAILED"}`,
          `Assert: Data cells "HTML5" and "4 hours" -> ${hasData ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasTable && hasHeader && hasData, logs };
      }
    }
  },

  "html-form-elements": {
    title: "Building Forms and Input Types",
    content: [
      "Forms are the primary interactive components on the web, allowing users to enter data and send it to servers. HTML forms are wrapped in a <form> tag and use inputs like textfields, checkboxes, and buttons.",
      "The <input> tag is highly versatile. By modifying the type attribute, it can turn into a text field (type='text'), password field (type='password'), checkbox, email field, or numerical selector.",
      "To ensure high-quality data entry, HTML provides native validation attributes. The required attribute prevents submission of empty fields, while minlength and maxlength restrict string lengths.",
      "When the user clicks a <button type='submit'>, the browser packages the input values and triggers a submit event, enabling interactive registration, search inputs, and content creation."
    ],
    quiz: [
      {
        question: "Which input type is used specifically for entering passwords?",
        options: ["type='hidden'", "type='secret'", "type='password'", "type='text'"],
        correctOption: 2,
        explanation: "type='password' masks input characters for security."
      },
      {
        question: "What HTML attribute makes a form input field mandatory?",
        options: ["validate='true'", "required", "needed", "must-fill"],
        correctOption: 1,
        explanation: "The required attribute specifies that the user must fill in a value before form submission."
      },
      {
        question: "Which tag groups multiple form controls together with a caption?",
        options: ["<group>", "<form>", "<fieldset>", "<label>"],
        correctOption: 2,
        explanation: "<fieldset> groups related form elements, and <legend> adds a caption."
      }
    ],
    task: {
      description: "Build a standard form containing a text input for username (required, name='username'), a password input for password (required, name='password'), and a submit button.",
      starterCode: `<form>\n  <!-- Create user input forms -->\n</form>`,
      language: "html",
      expectedOutput: "<form>\n  <input type=\"text\" name=\"username\" required />\n  <input type=\"password\" name=\"password\" required />\n  <button type=\"submit\">Submit</button>\n</form>",
      expectedOutputDisplay: "1. Form wrapper element (form).\n2. Username text input field (type=\"text\", name=\"username\", marked required).\n3. Password input field (type=\"password\", name=\"password\", marked required).\n4. Button triggering submission (type=\"submit\").",
      validate: (code: string) => {
        const hasForm = /<form\b[^>]*>([\s\S]*?)<\/form>/i.test(code);
        const hasUser = /<input\b[^>]*type=["']text["'][^>]*name=["']username["']/i.test(code) && /required/i.test(code);
        const hasPass = /<input\b[^>]*type=["']password["'][^>]*name=["']password["']/i.test(code) && /required/i.test(code);
        const hasButton = /<(button|input)\b[^>]*(type=["']submit["']|submit)/i.test(code);
        const logs = [
          "Analyzing form elements...",
          `Assert: <form> element present -> ${hasForm ? "PASSED" : "FAILED"}`,
          `Assert: Username input (type="text", name="username", required) -> ${hasUser ? "PASSED" : "FAILED"}`,
          `Assert: Password input (type="password", name="password", required) -> ${hasPass ? "PASSED" : "FAILED"}`,
          `Assert: Submit button present -> ${hasButton ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasForm && hasUser && hasPass && hasButton, logs };
      }
    }
  },

  "html-multimedia": {
    title: "Multimedia Audio and Video",
    content: [
      "Modern web applications frequently integrate audio, video, and interactive maps. HTML5 introduced native elements <audio> and <video> to play files directly without flash plugins.",
      "To render video, use the <video> element. You specify the source file via the src attribute (or nested <source> tags for different formats) and add the controls attribute to show play, pause, and volume buttons.",
      "Similarly, the <audio> tag integrates sound clips. Adding the autoplay or loop attributes can control when audio begins and whether it repeats.",
      "Providing descriptive subtitles and clear fallbacks inside the audio/video elements ensures your multimedia content is fully accessible to search engines and users with hearing impairments."
    ],
    quiz: [
      {
        question: "Which attribute must be added to <video> to display play/pause buttons?",
        options: ["buttons", "controls", "play", "media"],
        correctOption: 1,
        explanation: "The controls attribute is required to show standard browser playbacks."
      },
      {
        question: "Which tag is used to specify multiple media source options for a <video> tag?",
        options: ["<url>", "<file>", "<source>", "<link>"],
        correctOption: 2,
        explanation: "<source> elements allow browsers to choose the first media format they support."
      },
      {
        question: "What happens if a browser does not support the <video> tag?",
        options: ["The browser crashes", "It displays the fallback text inside the video element", "It plays as audio only", "It downloads the file automatically"],
        correctOption: 1,
        explanation: "Text written between <video> and </video> tags is displayed as a fallback in unsupported browsers."
      }
    ],
    task: {
      description: "Create a video tag with the file source 'https://learncode.academy/intro.mp4', show browser controls, and include the fallback text 'Video not supported'.",
      starterCode: `<!-- Add your video tag below -->\n`,
      language: "html",
      expectedOutput: "<video src=\"https://learncode.academy/intro.mp4\" controls>Video not supported</video>",
      expectedOutputDisplay: "1. Video element (video) with browser controls enabled (controls).\n2. Resource URL path set to:\n   \"https://learncode.academy/intro.mp4\"\n3. Accessible text fallback reading:\n   \"Video not supported\"",
      validate: (code: string) => {
        const hasVideo = /<video\b[^>]*controls/i.test(code);
        const hasSrc = /src=["']https:\/\/learncode\.academy\/intro\.mp4["']/i.test(code) || /<source\b[^>]*src=["']https:\/\/learncode\.academy\/intro\.mp4["']/i.test(code);
        const hasFallback = code.toLowerCase().includes("video not supported");
        const logs = [
          "Validating video player configs...",
          `Assert: <video> element with 'controls' -> ${hasVideo ? "PASSED" : "FAILED"}`,
          `Assert: src URL pointing to the video file -> ${hasSrc ? "PASSED" : "FAILED"}`,
          `Assert: Accessibility fallback text -> ${hasFallback ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasVideo && hasSrc && hasFallback, logs };
      }
    }
  },

  "html-doc-structure": {
    title: "HTML Document Structure",
    content: [
      "Every HTML page follows a standard boilerplate structure that tells the browser how to interpret and render the document. The very first line of any modern HTML file is the DOCTYPE declaration: <!DOCTYPE html>. This is not an HTML tag, but an instruction to the browser to render the page in standards mode.",
      "Below the DOCTYPE, the <html> element wraps the entire page. It accepts a lang attribute (e.g., lang=\"en\") that helps search engines and screen readers identify the document's primary language. Inside <html>, the two direct children are <head> and <body>.",
      "The <head> element contains metadata that is not displayed on the page itself. This includes the <title> tag (which sets the browser tab title), <meta charset=\"UTF-8\"> for character encoding, viewport settings for responsive design, and links to external stylesheets or scripts.",
      "The <body> element contains everything the user sees and interacts with — headings, paragraphs, images, forms, and more. Understanding this hierarchy is essential because it forms the skeleton of every web page you will ever build."
    ],
    quiz: [
      {
        question: "What is the purpose of <!DOCTYPE html>?",
        options: ["It creates the root HTML element", "It tells the browser to use standards rendering mode", "It links the CSS stylesheet", "It defines the page language"],
        correctOption: 1,
        explanation: "<!DOCTYPE html> is a declaration that instructs the browser to render the page using modern HTML5 standards mode."
      },
      {
        question: "Which element contains metadata like the page title and character encoding?",
        options: ["<body>", "<meta>", "<head>", "<html>"],
        correctOption: 2,
        explanation: "The <head> element is the container for metadata such as <title>, <meta>, and <link> tags."
      },
      {
        question: "What does the lang attribute on the <html> tag specify?",
        options: ["The programming language used", "The document's primary human language", "The text direction (LTR/RTL)", "The CSS framework version"],
        correctOption: 1,
        explanation: "The lang attribute declares the primary language of the document for accessibility and SEO purposes."
      }
    ],
    task: {
      description: "Create a complete HTML5 boilerplate with <!DOCTYPE html>, an <html lang=\"en\"> wrapper, a <head> containing <meta charset=\"UTF-8\"> and <title>My Page</title>, and an empty <body></body>.",
      starterCode: `<!-- Write the full HTML5 boilerplate -->\n`,
      language: "html",
      expectedOutput: "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>My Page</title>\n</head>\n<body>\n</body>\n</html>",
      expectedOutputDisplay: "1. DOCTYPE declaration for HTML5.\n2. Root <html> element with lang=\"en\".\n3. <head> containing <meta charset=\"UTF-8\"> and <title>My Page</title>.\n4. Empty <body> element.",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const cleanCode = clean(code);
        const hasDoctype = /<!doctypehtml>/i.test(cleanCode);
        const hasHtmlLang = /\<html[^>]*lang=["']en["']/i.test(code);
        const hasMeta = cleanCode.includes(clean('<meta charset="UTF-8">')) || cleanCode.includes(clean("<meta charset='UTF-8'>")) || cleanCode.includes(clean('<meta charset="utf-8">'));
        const hasTitle = cleanCode.includes(clean("<title>My Page</title>"));
        const hasBody = /\<body\b[^>]*\>[\s\S]*\<\/body\>/i.test(code);
        const logs = [
          "Analyzing HTML5 boilerplate...",
          `Assert: <!DOCTYPE html> declaration -> ${hasDoctype ? "PASSED" : "FAILED"}`,
          `Assert: <html lang="en"> root element -> ${hasHtmlLang ? "PASSED" : "FAILED"}`,
          `Assert: <meta charset="UTF-8"> in head -> ${hasMeta ? "PASSED" : "FAILED"}`,
          `Assert: <title>My Page</title> in head -> ${hasTitle ? "PASSED" : "FAILED"}`,
          `Assert: <body> element present -> ${hasBody ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasDoctype && hasHtmlLang && hasMeta && hasTitle && hasBody, logs };
      }
    }
  },

  "html-attributes": {
    title: "HTML Attributes & Global Attributes",
    content: [
      "HTML attributes provide additional information about elements. They are always specified in the opening tag and usually come in name-value pairs like name=\"value\". Attributes modify the behavior, appearance, or semantics of the element they belong to.",
      "Global attributes can be applied to any HTML element. The most common ones include id (a unique identifier), class (for CSS styling and JavaScript selection), style (inline CSS), and title (tooltip text displayed on hover).",
      "The data-* attributes allow you to store custom data directly on HTML elements without using non-standard attributes. For example, data-user-id=\"42\" stores a user ID that JavaScript can read using element.dataset.userId. This is widely used in modern frameworks.",
      "Other important global attributes include hidden (hides an element from display), tabindex (controls keyboard tab navigation order), and contenteditable (makes any element editable by the user). Proper use of attributes makes your HTML more semantic, accessible, and interactive."
    ],
    quiz: [
      {
        question: "Which attribute provides a unique identifier for an HTML element?",
        options: ["class", "name", "id", "key"],
        correctOption: 2,
        explanation: "The id attribute gives an element a unique identifier that must not be repeated on the same page."
      },
      {
        question: "How do you access a data-user-id attribute value in JavaScript?",
        options: ["element.data.userId", "element.dataset.userId", "element.getAttribute('userId')", "element.userID"],
        correctOption: 1,
        explanation: "Custom data-* attributes are accessed via the dataset property, with hyphens converted to camelCase."
      },
      {
        question: "Which global attribute makes an HTML element editable by the user?",
        options: ["editable", "contenteditable", "writable", "input-mode"],
        correctOption: 1,
        explanation: "The contenteditable attribute allows any HTML element's text content to be edited directly by the user."
      }
    ],
    task: {
      description: "Create a <div> with id=\"main\", class=\"container\", a custom attribute data-theme=\"dark\", and a title=\"Main Content\". Inside it, place a <p> with the text 'Hello World'.",
      starterCode: `<!-- Create a div with attributes -->\n`,
      language: "html",
      expectedOutput: "<div id=\"main\" class=\"container\" data-theme=\"dark\" title=\"Main Content\">\n  <p>Hello World</p>\n</div>",
      expectedOutputDisplay: "1. <div> with id=\"main\", class=\"container\".\n2. Custom data attribute data-theme=\"dark\".\n3. Title attribute \"Main Content\".\n4. Nested <p> containing \"Hello World\".",
      validate: (code: string) => {
        const hasId = /\<div\b[^>]*id=["']main["']/i.test(code);
        const hasClass = /\<div\b[^>]*class=["']container["']/i.test(code);
        const hasData = /data-theme=["']dark["']/i.test(code);
        const hasTitle = /title=["']Main Content["']/i.test(code);
        const hasP = code.replace(/\s+/g, "").toLowerCase().includes("<p>helloworld</p>");
        const logs = [
          "Validating HTML attributes...",
          `Assert: id="main" on div -> ${hasId ? "PASSED" : "FAILED"}`,
          `Assert: class="container" on div -> ${hasClass ? "PASSED" : "FAILED"}`,
          `Assert: data-theme="dark" attribute -> ${hasData ? "PASSED" : "FAILED"}`,
          `Assert: title="Main Content" attribute -> ${hasTitle ? "PASSED" : "FAILED"}`,
          `Assert: <p>Hello World</p> nested inside -> ${hasP ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasId && hasClass && hasData && hasTitle && hasP, logs };
      }
    }
  },

  "html-block-inline": {
    title: "Block vs Inline Elements",
    content: [
      "HTML elements are categorized into two fundamental display types: block-level and inline-level. Understanding this distinction is critical for controlling how content flows and how elements are sized on a web page.",
      "Block-level elements always start on a new line and stretch to fill the full width of their parent container. Common block elements include <div>, <p>, <h1> to <h6>, <ul>, <ol>, <section>, and <article>. They are used to create the structural layout of a page.",
      "Inline elements do not start on a new line — they flow within the text content. They only take up as much width as necessary. Common inline elements include <span>, <a>, <strong>, <em>, <img>, and <code>. You cannot set width or height on inline elements (unless you change their display property in CSS).",
      "The <div> tag is the generic block-level container used for grouping content, while <span> is the generic inline container used for styling portions of text. In modern CSS, you can override any element's display behavior using display: block, display: inline, or display: inline-block."
    ],
    quiz: [
      {
        question: "Which of the following is a block-level element?",
        options: ["<span>", "<a>", "<div>", "<strong>"],
        correctOption: 2,
        explanation: "<div> is a block-level element that starts on a new line and takes full width."
      },
      {
        question: "What is the key behavior difference between block and inline elements?",
        options: ["Block elements can't have children", "Inline elements start on a new line", "Block elements take full width and start on a new line", "There is no difference"],
        correctOption: 2,
        explanation: "Block elements start on a new line and expand to fill their container's width, while inline elements flow within text."
      },
      {
        question: "Which element is the generic inline container for styling text?",
        options: ["<div>", "<p>", "<span>", "<section>"],
        correctOption: 2,
        explanation: "<span> is the generic inline container used to wrap and style portions of text without breaking the flow."
      }
    ],
    task: {
      description: "Create a <div> block container with two lines inside: a <p> paragraph containing 'Block elements stack vertically.' and a <p> paragraph containing 'Use <span>inline</span> elements to style text.' where the word 'inline' is wrapped in a <span> tag with class=\"highlight\".",
      starterCode: `<!-- Demonstrate block vs inline elements -->\n`,
      language: "html",
      expectedOutput: "<div>\n  <p>Block elements stack vertically.</p>\n  <p>Use <span class=\"highlight\">inline</span> elements to style text.</p>\n</div>",
      expectedOutputDisplay: "1. Block <div> container wrapping content.\n2. First <p> with text \"Block elements stack vertically.\"\n3. Second <p> containing a <span class=\"highlight\"> wrapping \"inline\".\n4. Demonstrates block stacking and inline text flow.",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        const cleanCode = clean(code);
        const hasDiv = /\<div\b[^>]*\>[\s\S]*\<\/div\>/i.test(code);
        const hasP1 = cleanCode.includes(clean("<p>Block elements stack vertically.</p>"));
        const hasSpan = /\<span\b[^>]*class=["']highlight["'][^>]*\>inline\<\/span\>/i.test(code);
        const hasP2 = /\<p\>.*\<span\b[^>]*\>inline\<\/span\>.*\<\/p\>/i.test(code);
        const logs = [
          "Checking block vs inline structure...",
          `Assert: <div> block container present -> ${hasDiv ? "PASSED" : "FAILED"}`,
          `Assert: First <p> with correct text -> ${hasP1 ? "PASSED" : "FAILED"}`,
          `Assert: <span class="highlight"> wrapping "inline" -> ${hasSpan ? "PASSED" : "FAILED"}`,
          `Assert: <span> nested inside second <p> -> ${hasP2 ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasDiv && hasP1 && hasSpan && hasP2, logs };
      }
    }
  },

  "html-meta-head": {
    title: "Meta Tags & Head Elements",
    content: [
      "The <head> section of an HTML document is invisible to users but essential for browsers, search engines, and social media platforms. It contains metadata that controls how the page behaves, appears in search results, and renders on different devices.",
      "The <meta> tag is used to define metadata. Key meta tags include: charset (character encoding, typically UTF-8), viewport (controls layout on mobile devices using width=device-width, initial-scale=1.0), description (a summary for search engines), and keywords (SEO terms).",
      "The <link> tag connects external resources to your page. The most common use is linking CSS stylesheets via <link rel=\"stylesheet\" href=\"styles.css\">. You can also use it to set a favicon with <link rel=\"icon\" href=\"favicon.ico\">. The <link> tag is self-closing.",
      "Open Graph meta tags (og:title, og:description, og:image) control how your page appears when shared on social media platforms like Facebook, Twitter, and LinkedIn. These tags are placed inside <head> and use the property attribute instead of name."
    ],
    quiz: [
      {
        question: "Which meta tag is essential for responsive design on mobile devices?",
        options: ["<meta name=\"description\">", "<meta name=\"viewport\">", "<meta charset=\"UTF-8\">", "<meta name=\"keywords\">"],
        correctOption: 1,
        explanation: "The viewport meta tag controls how the page scales and fits on mobile screens."
      },
      {
        question: "How do you link an external CSS stylesheet in HTML?",
        options: ["<style src=\"styles.css\">", "<css href=\"styles.css\">", "<link rel=\"stylesheet\" href=\"styles.css\">", "<script src=\"styles.css\">"],
        correctOption: 2,
        explanation: "<link rel=\"stylesheet\" href=\"styles.css\"> is the standard way to connect external CSS files."
      },
      {
        question: "What are Open Graph meta tags used for?",
        options: ["Embedding videos", "Controlling how a page appears when shared on social media", "Adding JavaScript libraries", "Setting browser security policies"],
        correctOption: 1,
        explanation: "Open Graph tags (og:title, og:description, og:image) define how link previews look on social media platforms."
      }
    ],
    task: {
      description: "Create a <head> section containing: <meta charset=\"UTF-8\">, <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">, <meta name=\"description\" content=\"Learn HTML basics\">, <title>LearnCode Academy</title>, and <link rel=\"stylesheet\" href=\"styles.css\">.",
      starterCode: `<head>\n  <!-- Add meta tags, title, and link -->\n</head>`,
      language: "html",
      expectedOutput: "<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n  <meta name=\"description\" content=\"Learn HTML basics\">\n  <title>LearnCode Academy</title>\n  <link rel=\"stylesheet\" href=\"styles.css\">\n</head>",
      expectedOutputDisplay: "1. <meta charset=\"UTF-8\"> for character encoding.\n2. Viewport meta tag for responsive design.\n3. Description meta tag for SEO.\n4. <title> set to \"LearnCode Academy\".\n5. External stylesheet link.",
      validate: (code: string) => {
        const hasCharset = /\<meta\b[^>]*charset=["']UTF-8["']/i.test(code);
        const hasViewport = /\<meta\b[^>]*name=["']viewport["'][^>]*content=["'][^"']*width=device-width/i.test(code);
        const hasDescription = /\<meta\b[^>]*name=["']description["'][^>]*content=["']Learn HTML basics["']/i.test(code);
        const hasTitle = code.replace(/\s+/g, "").toLowerCase().includes("<title>learncodeacademy</title>");
        const hasLink = /\<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']styles\.css["']/i.test(code);
        const logs = [
          "Validating head elements...",
          `Assert: <meta charset="UTF-8"> -> ${hasCharset ? "PASSED" : "FAILED"}`,
          `Assert: Viewport meta tag -> ${hasViewport ? "PASSED" : "FAILED"}`,
          `Assert: Description meta tag -> ${hasDescription ? "PASSED" : "FAILED"}`,
          `Assert: <title>LearnCode Academy</title> -> ${hasTitle ? "PASSED" : "FAILED"}`,
          `Assert: <link rel="stylesheet" href="styles.css"> -> ${hasLink ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasCharset && hasViewport && hasDescription && hasTitle && hasLink, logs };
      }
    }
  },

  "html-entities": {
    title: "HTML Entities & Special Characters",
    content: [
      "HTML entities are used to display reserved characters and special symbols that cannot be typed directly into HTML code. Since characters like <, >, and & have special meaning in HTML syntax, they must be represented using entity codes to display them as text.",
      "There are two formats for HTML entities: named entities (like &lt; for <, &gt; for >, &amp; for &) and numeric entities (like &#60; for <, &#62; for >). Named entities are more readable, while numeric entities can represent any Unicode character.",
      "Common entities you will use frequently include: &copy; (©) for copyright symbols, &reg; (®) for registered trademarks, &trade; (™) for trademarks, &nbsp; for non-breaking spaces (prevents text from wrapping at that point), and &quot; for quotation marks inside attributes.",
      "Using entities correctly is essential for writing valid HTML. If you write raw < or > inside a paragraph, the browser may interpret them as tag delimiters and break your page layout. Always use &lt; and &gt; when you want to display these characters as text."
    ],
    quiz: [
      {
        question: "Which HTML entity displays the less-than symbol (<)?",
        options: ["&less;", "&lt;", "&lte;", "&<;"],
        correctOption: 1,
        explanation: "&lt; (less than) is the named entity for the < character."
      },
      {
        question: "What does the &nbsp; entity represent?",
        options: ["A new line break", "A non-breaking space", "A bold space", "A tab character"],
        correctOption: 1,
        explanation: "&nbsp; creates a non-breaking space that prevents text wrapping at that position."
      },
      {
        question: "Why must you use &amp; instead of typing & directly in HTML?",
        options: ["The & character is deprecated in HTML5", "The browser renders & as a line break", "The & character starts entity codes, so bare & can cause parsing errors", "There is no difference, both work the same"],
        correctOption: 2,
        explanation: "The & character is the start of all HTML entities, so bare & can be misinterpreted as the beginning of an entity reference."
      }
    ],
    task: {
      description: "Create a <p> tag containing the text '5 &lt; 10 &amp; 10 &gt; 5' and a second <p> tag containing '&copy; 2026 LearnCode Academy' using proper HTML entities.",
      starterCode: `<!-- Use HTML entities for special characters -->\n`,
      language: "html",
      expectedOutput: "<p>5 &lt; 10 &amp; 10 &gt; 5</p>\n<p>&copy; 2026 LearnCode Academy</p>",
      expectedOutputDisplay: "1. First <p> displaying: 5 < 10 & 10 > 5 (using &lt; &amp; &gt; entities).\n2. Second <p> displaying: © 2026 LearnCode Academy (using &copy; entity).",
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, " ").trim().toLowerCase();
        const cleanCode = clean(code);
        const hasLt = cleanCode.includes("&lt;");
        const hasGt = cleanCode.includes("&gt;");
        const hasAmp = cleanCode.includes("&amp;");
        const hasCopy = cleanCode.includes("&copy;");
        const hasP1 = /\<p\>[^<]*&lt;[^<]*&amp;[^<]*&gt;[^<]*\<\/p\>/i.test(code);
        const hasP2 = /\<p\>[^<]*&copy;[^<]*learncode academy[^<]*\<\/p\>/i.test(code);
        const logs = [
          "Checking HTML entity usage...",
          `Assert: &lt; entity used -> ${hasLt ? "PASSED" : "FAILED"}`,
          `Assert: &gt; entity used -> ${hasGt ? "PASSED" : "FAILED"}`,
          `Assert: &amp; entity used -> ${hasAmp ? "PASSED" : "FAILED"}`,
          `Assert: &copy; entity used -> ${hasCopy ? "PASSED" : "FAILED"}`,
          `Assert: First <p> with comparison entities -> ${hasP1 ? "PASSED" : "FAILED"}`,
          `Assert: Second <p> with copyright entity -> ${hasP2 ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasLt && hasGt && hasAmp && hasCopy && hasP1 && hasP2, logs };
      }
    }
  },

  "html-iframes": {
    title: "Iframes & Embedding Content",
    content: [
      "The <iframe> (Inline Frame) element allows you to embed another HTML document or external webpage inside your current page. This is commonly used to embed YouTube videos, Google Maps, social media posts, and third-party widgets.",
      "An iframe requires the src attribute to specify the URL of the content to embed. You can also set width and height attributes to control its dimensions. The title attribute is required for accessibility, as screen readers use it to describe the embedded content.",
      "For security, the sandbox attribute restricts what the embedded content can do. Values like 'allow-scripts' and 'allow-same-origin' control permissions individually. The loading=\"lazy\" attribute defers loading of offscreen iframes to improve page performance.",
      "While iframes are powerful, they should be used judiciously. Excessive iframes can slow down page loading, and embedding untrusted content can pose security risks. Always validate the source URL and use the sandbox attribute when embedding third-party content."
    ],
    quiz: [
      {
        question: "Which attribute specifies the URL of content to embed in an iframe?",
        options: ["href", "link", "src", "url"],
        correctOption: 2,
        explanation: "The src attribute specifies the URL of the document to display inside the iframe."
      },
      {
        question: "Why is the title attribute important on an <iframe>?",
        options: ["It styles the iframe border", "It provides a description for screen readers and accessibility", "It sets the iframe loading priority", "It defines the iframe ID"],
        correctOption: 1,
        explanation: "The title attribute gives screen readers a description of the embedded content for accessibility."
      },
      {
        question: "What does the sandbox attribute do on an iframe?",
        options: ["Adds a visual border around the iframe", "Restricts the capabilities of the embedded content for security", "Enables fullscreen mode", "Auto-resizes the iframe to fit content"],
        correctOption: 1,
        explanation: "The sandbox attribute applies extra restrictions to the content in the iframe, limiting actions like script execution and form submission."
      }
    ],
    task: {
      description: "Create an <iframe> that embeds 'https://www.example.com' with a width of 600, height of 400, a title of 'Example Website', and loading set to 'lazy'.",
      starterCode: `<!-- Create an iframe to embed external content -->\n`,
      language: "html",
      expectedOutput: "<iframe src=\"https://www.example.com\" width=\"600\" height=\"400\" title=\"Example Website\" loading=\"lazy\"></iframe>",
      expectedOutputDisplay: "1. <iframe> element with src pointing to example.com.\n2. Width set to 600 and height set to 400.\n3. Accessible title \"Example Website\".\n4. Lazy loading enabled for performance.",
      validate: (code: string) => {
        const hasSrc = /\<iframe\b[^>]*src=["']https:\/\/www\.example\.com["']/i.test(code);
        const hasWidth = /\<iframe\b[^>]*width=["']600["']/i.test(code);
        const hasHeight = /\<iframe\b[^>]*height=["']400["']/i.test(code);
        const hasTitle = /\<iframe\b[^>]*title=["']Example Website["']/i.test(code);
        const hasLazy = /\<iframe\b[^>]*loading=["']lazy["']/i.test(code);
        const logs = [
          "Validating iframe configuration...",
          `Assert: src="https://www.example.com" -> ${hasSrc ? "PASSED" : "FAILED"}`,
          `Assert: width="600" -> ${hasWidth ? "PASSED" : "FAILED"}`,
          `Assert: height="400" -> ${hasHeight ? "PASSED" : "FAILED"}`,
          `Assert: title="Example Website" -> ${hasTitle ? "PASSED" : "FAILED"}`,
          `Assert: loading="lazy" -> ${hasLazy ? "PASSED" : "FAILED"}`
        ];
        return { isPassed: hasSrc && hasWidth && hasHeight && hasTitle && hasLazy, logs };
      }
    }
  },

  "html5-apis": {
    title: "HTML5 APIs (Storage & Drag/Drop)",
    content: [
      "HTML5 introduced powerful JavaScript APIs that extend the capabilities of web pages beyond simple content display. These APIs allow you to store data locally, detect user location, implement drag-and-drop interfaces, and much more — all without plugins.",
      "The Web Storage API provides two mechanisms: localStorage and sessionStorage. localStorage persists data even after the browser is closed, while sessionStorage only lasts for the current browser tab session. Both use simple key-value pairs with setItem(), getItem(), and removeItem() methods.",
      "The Drag and Drop API enables users to grab elements and move them around the page. It uses events like dragstart, dragover, and drop on HTML elements. To make an element draggable, you add the draggable=\"true\" attribute. The dataTransfer object passes data between the drag source and drop target.",
      "The Geolocation API (navigator.geolocation) allows web apps to request the user's physical location (with permission). Combined with localStorage for caching preferences and drag-and-drop for interactive UIs, these APIs transform static HTML pages into dynamic web applications."
    ],
    quiz: [
      {
        question: "What is the difference between localStorage and sessionStorage?",
        options: ["localStorage is faster", "sessionStorage persists after closing the browser", "localStorage persists after closing the browser, sessionStorage does not", "They are identical"],
        correctOption: 2,
        explanation: "localStorage data persists indefinitely until explicitly cleared, while sessionStorage is cleared when the browser tab is closed."
      },
      {
        question: "Which attribute makes an HTML element draggable?",
        options: ["movable=\"true\"", "draggable=\"true\"", "drag=\"enabled\"", "ondrag=\"true\""],
        correctOption: 1,
        explanation: "The draggable=\"true\" attribute enables native drag-and-drop behavior on any HTML element."
      },
      {
        question: "Which method stores a value in localStorage?",
        options: ["localStorage.save()", "localStorage.setItem()", "localStorage.put()", "localStorage.store()"],
        correctOption: 1,
        explanation: "localStorage.setItem(key, value) stores a key-value pair in the browser's local storage."
      }
    ],
    task: {
      description: "Write a JavaScript function saveTheme(theme) that stores the given theme value in localStorage under the key 'userTheme', and a function getTheme() that retrieves and returns it.",
      starterCode: `function saveTheme(theme) {\n  // Store theme in localStorage\n}\n\nfunction getTheme() {\n  // Retrieve theme from localStorage\n}`,
      language: "javascript",
      expectedOutput: "saveTheme('dark') -> localStorage['userTheme'] = 'dark'\ngetTheme() -> 'dark'",
      expectedOutputDisplay: "1. Function saveTheme(theme) stores the value using localStorage.setItem().\n2. Function getTheme() returns the value using localStorage.getItem().\n3. Both use the key 'userTheme'.",
      validate: (code: string) => {
        const logs = ["Evaluating localStorage API usage..."];
        const hasSave = /localStorage\.setItem\s*\(\s*["']userTheme["']/i.test(code);
        const hasGet = /localStorage\.getItem\s*\(\s*["']userTheme["']/i.test(code);
        const hasSaveFn = /function\s+saveTheme\s*\(/i.test(code);
        const hasGetFn = /function\s+getTheme\s*\(/i.test(code);
        const hasReturn = /return\s+localStorage\.getItem/i.test(code);
        
        logs.push(`Assert: saveTheme function declared -> ${hasSaveFn ? "PASSED" : "FAILED"}`);
        logs.push(`Assert: localStorage.setItem('userTheme', ...) used -> ${hasSave ? "PASSED" : "FAILED"}`);
        logs.push(`Assert: getTheme function declared -> ${hasGetFn ? "PASSED" : "FAILED"}`);
        logs.push(`Assert: localStorage.getItem('userTheme') used -> ${hasGet ? "PASSED" : "FAILED"}`);
        logs.push(`Assert: getTheme returns the value -> ${hasReturn ? "PASSED" : "FAILED"}`);
        
        return { isPassed: hasSave && hasGet && hasSaveFn && hasGetFn && hasReturn, logs };
      }
    }
  }
};
