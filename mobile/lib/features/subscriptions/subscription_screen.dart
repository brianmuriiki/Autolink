import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../core/services/api_service.dart';
import '../../widgets/app_scaffold.dart';

class SubscriptionScreen extends ConsumerStatefulWidget {
  const SubscriptionScreen({super.key});

  @override
  ConsumerState<SubscriptionScreen> createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends ConsumerState<SubscriptionScreen> {
  int refresh = 0;

  Future<void> upgrade(String plan) async {
    await ref.read(apiServiceProvider).upgradeSubscription(plan);
    setState(() => refresh++);
  }

  @override
  Widget build(BuildContext context) {
    return AutoLinkScaffold(
      title: 'Subscription',
      child: FutureBuilder<Map<String, dynamic>>(
        key: ValueKey(refresh),
        future: ref.read(apiServiceProvider).subscription(),
        builder: (context, snapshot) {
          final current = snapshot.data?['plan'] ?? 'free';
          return ListView(
            padding: const EdgeInsets.all(16),
            children: ['free', 'premium', 'business']
                .map(
                  (plan) => Card(
                    child: ListTile(
                      title: Text(plan),
                      subtitle: Text(current == plan ? 'Current plan' : 'Tap to upgrade'),
                      trailing: FilledButton(onPressed: () => upgrade(plan), child: Text(current == plan ? 'Current' : 'Upgrade')),
                    ),
                  ),
                )
                .toList(),
          );
        },
      ),
    );
  }
}
