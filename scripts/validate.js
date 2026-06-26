const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const htmlFiles = fs.readdirSync(root).filter((file) => file.endsWith('.html'));
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const rsaPattern = /\bRSA\b/i;
const errors = [];

htmlFiles.forEach((file) => {
    const content = fs.readFileSync(path.join(root, file), 'utf8');
    if (rsaPattern.test(content)) {
        errors.push(`${file} still contains "RSA" references`);
    }
});

if (!script.includes('scrollRestoration')) {
    errors.push('script.js is missing scroll restoration on refresh');
}

if (!script.includes('initScrollToTopOnRefresh')) {
    errors.push('script.js is missing scroll-to-top on refresh handler');
}

const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
if (!/grandi strutture/i.test(indexHtml)) {
    errors.push('index.html should mention "grandi strutture" instead of RSA');
}

if (errors.length) {
    console.error('Validation failed:\n' + errors.map((e) => `- ${e}`).join('\n'));
    process.exit(1);
}

console.log('Validation passed.');
