import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'screens/home_screen.dart';
import 'core/theme.dart';

class LactoGuardApp extends StatelessWidget {
  const LactoGuardApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LactoGuard AI',
      debugShowCheckedModeBanner: false,
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      locale: context.locale,
      theme: LactoGuardTheme.light,
      home: const HomeScreen(),
    );
  }
}
