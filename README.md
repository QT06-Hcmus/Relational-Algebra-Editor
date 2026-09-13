# Relational Algebra Editor

A lightweight, browser-based editor for composing relational algebra expressions quickly and exporting them in reusable formats.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel)](https://dsqh-nhqt.vercel.app)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=000000)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=ffffff)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=ffffff)

## Overview

Relational Algebra Editor helps students and developers write database expressions without repeatedly searching for special mathematical symbols. It combines an editable workspace with operator shortcuts, subscript formatting, local persistence, and Markdown/LaTeX export.

> This project is a notation editor. It does not parse expressions or execute queries against a database.

## Features

- Insert relational algebra, join, logical, comparison, and aggregation symbols
- Write operator conditions as formatted subscripts
- Copy the current expression as a Markdown-compatible LaTeX block
- Export expressions as a plain-text `.txt` file
- Save and restore work with browser `localStorage`
- Change the font size of selected content or the editor workspace
- Print expressions using a dedicated print layout
- Exit subscript editing with `Tab` or the right-arrow key for faster keyboard input
- Run entirely in the browser without a backend, package manager, or build step

## Supported Notation

| Category | Symbols and functions |
| --- | --- |
| Core operators | `Ïƒ` selection, `Ï€` projection, `Ï` rename, `Ã—` product, `âˆª` union, `âˆ©` intersection, `âˆ’` difference, `Ã·` division |
| Joins | `â‹ˆ` natural join, `âŸ•` left outer join, `âŸ–` right outer join, `âŸ—` full outer join |
| Logic | `âˆ§`, `âˆ¨`, `Â¬`, `âˆ€`, `âˆƒ` |
| Comparison | `=`, `â‰ `, `<`, `â‰¤`, `>`, `â‰¥`, `âˆˆ` |
| Aggregation | `â„‘` grouping, `COUNT()`, `SUM()`, `AVG()`, `MIN()`, `MAX()` |

## Live Demo

Try the deployed application at **[dsqh-nhqt.vercel.app](https://dsqh-nhqt.vercel.app)**.

## Usage

1. Click an operator or helper button to insert it at the current cursor position.
2. Enter the operator condition or relation name in the editor.
3. Use **Save** and **Load** to persist work in the current browser.
4. Select **Copy** to copy a Markdown/LaTeX version of the expression.
5. Select **TXT** to download a plain-text version, or **Print** to open the browser print dialog.

For example, an expression containing selection and projection operators can be copied as a Markdown math block using commands such as `\sigma`, `\pi`, `\ge`, and `\bowtie`.

## Run Locally

Clone the repository:

```bash
git clone https://github.com/QT06-Hcmus/Relational-Algebra-Editor.git
cd Relational-Algebra-Editor
```

Start any static file server. For example, with Python:

```bash
python -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000). You can also open `index.html` directly, although clipboard access may depend on browser security settings.

## Project Structure

| File | Responsibility |
| --- | --- |
| `index.html` | Editor layout, symbol palette, and controls |
| `style.css` | Responsive screen styles and print layout |
| `script.js` | Cursor insertion, formatting, persistence, export, and print behavior |

## How It Works

- The editor uses the browser Selection and Range APIs to insert symbols at the active cursor position.
- Operators that accept conditions create a `<sub>` element and move the cursor into it automatically.
- Export functions clone the editor content, normalize line breaks, and convert supported symbols to LaTeX commands.
- Saved expressions and font preferences remain on the user's device through `localStorage`.

## Roadmap

- Add keyboard shortcuts and searchable operators
- Add import/export for complete editor sessions
- Add automated tests for symbol insertion and LaTeX conversion
- Improve keyboard navigation and accessibility

## Contributing

Issues and pull requests are welcome. Please describe the problem or proposed improvement clearly and keep each change focused.

## Author

Developed by [Nguyá»…n Há»“ Quang Tiáº¿n](https://github.com/QT06-Hcmus), Software Engineering student at HCMUS.
