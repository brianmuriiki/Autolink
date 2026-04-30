import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../app/routes/app_routes.dart';
import '../../core/services/api_service.dart';

class AuthScreen extends ConsumerStatefulWidget {
  const AuthScreen({super.key});

  @override
  ConsumerState<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends ConsumerState<AuthScreen> {
  final email = TextEditingController();
  final password = TextEditingController();
  final fullName = TextEditingController();
  final username = TextEditingController();
  bool register = false;
  String error = '';

  Future<void> submit() async {
    setState(() => error = '');
    try {
      final api = ref.read(apiServiceProvider);
      if (register) {
        await api.register({
          'email': email.text,
          'password': password.text,
          'full_name': fullName.text,
          'username': username.text,
        });
      }
      final tokens = await api.login(email.text, password.text);
      api.setToken(tokens['access'] as String);
      if (mounted) Navigator.pushReplacementNamed(context, AppRoutes.dashboard);
    } catch (err) {
      setState(() => error = 'Authentication failed. Check your details and backend server.');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(24),
          children: [
            const SizedBox(height: 48),
            const Text('AutoLink', style: TextStyle(fontSize: 34, fontWeight: FontWeight.w900)),
            const SizedBox(height: 8),
            const Text('Manage automations across WhatsApp, Facebook, Instagram, and Telegram.'),
            const SizedBox(height: 24),
            if (error.isNotEmpty) Text(error, style: const TextStyle(color: Colors.red)),
            if (register) ...[
              TextField(controller: fullName, decoration: const InputDecoration(labelText: 'Full name')),
              const SizedBox(height: 12),
              TextField(controller: username, decoration: const InputDecoration(labelText: 'Username')),
              const SizedBox(height: 12),
            ],
            TextField(controller: email, decoration: const InputDecoration(labelText: 'Email')),
            const SizedBox(height: 12),
            TextField(controller: password, decoration: const InputDecoration(labelText: 'Password'), obscureText: true),
            const SizedBox(height: 20),
            FilledButton(onPressed: submit, child: Text(register ? 'Register' : 'Login')),
            TextButton(onPressed: () => setState(() => register = !register), child: Text(register ? 'Login instead' : 'Create account')),
          ],
        ),
      ),
    );
  }
}
