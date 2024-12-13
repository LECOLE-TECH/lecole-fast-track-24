export const standardResponse = (res, code, data, message) => {
  res.status(code).json({
    code: code,
    message,
    data,
  });
};

export const paginationResponse = (
  res,
  code,
  data,
  message,
  currentPage,
  totalPage,
  recordPerPage,
  totalRecord
) => {
  res.status(code).json({
    code: code,
    message,
    data,
    currentPage,
    totalPage,
    recordPerPage,
    totalRecord,
  });
};
