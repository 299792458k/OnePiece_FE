/**
 * format theo ngày giờ vn
 * @param {String} dateString 
 * @returns 
 */
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN');
};

/**
 * format số
 * @param {*} num 
 * @returns 
 */
export const formatNumber = (num) => {
  return typeof num === 'number' ? num.toFixed(5) : num;
};
