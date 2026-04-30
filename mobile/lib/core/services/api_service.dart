import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final apiServiceProvider = Provider<ApiService>((ref) => ApiService());

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

  Future<Map<String, dynamic>> register(Map<String, dynamic> data) async {
    final response = await dio.post('/auth/register/', data: data);
    return Map<String, dynamic>.from(response.data as Map);
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await dio.post('/auth/login/', data: {'email': email, 'password': password});
    return Map<String, dynamic>.from(response.data as Map);
  }

  Future<Map<String, dynamic>> profile() async {
    final response = await dio.get('/user/profile/');
    return Map<String, dynamic>.from(response.data as Map);
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    await dio.put('/user/update/', data: data);
  }

  Future<Map<String, dynamic>> reportSummary() async {
    final response = await dio.get('/reports/summary/');
    return Map<String, dynamic>.from(response.data as Map);
  }

  Future<List<dynamic>> reports() async {
    final response = await dio.get('/reports/activity/');
    return List<dynamic>.from(response.data as List);
  }

  Future<List<dynamic>> automations() async {
    final response = await dio.get('/automation/list/');
    return List<dynamic>.from(response.data as List);
  }

  Future<void> createAutomation(Map<String, dynamic> data) async {
    await dio.post('/automation/create/', data: data);
  }

  Future<void> toggleAutomation(int id) async {
    await dio.post('/automation/toggle/$id/');
  }

  Future<List<dynamic>> platforms() async {
    final response = await dio.get('/platform/list/');
    return List<dynamic>.from(response.data as List);
  }

  Future<void> connectPlatform(Map<String, dynamic> data) async {
    await dio.post('/platform/connect/', data: data);
  }

  Future<Map<String, dynamic>> subscription() async {
    final response = await dio.get('/subscription/status/');
    return Map<String, dynamic>.from(response.data as Map);
  }

  Future<void> upgradeSubscription(String plan) async {
    await dio.post('/subscription/upgrade/', data: {'plan': plan, 'days': 30});
  }
}
