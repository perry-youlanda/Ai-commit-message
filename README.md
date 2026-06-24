# Youlanda AI Commit Message

VS Code extension for generating Git commit messages from staged or unstaged changes.

## Features

- Generate commit messages from staged or unstaged Git changes
- Write generated messages directly to the VS Code Git commit input
- Detect whitespace-only changes and generate `style` messages without calling AI
- Support Chinese, English, and bilingual output
- Support commit styles including emoji Conventional Commits
- Multi-provider support for OpenAI, DeepSeek, Qwen, Ollama, and OpenAI-compatible custom endpoints
- Store API keys in VS Code SecretStorage

## Usage

1. Open a Git repository in VS Code.
2. Configure `commitAI.provider`, `commitAI.model`, and `commitAI.apiBaseUrl` if needed.
3. Run `Commit AI: Set API Key` for cloud providers.
4. Click the flower icon in the Source Control title bar, or run `Commit AI: Generate Commit Message`.
5. Review the generated message in the Git commit input before committing.

## Commands

- `Commit AI: Generate Commit Message`
- `Commit AI: Set API Key`
- `Commit AI: Clear API Key`
- `Commit AI: Change Language`
- `Commit AI: Change Style`

## Settings

- `commitAI.language`: `zh-CN`, `en-US`, or `bilingual`
- `commitAI.style`: `emojiConventional`, `simple`, `conventional`, or `detailed`
- `commitAI.provider`: `openai`, `deepseek`, `qwen`, `ollama`, or `custom`
- `commitAI.model`: default `gpt-4o-mini`; provider defaults are used when this remains unchanged
- `commitAI.apiBaseUrl`: optional provider base URL
- `commitAI.maxDiffLength`: default `12000`
- `commitAI.diffMode`: `auto`, `staged`, `unstaged`, or `all`
- `commitAI.showPreview`: default `false`; generated messages are written directly to the Git commit input

## Provider Defaults

- OpenAI: `https://api.openai.com/v1`, model `gpt-4o-mini`
- DeepSeek: `https://api.deepseek.com`, model `deepseek-chat`
- Qwen: `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`, model `qwen-plus`
- Ollama: `http://localhost:11434`, model `llama3.1`
- Custom: requires `commitAI.apiBaseUrl`

For Qwen China Beijing, set `commitAI.apiBaseUrl` to:

```txt
https://dashscope.aliyuncs.com/compatible-mode/v1
```

For Qwen US Virginia, set:

```txt
https://dashscope-us.aliyuncs.com/compatible-mode/v1
```

## Default Commit Format

The default style is `emojiConventional`, which uses:

```txt
<type>(<scope>): <emoji> <subject>

- <what/why point 1>
- <what/why point 2>
```

Example:

```txt
feat(scm): ✨ 添加提交消息生成入口

- 在源码管理输入框添加生成按钮
- 生成后直接写入 Git 提交消息框
```

## Development

```bash
npm install
npm run compile
npm run package
```

Open this folder in VS Code and press F5 to launch the Extension Development Host.

## Notes

The stable release uses the Source Control title bar button. VS Code's Source Control input-box inline menu currently requires a proposed API and is not enabled in the packaged release.
