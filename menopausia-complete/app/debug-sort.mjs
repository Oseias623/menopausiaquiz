
const dbTitles = [
    'COLOSSENSES',
    'FILEMOM',
    'FILIPENSES',
    '1 TESSALONICENSES',
    '1 TIMÓTEO',
    'EFÉSIOS',
    '1 CORÍNTIOS',
    'ROMANOS',
    'GÁLATAS',
    '2 CORÍNTIOS',
    '2 TESSALONICENSES',
    '2 TIMÓTEO',
    'TITO'
];

const order = [
    'ROMANOS',
    '1 CORÍNTIOS', '2 CORÍNTIOS',
    'GÁLATAS',
    'EFÉSIOS',
    'FILIPENSES',
    'COLOSSENSES',
    '1 TESSALONICENSES', '2 TESSALONICENSES',
    '1 TIMÓTEO', '2 TIMÓTEO',
    'TITO',
    'FILEMOM'
];

const getIndex = (title) => {
    // Normalize current title to uppercase to match the list
    const cleanTitle = title.toUpperCase().trim();
    // Try exact match first
    let index = order.indexOf(cleanTitle);

    // If not found, try robust fuzzy match
    if (index === -1) {
        // Debug normalization issues
        console.log(`Mismatch for: '${cleanTitle}'`);
        // Check finding by substring
        index = order.findIndex(o => cleanTitle.includes(o));
    }
    return index;
};

console.log("Original:", dbTitles);

const sorted = [...dbTitles].sort((a, b) => {
    const indexA = getIndex(a);
    const indexB = getIndex(b);

    console.log(`Comparing ${a} (${indexA}) vs ${b} (${indexB})`);

    // If both found, sort by index. If not found, put at the end.
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return 0;
});

console.log("\nSorted:", sorted);
