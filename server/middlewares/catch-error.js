export const catchErrorHandler = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next)
}
