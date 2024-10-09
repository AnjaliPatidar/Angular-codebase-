/**
 * A list of commonly used helper functions
 */

/**
 * @description update the user data in localStorage
 * example of how to listen the localStorage is changed: window.addEventListener('storage', (e) => {...});
 * @param userData
 */
export function updateEHubObjectDataLS(userData): void {
  const event: any = document.createEvent('StorageEvent');
  const eHubObject = JSON.parse(localStorage.getItem('ehubObject')) || {};
  if (Number(eHubObject.userId) === Number(userData.userId)) {
    eHubObject.fullName = `${userData.firstName} ${userData.lastName}`;
    // TODO: we also have userGroups, userRoles and other user data stored in localStorage, update other data the same way if needed.
    localStorage.setItem('ehubObject', JSON.stringify(eHubObject));
    event.initStorageEvent('storage', false, false, 'ehubObject', 'oldValue', 'newValue', null, window.localStorage);
    window.dispatchEvent(event);
  }
}
