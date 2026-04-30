import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/services/api_service.dart';
import '../../widgets/app_scaffold.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AutoLinkScaffold(
      title: 'Dashboard',
      child: FutureBuilder<Map<String, dynamic>>(
        future: ref.read(apiServiceProvider).reportSummary(),
        builder: (context, snapshot) {
          final stats = snapshot.data ?? {'automations': 0, 'active_automations': 0, 'activity_logs': 0};
          return GridView.count(
            padding: const EdgeInsets.all(16),
            crossAxisCount: 2,
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            children: stats.entries
                .map((item) => Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(item.key.replaceAll('_', ' ')),
                          const Spacer(),
                          Text('${item.value}', style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900)),
                        ]),
                      ),
                    ))
                .toList(),
          );
        },
      ),
    );
  }
}
