// Node modules.
import { join } from 'path';
import fs from 'fs-extra';
import { trim } from 'lodash';

const keepPartialFolders = async (path: string, filterPatternRaws: string[]) => {
  const subPaths = await fs.readdir(path);

  // filterPatternRaws: ['Texture2D', 'Sprite', 'MonoBehaviour|(fg_\w+)\.json']
  const filterPatterns = filterPatternRaws.map((filterPatternRaw) => {
    const [filteredPath, filteredRule] = filterPatternRaw.split('|');
    return {
      filteredPath,
      filteredRule: filteredRule ? new RegExp(filteredRule) : null,
    };
  });

  for await (const subPath of subPaths) {
    const fullPath = join(path, subPath);
    const matchedPattern = filterPatterns
      .find(({ filteredPath }) => filteredPath === subPath);

    if (!matchedPattern) {
      fs.remove(fullPath);
      console.log(`[Remove] ${fullPath}`);
    } else if (matchedPattern.filteredRule) {
      const files = await fs.readdir(fullPath);

      for await (const file of files) {
        if (!matchedPattern.filteredRule.test(file)) {
          fs.remove(join(fullPath, file));
        }
      }

      console.log(`[Keep partial] ${fullPath}`);
    } else {
      console.log(`[Keep] ${fullPath}`);
    }
  }
};

const main = async () => {
  // [ARG1] artifactPath: 'artifacts'
  // [ARG2] pathPattern: 'Texture2D, Sprite, MonoBehaviour|(fg_\w+)\.json'
  const [artifactPath, pathPattern] = process.argv.slice(2);
  const filterPatternRaws = pathPattern.split(',').map(trim);
  await keepPartialFolders(artifactPath, filterPatternRaws);
};

main();
