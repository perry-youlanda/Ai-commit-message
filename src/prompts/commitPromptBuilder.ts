import { BuildCommitPromptInput, CommitLanguage, CommitStyle } from '../types';

export function buildCommitPrompt(input: BuildCommitPromptInput): string {
  const languageRules = getLanguageRules(input.language);
  const styleRules = getStyleRules(input.style, input.language);
  const generalRules = getGeneralRules(input.language);

  return `${languageRules}

${input.language === 'zh-CN' || input.language === 'bilingual' ? '风格要求' : 'Style requirements'}:
${styleRules}

${input.language === 'zh-CN' || input.language === 'bilingual' ? '通用要求' : 'General requirements'}:
${generalRules}

${input.language === 'zh-CN' || input.language === 'bilingual' ? '变更文件' : 'Changed files'}:
${input.files || '(No git status output)'}

${input.language === 'zh-CN' || input.language === 'bilingual' ? '变更统计' : 'Change stats'}:
${input.stats || '(No diff stat output)'}

Git Diff:
${input.diff}`;
}

function getLanguageRules(language: CommitLanguage): string {
  if (language === 'en-US') {
    return 'You are a professional software engineer. Generate a Git commit message in English based on the following changes.';
  }

  if (language === 'bilingual') {
    return `你是一个专业的软件工程师。请根据下面的 Git 变更生成中英双语提交消息。
必须同时输出中文和英文，不能只输出英文。
输出顺序必须是中文在前，英文在后。`;
  }

  return '你是一个专业的软件工程师。请根据下面的 Git 变更生成中文提交消息。';
}

function getStyleRules(style: CommitStyle, language: CommitLanguage): string {
  if (style === 'emojiConventional') {
    return getEmojiConventionalRules(language);
  }

  if (language === 'bilingual') {
    if (style === 'simple') {
      return `输出两行：
1. 中文：一行简短提交消息
2. English: one concise commit message`;
    }

    if (style === 'detailed') {
      return `输出两个段落：
中文：
<标题>
- <要点 1>
- <要点 2>

English:
<title>
- <point 1>
- <point 2>`;
    }

    return `使用 Conventional Commits 格式，并输出两个段落：
中文：
<type>: <中文标题>

- <中文要点 1>
- <中文要点 2>

English:
<type>: <English title>

- <English point 1>
- <English point 2>`;
  }

  if (language === 'zh-CN') {
    if (style === 'simple') {
      return '只返回一行简短中文提交消息。';
    }

    if (style === 'detailed') {
      return '返回一个中文标题，并附带 2-5 条简短中文说明。';
    }

    return '使用 Conventional Commits 格式，返回 type 前缀标题；必要时附带简短中文要点。';
  }

  if (style === 'simple') {
    return 'Return one concise single-line commit message.';
  }

  if (style === 'detailed') {
    return 'Return a title line followed by 2-5 concise bullet lines describing the main changes.';
  }

  return 'Follow the Conventional Commits format. Return a type-prefixed title and optional concise body bullets when useful.';
}

