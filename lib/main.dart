import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'app.dart';
import 'models/scan_record.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);

  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    if (FirebaseAuth.instance.currentUser == null) {
      await FirebaseAuth.instance.signInAnonymously().catchError((e) {
        debugPrint('Anonymous auth error: $e');
        return null;
      });
    }
  } catch (e) {
    debugPrint('Firebase init error: $e');
  }

  await Hive.initFlutter();
  Hive.registerAdapter(ScanRecordAdapter());
  await Hive.openBox<ScanRecord>('lactoguard_history');
  await Hive.openBox('lactoguard_products');
  await Hive.openBox('lactoguard_settings');

  await EasyLocalization.ensureInitialized();

  runApp(
    ProviderScope(
      child: EasyLocalization(
        supportedLocales: const [
          Locale('en'),
          Locale('ta'),
          Locale('hi'),
          Locale('te'),
          Locale('kn'),
        ],
        path: 'assets/translations',
        fallbackLocale: const Locale('en'),
        child: const LactoGuardApp(),
      ),
    ),
  );
}