import 'package:flutter/material.dart';

import '../app/routes/app_routes.dart';

class AutoLinkScaffold extends StatelessWidget {
  const AutoLinkScaffold({super.key, required this.title, required this.child});

  final String title;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(title)),
      body: SafeArea(child: child),
      bottomNavigationBar: NavigationBar(
        selectedIndex: 0,
        destinations: const [
          NavigationDestination(icon: Icon(Icons.dashboard_outlined), label: 'Home'),
          NavigationDestination(icon: Icon(Icons.smart_toy_outlined), label: 'Auto'),
          NavigationDestination(icon: Icon(Icons.link_outlined), label: 'Platforms'),
          NavigationDestination(icon: Icon(Icons.workspace_premium_outlined), label: 'Plan'),
        ],
        onDestinationSelected: (index) {
          final routes = [
            AppRoutes.dashboard,
            AppRoutes.automation,
            AppRoutes.platforms,
            AppRoutes.subscription,
          ];
          Navigator.pushReplacementNamed(context, routes[index]);
        },
      ),
    );
  }
}
