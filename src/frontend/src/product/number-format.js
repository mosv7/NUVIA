export function arabicUiNumbers(value) {
  const text = String(value);
  const protectedParts = /(https?:\/\/\S+|www\.\S+|[\w.-]+\.(?:link|com|org|net)\S*|#\d+)/g;
  return text
    .split(protectedParts)
    .map((part) => {
      if (
        /^(?:https?:\/\/|www\.)/.test(part) ||
        /^[\w.-]+\.(?:link|com|org|net)/.test(part) ||
        /^#\d+$/.test(part)
      )
        return part;
      return part
        .replace(/\d[\d,.]*\d|\d/g, (number) =>
          number
            .replace(/,/g, '٬')
            .replace(/\./g, '٫')
            .replace(/[0-9]/g, (digit) => '٠١٢٣٤٥٦٧٨٩'[Number(digit)]),
        )
        .replace(/%/g, '٪');
    })
    .join('');
}
