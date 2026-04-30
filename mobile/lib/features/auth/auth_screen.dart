import 'package:flutter/material.dart';

import '../../app/routes/app_routes.dart';

class AuthScreen extends StatelessWidget {
  const AuthScreen({super.key});

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
            const Text('Login or register to manage automations across WhatsApp, Facebook, Instagram, and Telegram.'),
            const SizedBox(height: 28),
            const TextField(decoration: InputDecoration(labelText: 'Email')),
            const SizedBox(height: 14),
            const TextField(decoration: InputDecoration(labelText: 'Password'), obscureText: true),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: () => Navigator.pushReplacementNamed(context, AppRoutes.dashboard),
              child: const Text('Continue'),
            ),
          ],
        ),
      ),
    );
  }
}

