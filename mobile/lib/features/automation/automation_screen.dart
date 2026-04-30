import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/services/api_service.dart';
import '../../widgets/app_scaffold.dart';

class AutomationScreen extends ConsumerStatefulWidget {
  const AutomationScreen({super.key});

  @override
  ConsumerState<AutomationScreen> createState() => _AutomationScreenState();
}

class _AutomationScreenState extends ConsumerState<AutomationScreen> {
  final message = TextEditingController();
  String type = 'auto_reply';
  int refresh = 0;

  Future<void> create() async {
    if (message.text.trim().isEmpty) return;
    await ref.read(apiServiceProvider).createAutomation({'type': type, 'message': message.text.trim(), 'trigger': '', 'schedule_time': null, 'connected_account': null});
    message.clear();
    setState(() => refresh++);
  }

  @override
  Widget build(BuildContext context) {
    return AutoLinkScaffold(
      title: 'Automation',
      child: FutureBuilder<List<dynamic>>(
        key: ValueKey(refresh),
        future: ref.read(apiServiceProvider).automations(),
        builder: (context, snapshot) {
          final automations = snapshot.data ?? [];
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              DropdownButtonFormField<String>(
                value: type,
                decoration: const InputDecoration(labelText: 'Type'),
                items: const [
                  DropdownMenuItem(value: 'auto_reply', child: Text('Auto Reply')),
                  DropdownMenuItem(value: 'scheduled_message', child: Text('Scheduled Message')),
                ],
                onChanged: (value) => setState(() => type = value ?? 'auto_reply'),
              ),
              const SizedBox(height: 12),
              TextField(controller: message, decoration: const InputDecoration(labelText: 'Message')),
              const SizedBox(height: 12),
              FilledButton(onPressed: create, child: const Text('Save automation')),
              const SizedBox(height: 16),
              for (final item in automations)
                Card(
                  child: ListTile(
                    title: Text('${item['type']}'),
                    subtitle: Text('${item['message']}'),
                    trailing: Switch(
                      value: item['is_active'] == true,
                      onChanged: (_) async {
                        await ref.read(apiServiceProvider).toggleAutomation(item['id'] as int);
                        setState(() => refresh++);
                      },
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
