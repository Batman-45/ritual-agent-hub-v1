import pkg from 'xlsx';
const { readFile, utils } = pkg;

const workbook = readFile('scripts/Community_Ritual_Dapps_List.xlsx');

workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const data = utils.sheet_to_json(worksheet);
    
    console.log(`--- Sheet: ${sheetName} ---`);
    console.log(`Rows: ${data.length}`);
    
    if (data.length > 0) {
        console.log('Headers:', Object.keys(data[0]));
        console.log('10 Representative rows:', JSON.stringify(data.slice(0, 10), null, 2));
    }
});
