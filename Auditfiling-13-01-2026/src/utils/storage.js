// src/utils/storage.js
import logger from './logger';

const safeGet = (key) => {
  try {
    const v = sessionStorage.getItem(key);
    if (v === null || v === 'null' || v === 'undefined' || v === undefined) return null;
    return v;
  } catch (e) {
    logger.warn('storage.safeGet error', e);
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    sessionStorage.setItem(key, String(value));
    return true;
  } catch (e) {
    logger.warn('storage.safeSet error', e);
    return false;
  }
};

const getUser = () => {
  try {
    const raw = sessionStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    logger.warn('storage.getUser parse error', e);
    return null;
  }
};


/* ---------------------- NEW: helper getters ---------------------- */
const getToken = () => safeGet("token") || null;
const getUserName = () => safeGet("user_name") || null;
/* ---------------------------------------------------------------- */

const getIds = () => {
  const user = getUser();

  const userId =
    (user && (user.id || user.user_id || user.userId || (user.data && user.data.id))) ||
    safeGet('lastPaidUserId') ||
    safeGet('userId') ||
    null;

  let serviceId =
    safeGet('lastPaidServiceId') ||
    safeGet('serviceId') ||
    null;

  if (!serviceId) {
    try {
      const params = new URLSearchParams(window.location.search);
      serviceId = params.get('serviceId') || params.get('service_id');
    } catch (e) {
      logger.warn('storage.getIds parse error', e);
      serviceId = null;
    }
  }

  const orderId = safeGet('lastOrderId') || null;
  const partialPaymentId = safeGet('lastPartialPaymentId') || null;

  return {
    userId: userId ? String(userId) : null,
    serviceId: serviceId ? String(serviceId) : null,
    orderId: orderId ? String(orderId) : null,
    partialPaymentId: partialPaymentId ? String(partialPaymentId) : null,

    // NEW 🔽
    token: getToken(),
    userName: getUserName(),
  };
};

/* ---------------------- NEW: set token/user/user_name ---------------------- */
const setUserData = ({ token, user, userName }) => {
  try {
    if (token) safeSet("token", token);
    if (user) safeSet("user", JSON.stringify(user));
    if (userName) safeSet("user_name", userName);
    return true;
  } catch (e) {
    logger.warn("storage.setUserData error", e);
    return false;
  }
};
/* -------------------------------------------------------------------------- */

const setIds = ({ userId, serviceId, orderId, partialPaymentId }) => {
  try {
    if (userId != null) safeSet('lastPaidUserId', userId);
    if (serviceId != null) safeSet('lastPaidServiceId', serviceId);
    if (orderId != null) safeSet('lastOrderId', orderId);
    if (partialPaymentId != null) safeSet('lastPartialPaymentId', partialPaymentId);
    return true;
  } catch (e) {
    logger.warn('storage.setIds error', e);
    return false;
  }
};

const clearIds = () => {
  try {
    sessionStorage.removeItem('lastPaidUserId');
    sessionStorage.removeItem('lastPaidServiceId');
    sessionStorage.removeItem('lastOrderId');
    sessionStorage.removeItem('lastPartialPaymentId');
    return true;
  } catch (e) {
    logger.warn('storage.clearIds error', e);
    return false;
  }
};

export default {
  safeGet,
  safeSet,
  getUser,
  getToken,
  getUserName,
  getIds,
  setIds,
  setUserData,
  clearIds,
};
