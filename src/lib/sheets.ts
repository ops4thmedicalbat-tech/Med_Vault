import { listDriveFiles, DriveFile } from "./drive";

export interface SheetTabInfo {
  sheetId: number;
  title: string;
  index: number;
  rowCount: number;
  columnCount: number;
}

export interface SpreadsheetMetadata {
  spreadsheetId: string;
  title: string;
  spreadsheetUrl: string;
  sheets: SheetTabInfo[];
}

export interface SheetValuesResult {
  range: string;
  majorDimension: string;
  values: string[][];
}

// 1. List Google Spreadsheets from Drive
export async function listSpreadsheets(
  accessToken: string,
  query?: string
): Promise<DriveFile[]> {
  return listDriveFiles(accessToken, {
    query,
    mimeTypeFilter: "application/vnd.google-apps.spreadsheet",
    pageSize: 20,
  });
}

// 2. Fetch Spreadsheet metadata (Title & Tab Sheets) - Avoids hardcoding sheet names!
export async function getSpreadsheetDetails(
  accessToken: string,
  spreadsheetId: string
): Promise<SpreadsheetMetadata> {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,properties.title,spreadsheetUrl,sheets.properties`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Sheets API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const sheets: SheetTabInfo[] = (data.sheets || []).map((s: any) => ({
    sheetId: s.properties?.sheetId || 0,
    title: s.properties?.title || "Sheet1",
    index: s.properties?.index || 0,
    rowCount: s.properties?.gridProperties?.rowCount || 100,
    columnCount: s.properties?.gridProperties?.columnCount || 20,
  }));

  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || "Untitled Spreadsheet",
    spreadsheetUrl: data.spreadsheetUrl || "",
    sheets,
  };
}

// 3. Read values from a specific Sheet tab and range
export async function getSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string
): Promise<SheetValuesResult> {
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Read Sheets Values Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return {
    range: data.range || range,
    majorDimension: data.majorDimension || "ROWS",
    values: data.values || [],
  };
}

// 4. Create a new Google Spreadsheet
export async function createSpreadsheet(
  accessToken: string,
  title: string,
  sheetTitles: string[] = ["รายการข้อมูล (DataLog)"]
): Promise<SpreadsheetMetadata> {
  const sheetsPayload = sheetTitles.map((sheetTitle, idx) => ({
    properties: {
      title: sheetTitle,
      index: idx,
    },
  }));

  const res = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: { title },
      sheets: sheetsPayload,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Create Spreadsheet Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return {
    spreadsheetId: data.spreadsheetId,
    title: data.properties?.title || title,
    spreadsheetUrl: data.spreadsheetUrl || "",
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId || 0,
      title: s.properties?.title || "Sheet1",
      index: s.properties?.index || 0,
      rowCount: s.properties?.gridProperties?.rowCount || 100,
      columnCount: s.properties?.gridProperties?.columnCount || 20,
    })),
  };
}

// 5. Append rows to a Spreadsheet tab
export async function appendSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  rows: (string | number)[][]
): Promise<any> {
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}:append?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: rows,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Append Sheets Values Error (${res.status}): ${errText}`);
  }

  return await res.json();
}

// 6. Update values in a specific range
export async function updateSpreadsheetValues(
  accessToken: string,
  spreadsheetId: string,
  range: string,
  rows: (string | number)[][]
): Promise<any> {
  const encodedRange = encodeURIComponent(range);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodedRange}?valueInputOption=USER_ENTERED`;

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      range,
      values: rows,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Update Sheets Values Error (${res.status}): ${errText}`);
  }

  return await res.json();
}
