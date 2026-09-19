# Nova

Nova is an AI-powered terminal assistant that turns plain-language development
requests into commands and runs them sequentially in your current shell.

<video controls src="assets/trailer.mp4" poster="assets/poster.png" title="Nova demo"></video>

## Requirements

- Node.js 22 or newer (Node.js 24 LTS is recommended)
- npm
- A [Google Gemini API key](https://aistudio.google.com/apikey)

## Installation

Install Nova globally from npm:

```bash
npm install --global tnova
```

The package is named `tnova`; the installed command is `nova`.

## Getting started

Start Nova in the directory where you want it to work:

```bash
nova
```

On the first run, enter your Google Gemini API key when prompted. Nova stores
it locally in `~/.nova/config.json` and reuses it on later runs.

Then describe a task, for example:

```text
Create a React app called dashboard using Vite
```

Nova asks Gemini to create a structured plan, displays a short description,
and executes the returned commands in order. Enter `exit`, `quit`, or `bye`, or
press `Ctrl+C`, to leave the prompt.

> [!CAUTION]
> Nova currently executes AI-generated commands in your shell. Review the
> displayed commands and run Nova only in a directory where you are comfortable
> allowing changes.

## Supported tasks

Nova's current prompts support:

| Task | Example |
| --- | --- |
| Create directories | `Create a folder called utils inside src` |
| Initialize Node.js projects | `Create a Node.js app called api-server` |
| Scaffold Vite apps | `Create a Vue app called dashboard using Vite` |
| Scaffold Next.js, Remix, or Astro apps | `Create a Next.js app called blog` |
| Scaffold Next.js with MUI | `Create a Next.js project with MUI called admin` |
| Install or remove npm packages | `Install axios and dotenv` |
| Run npm scripts | `Run the dev script` |
| Rename a codebase with Casely | `Rename src to kebab case` |

Scaffolding and package-management tasks can download packages and may open
interactive prompts from npm or npx.

## CLI options

```text
nova                 Start the interactive assistant
nova --help          Show command help
nova --version       Show the installed version
nova --dev           Open the development action menu
```

The development menu runs predefined actions through Nova's executor. Some
actions create files, install packages, or start a long-running development
server, so use it in a disposable directory.

## Configuration

Nova stores its configuration in:

```text
~/.nova/config.json
```

The current format is:

```json
{
  "apiKey": "your-google-gemini-api-key"
}
```

Treat this file as a secret and do not commit it. To replace the key, delete
the file and start Nova again:

macOS and Linux:

```bash
rm ~/.nova/config.json
nova
```

Windows PowerShell:

```powershell
Remove-Item "$HOME\.nova\config.json"
nova
```

## Updating and uninstalling

```bash
npm install --global tnova@latest
npm uninstall --global tnova
```

## Development

Clone the repository and install its dependencies:

```bash
git clone https://github.com/thatonevikash/nova.git
cd nova
npm install
```

Run the CLI directly from source:

```bash
node bin/nova.js
```

Or create a global development link:

```bash
npm link
nova
```

Run the automated tests and package smoke test before contributing:

```bash
npm test
npm run test:package
```

The project uses ECMAScript modules. Its main entry points are
`bin/nova.js`, `src/index.js`, and `src/executor.js`.

## Tech stack

- [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) for task evaluation
- [Clack](https://www.npmjs.com/package/@clack/prompts) for interactive prompts
- [Chalk](https://www.npmjs.com/package/chalk) for terminal styling
- Node.js `child_process` and filesystem APIs for command execution

## License

Nova is available under the [MIT License](LICENCE).