function getGeneralRules(language: CommitLanguage): string {
  if (language === 'bilingual') {
    return `1. 只输出提交消息本身，不要解释。
2. 不要使用 Markdown 代码块。
3. 不要编造 diff 中没有体现的功能。
4. 标题不要超过 72 个字符。
5. 使用 Conventional Commits 时，选择合适类型：feat、fix、docs、style、refactor、test、chore、perf、ci、build。
6. 如果主要是测试文件，优先使用 test。
7. 如果主要是配置、种子数据、fixture、构建脚本，优先使用 chore。
8. 必须包含中文和 English 两个段落；缺少任意一种语言都视为错误。
9. 准确性优先于好听：只总结 diff 中真实出现的新增、删除、修改。
10. 不要把“配置项、环境变量、文档 URL、脚本、依赖”描述成“新增业务功能”。
11. 正文要点必须能从变更文件或 diff 行中找到依据。
12. 正文默认只输出 1-2 条；只有多模块改动才输出 3 条。
13. 话术保持克制，不要使用“便于、提升、优化体验、增强能力、统一管理、快速访问”等价值判断词，除非 diff 直接体现。
14. 不要输出总结性套话，只写具体变更。
15. 先在内部提取 1-3 个可验证事实，再生成提交消息；最终不要输出这个内部分析。
16. 每个名词短语必须来自文件名、配置键、函数名、变量名、路由、命令或 diff 文本。
17. 如果无法从 diff 直接确认目的，只描述“新增/修改/删除了什么”，不要描述“为什么”。`;
  }

  if (language === 'zh-CN') {
    return `1. 只输出提交消息本身，不要解释。
2. 不要使用 Markdown 代码块。
3. 不要编造 diff 中没有体现的功能。
4. 标题不要超过 72 个字符。
5. 使用 Conventional Commits 时，选择合适类型：feat、fix、docs、style、refactor、test、chore、perf、ci、build。
6. 如果主要是测试文件，优先使用 test。
7. 如果主要是配置、种子数据、fixture、构建脚本，优先使用 chore。
8. 必须使用中文。
9. 准确性优先于好听：只总结 diff 中真实出现的新增、删除、修改。
10. 不要把“配置项、环境变量、文档 URL、脚本、依赖”描述成“新增业务功能”。
11. 正文要点必须能从变更文件或 diff 行中找到依据。
12. 正文默认只输出 1-2 条；只有多模块改动才输出 3 条。
13. 话术保持克制，不要使用“便于、提升、优化体验、增强能力、统一管理、快速访问”等价值判断词，除非 diff 直接体现。
14. 不要输出总结性套话，只写具体变更。
15. 先在内部提取 1-3 个可验证事实，再生成提交消息；最终不要输出这个内部分析。
16. 每个名词短语必须来自文件名、配置键、函数名、变量名、路由、命令或 diff 文本。
17. 如果无法从 diff 直接确认目的，只描述“新增/修改/删除了什么”，不要描述“为什么”。`;
  }

  return `1. Output only the commit message.
2. Do not explain the result.
3. Do not use Markdown code blocks.
4. Do not invent functionality not shown in the diff.
5. Keep the title under 72 characters.
6. Choose an appropriate type when using Conventional Commits: feat, fix, docs, style, refactor, test, chore, perf, ci, build.
7. If the changes are mainly test files, prefer test.
8. If the changes are mainly seed data, fixtures, config, or build scripts, prefer chore.
9. Use English.
10. Accuracy is more important than sounding polished: summarize only additions, deletions, and modifications that really appear in the diff.
11. Do not describe config, environment variables, docs URLs, scripts, or dependencies as new product features.
12. Every body bullet must be supported by changed files or visible diff lines.
13. Output 1-2 body bullets by default; use 3 only for multi-module changes.
14. Keep wording restrained. Avoid value-judgment phrases such as "improve experience", "enhance capability", "make it easier", "unify management", or "quickly access" unless directly shown in the diff.
15. Do not add generic summary phrases; state concrete changes only.
16. Internally extract 1-3 verifiable facts first, then write the commit message; do not output the internal analysis.
17. Every noun phrase must come from filenames, config keys, function names, variable names, routes, commands, or diff text.
18. If intent is not directly visible in the diff, describe only what was added, changed, or removed, not why.`;
}

