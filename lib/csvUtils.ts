export interface ParsedCVRow {
    section: string;
    field: string;
    value: string;
}

export function convertToCSV(data: ParsedCVRow[]): string {
    const header = 'Section,Field,Value';
    const rows = data.map((row) => {
        const escape = (val: string) =>
            `"${val.replace(/"/g, '""')}"`;
        return `${escape(row.section)},${escape(row.field)},${escape(row.value)}`;
    });
    return [header, ...rows].join('\n');
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
