import 'package:flutter/material.dart';

import '../../features/auth/auth_screen.dart';
import '../../features/automation/automation_screen.dart';
import '../../features/dashboard/dashboard_screen.dart';
import '../../features/platforms/platforms_screen.dart';
import '../../features/reports/reports_screen.dart';
import '../../features/subscriptions/subscription_screen.dart';

class AppRoutes {
  static const splash = '/';
  static const auth = '/auth';
  static const dashboard = '/dashboard';
  static const automation = '/automation';
  static const platforms = '/platforms';
  static const reports = '/reports';
  static const subscription = '/subscription';

  static Map<String, WidgetBuilder> get routes => {
        splash: (_) => const SplashScreen(),
        auth: (_) => const AuthScreen(),
        dashboard: (_) => const DashboardScreen(),
        automation: (_) => const AutomationScreen(),
        platforms: (_) => const PlatformsScreen(),
        reports: (_) => const ReportsScreen(),
        subscription: (_) => const SubscriptionScreen(),
      };
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    Future.microtask(() => Navigator.pushReplacementNamed(context, AppRoutes.auth));
    return const Scaffold(
      body: Center(
        child: Text('AutoLink', style: TextStyle(fontSize: 36, fontWeight: FontWeight.w900)),
      ),
    );
  }
}

