class ApiConstants {
  static const String baseUrl = 'http://localhost:3000/api';
  
  // Auth endpoints
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String verify = '/auth/verify';
  static const String resendOtp = '/auth/resend-otp';
  static const String updateAccount = '/auth/update';
  static const String deleteAccount = '/auth/delete';
}
