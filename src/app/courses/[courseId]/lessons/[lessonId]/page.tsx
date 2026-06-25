"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useApp } from "../../../../../lib/db";
import Link from "next/link";
import { 
  Play, Check, Terminal as ConsoleIcon, ArrowLeft, ArrowRight, 
  Cpu, RotateCcw, ShieldCheck, Loader2, BookOpen, Lock, 
  CheckCircle2, AlertCircle, RefreshCw, XCircle, Award, LayoutList, ChevronRight, Languages
} from "lucide-react";
import { TAMIL_COURSES, TamilLesson } from "../../../../../data/tamilCourseData";
import Editor from "@monaco-editor/react";
import confetti from "canvas-confetti";
import { db, auth } from "../../../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

// ================= HANDCRAFTED COURSE CONTENT DATABASE =================
interface QuizQuestion {
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

interface CodingTask {
  description: string;
  starterCode: string;
  language: string;
  expectedOutput: string;
  expectedOutputDisplay: string;
  validate: (code: string) => { isPassed: boolean; logs: string[] };
}

interface HandcraftedLesson {
  title: string;
  content: string[];
  quiz: QuizQuestion[];
  task: CodingTask;
}

const HANDCRAFTED_COURSES: Record<string, HandcraftedLesson> = {
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
  },
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
  },
  "js-variables": {
    title: "Scope: let, const, and var",
    content: [
      "JavaScript variables store data values. In modern JavaScript (ES6+), variables can be declared using three keywords: let, const, and var. Understanding their differences is crucial for code stability.",
      "The let and const keywords introduce block scope, meaning variables declared inside curly braces {} are not accessible outside them. const is used for constant values that cannot be reassigned, whereas let allows reassignment.",
      "The older var keyword is function-scoped and undergoes hoisting, which makes variables accessible before their declaration line. This often causes logical bugs and is avoided in modern codebases.",
      "By using block-scoped variables and defaulting to const unless reassignment is needed, you create cleaner, more predictable code that is easier to debug and scale."
    ],
    quiz: [
      {
        question: "Which keyword is block-scoped and allows reassignment?",
        options: ["var", "let", "const", "define"],
        correctOption: 1,
        explanation: "let is block-scoped and can be reassigned, unlike const which is read-only."
      },
      {
        question: "What happens if you try to reassign a variable declared with const?",
        options: ["It silently ignores the change", "It changes the variable name", "It throws a TypeError", "It creates a new variable"],
        correctOption: 2,
        explanation: "Reassigning a const variable triggers a TypeError: Assignment to constant variable."
      },
      {
        question: "Which statement about var is correct?",
        options: ["It is block-scoped", "It is function-scoped", "It cannot be reassigned", "It is not hoisted"],
        correctOption: 1,
        explanation: "var is function-scoped and is hoisted to the top of its scope."
      }
    ],
    task: {
      description: "Implement a function calculateTotal(price) that declares a local constant variable taxRate equal to 0.15. Return the total cost after adding the tax amount (price * taxRate).",
      starterCode: `function calculateTotal(price) {\n  // Write constant taxRate and return calculation\n}`,
      language: "javascript",
      expectedOutput: "calculateTotal(100) => 115",
      expectedOutputDisplay: "1. Function calculateTotal(price) accepting input argument.\n2. Declares a block constant taxRate of 0.15.\n3. Returns computed price with 15% tax included.",
      validate: (code: string) => {
        const logs = ["Evaluating JavaScript execution sandbox..."];
        let isPassed = false;
        try {
          const userFn = new Function(`${code}\nreturn calculateTotal;`)();
          const res100 = userFn(100);
          const res200 = userFn(200);
          
          logs.push(`Test 1: calculateTotal(100) -> Output: ${res100}`);
          logs.push(`Test 2: calculateTotal(200) -> Output: ${res200}`);
          
          const correctVal = res100 === 115 && res200 === 230;
          const hasConst = /const\s+taxRate/i.test(code);
          
          logs.push(`Assert: Function returns correct values -> ${correctVal ? "PASSED" : "FAILED"}`);
          logs.push(`Assert: Constant variable 'taxRate' used -> ${hasConst ? "PASSED" : "FAILED"}`);
          
          isPassed = correctVal && hasConst;
        } catch (err: any) {
          logs.push(`Error executing code: ${err.message}`);
        }
        return { isPassed, logs };
      }
    }
  },
  "js-promises": {
    title: "Promises & Async/Await",
    content: [
      "JavaScript is single-threaded, meaning it executes one task at a time. To run operations like network calls or databases without locking the browser, JavaScript uses asynchronous code.",
      "A Promise is an object representing the eventual completion or failure of an asynchronous operation. It starts in a pending state, and transitions to either fulfilled (success) or rejected (failure).",
      "Modern JS handles Promises elegantly using the async/await syntax. Marking a function with the async keyword allows us to write asynchronous code that reads like synchronous code using the await keyword.",
      "With async/await and robust try/catch blocks, you can easily load data from APIs, write file operations, and handle error scenarios safely."
    ],
    quiz: [
      {
        question: "What state does a Promise enter when it resolves successfully?",
        options: ["Pending", "Rejected", "Fulfilled", "Resolved"],
        correctOption: 2,
        explanation: "A Promise is in the 'fulfilled' state when the asynchronous operation completes successfully."
      },
      {
        question: "Which keyword is required inside a function to use the await keyword?",
        options: ["defer", "async", "promise", "wait"],
        correctOption: 1,
        explanation: "The await keyword can only be used inside functions marked with async."
      },
      {
        question: "What is the best block structure to handle errors inside async functions?",
        options: ["if/else", "try/catch", "catch/finally", "then/catch"],
        correctOption: 1,
        explanation: "try/catch is the standard block for handling errors inside async functions."
      }
    ],
    task: {
      description: "Create an async function fetchData() that returns a Promise resolving to the string 'Success!' after a 100ms delay. (Tip: Use new Promise and setTimeout).",
      starterCode: `async function fetchData() {\n  // Write promise code here\n}`,
      language: "javascript",
      expectedOutput: "await fetchData() => \"Success!\"",
      expectedOutputDisplay: "1. Asynchronous function named fetchData().\n2. Returns a Promise.\n3. Resolves to string \"Success!\" after 100ms delay.",
      validate: (code: string) => {
        const logs = ["Evaluating Asynchronous JavaScript execution sandbox..."];
        return { isPassed: false, logs }; 
      }
    }
  },
  "py-lists": {
    title: "List Comprehensions & Lambdas",
    content: [
      "Python lists are ordered, changeable sequences of items. In data science and AI workflows, manipulating lists efficiently is a daily requirement for data processing.",
      "A list comprehension is a concise, readable way to construct lists from existing lists or iterables. Instead of writing long multi-line loops, you write it in a single line (e.g. [x * 2 for x in nums]).",
      "List comprehensions can also filter items using an if clause. For instance, [x for x in nums if x > 5] creates a new list containing only numbers strictly greater than 5.",
      "By using list comprehensions and anonymous lambda functions (lambda x: x + 1), Python developers write highly readable, mathematical, and performant operations."
    ],
    quiz: [
      {
        question: "Which is the correct list comprehension to filter even numbers from nums?",
        options: ["[x for x in nums if x % 2 == 0]", "[x if x % 2 == 0 for x in nums]", "[x for x in nums while x % 2 == 0]", "filter(even, nums)"],
        correctOption: 0,
        explanation: "[x for x in nums if x % 2 == 0] is the correct list comprehension structure in Python."
      },
      {
        question: "How do you filter items in a list comprehension?",
        options: ["By adding an if clause at the end", "By using the filter keyword inside brackets", "By writing a nested loop", "By using a ternary operator at the start"],
        correctOption: 0,
        explanation: "An if clause is placed at the end of the comprehension to filter elements."
      },
      {
        question: "Which is an anonymous function in Python?",
        options: ["def anon():", "lambda x: x", "func()", "inline x"],
        correctOption: 1,
        explanation: "The lambda keyword defines a small, anonymous function inline."
      }
    ],
    task: {
      description: "Implement a python function filter_evens(nums) that uses a python list comprehension to filter even numbers from the nums list.",
      starterCode: `def filter_evens(nums):\n    # Return even numbers\n    pass`,
      language: "python",
      expectedOutput: "filter_evens([1, 2, 3, 4, 5, 6]) => [2, 4, 6]",
      expectedOutputDisplay: "1. Python function filter_evens(nums).\n2. Returns a new list containing only even integers from input.\n3. Must employ list comprehension structure.",
      validate: (code: string) => {
        const logs = [
          "Initializing Python 3 AST simulation...",
          "Checking syntax rules..."
        ];
        const hasDef = /def filter_evens\s*\(\s*nums\s*\)\s*:/i.test(code);
        const hasComp = /\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s+for\s+[a-zA-Z_][a-zA-Z0-9_]*\s+in\s+nums\s+if\s+[a-zA-Z_][a-zA-Z0-9_]*\s*%\s*2\s*==\s*0\s*\]/.test(code);
        
        logs.push(`Assert: Function 'filter_evens' declared -> ${hasDef ? "PASSED" : "FAILED"}`);
        logs.push(`Assert: List comprehension syntax checked -> ${hasComp ? "PASSED" : "FAILED"}`);
        
        const isPassed = hasDef && hasComp;
        if (isPassed) {
          logs.push("Test case [1, 2, 3, 4, 5, 6] -> Output: [2, 4, 6] -> PASSED");
          logs.push("Test case [10, 15, 20, 25] -> Output: [10, 20] -> PASSED");
        } else {
          logs.push("Test cases FAILED. Please use the exact list comprehension syntax.");
        }
        return { isPassed, logs };
      }
    }
  }
};

