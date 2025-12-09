import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readExcelData = () => {
    try {
        const filePath = path.join(__dirname, 'public/Mentions_Coritiba.xlsx');
        console.log("Reading file from:", filePath);
        const workbook = XLSX.readFile(filePath);

        console.log("Sheets found:", workbook.SheetNames);

        workbook.SheetNames.forEach(sheetName => {
            console.log(`\n--- Sheet: ${sheetName} ---`);
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            if (json.length > 0) {
                console.log("Headers (Row 0):", json[0]);
                // Print a few sample rows to understand data types
                console.log("Sample Row 1:", json[1]);
                if (json.length > 2) console.log("Sample Row 2:", json[2]);
            } else {
                console.log("Empty sheet");
            }
        });

    } catch (error) {
        console.error("Error reading Excel file:", error);
    }
};

readExcelData();
