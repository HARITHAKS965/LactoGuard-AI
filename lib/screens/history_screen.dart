import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import '../core/theme.dart';
import '../models/scan_record.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  Color _riskColor(String risk) {
    switch (risk.toLowerCase()) {
      case 'low':      return LactoGuardTheme.safe;
      case 'medium':   return LactoGuardTheme.warning;
      case 'high':     return Colors.deepOrange;
      default:         return LactoGuardTheme.danger;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scan History'),
        actions: [
          IconButton(
            icon: const Icon(Icons.delete_sweep),
            tooltip: 'Clear History',
            onPressed: () async {
              final confirm = await showDialog<bool>(
                context: context,
                builder: (_) => AlertDialog(
                  title: const Text('Clear History'),
                  content: const Text('Delete all scan history?'),
                  actions: [
                    TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
                    TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Delete', style: TextStyle(color: Colors.red))),
                  ],
                ),
              );
              if (confirm == true) {
                await Hive.box<ScanRecord>('lactoguard_history').clear();
              }
            },
          ),
        ],
      ),
      body: ValueListenableBuilder(
        valueListenable: Hive.box<ScanRecord>('lactoguard_history').listenable(),
        builder: (context, Box<ScanRecord> box, _) {
          if (box.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.history, size: 80, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  Text('No scans yet', style: TextStyle(fontSize: 18, color: Colors.grey[500], fontWeight: FontWeight.w600)),
                  const SizedBox(height: 8),
                  Text('Analyze a product to see history', style: TextStyle(color: Colors.grey[400])),
                ],
              ),
            );
          }
          final records = box.values.toList().reversed.toList();
          return ListView.builder(
            padding: const EdgeInsets.all(16),
            itemCount: records.length,
            itemBuilder: (context, index) {
              final r = records[index];
              final color = _riskColor(r.riskLevel);
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: ListTile(
                  contentPadding: const EdgeInsets.all(16),
                  leading: CircleAvatar(
                    backgroundColor: color.withOpacity(0.15),
                    child: Text(
                      '',
                      style: TextStyle(color: color, fontWeight: FontWeight.w900, fontSize: 13),
                    ),
                  ),
                  title: Text(r.productName, style: const TextStyle(fontWeight: FontWeight.w700)),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const SizedBox(height: 4),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(r.riskLevel, style: TextStyle(color: color, fontSize: 11, fontWeight: FontWeight.w700)),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        '// :',
                        style: TextStyle(fontSize: 11, color: Colors.grey[500]),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
