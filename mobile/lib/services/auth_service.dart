import '../constants/api_constants.dart';
import '../models/user.dart';
import 'api_service.dart';

class AuthService {
  static Future<AuthResponse> register({
    required String name,
    required String phoneNumber,
    String? email,
    required String password,
    required String userType,
  }) async {
    final data = {
      'name': name,
      'phone_number': phoneNumber,
      'email': email,
      'password': password,
      'user_type': userType,
    };
    final response = await ApiService.post(ApiConstants.register, data);
    return AuthResponse.fromJson(response);
  }

  static Future<AuthResponse> login({
    required String phoneNumber,
    required String password,
  }) async {
    final data = {
      'phone_number': phoneNumber,
      'password': password,
    };
    final response = await ApiService.post(ApiConstants.login, data);
    return AuthResponse.fromJson(response);
  }

  static Future<AuthResponse> verify({
    String? phoneNumber,
    String? email,
    required String code,
  }) async {
    final data = {
      'phone_number': phoneNumber,
      'email': email,
      'code': code,
    };
    final response = await ApiService.post(ApiConstants.verify, data);
    return AuthResponse.fromJson(response);
  }

  static Future<Map<String, dynamic>> resendOTP({
    String? phoneNumber,
    String? email,
  }) async {
    final data = {
      'phone_number': phoneNumber,
      'email': email,
    };
    return await ApiService.post(ApiConstants.resendOtp, data);
  }

  static Future<AuthResponse> updateAccount(Map<String, dynamic> data) async {
    final response = await ApiService.put(ApiConstants.updateAccount, data);
    return AuthResponse.fromJson(response);
  }

  static Future<Map<String, dynamic>> deleteAccount() async {
    return await ApiService.delete(ApiConstants.deleteAccount);
  }
}
