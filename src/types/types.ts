interface UnusedPackages {
  dependencies: string[];
  devDependencies: string[];
}

type Dependencies = UnusedPackages & { packageJson: Record<string, string> };
export { UnusedPackages, Dependencies };
