import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/services/api_service.dart';
import '../../widgets/app_scaffold.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final fullName = TextEditingController();
  final username = TextEditingController();
  final phone = TextEditingController();

  Future<void> save() async {
    await ref.read(apiServiceProvider).updateProfile({'full_name': fullName.text, 'username': username.text, 'phone_number': phone.text});
  }

  @override
  Widget build(BuildContext context) {
    return AutoLinkScaffold(
      title: 'Profile',
      child: FutureBuilder<Map<String, dynamic>>(
        future: ref.read(apiServiceProvider).profile(),
        builder: (context, snapshot) {
          final data = snapshot.data;
          if (data != null && fullName.text.isEmpty) {
            fullName.text = '${data['full_name'] ?? ''}';
            username.text = '${data['username'] ?? ''}';
            phone.text = '${data['phone_number'] ?? ''}';
          }
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              TextField(controller: fullName, decoration: const InputDecoration(labelText: 'Full name')),
              const SizedBox(height: 12),
              TextField(controller: username, decoration: const InputDecoration(labelText: 'Username')),
              const SizedBox(height: 12),
              TextField(controller: phone, decoration: const InputDecoration(labelText: 'Phone')),
              const SizedBox(height: 16),
              FilledButton(onPressed: save, child: const Text('Save profile')),
            ],
          );
        },
      ),
    );
  }
}
