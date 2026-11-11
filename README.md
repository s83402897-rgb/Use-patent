# UsePatent — student patent discovery workspace

A responsive React + TypeScript + Tailwind CSS prototype for exploring patent-inspired innovation opportunities. It uses fictional demo records only.

## What is included

- Overview dashboard and theme shortcuts
- Patent Explorer with text search, theme and status filters
- Plain-English patent briefs, potential innovation gaps and project directions
- Save / unsave ideas (in-memory for the current browser session)
- Project submission form and a lightweight demo keyword-overlap signal
- College Dashboard with sample project pipeline and theme mix
- Responsive sidebar navigation, modal details, notifications and mobile layout

## Important data and legal note

Every patent-like record is clearly marked **DEMO** and uses fictional identifiers such as `DEMO-IN-2021-01482`. These are not real patent records. The prototype does not connect to IP India, WIPO, Google Patents or any official register. A status such as active, expired or pending does not by itself establish freedom to operate or permission to use an invention. Before relying on a real record, verify the official register, patent claims, family, ownership, jurisdiction, licences and other applicable rights with a qualified professional where appropriate.

The app's similarity signal is a simple keyword-overlap demonstration, not plagiarism detection, patent search, or a legal assessment. Data is stored only in React state and resets when the page is refreshed.

## Run it locally (beginner friendly)

### 1. Install Node.js

1. Open https://nodejs.org/
2. Download the **LTS** version for your computer.
3. Run the installer and accept the normal default options.
4. Restart your terminal after installation.

### 2. Open the project folder

1. Extract `usepatent-project.zip`.
2. Open the extracted `usepatent` folder in Visual Studio Code.
3. In VS Code, choose **Terminal → New Terminal**.

### 3. Install the project packages

In the terminal, type this command and press Enter:

```bash
npm install
```

Wait for it to finish. This downloads React, Vite, Tailwind CSS and lucide-react.

### 4. Start the website

Type:

```bash
npm run dev
```

Vite will show a local address, usually:

```text
http://localhost:5173
```

Ctrl-click that address in VS Code, or copy it into Chrome.

### 5. Build the production version

When you want to check the production build, stop the development server with `Ctrl + C`, then run:

```bash
npm run build
```

The finished static website will be placed in the `dist` folder.

## Project structure

```text
usepatent/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
├── README.md
└── src/
    ├── App.tsx
    ├── data.ts
    ├── index.css
    └── main.tsx
```

## Suggested next production steps

1. Connect a backend and database for accounts, saved ideas and submissions.
2. Integrate official patent data sources and preserve source URLs, jurisdictions, claims, family and last-checked timestamps.
3. Add authentication and institution-level access controls.
4. Replace the keyword-overlap demo with a transparent similarity workflow that links to the records it compares.
5. Add legal review and a clear process for correcting stale or inaccurate patent information.
