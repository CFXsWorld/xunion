export const getFirstCampLetter = (word: string) =>
  word.substring(0, 1).toUpperCase();

export function formatNumberWithCommas(number: number) {
  return number ? number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : 0;
}

export function formatNumber(number: number, decimals: number) {
  const factor = Math.pow(10, decimals);
  return Math.floor(number * factor) / factor;
}

export function fuzzyMatch(query: string, text: string) {
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedQuery, 'i');
  return regex.test(text);
}

export function maskAddress(address: string) {
  return (
    address.substring(0, 10) +
    '...' +
    address.substring(address.length - 10, address.length)
  );
}
export function maskAddress4(address: string) {
  return (
    address.substring(0, 4) +
    '...' +
    address.substring(address.length - 4, address.length)
  );
}

export function isValidURL(url: string) {
  const urlRegex = /^(https):\/\/[^\s/$.?#].[^\s]*$/;
  return urlRegex.test(url);
}

export function formatCurrency(num: number, symbol = true, decimals = 5) {
  if (isNaN(num)) {
    return 'Invalid number';
  }
  let amount = '';
  if (decimals > 4 && Math.abs(num) < Math.pow(10, -decimals) && num > 0) {
    amount =
      '< ' +
      (0.00001).toLocaleString('en-US', {
        maximumFractionDigits: decimals,
      });
  } else {
    amount = formatNumber(num, decimals).toLocaleString('en-US', {
      maximumFractionDigits: decimals,
    });
  }

  if (symbol) {
    amount = '$ ' + amount;
  }
  return amount;
}

export function formatLargeNumber(
  value: number,
  decimalPlaces: number = 2
): string {
  const units = ['', 'K', 'M', 'B'];
  const tier = value < 1000 ? 0 : Math.floor(Math.log10(value) / 3);
  const scaled = value / Math.pow(1000, tier);

  return scaled.toFixed(decimalPlaces) + units[tier];
}
