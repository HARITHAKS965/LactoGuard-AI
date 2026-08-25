import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:hive_flutter/hive_flutter.dart';
import 'package:http/http.dart' as http;
import '../core/theme.dart';
import '../models/scan_record.dart';
import '../models/lacto_result.dart';
import 'result_screen.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  List<Map<String, dynamic>> _syncedScans = [];
  Timer? _pollTimer;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchLiveScans();
    _pollTimer = Timer.periodic(const Duration(seconds: 2), (_) => _fetchLiveScans());
  }

  @override
  void dispose() {
    _pollTimer?.cancel();
    super.dispose();
  }

  Future<void> _fetchLiveScans() async {
    final syncUrls = kIsWeb
        ? ['http://localhost:8088/api/scans', 'http://10.249.189.15:8088/api/scans']
        : ['http://10.249.189.15:8088/api/scans', 'http://10.0.2.2:8088/api/scans', 'http://localhost:8088/api/scans'];

    for (final url in syncUrls) {
      try {
        final res = await http.get(Uri.parse(url)).timeout(const Duration(milliseconds: 1200));
        if (res.statusCode == 200) {
          final List data = json.decode(res.body);
          if (mounted) {
            setState(() {
              _syncedScans = List<Map<String, dynamic>>.from(data);
              _isLoading = false;
            });
          }
          return;
        }
      } catch (_) {}
    }

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  Color _riskColor(String risk) {
    switch (risk.toLowerCase()) {
      case 'low':
      case 'safe':
        return LactoGuardTheme.safe;
      case 'medium':
        return LactoGuardTheme.warning;
      case 'high':
        return Colors.deepOrange;
      default:
        return LactoGuardTheme.danger;
    }
  }

  Future<void> _clearAllHistory() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Clear History'),
        content: const Text('Delete all scan history?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text('Delete All', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirm == true) {
      try {
        if (Hive.isBoxOpen('lactoguard_history')) {
          await Hive.box<ScanRecord>('lactoguard_history').clear();
        }
      } catch (_) {}

      final syncUrls = kIsWeb
          ? ['http://localhost:8088/api/scans', 'http://10.249.189.15:8088/api/scans']
          : ['http://10.249.189.15:8088/api/scans', 'http://10.0.2.2:8088/api/scans', 'http://localhost:8088/api/scans'];

      for (final url in syncUrls) {
        try {
          await http.delete(Uri.parse(url)).timeout(const Duration(milliseconds: 1000));
          break;
        } catch (_) {}
      }

      setState(() => _syncedScans = []);
    }
  }

  void _openReport(Map<String, dynamic> item) {
    final score = (item['purityScore'] is int)
        ? item['purityScore'] as int
        : int.tryParse(item['purityScore']?.toString() ?? '70') ?? 70;
    final risk = item['riskLevel']?.toString() ?? 'Medium';
    final pName = item['productName']?.toString() ?? 'Milk Product';
    final rec = item['recommendation']?.toString() ?? 'Use with caution.';

    DateTime date = DateTime.now();
    if (item['scannedAt'] != null) {
      date = DateTime.tryParse(item['scannedAt'].toString()) ?? DateTime.now();
    }

    final result = LactoResult(
      productName: pName,
      purityScore: score,
      riskLevel: risk,
      possibleIssues: score < 80 ? ['Potential adulterants', 'Unverified quality'] : ['None detected'],
      healthRisks: score < 80 ? ['Digestive risk', 'Nutritional deficiency'] : ['Minimal risk'],
      recommendation: rec,
      testMethod: 'Perform warm water dissolution test. Pure milk product dissolves smoothly without grease.',
      requiresLabTest: score < 60,
      analyzedAt: date,
    );

    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => ResultScreen(result: result)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        title: const Text('Scan History'),
        backgroundColor: LactoGuardTheme.primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            tooltip: 'Refresh',
            onPressed: _fetchLiveScans,
          ),
          IconButton(
            icon: const Icon(Icons.delete_sweep),
            tooltip: 'Clear History',
            onPressed: _clearAllHistory,
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 850),
          child: ValueListenableBuilder<Box<ScanRecord>>(
            valueListenable: Hive.box<ScanRecord>('lactoguard_history').listenable(),
            builder: (context, hiveBox, _) {
              final List<Map<String, dynamic>> displayList = [];

              if (_syncedScans.isNotEmpty) {
                displayList.addAll(_syncedScans);
              } else {
                final hiveRecords = hiveBox.values.toList().reversed.toList();
                for (final r in hiveRecords) {
                  displayList.add({
                    'productName': r.productName,
                    'purityScore': r.purityScore,
                    'riskLevel': r.riskLevel,
                    'recommendation': r.recommendation,
                    'scannedAt': r.scannedAt.toIso8601String(),
                  });
                }
              }

              if (displayList.isEmpty && !_isLoading) {
                return Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.history, size: 70, color: Colors.grey[300]),
                      const SizedBox(height: 14),
                      Text('No scans yet', style: TextStyle(fontSize: 18, color: Colors.grey[600], fontWeight: FontWeight.w700)),
                      const SizedBox(height: 6),
                      Text('Analyze any milk product to see history here', style: TextStyle(color: Colors.grey[400], fontSize: 13)),
                    ],
                  ),
                );
              }

              return ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 18),
                itemCount: displayList.length,
                itemBuilder: (context, index) {
                  final item = displayList[index];
                  final score = item['purityScore'] ?? 70;
                  final color = _riskColor(item['riskLevel']?.toString() ?? 'Medium');
                  final pName = item['productName']?.toString() ?? 'Unknown';
                  final rec = item['recommendation']?.toString() ?? '';

                  DateTime date = DateTime.now();
                  if (item['scannedAt'] != null) {
                    date = DateTime.tryParse(item['scannedAt'].toString()) ?? DateTime.now();
                  }

                  return Card(
                    margin: const EdgeInsets.only(bottom: 12),
                    elevation: 1.5,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    child: ListTile(
                      onTap: () => _openReport(item),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                      leading: Container(
                        width: 48,
                        height: 48,
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: color.withOpacity(0.12),
                          border: Border.all(color: color, width: 2),
                        ),
                        child: Center(
                          child: Text(
                            '$score%',
                            style: TextStyle(color: color, fontWeight: FontWeight.w900, fontSize: 13),
                          ),
                        ),
                      ),
                      title: Text(pName, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15)),
                      subtitle: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                decoration: BoxDecoration(
                                  color: color.withOpacity(0.12),
                                  borderRadius: BorderRadius.circular(8),
                                ),
                                child: Text(
                                  'Risk: ${item['riskLevel'] ?? 'Medium'}',
                                  style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w700),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                '${date.day}/${date.month}/${date.year} ${date.hour.toString().padLeft(2, '0')}:${date.minute.toString().padLeft(2, '0')}',
                                style: TextStyle(fontSize: 11, color: Colors.grey[600]),
                              ),
                            ],
                          ),
                          if (rec.isNotEmpty) ...[
                            const SizedBox(height: 4),
                            Text(
                              rec,
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                            ),
                          ],
                        ],
                      ),
                      trailing: const Icon(Icons.chevron_right, color: Colors.grey),
                    ),
                  );
                },
              );
            },
          ),
        ),
      ),
    );
  }
}