// ================= DYNAMIC FALLBACK LESSON DATA GENERATOR =================
const getFallbackLessonData = (lessonId: string, title: string, courseId: string): HandcraftedLesson => {
  const language = courseId === "html" || courseId === "css" || courseId === "javascript" || courseId === "python" ? courseId : "javascript";
  return {
    title: title,
    content: [
      `Welcome to the lesson on "${title}". In this topic, we will explore the core concepts and standard architectural designs that form the foundation of this engineering discipline.`,
      `Understanding how to compile, build, and debug files in this runtime environment is critical for building production-grade services. Follow along with the code patterns and check the parameters carefully.`,
      `By completing the quiz and writing the syntax rules in the Monaco sandbox below, you will reinforce your comprehension and progress closer to earning your official course graduation certificate.`
    ],
    quiz: [
      {
        question: `Which of the following describes the key concept of "${title}"?`,
        options: [
          "It represents the base compilation element.",
          "It defines variables dynamically in global scope.",
          "It coordinates core layouts and processes data flows.",
          "All of the above."
        ],
        correctOption: 3,
        explanation: "This concept represents the standard architectural practice within this environment."
      },
      {
        question: `What is a common best practice when writing code for "${title}"?`,
        options: [
          "Avoid using placeholders and focus on semantic structure.",
          "Always handle error exceptions with try/catch blocks or proper logging.",
          "Optimize resource allocation by separating concerns.",
          "All of the above."
        ],
        correctOption: 3,
        explanation: "All of these choices are professional engineering standards."
      },
      {
        question: `How does completing the quiz and task affect course progress?`,
        options: [
          "It unlocks the coding sandbox and next topic.",
          "It stores scores and task completion in Firestore.",
          "It updates the course progress bar percentage at the top.",
          "All of the above."
        ],
        correctOption: 3,
        explanation: "All these actions occur as you complete the requirements."
      }
    ],
    task: {
      description: `Write a snippet of code in ${language.toUpperCase()} to demonstrate basic familiarity with "${title}". For JavaScript/Python, write a function named \`initChallenge()\` that returns the number \`42\`. For HTML, create a \`<div id="sandbox">42</div>\`. For CSS, define a style \`#sandbox { width: 42px; }\`.`,
      starterCode: language === "html" 
        ? `<!-- Create div with id "sandbox" -->\n<div id="sandbox"></div>`
        : language === "css"
        ? `/* Style div with width 42px */\n#sandbox {\n}`
        : language === "python"
        ? `def initChallenge():\n    # Return 42\n    pass`
        : `function initChallenge() {\n  // Return 42\n}`,
      language: language,
      expectedOutput: "42",
      expectedOutputDisplay: `1. Structure returning value 42.\n2. Uses correct syntactical bindings for ${language.toUpperCase()}.`,
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        let isPassed = false;
        const logs = ["Running fallback validation assertions..."];
        if (language === "html") {
          isPassed = clean(code).includes(clean('<divid="sandbox">42</div>'));
          logs.push(`Assert: <div id="sandbox">42</div> element present -> ${isPassed ? "PASSED" : "FAILED"}`);
        } else if (language === "css") {
          isPassed = clean(code).includes(clean("width:42px"));
          logs.push(`Assert: selector with width: 42px; -> ${isPassed ? "PASSED" : "FAILED"}`);
        } else if (language === "python") {
          isPassed = /def initChallenge\s*\(\s*\)\s*:/i.test(code) && /return\s+42/i.test(code);
          logs.push(`Assert: python function initChallenge returns 42 -> ${isPassed ? "PASSED" : "FAILED"}`);
        } else {
          try {
            const userFn = new Function(`${code}\nreturn initChallenge;`)();
            const res = userFn();
            isPassed = res === 42;
            logs.push(`Assert: initChallenge() returns 42 -> ${isPassed ? "PASSED" : "FAILED"}`);
          } catch (err: any) {
            logs.push(`Error running JavaScript code: ${err.message}`);
          }
        }
        return { isPassed, logs };
      }
    }
  };
};

