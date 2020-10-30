// Node modules.
import { join } from 'path';
import fs from 'fs-extra';

const duplicatedPattern = /^.+ #\d+/;

const recursiveRemoveDuplications = async (path: string) => {
  const stat = await fs.lstat(path);

  if (stat.isDirectory()) {
    const subPaths = await fs.readdir(path);

    for await (const subPath of subPaths) {
      const fullPath = join(path, subPath);
      const isDuplicated = duplicatedPattern.test(subPath);

      if (!isDuplicated) {
        recursiveRemoveDuplications(fullPath);
      } else {
        await fs.remove(fullPath);
        console.log(`Remove duplicated: ${fullPath}`);
      }
    }
  }
};

const main = async () => {
  const [artifactPath] = process.argv.slice(2);
  await recursiveRemoveDuplications(artifactPath);
};

main();
