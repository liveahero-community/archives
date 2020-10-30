// Node modules.
import { join } from 'path';
import fs from 'fs-extra';
import { trim } from 'lodash';

const keepPartialFolders = async (path: string, filterPaths: string[]) => {
  const subPaths = await fs.readdir(path);

  subPaths.forEach((subPath) => {
    const fullPath = join(path, subPath);
    const matched = filterPaths.includes(subPath);

    if (!matched) {
      fs.remove(fullPath);
      console.log(`[Remove] ${fullPath}`);
    } else {
      console.log(`[Keep] ${fullPath}`);
    }
  });
};

const main = async () => {
  const [artifactPath, pathPattern] = process.argv.slice(2);
  const filterPaths = pathPattern.split(',').map(trim);
  await keepPartialFolders(artifactPath, filterPaths);
};

main();