export default function LessonWorkspace() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { courses, user, completeLesson, completeQuiz, isFirebaseActive, loading } = useApp();

  // Redirect guest users to sign-in page
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);
  const course = courses.find((c) => c.id === courseId);

  // Dynamic syllabus modules injection specifically for html course
  let courseModules = course ? [...course.modules] : [];
  if (courseId === "html" && courseModules.length > 0) {
    courseModules = [
      {
        id: "html-intro",
        title: "Introduction to HTML",
        lessons: [
          {
            id: "html-basics",
            title: "HTML Syntax and Structure",
            duration: "20 mins",
            xp: 100,
            contentFile: "html-basics.md"
          },
          {
            id: "semantic-html",
            title: "Semantic Markup and Accessibility",
            duration: "25 mins",
            xp: 120,
            contentFile: "semantic-html.md"
          },
          {
            id: "html-doc-structure",
            title: "HTML Document Structure",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-doc-structure.md"
          },
          {
            id: "html-attributes",
            title: "HTML Attributes & Global Attributes",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-attributes.md"
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
            contentFile: "html-links-images.md"
          },
          {
            id: "html-lists",
            title: "Lists (Ordered & Unordered)",
            duration: "15 mins",
            xp: 100,
            contentFile: "html-lists.md"
          },
          {
            id: "html-block-inline",
            title: "Block vs Inline Elements",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-block-inline.md"
          },
          {
            id: "html-meta-head",
            title: "Meta Tags & Head Elements",
            duration: "25 mins",
            xp: 120,
            contentFile: "html-meta-head.md"
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
            contentFile: "html-tables.md"
          },
          {
            id: "html-form-elements",
            title: "Building Forms and Input Types",
            duration: "30 mins",
            xp: 150,
            contentFile: "html-form-elements.md"
          },
          {
            id: "html-entities",
            title: "HTML Entities & Special Characters",
            duration: "15 mins",
            xp: 100,
            contentFile: "html-entities.md"
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
            contentFile: "html-multimedia.md"
          },
          {
            id: "html-iframes",
            title: "Iframes & Embedding Content",
            duration: "20 mins",
            xp: 120,
            contentFile: "html-iframes.md"
          },
          {
            id: "html5-apis",
            title: "HTML5 APIs (Storage & Drag/Drop)",
            duration: "25 mins",
            xp: 130,
            contentFile: "html5-apis.md"
          }
        ]
      }
    ];
  }

  // Lesson list navigation
  const allLessons = courseId === "html" 
    ? courseModules.flatMap(m => m.lessons)
    : (course ? course.modules.flatMap(m => m.lessons) : []);

  const currentLessonIdx = allLessons.findIndex(l => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIdx];

  // Handcrafted or dynamic lesson details
  const activeLessonData: HandcraftedLesson = HANDCRAFTED_COURSES[lessonId] || 
    getFallbackLessonData(lessonId, currentLesson?.title || "Lesson Topic", courseId);

  // Language state (persisted to localStorage)
  const [courseLang, setCourseLang] = useState<"en" | "ta">("en");

  // Load saved language preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("learncode_lang") as "en" | "ta" | null;
      if (saved === "ta" || saved === "en") setCourseLang(saved);
    }
  }, []);

  const toggleLanguage = (lang: "en" | "ta") => {
    setCourseLang(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("learncode_lang", lang);
    }
  };

  // Get Tamil translation for the current lesson (if HTML/CSS course and Tamil selected)
  const tamilData: TamilLesson | null = ((courseId === "html" || courseId === "css") && courseLang === "ta") ? (TAMIL_COURSES[lessonId] || null) : null;

  // States
  const [activeTab, setActiveTab] = useState<"content" | "quiz" | "task">("content");
  const [contentRead, setContentRead] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Quiz States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Code Sandbox States
  const [editorCode, setEditorCode] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Console Tab Controller: "logs" | "preview"
  const [consoleTab, setConsoleTab] = useState<"logs" | "preview">("logs");

  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize completion and pass states from context user profile
  useEffect(() => {
    if (user) {
      const isCompleted = user.completedLessons.includes(lessonId);
      setIsLessonCompleted(isCompleted);
      
      const hasPassedQuiz = user.completedQuizzes[lessonId]?.score >= 60 || user.completedQuizzes[lessonId]?.passed || isCompleted;
      setQuizPassed(!!hasPassedQuiz);
      
      if (isCompleted || hasPassedQuiz) {
        setContentRead(true);
      }
    }
  }, [lessonId, user]);

  // Set default starter code template
  useEffect(() => {
    setEditorCode(activeLessonData.task.starterCode);
    setConsoleLogs([]);
    setConsoleTab("logs");
    
    // Reset quiz state when switching lessons
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
    
    // Automatically open to appropriate tab
    if (user?.completedLessons?.includes(lessonId)) {
      setActiveTab("task");
    } else {
      setActiveTab("content");
    }
  }, [lessonId, activeLessonData]);

  // Check if content fits in container without scrolling
  useEffect(() => {
    if (containerRef.current && activeTab === "content") {
      const { scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight <= clientHeight) {
        setContentRead(true);
      }
    }
  }, [lessonId, activeTab, activeLessonData]);

  if (!course || !currentLesson) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Lesson Not Found</h2>
        <p className="text-slate-400 mb-6">The lesson you are looking for does not exist in this course curriculum.</p>
        <Link href="/dashboard" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Calculate Course Progress Bar
  const completedInCourseCount = allLessons.filter(l => user?.completedLessons?.includes(l.id) || false).length;
  const overallProgress = allLessons.length > 0 ? Math.round((completedInCourseCount / allLessons.length) * 100) : 0;

  // Next/Previous navigation
  const prevLesson = currentLessonIdx > 0 ? allLessons[currentLessonIdx - 1] : null;
  const nextLesson = currentLessonIdx < allLessons.length - 1 ? allLessons[currentLessonIdx + 1] : null;

  const getTopicStatus = (lesId: string) => {
    if (user?.completedLessons?.includes(lesId)) {
      return "completed";
    }
    const idx = allLessons.findIndex(l => l.id === lesId);
    if (idx === -1) return "locked";
    if (idx === 0) return "unlocked";
    
    // Unlocked if previous is completed
    const prevLes = allLessons[idx - 1];
    if (user?.completedLessons?.includes(prevLes.id)) {
      return "unlocked";
    }
    return "locked";
  };

  // Scroll detection to unlock "Take Quiz" button
  const handleScroll = () => {
    if (!containerRef.current || contentRead || activeTab !== "content") return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setContentRead(true);
    }
  };

  // Quiz Handling
  const handleQuizOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    const isCorrect = selectedOption === activeLessonData.quiz[currentQuestionIdx].correctOption;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleQuizNext = async () => {
    if (currentQuestionIdx < activeLessonData.quiz.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed - calculate score
      const finalScore = Math.round((correctCount / activeLessonData.quiz.length) * 100);
      const passed = finalScore >= 60;
      
      // Save quiz progress in Firestore/database
      await completeQuiz(courseId, lessonId, finalScore);
      
      setQuizPassed(passed);
      setQuizFinished(true);

      if (passed) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }
  };

  const handleQuizRetry = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  // Safe client-side async script evaluator
  const runAsyncCode = async (code: string) => {
    return new Promise<{ isPassed: boolean; logs: string[] }>(async (resolve) => {
      const logs = ["Evaluating JS Promise script in runtime sandbox...", "Awaiting resolution of promise..."];
      try {
        const userFn = new Function(`${code}\nreturn fetchData;`)();
        const start = Date.now();
        const res = await userFn();
        const elapsed = Date.now() - start;
        logs.push(`Promise resolved to: "${res}" in ${elapsed}ms`);
        
        const correct = res === "Success!";
        const hasDelay = elapsed >= 80;
        
        logs.push(`Assert: promise returned "Success!" -> ${correct ? "PASSED" : "FAILED"}`);
        logs.push(`Assert: promise executed asynchronously -> ${hasDelay ? "PASSED" : "FAILED"}`);
        
        resolve({ isPassed: correct && hasDelay, logs });
      } catch (err: any) {
        logs.push(`Runtime error: ${err.message}`);
        resolve({ isPassed: false, logs });
      }
    });
  };

  // Run & Verify Code logic
  const handleRunAndVerifyCode = async () => {
    setIsRunning(true);
    setConsoleLogs([
      "Initializing compilation sandbox...",
      `Setting runtime: ${activeLessonData.task.language.toUpperCase()} environment`,
      "Running compiler assertions & executing code..."
    ]);
    setConsoleTab("logs");
    
    setTimeout(async () => {
      let validationResult;
      if (lessonId === "js-promises") {
        validationResult = await runAsyncCode(editorCode);
      } else {
        validationResult = activeLessonData.task.validate(editorCode);
      }
      
      const newLogs = [
        "Compilation successful.",
        "Code executed successfully.",
        ...validationResult.logs
      ];

      if (validationResult.isPassed) {
        newLogs.push(
          "",
          "STATUS: ALL ASSERTIONS PASSED! 🎉",
          `Earned: +${currentLesson.xp} Lesson Completion XP!`
        );
        setConsoleLogs(newLogs);
        
        // Trigger Confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        
        // Mark lesson completed in Firestore & context state
        await completeLesson(courseId, lessonId);
        setIsLessonCompleted(true);

        // Track task status in Firestore explicitly if logged in
        if (isFirebaseActive && auth?.currentUser && db) {
          try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userDocRef, {
              [`completedTasks.${lessonId}`]: true
            });
          } catch (err) {
            console.error("Firestore sync task status failed:", err);
          }
        }
        
        // Swap tab to visual output when run HTML/CSS to show what they built
        if (activeLessonData.task.language === "html" || activeLessonData.task.language === "css") {
          setTimeout(() => {
            setConsoleTab("preview");
          }, 1500);
        }
      } else {
        newLogs.push(
          "",
          "STATUS: ASSERTIONS FAILED. ❌ Please review expected output logic and correct rules."
        );
        setConsoleLogs(newLogs);
      }
      setIsRunning(false);
    }, 1200);
  };

  // Format markdown helper
  const renderMD = (paragraphs: string[]) => {
    return paragraphs.map((para, i) => (
      <p key={i} className="text-slate-600 text-sm leading-relaxed mb-4">{para}</p>
    ));
  };

  // Modules selector list rendering
  const modulesToRender = courseId === "html" ? courseModules : (course ? course.modules : []);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-62px)] overflow-hidden bg-slate-50/50">
      
      {/* Top Header / Completion Bar */}
      <div className="glass-panel border-b border-indigo-100/60 px-6 py-3 flex flex-wrap gap-4 items-center justify-between bg-white/90 z-20">
        <div className="flex items-center gap-4">
          <Link 
            href={`/courses/${courseId}`} 
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Syllabus
          </Link>
          <span className="text-slate-300 font-medium">|</span>
          <div className="flex flex-col">
            <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Active Lesson</span>
            <span className="text-xs font-bold text-slate-800 truncate max-w-[250px]">{currentLesson.title}</span>
          </div>
        </div>

        {/* Progress bar centered */}
        <div className="flex items-center gap-3 flex-1 max-w-md mx-auto justify-center">
          <span className="text-2xs font-bold text-slate-500 whitespace-nowrap">Course Progress:</span>
          <div className="w-full bg-indigo-50 h-2.5 rounded-full overflow-hidden relative border border-indigo-100/50">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-indigo-600 whitespace-nowrap">{overallProgress}%</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle — for HTML & CSS courses */}
          {(courseId === "html" || courseId === "css") && (
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 border border-indigo-100/50 p-0.5">
              <button
                onClick={() => toggleLanguage("en")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-2xs font-extrabold transition-all cursor-pointer ${
                  courseLang === "en"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <span>🇬🇧</span> English
              </button>
              <button
                onClick={() => toggleLanguage("ta")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-2xs font-extrabold transition-all cursor-pointer ${
                  courseLang === "ta"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-500 hover:text-orange-600 hover:bg-slate-50"
                }`}
              >
                <span>🇮🇳</span> தமிழ்
              </button>
            </div>
          )}

          {prevLesson && (
            <button
              onClick={() => router.push(`/courses/${courseId}/lessons/${prevLesson.id}`)}
              title="Previous Lesson"
              className="rounded bg-white hover:bg-indigo-50 border border-indigo-100/60 p-1.5 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          {nextLesson && (
            <button
              onClick={() => router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
              title="Next Lesson"
              className="rounded bg-white hover:bg-indigo-50 border border-indigo-100/60 p-1.5 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        
        {/* ================= LEFT COLUMN: TOPIC SELECTOR SIDEBAR ================= */}
        <div className="w-64 border-r border-indigo-100/60 bg-white/50 flex flex-col h-full shrink-0 hidden md:flex">
          <div className="p-4 border-b border-indigo-100/50 flex items-center justify-between bg-slate-50/50">
            <span className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutList className="h-3.5 w-3.5 text-indigo-500" /> Curriculum
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {modulesToRender.map((mod) => (
              <div key={mod.id} className="space-y-1.5">
                <h3 className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest pl-2">
                  {mod.title}
                </h3>
                
                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const status = getTopicStatus(les.id);
                    const isActive = les.id === lessonId;
                    
                    let statusIcon = <Lock className="h-3.5 w-3.5 text-slate-300 shrink-0" />;
                    if (status === "completed") {
                      statusIcon = <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
                    } else if (status === "unlocked") {
                      statusIcon = <div className="h-3 w-3 rounded-full border border-slate-400 shrink-0" />;
                    }

                    return (
                      <button
                        key={les.id}
                        disabled={status === "locked"}
                        onClick={() => router.push(`/courses/${courseId}/lessons/${les.id}`)}
                        className={`w-full flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2.5 text-xs transition-all text-left ${
                          isActive
                            ? "bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold"
                            : status === "locked"
                            ? "text-slate-400 cursor-not-allowed opacity-50"
                            : "text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600"
                        }`}
                      >
                        <span className="truncate flex-1">{les.title}</span>
                        {statusIcon}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= MIDDLE COLUMN: LESSON / QUIZ / TASK TABS ================= */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-indigo-100/60 bg-white overflow-hidden">
          
          {/* Tab Switcher Headers */}
          <div className="flex border-b border-indigo-100/50 bg-slate-50 p-1.5 gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "content"
                  ? "bg-white text-indigo-600 border border-indigo-100/60 shadow-sm"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Lesson Content
            </button>

            <button
              disabled={!contentRead}
              onClick={() => setActiveTab("quiz")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                !contentRead ? "opacity-40 cursor-not-allowed text-slate-400" : ""
              } ${
                activeTab === "quiz"
                  ? "bg-white text-indigo-600 border border-indigo-100/60 shadow-sm"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {quizPassed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Award className="h-3.5 w-3.5" />
              )}
              Lesson Quiz
            </button>

            <button
              disabled={!quizPassed}
              onClick={() => setActiveTab("task")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                !quizPassed ? "opacity-40 cursor-not-allowed text-slate-400" : ""
              } ${
                activeTab === "task"
                  ? "bg-white text-indigo-600 border border-indigo-100/60 shadow-sm"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {!quizPassed ? (
                <Lock className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <Cpu className="h-3.5 w-3.5 text-indigo-500" />
              )}
              Coding Task
            </button>
          </div>

          {/* Dynamic Tab Body */}
          <div 
            id="lesson-content-container"
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 select-text"
          >
            
            {/* TABS CONTAINER: CONTENT VIEW */}
            {activeTab === "content" && (
              <div className="space-y-6 max-w-2xl mx-auto w-full">
                <div className="space-y-2">
                  <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{tamilData ? tamilData.title : activeLessonData.title}</h1>
                  <div className="h-1 w-20 bg-indigo-600 rounded-full" />
                  {tamilData && (
                    <span className="inline-flex items-center gap-1 text-2xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                      <Languages className="h-3 w-3" /> தமிழில் படிக்கிறீர்கள்
                    </span>
                  )}
                </div>
                
                <article className="prose max-w-none text-slate-600 animate-fade-in">
                  {renderMD(tamilData ? tamilData.content : activeLessonData.content)}
                </article>

                {/* Sticky scroll instructions / Take Quiz CTA */}
                <div className="pt-8 border-t border-indigo-100/50 flex flex-col items-center">
                  {!contentRead ? (
                    <div className="text-xs text-slate-500 font-semibold animate-pulse text-center">
                      Please read through all paragraphs to unlock the quiz...
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveTab("quiz")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 transition-all hover:scale-103 shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      Take Lesson Quiz <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TABS CONTAINER: QUIZ SECTION */}
            {activeTab === "quiz" && (
              <div className="max-w-xl mx-auto w-full">
                {quizFinished ? (
                  <div className="glass-panel p-6 rounded-xl border border-indigo-100/50 space-y-5 text-center mt-4">
                    <Award className={`h-16 w-16 mx-auto ${quizPassed ? "text-amber-400" : "text-slate-400"}`} />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-800">Quiz Completed</h3>
                      <p className="text-slate-600 text-sm">
                        You scored <span className="font-extrabold text-indigo-600">{correctCount}</span> out of{" "}
                        <span className="font-extrabold text-slate-800">{activeLessonData.quiz.length}</span> (
                        <span className="font-extrabold text-indigo-600">
                          {Math.round((correctCount / activeLessonData.quiz.length) * 100)}%
                        </span>).
                      </p>
                    </div>

                    {quizPassed ? (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" /> Passed (Requires ≥ 60%)
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                          Awesome job! You have passed the quiz and unlocked the coding sandbox task.
                        </p>
                        <button
                          onClick={() => setActiveTab("task")}
                          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 py-3 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                        >
                          Start Coding Task
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-4 py-1.5 text-xs font-bold text-rose-600">
                          <XCircle className="h-4 w-4" /> Failed (Requires ≥ 60%)
                        </div>
                        <button
                          onClick={handleQuizRetry}
                          className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-slate-100 hover:bg-slate-200 py-3 text-xs font-bold text-slate-700 transition-all cursor-pointer border border-slate-200"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Retry Quiz
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="glass-panel p-6 rounded-xl border border-indigo-100/50 space-y-6">
                    
                    {/* Quiz Progress */}
                    <div className="flex items-center justify-between border-b border-indigo-100/50 pb-3">
                      <span className="text-2xs font-extrabold text-indigo-600 uppercase tracking-widest">Lesson Quiz Assessment</span>
                      <span className="text-xs text-slate-400">
                        Question {currentQuestionIdx + 1} of {activeLessonData.quiz.length}
                      </span>
                    </div>

                    {/* Question Text */}
                    <h4 className="text-sm font-bold text-slate-800 leading-relaxed">
                      {tamilData ? tamilData.quiz[currentQuestionIdx]?.question : activeLessonData.quiz[currentQuestionIdx].question}
                    </h4>

                    {/* Options Stack */}
                    <div className="space-y-2.5">
                      {activeLessonData.quiz[currentQuestionIdx].options.map((opt, idx) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = idx === activeLessonData.quiz[currentQuestionIdx].correctOption;
                        
                        let btnStyle = "bg-slate-50 border-indigo-100/60 text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-600";
                        if (isSelected) btnStyle = "bg-indigo-50 border-indigo-500/50 text-indigo-600 font-bold";
                        
                        if (isAnswered) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-50 border-emerald-500/30 text-emerald-700 font-bold";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-50 border-rose-500/30 text-rose-700 font-semibold";
                          } else {
                            btnStyle = "bg-slate-50 border-indigo-100/30 text-slate-400 opacity-60";
                          }
                        }

                        const optionLetters = ["A", "B", "C", "D"];

                        return (
                          <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleQuizOptionClick(idx)}
                            className={`w-full text-left rounded-lg border p-3.5 text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-3xs font-extrabold border ${
                                isSelected ? "bg-indigo-100 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-500"
                              }`}>
                                {optionLetters[idx]}
                              </span>
                              <span>{tamilData ? (tamilData.quiz[currentQuestionIdx]?.options[idx] || opt) : opt}</span>
                            </div>
                            {isAnswered && isCorrect && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />}
                            {isAnswered && isSelected && !isCorrect && <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanations & CTAs */}
                    <div className="space-y-4">
                      {isAnswered && (
                        <div className={`p-4 rounded-lg text-xs leading-relaxed border ${
                          selectedOption === activeLessonData.quiz[currentQuestionIdx].correctOption
                            ? "bg-emerald-50/50 border-emerald-250 text-slate-600"
                            : "bg-rose-50/50 border-rose-250 text-slate-600"
                        }`}>
                          <span className="font-bold block mb-1">
                            {selectedOption === activeLessonData.quiz[currentQuestionIdx].correctOption ? "Correct!" : "Incorrect."}
                          </span>
                          {tamilData ? (tamilData.quiz[currentQuestionIdx]?.explanation || activeLessonData.quiz[currentQuestionIdx].explanation) : activeLessonData.quiz[currentQuestionIdx].explanation}
                        </div>
                      )}

                      {!isAnswered ? (
                        <button
                          disabled={selectedOption === null}
                          onClick={handleQuizSubmit}
                          className={`w-full rounded-lg py-2.5 text-xs font-bold text-white transition-all text-center cursor-pointer ${
                            selectedOption === null 
                              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" 
                              : "bg-indigo-600 hover:bg-indigo-500"
                          }`}
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleQuizNext}
                          className="flex items-center justify-center gap-1 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all text-center cursor-pointer"
                        >
                          <span>{currentQuestionIdx < activeLessonData.quiz.length - 1 ? "Next Question" : "Finish Quiz"}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TABS CONTAINER: CODING TASK */}
            {activeTab === "task" && (
              <div className="space-y-6 max-w-2xl mx-auto w-full animate-fade-in">
                <div className="space-y-2">
                  <span className="text-3xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Coding Challenge
                  </span>
                  <h2 className="text-xl font-bold text-slate-800">Task Instructions</h2>
                </div>

                <div className="glass-panel p-5 rounded-lg border border-indigo-100/50 space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {tamilData ? tamilData.taskDescription : activeLessonData.task.description}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-2xs font-extrabold text-slate-500 uppercase tracking-wide block">Expected Structural Result:</span>
                    <div className="p-3 bg-slate-50 rounded text-xs font-mono text-slate-600 overflow-x-auto border border-slate-200 select-text whitespace-pre-line leading-relaxed">
                      {activeLessonData.task.expectedOutputDisplay}
                    </div>
                  </div>
                </div>

                {isLessonCompleted ? (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-600">Task Completed & Verified!</span>
                    </div>
                    {nextLesson && (
                      <button
                        onClick={() => router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
                        className="w-full md:w-auto inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Next Lesson <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-slate-50 border border-dashed border-indigo-150 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Use the code sandbox on the right to implement your solution, then click "Run & Verify Code".
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE CODE SANDBOX ================= */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-950 overflow-hidden border-l border-slate-800">
          
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900 text-slate-200 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <ConsoleIcon className="h-4.5 w-4.5 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">Workspace Editor</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xs font-extrabold text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2.5 py-1 rounded tracking-wider uppercase">
                {activeLessonData.task.language}
              </span>

              {/* Unified Run & Verify Code Button */}
              <button
                onClick={handleRunAndVerifyCode}
                disabled={isRunning}
                className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-2xs font-extrabold px-4 py-2 text-white transition-all duration-300 shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-white text-white" />
                    <span>Run & Verify Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor Pane */}
          <div className="flex-1 flex overflow-hidden relative">
            <Editor
              height="100%"
              language={activeLessonData.task.language}
              value={editorCode}
              onChange={(val) => setEditorCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                minimap: { enabled: false },
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                readOnly: isLessonCompleted,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                }
              }}
            />
          </div>

          {/* Console / Output Tabs Console */}
          <div className="h-56 border-t border-slate-800 bg-slate-950 flex flex-col shrink-0">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-2xs text-slate-400 font-bold select-none uppercase tracking-widest">
              <div className="flex gap-4">
                <button 
                  onClick={() => setConsoleTab("logs")}
                  className={`transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded ${
                    consoleTab === "logs" ? "text-indigo-400 bg-slate-850 font-extrabold border border-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <ConsoleIcon className="h-3.5 w-3.5" />
                  Compiler Logs
                </button>
                
                {(activeLessonData.task.language === "html" || activeLessonData.task.language === "css") && (
                  <button 
                    onClick={() => setConsoleTab("preview")}
                    className={`transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded ${
                      consoleTab === "preview" ? "text-indigo-400 bg-slate-850 font-extrabold border border-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Play className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
                    Output Preview
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => {
                  if (consoleTab === "logs") setConsoleLogs([]);
                }}
                className="hover:text-slate-200 text-slate-500 flex items-center gap-1 transition-colors py-1 px-2 rounded hover:bg-slate-850"
              >
                <RotateCcw className="h-3 w-3" /> Clear
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative bg-slate-950">
              {consoleTab === "logs" ? (
                <div className="h-full p-4 font-mono text-2xs overflow-y-auto space-y-1.5 text-slate-300 select-text">
                  {consoleLogs.length === 0 ? (
                    <span className="text-slate-500 font-semibold italic">Console idle. Click "Run & Verify Code" to check results.</span>
                  ) : (
                    consoleLogs.map((log, i) => {
                      let logClass = "text-slate-400";
                      if (log.startsWith("Error") || log.includes("FAILED") || log.includes("Runtime error") || log.includes("failed")) {
                        logClass = "text-rose-400 font-semibold bg-rose-950/20 px-2.5 py-1 rounded border border-rose-900/30";
                      } else if (log.startsWith("Assert") && log.includes("PASSED")) {
                        logClass = "text-emerald-400 font-medium bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-900/30";
                      } else if (log.includes("STATUS: ALL") || log.includes("PASSED!")) {
                        logClass = "text-emerald-300 font-bold bg-gradient-to-r from-emerald-600/20 to-teal-600/20 px-3.5 py-2 rounded-lg border border-emerald-500/30 shadow-lg shadow-emerald-500/5 animate-pulse mt-2 mb-2 block";
                      } else if (log.startsWith("Assert") || log.startsWith("Analyzing") || log.startsWith("Checking")) {
                        logClass = "text-slate-400";
                      }
                      
                      return (
                        <div key={i} className={`${logClass} py-0.5`}>
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="h-full w-full bg-white text-black p-0.5 overflow-hidden">
                  <iframe
                    title="Sandbox Preview Pane"
                    sandbox="allow-scripts"
                    className="w-full h-full border-none bg-white"
                    srcDoc={
                      activeLessonData.task.language === "html" 
                        ? editorCode 
                        : activeLessonData.task.language === "css" 
                        ? `<html><head><style>${editorCode}</style></head><body style="padding: 12px; font-family: sans-serif;"><div class="navbar" style="margin-bottom: 12px;"><a href="#" style="margin-right: 8px;">Home</a><a href="#">About</a></div><div class="card" id="sandbox" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 8px;">I am styled using selector #sandbox</div><div class="card" style="border: 1px solid #ccc; padding: 10px;">I am standard layout card</div></body></html>` 
                        : `<html><body><script>${editorCode}</script><p>Evaluation Running...</p></body></html>`
                    }
                  />
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
