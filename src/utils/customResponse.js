const HTTPSTATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
}

export const sendResponse = (res, statusCode, message, data = undefined) => {
  res.status(statusCode).json({
    status: statusCode,
    message,
    data
  });
}