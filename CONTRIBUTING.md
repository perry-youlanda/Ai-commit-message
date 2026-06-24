# Contributing

Thanks for contributing to Commit Message.

## Development

```bash
npm install
npm run compile
```

Open the project in VS Code and run the `Run Extension` debug configuration.

## Packaging

```bash
npm run package
```

## Pull Requests

- Keep changes focused.
- Run `npm run compile` before submitting.
- Update `README.md` or `CHANGELOG.md` when behavior changes.
- Do not commit API keys, tokens, `.vsix` files, `node_modules`, or `out`.

## Commit Messages

Use Conventional Commits:

```txt
feat: add provider support
fix: handle whitespace-only diffs
docs: update usage guide
```
