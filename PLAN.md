# NOVA

An assistant who lives on terminal commands.

## CONTROLS

- Capable to create folder ( eg. for spinning up a new react project using any tool vite, nextjs, backend setup )
- Capable to run commands within any folder ( eg. npm init )
- Capable to navigate within created folder ( directory )
- Capable to start dev server in the active terminal.
- Capable to install further dependencies. ( axios, swr ).

## FORM

Lives in local system that can be downloadable. ( I will make it publically available )

## ACTIVATION

To activate it will require to run a command on terminal

```bash
nova --activate
```

### ACTIVATION LOOK ON TERMINAL

```bash
$ nova --activate
-
> Hello, {$username}. I'm 'NOVA'
-
> describe your task!
-
◕ thinking... ( 2.1 seconds )
◕ generating... ( 3.5 seconds )
-
◓ finished.
-
> describe your task!
```

- `$username` is desktop username
- `describe your task!` is a placeholder text

## PROMPTING ENGINE WORK

- described task evalution ( what is the task? )
- categorized the task:
  1. directory creation
  2. npx command execution ( scaffolding a new project using vite, nextjs or any other library )
  3. package installation/uninstallation ( adding a new dependency/removing dependency )
  4. script execution ( package.json )
