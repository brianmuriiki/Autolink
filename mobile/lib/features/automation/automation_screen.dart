import 'package:flutter/material.dart';

import '../../widgets/app_scaffold.dart';

class AutomationScreen extends StatelessWidget {
  const AutomationScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AutoLinkScaffold(
      title: 'Automation',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          TextField(decoration: InputDecoration(labelText: 'Message')),
          SizedBox(height: 12),
          Card(child: ListTile(title: Text('WhatsApp auto-reply'), subtitle: Text('Active'))),
          Card(child: ListTile(title: Text('Telegram scheduled reminder'), subtitle: Text('Scheduled'))),
          Card(child: ListTile(title: Text('Instagram customer reply'), subtitle: Text('Paused'))),
        ],
      ),
    );
  }
}

