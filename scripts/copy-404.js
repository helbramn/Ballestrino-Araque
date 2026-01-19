import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const copy404 = () => {
    const distPath = path.resolve(__dirname, '../dist');
    if (fs.existsSync(distPath)) {
        fs.copyFileSync(path.join(distPath, 'index.html'), path.join(distPath, '404.html'));
        console.log('Copied index.html to 404.html for GitHub Pages routing.');
    }
};

copy404();