function getEmojiConventionalRules(language: CommitLanguage): string {
  const typeMap = `常见 type 和 emoji 映射：
- ✨ feat：新增功能
- 🐛 fix：修复 bug
- 📝 docs：文档修改
- 💄 style：格式、样式、空白、分号等不影响逻辑的修改
- ♻️ refactor：代码重构，不新增功能也不修复 bug
- ✅ test：测试相关
- 🔧 chore：配置、脚本、种子数据、fixture、工具维护
- ⚡ perf：性能优化
- 👷 ci：CI/CD 相关
- 📦 build：构建系统、依赖、打包相关
- ⏪ revert：回滚提交`;

  const typePriority = `类型选择优先级：
1. 主要修改测试文件：test
2. 主要修改 README、注释文档、API 文档：docs
3. 主要修改 env、config、fixture、seed、脚本、工具配置：chore
4. 主要修改依赖、构建配置、打包配置：build
5. 主要修改 CI/CD 配置：ci
6. 明确修复错误、异常、回归：fix
7. 明确新增用户可感知能力或业务流程：feat
8. 只调整内部结构且行为不变：refactor
9. 只调整性能：perf

当不确定是否是 feat 时，优先选择 chore 或 refactor。`;

  const classicRulesZh = `经典文本规范：
1. 标题格式必须是：<type>(<scope>): <emoji> <subject>
2. scope 可选；没有明确模块时省略括号。
3. subject 使用简短祈使/动宾结构，不要以句号结尾。
4. 标题尽量不超过 50 个字符，最长不要超过 72 个字符。
5. 标题和正文之间保留一个空行。
6. 正文用 0-2 条短横线要点说明直接改动；单一小改动可以不写正文。
7. 正文每条尽量控制在 72 个字符以内。
8. 不要编造 diff 中没有体现的功能。
9. 不要为了显得完整而补充收益描述。
10. 优先复用 diff 中的具体标识符，例如环境变量名、配置键、文件名。`;

  if (language === 'bilingual') {
    return `${typeMap}

${typePriority}

${classicRulesZh}

输出格式必须严格如下：
中文：
<type>(<scope>): <emoji> <中文 subject>

- <中文说明 what/why 1>
- <中文说明 what/why 2，必要时才输出>

English:
<type>(<scope>): <emoji> <English subject>

- <English what/why point 1>
- <English what/why point 2, only when needed>

中文和英文必须表达同一组改动，emoji、type、scope 必须一致。
注意：type 必须放在标题开头，emoji 必须放在冒号后，保证兼容 commitlint。`;
  }

  if (language === 'zh-CN') {
    return `${typeMap}

${typePriority}

${classicRulesZh}

输出格式：
<type>(<scope>): <emoji> <中文 subject>

- <中文说明 what/why 1>
- <中文说明 what/why 2，必要时才输出>`;
  }

  return `Common type and emoji mapping:
- ✨ feat: new feature
- 🐛 fix: bug fix
- 📝 docs: documentation
- 💄 style: formatting or style-only changes
- ♻️ refactor: code refactor without feature or bug fix
- ✅ test: tests
- 🔧 chore: config, scripts, seed data, fixtures, tooling
- ⚡ perf: performance improvement
- 👷 ci: CI/CD
- 📦 build: build system, dependencies, packaging
- ⏪ revert: revert

Type selection priority:
1. Mostly test files: test
2. Mostly README, comments, docs, or API documentation: docs
3. Mostly env, config, fixtures, seed data, scripts, or tooling: chore
4. Mostly dependencies, build config, or packaging: build
5. Mostly CI/CD config: ci
6. Clear bug, exception, or regression fix: fix
7. Clear user-facing capability or business flow: feat
8. Internal behavior-preserving structure change: refactor
9. Performance-only change: perf

When unsure whether the change is feat, prefer chore or refactor.

Classic commit message rules:
1. The title format must be: <type>(<scope>): <emoji> <subject>
2. Scope is optional; omit parentheses when there is no clear module.
3. Use a short imperative subject and do not end it with a period.
4. Prefer a title under 50 characters; never exceed 72 characters.
5. Separate title and body with a blank line.
6. Use 0-2 bullet points for direct changes; omit the body for a single small change.
7. Keep body lines near 72 characters.
8. Do not invent functionality not shown in the diff.
9. Do not add benefit claims just to make the message sound complete.
10. Prefer concrete identifiers from the diff, such as env var names, config keys, and filenames.

Output format:
<type>(<scope>): <emoji> <English subject>

- <English what/why point 1>
- <English what/why point 2, only when needed>`;
}
