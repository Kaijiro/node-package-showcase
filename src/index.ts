import {Command} from "commander";
import inquirer from "inquirer";
import {autoUpdate, isOutdated} from "./update-check";
import {spawnSync} from "child_process";

const actualVersion = require('../package.json').version;
const actualName = require('../package.json').name;

const program = new Command();

program.name(actualName)
  .description('This is a CLI showcase, bundled into an installable package.')
  .version(actualVersion);

program.option('--skip-check-update', 'Skip auto-update process', false);
program.hook('preAction', async (_, __) => {
  if (program.opts().skipCheckUpdate) {
    console.info('User chose to skip auto-update process');
  } else {
    console.info('Checking if an update is available');
    if (isOutdated()) {
      await inquirer.prompt([
        {
          type: "confirm",
          name: "auto-update",
          message: 'An update is available, update now ?'
        }
      ]).then(answers => {
          if (answers['auto-update']) {
            console.info('CLI is outdated, launching auto-update process');
            autoUpdate();

            console.info('CLI has been updated, restarting the process to run on the last version !')

            spawnSync(process.argv.shift(), process.argv, {
              "cwd": process.cwd(),
              "stdio": "inherit"
            });
            process.exit(0);
          }
        }
      );
    }
  }
})
;

program.command('hello')
  .description('This is a classic example : the Hello World !')
  .argument('<who>', 'who should I say hello to ?')
  .action((who: string) => {
    const version = require('../package.json').version;
    console.log(`Hello ${who}, running on version ${version}`);
  });

program.parse();
