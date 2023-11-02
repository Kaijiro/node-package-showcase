import {execSync} from "child_process";
import * as semver from "semver";

const ACTUAL_PACKAGE_NAME = require('../package.json').name;

// In a standard node installation, you can replace the "node" part by whatever global-installed lib you want
// in the path to call it. You'll be sure to have the right runtime

function getNpmExecutablePath() {
  const argv0Parts = process.argv0.split('/');
  return argv0Parts.slice(0, argv0Parts.length - 1).join('/') + '/npm';
}

function fetchLastVersionNumber(): string {
  const npmCmd = getNpmExecutablePath();

  const commandOutput = execSync(`${npmCmd} info ${ACTUAL_PACKAGE_NAME} --json`);

  const jsonOutput = JSON.parse(commandOutput.toString());
  return jsonOutput['dist-tags'].latest;
}

export function isOutdated(): boolean {
  const lastPublishedVersion = fetchLastVersionNumber();
  const actualVersion = require('../package.json').version;

  console.debug(actualVersion, lastPublishedVersion);

  return semver.lt(actualVersion, lastPublishedVersion);
}

export function autoUpdate(): void {
  const npmCmd = getNpmExecutablePath();

  console.info(`Let's go for the update !`);
  execSync(`${npmCmd} install -g ${ACTUAL_PACKAGE_NAME}`);
}
