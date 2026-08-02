const SHEET_NAME = 'Waitlist';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const p = (e && e.parameter) || {};
    if (p.website) return json_({ ok: true }); // honeypot: silently discard spam
    const name = clean_(p.name, 100);
    const whatsapp = clean_(p.whatsapp, 30);
    const email = clean_(p.email, 150);
    const consent = p.consent === 'on' || p.consent === 'true';
    if (!name || !whatsapp || !email || !consent) return json_({ ok: false, error: 'Missing required fields' });

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(['Received at','Name','WhatsApp','Email','Consent','Source','Submitted at','Page']);
    sheet.appendRow([new Date(), name, whatsapp, email, 'Yes', clean_(p.source, 60), clean_(p.submittedAt, 50), clean_(p.page, 500)]);
    return json_({ ok: true });
  } finally { lock.releaseLock(); }
}

function clean_(value, max) {
  const text = String(value || '').trim().slice(0, max);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
