import 'package:flutter/material.dart';

import '../../widgets/app_scaffold.dart';

class SubscriptionScreen extends StatelessWidget {
  const SubscriptionScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const AutoLinkScaffold(
      title: 'Subscription',
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Card(
          child: ListTile(
            title: Text('Premium'),
            subtitle: Text('Advanced automation and reports'),
            trailing: Text('KES 799'),
          ),
        ),
      ),
    );
  }
}

