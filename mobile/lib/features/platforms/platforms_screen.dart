import 'package:flutter/material.dart';

import '../../widgets/app_scaffold.dart';

class PlatformsScreen extends StatelessWidget {
  const PlatformsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return AutoLinkScaffold(
      title: 'Platforms',
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: ['WhatsApp', 'Facebook', 'Instagram', 'Telegram']
            .map((platform) => Card(
                  child: ListTile(
                    leading: const Icon(Icons.link),
                    title: Text(platform),
                    trailing: FilledButton(onPressed: () {}, child: const Text('Connect')),
                  ),
                ))
            .toList(),
      ),
    );
  }
}

