// this module saves to sessionStorage

module.exports = function (itemsToSave) {
  if (!itemsToSave) throw Error('Argument must not be empty');

  const keys = Object.keys(itemsToSave);
  keys.forEach((key) => {
    sessionStorage.setItem(key, itemsToSave[key]);
  });  
}
