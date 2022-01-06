var ranges = [
  { divider: 1e6, suffix: "M" },
  { divider: 1e3, suffix: "k" },
];

export function formatNumber(n) {
  for (var i = 0; i < ranges.length; i++) {
    if (Math.abs(n) >= ranges[i].divider) {
      return (n / ranges[i].divider).toFixed(1).toString() + ranges[i].suffix;
    }
  }
  return n;
}
