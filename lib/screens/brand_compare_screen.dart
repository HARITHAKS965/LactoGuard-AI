import 'package:flutter/material.dart';
import '../core/theme.dart';

class BrandCompareScreen extends StatelessWidget {
  const BrandCompareScreen({super.key});

  static const _brands = [
    {
      'name': 'Amul Gold',
      'score': 94,
      'status': 'Trusted',
      'fssai': true,
      'issues': 'None detected',
    },
    {
      'name': 'Nestlé NANGROW',
      'score': 91,
      'status': 'Trusted',
      'fssai': true,
      'issues': 'None detected',
    },
    {
      'name': 'Mother Dairy',
      'score': 88,
      'status': 'Trusted',
      'fssai': true,
      'issues': 'None detected',
    },
    {
      'name': 'Unknown Brand X',
      'score': 43,
      'status': 'Suspicious',
      'fssai': false,
      'issues': 'Starch, vegetable fat',
    },
    {
      'name': 'Local Brand Y',
      'score': 61,
      'status': 'Medium Risk',
      'fssai': false,
      'issues': 'Maltodextrin added',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Brand Comparison')),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: _brands.length,
        itemBuilder: (ctx, i) {
          final b = _brands[i];
          final score = b['score'] as int;
          final isTrusted = b['status'] == 'Trusted';
          final color = score >= 85
              ? LactoGuardTheme.safe
              : score >= 65
                  ? LactoGuardTheme.warning
                  : LactoGuardTheme.danger;

          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Row(
                children: [
                  // Score circle
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: color.withOpacity(0.12),
                      border: Border.all(color: color, width: 2),
                    ),
                    child: Center(
                      child: Text(
                        '$score',
                        style: TextStyle(
                            color: color,
                            fontWeight: FontWeight.w900,
                            fontSize: 16),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(b['name'] as String,
                            style: const TextStyle(
                                fontWeight: FontWeight.w800, fontSize: 15)),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                  horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: color.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                b['status'] as String,
                                style: TextStyle(
                                    color: color,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700),
                              ),
                            ),
                            const SizedBox(width: 6),
                            if (b['fssai'] as bool)
                              const Text('✅ FSSAI',
                                  style: TextStyle(fontSize: 11)),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Issues: ${b['issues']}',
                          style: TextStyle(
                              fontSize: 12, color: Colors.grey[600]),
                        ),
                      ],
                    ),
                  ),
                  Icon(
                    isTrusted ? Icons.verified : Icons.warning,
                    color: color,
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}