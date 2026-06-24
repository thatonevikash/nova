# NOVA

> An AI assistant that lives in your terminal.

NOVA understands developer tasks in plain English — scaffolding projects, installing packages, creating directories, and running scripts — and executes them directly in your shell.

---

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

## Activate

```bash
nova --activate
```

On first run, NOVA will ask for your **Anthropic/GenAI API key** and save it to `~/.nova/config.json`. You won't be asked again.

---

## Example session

```
$ nova --activate

  -
  > Hello, vikash. I'm 'NOVA'
  -

  > describe your task! create a new react app called my-portfolio using vite

  -
  ◕ thinking... ( 1.8 seconds )
  → Scaffolding a Vite React project called my-portfolio and installing dependencies

  $ npx create-vite@latest my-portfolio --template react
  [npx output...]

  $ cd /Users/vikash/my-portfolio

  $ npm install
  [npm output...]

  -
  ◕ generating... ( 18.4 seconds )
  ◓ finished.
  -

  > describe your task!
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
nova --activate
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
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-node) — task evaluation
- [Google GenAI](https://ai.google.dev/gemini-api/docs/get-started) — task evaluation
- [chalk](https://github.com/chalk/chalk) — terminal styling
- `child_process.spawn` — shell command execution
