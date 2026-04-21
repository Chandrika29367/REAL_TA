// lib/constants.js
export const PLACEHOLDER_IMG = "/placeholder.jpg";

export const RISK_SCORES = [82, 74, 68, 55, 61, 70, 58, 65, 72, 48];
export const PROP_AGES   = [15,  1,  8,  0,  3,  0,  5,  4, 10, 12];

export const getRisk = (id) => RISK_SCORES[(id - 1) % RISK_SCORES.length] || 60;
export const getAge  = (id) => PROP_AGES[(id - 1)   % PROP_AGES.length]   || 5;

// Image proxy function for hotlink-protected CDN images
export const getImageSrc = (property) => {
  const raw = property?.images?.[0] || property?.imageUrl || null;
  if (!raw) return PLACEHOLDER_IMG;
  if (raw.startsWith('http')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(raw)}&w=600&q=80`;
  }
  return raw;
};

export const getImageSrcs = (property) => {
  const imgs = property?.images;
  if (!imgs || imgs.length === 0) return [PLACEHOLDER_IMG];
  return imgs.map(url =>
    `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=600&q=80`
  );
};

// Decode listing type from scraped data codes
export const decodeListing = (code) => {
  const map = { "P": "Buy", "R": "Rent", "PG": "PG" };
  return map[code] || code;
};

export const fmtPrice = (n) => {
  if (!n) return "Price on Request";
  const num = typeof n === 'string' ? parseFloat(n) : n;
  return num >= 10000000 ? `₹${(num / 10000000).toFixed(1)} Cr` :
         num >= 100000   ? `₹${(num / 100000).toFixed(0)} L`    :
         `₹${num?.toLocaleString() || 0}`;
};

// Design tokens
export const C = {
  primary:   "#E03A3C",
  primaryDk: "#C0302F",
  green:     "#00897B",
  bg:        "#F5F5F5",
  white:     "#FFFFFF",
  text:      "#1A1A1A",
  text2:     "#717171",
  border:    "#E0E0E0",
  greenBg:   "#E0F2F1",
};
