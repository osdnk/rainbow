import { isValidAddress } from '@rainbow-me/rainbow-common';

/**
 * @desc get ethereum address from raw QR Code data
 * @param  {String}  data - qr code data
 * @return {String}  address - ethereum address
 */
export const getEthereumAddressFromQRCodeData = async (data) => {
  if (!data) return null;

  const parts = data.split(':');

  if (parts[0] === 'ethereum' && await isValidAddress(parts[1])) {
    return parts[1];
  }
  if (await isValidAddress(parts[0])) {
    return parts[0];
  }

  return null;
};

export const maxLength = 42;

export default {
  getEthereumAddressFromQRCodeData,
  maxLength,
};
