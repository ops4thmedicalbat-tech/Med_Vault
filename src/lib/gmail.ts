export interface GmailHeader {
  name: string;
  value: string;
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
  labelIds?: string[];
  isUnread?: boolean;
}

export interface GmailMessageDetail extends GmailMessageSummary {
  bodyText?: string;
  bodyHtml?: string;
}

// Helper to encode UTF-8 string to base64url format for Gmail API raw email sending
const EMAIL_ADDRESS_PATTERN = /^[^\s@<>,;"]+@[^\s@<>,;"]+\.[^\s@<>,;"]+$/;

function buildRawEmail(to: string, subject: string, bodyText: string): string {
  // ป้องกัน Email Header Injection: ห้ามมีการขึ้นบรรทัดใหม่ในหัวอีเมล
  if (/[\r\n]/.test(to) || /[\r\n]/.test(subject)) {
    throw new Error("ผู้รับหรือหัวเรื่องอีเมลมีอักขระที่ไม่อนุญาต");
  }

  const recipients = to
    .split(",")
    .map((addr) => addr.trim())
    .filter(Boolean);

  if (recipients.length === 0 || !recipients.every((addr) => EMAIL_ADDRESS_PATTERN.test(addr))) {
    throw new Error("รูปแบบอีเมลผู้รับไม่ถูกต้อง (คั่นหลายรายการด้วยเครื่องหมาย ,)");
  }

  to = recipients.join(", ");

  const emailLines = [
    `To: ${to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'Content-Type: text/plain; charset="UTF-8"',
    'MIME-Version: 1.0',
    '',
    bodyText,
  ];

  const emailStr = emailLines.join('\r\n');
  
  // Convert to Base64URL encoding (URL-safe base64 without padding)
  const base64 = btoa(unescape(encodeURIComponent(emailStr)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Extract header value from Gmail message headers
function getHeaderValue(headers: GmailHeader[] = [], headerName: string): string {
  const target = headers.find((h) => h.name.toLowerCase() === headerName.toLowerCase());
  return target ? target.value : '';
}

// Extract body text or HTML from Gmail payload parts
function extractBody(payload: any): { text?: string; html?: string } {
  if (!payload) return {};

  let text = '';
  let html = '';

  const decodeData = (dataStr: string) => {
    try {
      const base64 = dataStr.replace(/-/g, '+').replace(/_/g, '/');
      return decodeURIComponent(
        Array.prototype.map
          .call(atob(base64), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      return '';
    }
  };

  if (payload.body && payload.body.data) {
    if (payload.mimeType === 'text/plain') {
      text = decodeData(payload.body.data);
    } else if (payload.mimeType === 'text/html') {
      html = decodeData(payload.body.data);
    }
  }

  if (payload.parts && Array.isArray(payload.parts)) {
    for (const part of payload.parts) {
      const extracted = extractBody(part);
      if (extracted.text) text += (text ? '\n' : '') + extracted.text;
      if (extracted.html) html += (html ? '\n' : '') + extracted.html;
    }
  }

  return { text, html };
}

// 1. Fetch message list
export async function listGmailMessages(
  accessToken: string,
  query: string = '',
  maxResults: number = 15
): Promise<GmailMessageSummary[]> {
  const url = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  url.searchParams.append('maxResults', String(maxResults));
  if (query) {
    url.searchParams.append('q', query);
  }

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail API Error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  if (!data.messages || !Array.isArray(data.messages)) {
    return [];
  }

  // Fetch light metadata for each message concurrently
  const summaries = await Promise.all(
    data.messages.map(async (item: { id: string; threadId: string }) => {
      try {
        const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${item.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`;
        const detailRes = await fetch(detailUrl, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!detailRes.ok) return null;
        const msg = await detailRes.json();
        const headers = msg.payload?.headers || [];

        return {
          id: msg.id,
          threadId: msg.threadId,
          snippet: msg.snippet,
          subject: getHeaderValue(headers, 'Subject') || '(ไม่มีหัวข้อ)',
          from: getHeaderValue(headers, 'From') || 'ผู้ส่งไม่ระบุ',
          to: getHeaderValue(headers, 'To'),
          date: getHeaderValue(headers, 'Date'),
          labelIds: msg.labelIds || [],
          isUnread: (msg.labelIds || []).includes('UNREAD'),
        } as GmailMessageSummary;
      } catch (e) {
        console.error('Error fetching message summary:', e);
        return null;
      }
    })
  );

  return summaries.filter((s): s is GmailMessageSummary => s !== null);
}

// 2. Get detailed message content
export async function getGmailMessageDetail(
  accessToken: string,
  messageId: string
): Promise<GmailMessageDetail> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail API Error (${res.status}): ${errText}`);
  }

  const msg = await res.json();
  const headers = msg.payload?.headers || [];
  const { text, html } = extractBody(msg.payload);

  return {
    id: msg.id,
    threadId: msg.threadId,
    snippet: msg.snippet,
    subject: getHeaderValue(headers, 'Subject') || '(ไม่มีหัวข้อ)',
    from: getHeaderValue(headers, 'From') || 'ผู้ส่งไม่ระบุ',
    to: getHeaderValue(headers, 'To'),
    date: getHeaderValue(headers, 'Date'),
    labelIds: msg.labelIds || [],
    isUnread: (msg.labelIds || []).includes('UNREAD'),
    bodyText: text,
    bodyHtml: html,
  };
}

// 3. Send email via Gmail
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<{ id: string; threadId: string }> {
  const rawBase64Url = buildRawEmail(to, subject, bodyText);

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawBase64Url }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail Send Error (${res.status}): ${errText}`);
  }

  return await res.json();
}

// 4. Trash / Delete email
export async function trashGmailMessage(
  accessToken: string,
  messageId: string
): Promise<void> {
  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail Trash Error (${res.status}): ${errText}`);
  }
}

// 5. Mark message read/unread
export async function toggleGmailReadState(
  accessToken: string,
  messageId: string,
  markAsRead: boolean
): Promise<void> {
  const body = markAsRead
    ? { removeLabelIds: ['UNREAD'] }
    : { addLabelIds: ['UNREAD'] };

  const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gmail Modify Error (${res.status}): ${errText}`);
  }
}
