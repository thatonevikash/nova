# NOVA

> An AI assistant that lives in your terminal.

NOVA understands developer tasks in plain English — scaffolding projects, installing packages, creating directories, and running scripts — and executes them directly in your shell.

---

<video controls src="assets/trailer.mp4" poster="assets/poster.png" title="trailer"></video>

## Install

Install [Node.js 22 or newer](https://nodejs.org/) (Node.js 24 LTS is
recommended), then run:

```bash
npm install -g tnova
```

This installs NOVA's dependencies and makes the `nova` command available
globally. No repository clone or local linking is required.

---

## Start

```bash
nova
```

On first run, NOVA will ask for your **Google GenAI API key** and save it to `~/.nova/config.json`. You won't be asked again.

---

## Example session

```
$ nova

┌  NOVA Local terminal assistant for vikash
│
◆  What would you like Nova to do?
│  create a new react app called my-portfolio using vite
│
◇  Thinking complete (1.8s).
│
●  Scaffolding a Vite React project called my-portfolio
│
◇  $ npx create-vite@latest my-portfolio --template react
   [npx output...]
│
◇  $ npm install
   [npm output...]
│
◆  Finished in 18.4 seconds.
│
◇  What would you like Nova to do?
```

---

## Supported task categories

| Category             | Example                                  |
| -------------------- | ---------------------------------------- |
| `directory_creation` | "create a folder called backend"         |
| `npx_command`        | "scaffold a next.js app called blog"     |
| `package_install`    | "install axios and react-query"          |
| `script_execution`   | "run the dev server"                     |
| `mixed`              | "create a vite project and add tailwind" |

---

## Config

Stored at `~/.nova/config.json`:

```json
{
  "apiKey": "sk-ant-..."
}
```

To reset and re-enter your API key:

```bash
rm ~/.nova/config.json
nova
```

To launch NOVA's development environment:

```bash
nova --dev
```

To update or uninstall NOVA:

```bash
npm install -g tnova@latest
npm uninstall -g tnova
```

---

## Contributing

Repository contributors can run NOVA directly from source:

```bash
git clone https://github.com/thatonevikash/nova.git
cd nova
npm install
npm link
```

### Publishing

The first npm release creates the package and must be published by its owner:

```bash
npm login
npm test
npm run test:package
npm publish
```

After the first release, configure `thatonevikash/nova` as the trusted GitHub
publisher for the npm package `tnova`, select `publish.yml`, and allow direct
publishing. Future releases are published automatically when a GitHub Release
whose tag matches the package version (for example, `v0.0.4`) is published.

---

## Commands

| Terminal input          | Effect        |
| ----------------------- | ------------- |
| `exit` / `quit` / `bye` | Quit NOVA     |
| `Ctrl+C`                | Graceful exit |

---

## Tech

- Node.js 22+ (ESM; Node.js 24 LTS recommended)
- [Clack](https://github.com/bombshell-dev/clack) — prompts, spinners, and terminal UI
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-node) — task evaluation
- [Google GenAI](https://ai.google.dev/gemini-api/docs/get-started) — task evaluation
- [chalk](https://github.com/chalk/chalk) — terminal styling
- `child_process.spawn` — shell command execution
