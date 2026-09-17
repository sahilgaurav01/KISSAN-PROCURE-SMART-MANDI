/**
 * =========================================================
 * UTILS: DATA FORMATTERS (js/utils/formatters.js)
 * Formats Indian Currency (₹), Dates, Quantities, and Tokens
 * =========================================================
 */

export function formatINR(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  return '₹' + Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatQuintals(qty) {
  if (!qty) return '0.0 Qtl';
  return `${Number(qty).toFixed(1)} Qtl`;
}

export function formatToken(tokenNum) {
  if (!tokenNum) return '#0';
  return `#${tokenNum}`;
}

export function formatMaskedBank(account) {
  if (!account) return 'N/A';
  return account;
}

export function formatShortDate(dateStr) {
  if (!dateStr || dateStr === 'Today') return 'Today';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    return dateStr;
  }
}
