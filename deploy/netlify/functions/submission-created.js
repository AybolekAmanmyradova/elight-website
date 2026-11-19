// Netlify runs this automatically on every verified form submission.
// It forwards the submission to the Google Apps Script web app, which appends
// a row to the spreadsheet. Unlike an outgoing webhook, this never gets
// disabled: Netlify only cares that this function returns 200, and the redirect
// that Apps Script sends back is handled here instead of by Netlify.
//
// Paste your Apps Script /exec URL below (the one ending in /exec).
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbw2cF4Z7_EN4asr7sM9PWZW-uhANu_DnnNaamvMmvQa-59w5ISHbs-xC14L-ip_lHbc6g/exec';

exports.handler = async (event) => {
  try {
    // event.body is already { payload: { data, created_at, id, ... } },
    // exactly what the Apps Script doPost expects.
    await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: event.body,
      redirect: 'follow', // Apps Script answers with a 302; follow it
    });
  } catch (err) {
    // Log but still return 200 so Netlify doesn't retry/disable anything.
    console.error('Forward to Apps Script failed:', err);
  }
  return { statusCode: 200, body: 'ok' };
};
