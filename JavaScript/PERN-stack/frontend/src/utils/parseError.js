export function parseErrors(err) {
  const data = err?.response?.data ?? err?.data ?? err;

  if (Array.isArray(data)) {
    return data.map((it) => (typeof it === 'string' ? it : it?.message ?? JSON.stringify(it)));
  }

  if (typeof data === 'string') {
    const str = data.trim();
    if ((str.startsWith('{') && str.endsWith('}')) || (str.startsWith('[') && str.endsWith(']'))) {
      try {
        const parsed = JSON.parse(str);
        return parseErrors({ response: { data: parsed } });
      } catch (e) {
        return [str];
      }
    }
    return [str];
  }

  if (data && typeof data === 'object') {
    if (Array.isArray(data.message)) {
      return data.message.map((it) => (typeof it === 'string' ? it : it?.message ?? JSON.stringify(it)));
    }

    if (typeof data.message === 'string') {
      return parseErrors(data.message);
    }

    if (Array.isArray(data.errors)) {
      return data.errors.map((it) => (typeof it === 'string' ? it : it?.message ?? JSON.stringify(it)));
    }

    if (data.message) return [String(data.message)];
    try {
      return [JSON.stringify(data)];
    } catch (e) {
      return [String(data)];
    }
  }

  return [err?.message ?? 'Error desconocido'];
}

export default parseErrors;
