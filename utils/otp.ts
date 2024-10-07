export default function generateOtp (length = 6) {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export const encodeOtp = (otp: string) => {
    return btoa(otp.toString());
};
  
export const decodeOtp = (encodedOtp : string) => {
    return atob(encodedOtp);
};
