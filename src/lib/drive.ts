export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  webViewLink?: string;
  webContentLink?: string;
  iconLink?: string;
  hasThumbnail?: boolean;
  thumbnailLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  owners?: { displayName: string; emailAddress: string }[];
  shared?: boolean;
}

// List files from Google Drive
export async function listDriveFiles(
  accessToken: string,
  options: {
    query?: string;
    mimeTypeFilter?: string;
    pageSize?: number;
    orderBy?: string;
  } = {}
): Promise<DriveFile[]> {
  const { query = "", mimeTypeFilter, pageSize = 20, orderBy = "modifiedTime desc" } = options;

  const url = new URL("https://www.googleapis.com/drive/v3/files");
  url.searchParams.append("pageSize", String(pageSize));
  url.searchParams.append("orderBy", orderBy);
  url.searchParams.append(
    "fields",
    "files(id, name, mimeType, webViewLink, webContentLink, iconLink, createdTime, modifiedTime, size, owners, shared)"
  );

  let qParts: string[] = ["trashed = false"];
  if (query) {
    // escape \ ก่อน แล้วจึง escape ' ตามรูปแบบ query ของ Drive API
    const escaped = query.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
    qParts.push(`name contains '${escaped}'`);
  }
  if (mimeTypeFilter) {
    qParts.push(`mimeType = '${mimeTypeFilter}'`);
  }

  url.searchParams.append("q", qParts.join(" and "));

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Google Drive API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  return data.files || [];
}

// Create a folder in Google Drive
export async function createDriveFolder(
  accessToken: string,
  folderName: string,
  parentFolderId?: string
): Promise<DriveFile> {
  const metadata: any = {
    name: folderName,
    mimeType: "application/vnd.google-apps.folder",
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch("https://www.googleapis.com/drive/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Create Folder Error (${res.status}): ${errText}`);
  }

  return await res.json();
}

// Upload a text/JSON/doc file to Google Drive
export async function createDriveFile(
  accessToken: string,
  filename: string,
  content: string,
  mimeType: string = "text/plain",
  parentFolderId?: string
): Promise<DriveFile> {
  const metadata: any = {
    name: filename,
    mimeType,
  };
  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  // Use multipart upload
  const boundary = "-------314159265358979323846";
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  const multipartRequestBody =
    delimiter +
    "Content-Type: application/json\r\n\r\n" +
    JSON.stringify(metadata) +
    delimiter +
    "Content-Type: " +
    mimeType +
    "\r\n\r\n" +
    content +
    close_delim;

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/related; boundary=" + boundary,
    },
    body: multipartRequestBody,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`File Upload Error (${res.status}): ${errText}`);
  }

  return await res.json();
}

// Trash / Delete file in Google Drive
export async function trashDriveFile(accessToken: string, fileId: string): Promise<void> {
  const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trashed: true }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Trash File Error (${res.status}): ${errText}`);
  }
}
