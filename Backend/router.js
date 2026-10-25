import router from "express";

import {
  user_register,
  otp_verification,
  resend_otp,
} from "./Controllers/register.js";

import {
  login,
  Login_with_otp,
  Login_verification,
  forgot_password,
  verify_reset_otp,
  reset_password,
} from "./Controllers/Login.js";

const route = router();

route.post("/auth/login", login);
route.post("/auth/send-login-otp", Login_with_otp);
route.post("/auth/verify-login-otp", Login_verification);

route.post("/auth/forgot-password", forgot_password);
route.post("/auth/verify-reset-otp", verify_reset_otp);
route.post("/auth/reset-password", reset_password);

route.post("/auth/register", user_register);
route.post("/auth/otpverification", otp_verification);
route.post("/auth/resendotp", resend_otp);

export default route;
