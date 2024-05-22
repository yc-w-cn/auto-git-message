import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { GitHubLogoIcon, ReaderIcon } from "@radix-ui/react-icons";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="mt-6 text-center text-4xl sm:text-5xl font-extrabold text-gray-900">
            AutoGitMessage
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            AI-Powered Commit Message Generator
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>Automated Diff Generation:</strong> Reads the code changes
              in your Git repository and generates diffs.
            </li>
            <li>
              <strong>AI-Powered Commit Messages:</strong> Uses AI to analyze
              diffs and generate relevant commit messages.
            </li>
            <li>
              <strong>TypeScript Full-Stack:</strong> Built using TypeScript for
              both the front-end and back-end.
            </li>
            <li>
              <strong>Easy Integration:</strong> Can be integrated into your
              existing Git workflow seamlessly.
            </li>
          </ul>
        </div>
        <div className="mt-6 flex gap-4 justify-center">
          <Link
            target="_blank"
            href="https://github.com/yc-w-cn/"
            className={buttonVariants({ variant: "outline" })}
          >
            <GitHubLogoIcon className="mr-2" />
            Github Repository
          </Link>
          <Link
            target="_blank"
            href="https://github.com/yc-w-cn/auto-git-message/blob/master/LICENSE"
            className={buttonVariants({ variant: "outline" })}
          >
            <ReaderIcon className="mr-2" />
            View License
          </Link>
        </div>
      </div>
    </div>
  );
}
