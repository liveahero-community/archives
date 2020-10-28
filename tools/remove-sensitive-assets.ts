// Node modules.
import { join } from 'path';
import fs from 'fs/promises';

const whitelistPatterns = [
  { filteredPath: 'MonoBehaviour', filteredRule: /^fg_\w+\.json$/ },
  { filteredPath: 'Sprite' },
  { filteredPath: 'Texture2D' },
];

const keepPartialFolders = async (path: string) => {
  const subPaths = await fs.readdir(path);

  for (const subPath of subPaths) {
    const fullPath = join(path, subPath);
    const matchedPattern = whitelistPatterns
      .find(({ filteredPath }) => filteredPath === subPath);

    // remove directory directly
    if (!matchedPattern) {
      fs.rm(fullPath, { recursive: true });
      console.log(`[Remove] ${fullPath}`);
    }
    // remove partial files
    else if (matchedPattern.filteredRule) {
      const files = await fs.readdir(fullPath);

      for (const file of files) {
        if (!matchedPattern.filteredRule.test(file)) {
          await fs.unlink(join(fullPath, file));
        }
      }

      console.log(`[Keep partial] ${fullPath}`);
    } else {
      console.log(`[Keep] ${fullPath}`);
    }
  }
};

const main = async () => {
  const [artifactPath] = process.argv.slice(2);
  await keepPartialFolders(artifactPath);
};

main();
