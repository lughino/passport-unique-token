export const lookup = (obj: any, field: string): string | null => {
  if (!obj) {
    return null;
  }
  const chain = field
    .split(']')
    .join('')
    .split('[');
  for (let i = 0, x; (x = chain[i]); ++i) {
    const prop = obj[x];
    if (typeof prop === 'undefined') {
      return null;
    }
    if (typeof prop !== 'object') {
      return prop;
    }
    obj = prop;
  }
  return null;
};
