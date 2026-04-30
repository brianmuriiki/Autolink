import 'package:dio/dio.dart';

class ApiService {
  ApiService()
      : dio = Dio(
          BaseOptions(
            baseUrl: 'http://127.0.0.1:8000/api/v1',
            connectTimeout: const Duration(seconds: 10),
            receiveTimeout: const Duration(seconds: 10),
          ),
        );

  final Dio dio;

  void setToken(String token) {
    dio.options.headers['Authorization'] = 'Bearer $token';
  }

  Future<Response<dynamic>> login(String email, String password) {
    return dio.post('/auth/login/', data: {'email': email, 'password': password});
  }

  Future<Response<dynamic>> automations() {
    return dio.get('/automation/list/');
  }
}

