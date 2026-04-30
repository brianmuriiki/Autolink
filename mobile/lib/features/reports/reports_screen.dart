import 'package:flutter/material.dart';

import '../../widgets/app_scaffold.dart';

class ReportsScreen extends StatelessWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const AutoLinkScaffold(
      title: 'Reports',
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          children: [
            Card(child: ListTile(title: Text('Auto-replies delivered'), trailing: Text('428'))),
            Card(child: ListTile(title: Text('Scheduled messages sent'), trailing: Text('93'))),
            Card(child: ListTile(title: Text('Failed sends'), trailing: Text('4'))),
          ],
        ),
      ),
    );
  }
}

