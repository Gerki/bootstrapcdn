#!/usr/bin/env node

'use strict';

const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');
const walk = require('fs-walk');

(() => {
    let version = process.argv[2];

    if (!version) {
        throw new Error('Valid Bootswatch version required.\nPlease pass the Bootswatch version as an argument.');
    }

    // strip leading 'v' if present
    version = version.replace(/^v/, '');

    const basedir = path.join(__dirname, '..');
    const bootswatchSrcDir = path.join(basedir, 'node_modules/bootswatch/dist');
    const bootswatchDistDir = path.join(basedir, 'cdn/bootswatch', version);

    if (fs.existsSync(bootswatchDistDir)) {
        console.log('Bootswatch version already found, exiting.');
        return;
    }

    fs.mkdirSync(bootswatchDistDir);

    walk.filesSync(bootswatchSrcDir, (base, filename) => {
        if (filename.endsWith('.css')) {
            const themefolder = path.basename(base);

            fse.ensureDirSync(path.join(bootswatchDistDir, themefolder));

            fse.copySync(path.join(base, filename), path.join(bootswatchDistDir, themefolder, filename), {
                overwrite: false,
                errorOnExist: true,
                preserveTimestamps: true
            });
            console.log(`Copied "${path.join(themefolder, filename)}" to "${path.join(bootswatchDistDir, themefolder, filename)}"`);
        }
    });

    console.log(`\nDo not forget to update "${path.normalize('config/_config.yml')}"!`);
})();
