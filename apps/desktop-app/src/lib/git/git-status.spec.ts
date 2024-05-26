import { parseGitStatus, GitStatus } from "./git-status";

const checkIsDirectoryMock = jest.fn(async (path: string) => false);

// Mock the checkIsDirectory function
jest.mock("../commands/check-is-directory", () => ({
  checkIsDirectory: (path: string) => checkIsDirectoryMock(path),
}));

describe("parseGitStatus", () => {
  beforeEach(() => {
    checkIsDirectoryMock.mockClear();
  });

  it("should parse Chinese Git status correctly", async () => {
    const statusText = `
位于分支 master
您的分支与上游分支 'origin/master' 一致。

要提交的变更：
  （使用 "git restore --staged <文件>..." 撤出暂存区）
  （使用 "git restore <文件>..." 撤消工作区的改动）
	修改：   apps/dashboard/src/app/(portal)/(main)/users/page.tsx
	修改：   apps/dashboard/src/components/user-nav.tsx
	修改：   apps/server/src/auth/auth.controller.ts
	修改：   apps/server/src/auth/local-auth.guard.ts

尚未暂存以备提交的变更：
  （使用 "git add <文件>..." 更新要提交的内容）
  （使用 "git restore <文件>..." 撤消工作区的改动）
	修改：   apps/dashboard/src/lib/auth.ts

未跟踪的文件:
  （使用 "git add <文件>..." 以包含要提交的内容）
	apps/dashboard/src/test.ts
`;

    const expected: GitStatus = {
      branch: "master",
      upstream: "origin/master",
      changesToBeCommitted: {
        modified: [
          "apps/dashboard/src/app/(portal)/(main)/users/page.tsx",
          "apps/dashboard/src/components/user-nav.tsx",
          "apps/server/src/auth/auth.controller.ts",
          "apps/server/src/auth/local-auth.guard.ts",
        ],
        deleted: [],
        added: [],
      },
      changesNotStagedForCommit: {
        modified: ["apps/dashboard/src/lib/auth.ts"],
        deleted: [],
      },
      untrackedFiles: ["apps/dashboard/src/test.ts"],
    };

    const result = await parseGitStatus(statusText, "/path/to/repo");
    expect(result).toEqual(expected);
  });

  it("should parse English Git status correctly", async () => {
    const statusText = `
On branch master
Your branch is up to date with 'origin/master'.

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   apps/dashboard/src/app/(portal)/(main)/users/page.tsx
	modified:   apps/dashboard/src/components/user-nav.tsx
	modified:   apps/server/src/auth/auth.controller.ts
	modified:   apps/server/src/auth/local-auth.guard.ts

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
	modified:   apps/dashboard/src/lib/auth.ts

Untracked files:
  (use "git add <file>..." to include in what will be committed)
	apps/dashboard/src/test.ts
`;

    const expected: GitStatus = {
      branch: "master",
      upstream: "origin/master",
      changesToBeCommitted: {
        modified: [
          "apps/dashboard/src/app/(portal)/(main)/users/page.tsx",
          "apps/dashboard/src/components/user-nav.tsx",
          "apps/server/src/auth/auth.controller.ts",
          "apps/server/src/auth/local-auth.guard.ts",
        ],
        deleted: [],
        added: [],
      },
      changesNotStagedForCommit: {
        modified: ["apps/dashboard/src/lib/auth.ts"],
        deleted: [],
      },
      untrackedFiles: ["apps/dashboard/src/test.ts"],
    };

    const result = await parseGitStatus(statusText, "/path/to/repo");
    expect(result).toEqual(expected);
  });
});
