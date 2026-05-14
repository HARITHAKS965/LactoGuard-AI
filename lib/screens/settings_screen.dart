import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../core/theme.dart';
import '../models/scan_record.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});
  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notifications = true;
  bool _offlineMode = true;
  bool _saveHistory = true;
  String _selectedLanguage = 'en';

  final _languages = [
    {'code': 'en', 'name': 'English', 'flag': '🇬🇧'},
    {'code': 'ta', 'name': 'தமிழ்', 'flag': '🇮🇳'},
    {'code': 'hi', 'name': 'हिंदी', 'flag': '🇮🇳'},
    {'code': 'te', 'name': 'తెలుగు', 'flag': '🇮🇳'},
  ];

  @override
  void initState() {
    super.initState();
    final box = Hive.box('lactoguard_settings');
    _notifications = box.get('notifications', defaultValue: true);
    _offlineMode = box.get('offlineMode', defaultValue: true);
    _saveHistory = box.get('saveHistory', defaultValue: true);
    _selectedLanguage = box.get('language', defaultValue: 'en');
  }

  void _saveSetting(String key, dynamic value) {
    Hive.box('lactoguard_settings').put(key, value);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Language
            _sectionTitle('Language'),
            Card(
              child: Column(
                children: _languages.map((lang) => RadioListTile<String>(
                  value: lang['code']!,
                  groupValue: _selectedLanguage,
                  title: Text('${lang['flag']} ${lang['name']}'),
                  onChanged: (val) {
                    setState(() => _selectedLanguage = val!);
                    _saveSetting('language', val);
                    context.setLocale(Locale(val!));
                  },
                )).toList(),
              ),
            ),
            const SizedBox(height: 16),

            // Preferences
            _sectionTitle('Preferences'),
            Card(
              child: Column(
                children: [
                  SwitchListTile(
                    value: _notifications,
                    onChanged: (val) {
                      setState(() => _notifications = val);
                      _saveSetting('notifications', val);
                    },
                    title: const Text('Notifications', style: TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: const Text('Alert for high risk products'),
                    secondary: const Icon(Icons.notifications, color: LactoGuardTheme.primary),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    value: _offlineMode,
                    onChanged: (val) {
                      setState(() => _offlineMode = val);
                      _saveSetting('offlineMode', val);
                    },
                    title: const Text('Offline Mode', style: TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: const Text('Use local database without internet'),
                    secondary: const Icon(Icons.wifi_off, color: LactoGuardTheme.primary),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    value: _saveHistory,
                    onChanged: (val) {
                      setState(() => _saveHistory = val);
                      _saveSetting('saveHistory', val);
                    },
                    title: const Text('Save Scan History', style: TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: const Text('Store analysis results locally'),
                    secondary: const Icon(Icons.history, color: LactoGuardTheme.primary),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Data Management
            _sectionTitle('Data Management'),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.delete_sweep, color: Colors.red),
                    title: const Text('Clear Scan History', style: TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: const Text('Delete all saved scans'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                    onTap: () async {
                      final confirm = await showDialog<bool>(
                        context: context,
                        builder: (_) => AlertDialog(
                          title: const Text('Clear History'),
                          content: const Text('This will delete all scan history. Are you sure?'),
                          actions: [
                            TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                            TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: Colors.red))),
                          ],
                        ),
                      );
                      if (confirm == true) {
                        await Hive.box<ScanRecord>('lactoguard_history').clear();
                        if (context.mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('History cleared!'), backgroundColor: Colors.green),
                          );
                        }
                      }
                    },
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // About
            _sectionTitle('About'),
            Card(
              child: Column(
                children: [
                  ListTile(
                    leading: const Icon(Icons.info, color: LactoGuardTheme.primary),
                    title: const Text('Version', style: TextStyle(fontWeight: FontWeight.w600)),
                    trailing: const Text('1.0.0', style: TextStyle(color: Colors.grey)),
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.shield, color: LactoGuardTheme.primary),
                    title: const Text('Privacy Policy', style: TextStyle(fontWeight: FontWeight.w600)),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                    onTap: () {},
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.star, color: LactoGuardTheme.accent),
                    title: const Text('Rate on Play Store', style: TextStyle(fontWeight: FontWeight.w600)),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                    onTap: () {},
                  ),
                  const Divider(height: 1),
                  ListTile(
                    leading: const Icon(Icons.email, color: LactoGuardTheme.primary),
                    title: const Text('Contact Support', style: TextStyle(fontWeight: FontWeight.w600)),
                    subtitle: const Text('support@lactoguard.ai'),
                    trailing: const Icon(Icons.arrow_forward_ios, size: 14),
                    onTap: () {},
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Center(
              child: Column(
                children: [
                  const Icon(Icons.water_drop, size: 40, color: LactoGuardTheme.primary),
                  const SizedBox(height: 8),
                  const Text('LactoGuard AI', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                  Text('Milk Purity. AI Powered. You Protected.', style: TextStyle(color: Colors.grey[500], fontSize: 12)),
                  const SizedBox(height: 4),
                  Text('v1.0.0 © 2025 LactoGuard', style: TextStyle(color: Colors.grey[400], fontSize: 11)),
                ],
              ),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _sectionTitle(String title) => Padding(
    padding: const EdgeInsets.only(bottom: 8, left: 4),
    child: Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Colors.grey, letterSpacing: 0.5)),
  );
}