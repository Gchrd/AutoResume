export interface ParsedCVRow {
    section: string;
    field: string;
    value: string;
}

export function convertToCSV(data: ParsedCVRow[]): string {
    const header = 'Section,Field,Value';
    const rows: string[] = [];
    let lastSection = '';

    for (const row of data) {
        // Add an empty row between different sections for readability
        if (row.section !== lastSection && lastSection !== '') {
            rows.push(',,');
        }
        lastSection = row.section;

        rows.push(`${escape(row.section)},${escape(row.field)},${escape(row.value)}`);
    }

    return [header, ...rows].join('\n');
}

function escape(val: string): string {
    // Always wrap in quotes and escape internal quotes
    return `"${val.replace(/"/g, '""')}"`;
}

export function downloadCSV(csvContent: string, filename: string = 'cv_data.csv') {
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
}
