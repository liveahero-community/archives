// Node modules.
import _ from 'lodash';
import fs from 'fs-extra';
import fetch, { RequestInit } from 'node-fetch';
import appRoot from 'app-root-path';

const API_URL = 'https://gateway.live-a-hero.jp';
const STATIC_URL = 'https://d1itvxfdul6wxg.cloudfront.net';
const BASE_FETCH_OPTIONS = {
  headers: { 'User-Agent': `LiveAHeroAPI` },
};

const getVersion = async (options: RequestInit) => {
  const res = await fetch(`${API_URL}/api/status/version`, options);
  // {"result":true,"message":"","client":"1.0.3","master":33}
  const { client, master } = await res.json();

  return {
    appVersion: client,
    masterVersion: master,
  };
};

const getAssetList = async (options: RequestInit) => {
  const res = await fetch(`${STATIC_URL}/assetList.Android`, options);
  // Assetbundle/Android/dicing_kouki_h01_skin1_assets_fg_kouki_h01_skin1_1d7f5fc9c6c0d87841618de6de11deda.bundle,0a0e9494875f3c484d4ff6e667de5f6e,1005631
  // Assetbundle/Android/crowne_assets_icon_crowne_h01_skin1_25b59b7548f66a0b24870ae6d634e723.bundle,784fd433e85744005959e4365c8140ba,13132
  const data = await res.text();
  const assetList = data.split('\n').map((line) => {
    const [filePath, hashCode, fileSize] = line.split(',');
    return { filePath, hashCode, fileSize: Number(fileSize) };
  });

  return assetList;
}

const main = async () => {
  // Step 1: get app version info.
  const { appVersion } = await getVersion(BASE_FETCH_OPTIONS);
  const options = {
    ...BASE_FETCH_OPTIONS,
    headers: {
      ...BASE_FETCH_OPTIONS.headers,
      'User-Agent': `LiveAHeroAPI/${appVersion}`,
    },
  };

  // Store the version info.
  if (!appVersion) {
    console.warn('Cannot get version from server');
    process.exit(0);
  }

  console.log(`Version: ${appVersion}`);

  // Step 2: get master data JSON.
  const assetList = await getAssetList(options);
  console.log(assetList);
};

main();
