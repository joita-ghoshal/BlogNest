export function shapeList(payload, key) {
  const arr = Array.isArray(payload)
    ? payload
    : payload && Array.isArray(payload[key])
    ? payload[key]
    : payload && Array.isArray(payload.data)
    ? payload.data
    : [];
  const pg = (payload && payload.pagination) || {};
  const totalPages = pg.pages ?? pg.totalPages ?? 1;
  const total = pg.total ?? arr.length;
  const page = pg.page ?? 1;
  return {
    [key]: arr,
    data: { [key]: arr, totalPages, total, page },
    totalPages,
    total,
    page,
  };
}

export function shapeItem(payload, key) {
  const item = payload && payload.data !== undefined ? payload.data : payload;
  return { [key]: item, data: item };
}
