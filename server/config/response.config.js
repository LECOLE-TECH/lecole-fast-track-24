export const standardResponse = (res, code, data, message) => {
  res.status(code).json({
    code: code,
    message,
    data,
  });
};
