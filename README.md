# NOVA

> An AI assistant that lives in your terminal.

NOVA understands developer tasks in plain English — scaffolding projects, installing packages, creating directories, and running scripts — and executes them directly in your shell.

---

<video controls src="assets/trailer.mp4" poster="assets/poster.png" title="trailer"></video>

## Install

```bash
# Clone or download the repo
cd nova

# Install dependencies
npm install

# Link globally so `nova` works anywhere
npm link
```

---

## Start

```bash
nova
```

On first run, NOVA will ask for your **Anthropic/GenAI API key** and save it to `~/.nova/config.json`. You won't be asked again.

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

---

## Commands

| Terminal input          | Effect        |
| ----------------------- | ------------- |
| `exit` / `quit` / `bye` | Quit NOVA     |
| `Ctrl+C`                | Graceful exit |

---

## Tech

- Node.js 18+ (ESM)
- [Clack](https://github.com/bombshell-dev/clack) — prompts, spinners, and terminal UI
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-node) — task evaluation
- [Google GenAI](https://ai.google.dev/gemini-api/docs/get-started) — task evaluation
- [chalk](https://github.com/chalk/chalk) — terminal styling
- `child_process.spawn` — shell command execution
