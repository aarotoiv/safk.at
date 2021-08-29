const keys = require('./keys')

// Quicko hack

const requests = {}

const addRequest = (url) => {
  const usableUrl = url.trim().substring(0, 50)
  if (usableUrl.includes('assets') || usableUrl.includes('static') || usableUrl.includes('admin')) {
    return
  }
  if (!requests[usableUrl]) {
    requests[usableUrl] = 0
  }
  requests[usableUrl]++
}

const getRequests = () => requests

const checkAdminKey = (req, res, next) => {
  if (req.headers.authorization === keys.adminKey) {
    next()
    return
  }
  res.sendStatus(401)
}

module.exports = {
  addRequest,
  getRequests,
  checkAdminKey
}