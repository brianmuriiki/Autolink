import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/services/api_service.dart';
import '../../widgets/app_scaffold.dart';

class PlatformsScreen extends ConsumerStatefulWidget {
  const PlatformsScreen({super.key});

  @override
  ConsumerState<PlatformsScreen> createState() => _PlatformsScreenState();
}

class _PlatformsScreenState extends ConsumerState<PlatformsScreen> {
  String platform = 'whatsapp';
  final accountName = TextEditingController();
  int refresh = 0;

  Future<void> connect() async {
    await ref.read(apiServiceProvider).connectPlatform({'platform': platform, 'account_name': accountName.text, 'external_account_id': '', 'token': 'development-token'});
    accountName.clear();
    setState(() => refresh++);
  }

  @override
  Widget build(BuildContext context) {
    return AutoLinkScaffold(
      title: 'Platforms',
      child: FutureBuilder<List<dynamic>>(
        key: ValueKey(refresh),
        future: ref.read(apiServiceProvider).platforms(),
        builder: (context, snapshot) {
          final accounts = snapshot.data ?? [];
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              DropdownButtonFormField<String>(
                value: platform,
                decoration: const InputDecoration(labelText: 'Platform'),
                items: const [
                  DropdownMenuItem(value: 'whatsapp', child: Text('WhatsApp')),
                  DropdownMenuItem(value: 'facebook', child: Text('Facebook')),
                  DropdownMenuItem(value: 'instagram', child: Text('Instagram')),
                  DropdownMenuItem(value: 'telegram', child: Text('Telegram')),
                ],
                onChanged: (value) => setState(() => platform = value ?? 'whatsapp'),
              ),
              const SizedBox(height: 12),
              TextField(controller: accountName, decoration: const InputDecoration(labelText: 'Account name')),
              const SizedBox(height: 12),
              FilledButton(onPressed: connect, child: const Text('Connect platform')),
              const SizedBox(height: 16),
              for (final account in accounts)
                Card(child: ListTile(leading: const Icon(Icons.link), title: Text('${account['platform']}'), subtitle: Text('${account['account_name'] ?? ''}'))),
            ],
          );
        },
      ),
    );
  }
}
