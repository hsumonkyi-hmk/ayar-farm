import 'dart:convert';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';

class ApiService {
  static String? _token;

  static void setToken(String? token) {
    _token = token;
  }

  static String? getToken() {
    return _token;
  }

  static Map<String, String> _getHeaders() {
    final headers = {'Content-Type': 'application/json'};
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  static Future<Map<String, dynamic>> post(
    String endpoint,
    Map<String, dynamic> data,
  ) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final response = await http.post(
      url,
      headers: _getHeaders(),
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> get(
    String endpoint, {
    Map<String, String>? queryParams,
  }) async {
    final uri = Uri.parse(
      '${ApiConstants.baseUrl}$endpoint',
    ).replace(queryParameters: queryParams);
    final response = await http.get(uri, headers: _getHeaders());
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> put(
    String endpoint,
    Map<String, dynamic> data,
  ) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final response = await http.put(
      url,
      headers: _getHeaders(),
      body: jsonEncode(data),
    );
    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> delete(String endpoint) async {
    final url = Uri.parse('${ApiConstants.baseUrl}$endpoint');
    final response = await http.delete(url, headers: _getHeaders());
    return jsonDecode(response.body);
  }
}
