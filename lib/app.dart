import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'screens/home_screen.dart';
import 'screens/splash_screen.dart';
import 'screens/result_screen.dart';
import 'models/lacto_result.dart';
import 'core/theme.dart';

class LactoGuardApp extends StatelessWidget {
  const LactoGuardApp({super.key});

  Widget _buildReportOrHome() {
    try {
      final base = Uri.base;
      String? pName;
      int? score;
      String? risk;
      String? grade;
      String? issuesStr;
      String? risksStr;
      String? recStr;

      // 1. Check direct query parameters: ?p=...
      if (base.queryParameters.containsKey('p')) {
        pName = base.queryParameters['p'];
        score = int.tryParse(base.queryParameters['s'] ?? '70');
        risk = base.queryParameters['r'];
        grade = base.queryParameters['g'];
        issuesStr = base.queryParameters['i'];
        risksStr = base.queryParameters['h'];
        recStr = base.queryParameters['rec'];
      }
      // 2. Check fragment query parameters: #/report?p=...
      if (pName == null && base.fragment.isNotEmpty) {
        final frag = base.fragment;
        final qIndex = frag.indexOf('?');
        if (qIndex != -1) {
          final queryPart = frag.substring(qIndex + 1);
          final dummyUri = Uri.parse('http://localhost/?$queryPart');
          pName = dummyUri.queryParameters['p'];
          score = int.tryParse(dummyUri.queryParameters['s'] ?? '70');
          risk = dummyUri.queryParameters['r'];
          grade = dummyUri.queryParameters['g'];
          issuesStr = dummyUri.queryParameters['i'];
          risksStr = dummyUri.queryParameters['h'];
          recStr = dummyUri.queryParameters['rec'];
        }
      }

      if (pName != null && pName.trim().isNotEmpty) {
        final List<String> issues = (issuesStr != null && issuesStr.trim().isNotEmpty)
            ? issuesStr.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList()
            : ['None detected'];

        final List<String> healthRisks = (risksStr != null && risksStr.trim().isNotEmpty)
            ? risksStr.split(',').map((e) => e.trim()).where((e) => e.isNotEmpty).toList()
            : ['Minimal risk'];

        final sharedResult = LactoResult(
          productName: pName.trim(),
          purityScore: score ?? 85,
          riskLevel: risk ?? 'Low',
          possibleIssues: issues,
          healthRisks: healthRisks,
          recommendation: (recStr != null && recStr.trim().isNotEmpty)
              ? recStr.trim()
              : 'Safe for consumption. FSSAI certified product.',
          testMethod: 'Perform warm water dissolution test. Pure milk product dissolves smoothly without grease.',
          requiresLabTest: (score ?? 85) < 60,
          analyzedAt: DateTime.now(),
        );

        return ResultScreen(result: sharedResult);
      }
    } catch (e) {
      debugPrint('Report URL parsing error: $e');
    }

    return const HomeScreen();
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LactoGuard AI',
      debugShowCheckedModeBanner: false,
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      theme: LactoGuardTheme.light,
      home: _buildReportOrHome(),
      onGenerateRoute: (settings) {
        return MaterialPageRoute(
          builder: (_) => _buildReportOrHome(),
        );
      },
      routes: {
        '/splash': (_) => const SplashScreen(),
        '/home': (_) => const HomeScreen(),
      },
    );
  }
}