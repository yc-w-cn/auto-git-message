export const PROMPT_INTRO_GIT_MESSAGE_CH: string = [
  "介绍 Git Message: ",
  `格式：<type>(<scope>): <subject>，type(必须)，scope(可选),举例：feat: 新增阅读文档功能`,
  `以下是scope的说明：`,
  `feat：新功能（feature）。`,
  `fix/to：修复bug，可以是QA发现的BUG，也可以是研发自己发现的BUG。`,
  `- fix：产生diff并自动修复此问题。适合于一次提交直接修复问题`,
  `- to：只产生diff不自动修复此问题。适合于多次提交。最终修复问题提交时使用fix`,
  `docs：文档（documentation）。`,
  `style：格式（不影响代码运行的变动）。`,
  `refactor：重构（即不是新增功能，也不是修改bug的代码变动）。`,
  `perf：优化相关，比如提升性能、体验。`,
  `test：增加测试。`,
  `chore：构建过程或辅助工具的变动。`,
  `revert：回滚到上一个版本。`,
  `merge：代码合并。`,
  `zd：同步主线或分支的Bug。`,
].join("\n");

export const PROMPT_INTRO_GIT_MESSAGE: string = [
  "About Git Message: ",
  "Format: <type>(<scope>): <subject>",
  " <scope> is optional",
  " Example: feat: add hat wobble",
  "",
  "feat: (new feature for the user, not a new feature for build script)",
  "fix: (bug fix for the user, not a fix to a build script)",
  "docs: (changes to the documentation)",
  "style: (formatting, missing semi colons, etc; no production code change)",
  "refactor: (refactoring production code, eg. renaming a variable)",
  "test: (adding missing tests, refactoring tests; no production code change)",
  "chore: (updating grunt tasks etc; no production code change)",
].join("\n");