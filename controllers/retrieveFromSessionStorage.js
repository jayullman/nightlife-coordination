// this module retrieves the sessionStorage

module.exports = function () {
  const sessionObj = {};
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    sessionObj[key] = JSON.parse(sessionStorage.getItem(key));
  }
  // clear session storage
  sessionStorage.clear();
  return sessionObj;
};
