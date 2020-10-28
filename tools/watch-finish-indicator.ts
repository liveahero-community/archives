// Node modules.
import fs from 'fs-extra';

const watchFileAppend = (path: string) => {
  return new Promise((resolve) => {
    const confirmExists = () => {
      fs.stat(path, (err) => {
        if (err === null) {
          resolve(true);
        }
      });
    };

    confirmExists();
    fs.watchFile(path, confirmExists);
  });
};

const main = async () => {
  const [filePath] = process.argv.slice(2);

  console.log(`Watch for ${filePath}`);
  await watchFileAppend(filePath);
  console.log(`${filePath} exists`);

  process.exit(0);
};

main();
