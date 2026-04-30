import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/services/api_service.dart';
import '../../widgets/app_scaffold.dart';

class ReportsScreen extends ConsumerWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AutoLinkScaffold(
      title: 'Reports',
      child: FutureBuilder<List<dynamic>>(
        future: ref.read(apiServiceProvider).reports(),
        builder: (context, snapshot) {
          final reports = snapshot.data ?? [];
          return ListView(
            padding: const EdgeInsets.all(16),
            children: [
              if (reports.isEmpty) const Card(child: ListTile(title: Text('No activity yet'))),
              for (final report in reports)
                Card(
                  child: ListTile(
                    title: Text('${report['action']}'),
                    subtitle: Text('${report['timestamp']}'),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
