/**
 * Renames all TypeScript files in the src directory to JavaScript files.
 * Must run from project root.
 */
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

fs.readdir(srcDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        const filePath = path.join(srcDir, file);
        if (path.extname(file) === '.ts') {
            const newFilePath = filePath.replace(/\.ts$/, '.js');
            fs.rename(filePath, newFilePath, err => {
                if (err) {
                    console.error('Error renaming file:', err);
                } else {
                    console.log(`Renamed: ${file} -> ${path.basename(newFilePath)}`);
                }
            });
        }
    });
});
