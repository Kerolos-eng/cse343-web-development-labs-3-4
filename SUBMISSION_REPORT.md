# CSE343 Web Development — Labs 3 & 4 Report

**Student:** [Enter your full name]  
**Student ID:** [Enter your ID]  
**Section:** [Enter your section]  
**Course:** CSE343 — Web Development  
**Submitted:** 2 November 2026

## Submission overview

This report documents the two JavaScript web applications completed from the supplied Lab 3 and Lab 4 task slides. The source code is included in the repository, separated into standalone HTML, CSS, and JavaScript files for each lab.

**GitHub repository:** https://github.com/Kerolos-eng/cse343-web-development-labs-3-4

## Lab 3 — Interactive Calculator Webpage

The Lab 3 task asks for a webpage calculator for basic mathematical operations, implemented using HTML, CSS, and JavaScript. The Orbit Calculator has a responsive interface and supports addition, subtraction, multiplication, division, decimals, percentage, sign change, clear, and keyboard input. Division by zero is handled safely, and the page updates the display through DOM events.

### Screenshot evidence

![Lab 3 calculator screenshot](screenshots/lab3-calculator.png)

**Files:** `lab3-calculator/index.html`, `lab3-calculator/styles.css`, `lab3-calculator/app.js`

## Lab 4 — To-do List Application

The Lab 4 task slide presents a to-do list application. Daybook implements the visible task-list workflow and adds useful interactions: create tasks, mark tasks complete, filter all/active/completed, edit task text, delete individual tasks, clear completed tasks, and clear the whole list. It displays remaining-task and completion counts and persists tasks with `localStorage`.

### Screenshot evidence

![Lab 4 task manager screenshot](screenshots/lab4-todo.png)

**Files:** `lab4-todo/index.html`, `lab4-todo/styles.css`, `lab4-todo/app.js`

## Implementation and checks

Both projects are client-side applications and require no server or package installation. They use semantic HTML, responsive CSS, vanilla JavaScript, DOM selection and updates, event listeners, and clear separation of structure, presentation, and behavior. The Lab 4 implementation also uses a `TaskList` class, array `map`/`filter` methods, object spread, template literals, and browser storage.

The JavaScript source files were checked with Node.js syntax validation. The interactive controls and responsive page rendering were checked in a browser before capturing the screenshots.

## Included files and final check

The repository and ZIP bundle include both applications’ source files, screenshot evidence, browser-check results, this report, and a README with local run instructions. Before submission, replace the student name, student ID, and section placeholders, then confirm the private repository is shared with your instructor if required.
