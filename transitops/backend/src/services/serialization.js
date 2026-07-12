export function toPlainObject(document) {
  if (!document) {
    return null;
  }

  return document.toObject ? document.toObject({ virtuals: true }) : document;
}

export function serializePage(result, serializer = toPlainObject) {
  return {
    ...result,
    items: result.items.map(serializer)
  };
}
