export const catchErrorHandler = (fn) => (req, res, next) => {
  fn(req, res).catch(next)
}
