import 'package:flutter/material.dart';

import '../../widgets/app_scaffold.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final stats = {'Platforms': '4', 'Automations': '18', 'Scheduled': '9', 'Replies': '428'};
    return AutoLinkScaffold(
      title: 'Dashboard',
      child: GridView.count(
        padding: const EdgeInsets.all(16),
        crossAxisCount: 2,
        mainAxisSpacing: 12,
        crossAxisSpacing: 12,
        children: stats.entries
            .map((item) => Card(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                      Text(item.key),
                      const Spacer(),
                      Text(item.value, style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w900)),
                    ]),
                  ),
                ))
            .toList(),
      ),
    );
  }
}

