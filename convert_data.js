const fs = require('fs');

const rawBuffer = fs.readFileSync('data.txt');

// Simple MacRoman decoder for Norwegian characters
function decodeMacRoman(buffer) {
    let str = '';
    for (const byte of buffer) {
        if (byte < 128) {
            str += String.fromCharCode(byte);
        } else {
            switch (byte) {
                case 0x81: str += 'Å'; break; // Å
                case 0x8C: str += 'å'; break; // å
                case 0xAE: str += 'Æ'; break; // Æ
                case 0xBE: str += 'æ'; break; // æ
                case 0xAF: str += 'Ø'; break; // Ø
                case 0xBF: str += 'ø'; break; // ø
                default: str += '?'; break; // Unknown high-bit char, replace with ?
            }
        }
    }
    return str;
}

const rawData = decodeMacRoman(rawBuffer);
// const rawData = fs.readFileSync('data.txt', 'latin1'); // Old attempt
const lines = rawData.split('\n').filter(l => l.trim() !== '');

const headers = lines[0].split('\t');
console.log('Headers:', headers);

const projects = lines.slice(1).map((line, index) => {
    const cols = line.split('\t');

    // Map columns (adjust indices based on header)
    // 0: Prosjekt, 1: Trinn, 3: Enheter, 11: Snittpris, 9: Utvikler, 10: Megler
    // Note: The previous view showed malformed chars, likely due to encoding.
    // We will trust the file read to be correct if it is valid utf8 or latin1.

    // Fallback if split fails or empty lines
    if (cols.length < 5) return null;

    const name = cols[0];
    const trinn = cols[1];
    const enheter = cols[3];

    // Formatting price
    let price = cols[11] || "0";
    // Price might have spaces in the source like "10 994 146", clean it
    price = price.replace(/\s/g, '');
    // Format nicely
    const fmtPrice = parseInt(price).toLocaleString('no-NO') + " kr";

    // Utvikler/Megler
    const utvikler = cols[9];
    const megler = cols[10];

    const salgsstart = cols[2];
    const solgt = cols[4];
    const oppdatert = cols[5];

    return {
        id: index + 1,
        name: `${name} ${trinn}`,
        area: "Oslo", // Default as per data
        units: parseInt(enheter) || 0,
        sold: parseInt(solgt) || 0,
        price_from: fmtPrice,
        description: `<strong>Utvikler:</strong> ${utvikler}<br><strong>Megler:</strong> ${megler}<br><strong>Salg:</strong> ${solgt} av ${enheter} solgt.<br><strong>Salgsstart:</strong> ${salgsstart}`,
        image: `https://source.unsplash.com/random/800x600/?apartment,modern,${index}`
    };
}).filter(p => p !== null);

const jsContent = `const projects = ${JSON.stringify(projects, null, 4)};\n\nexport default projects;`;

fs.writeFileSync('data.js', jsContent);
console.log('data.js updated with ' + projects.length + ' projects.');
