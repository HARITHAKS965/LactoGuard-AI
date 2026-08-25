import 'package:flutter/material.dart';
import 'nearby_labs_screen.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:share_plus/share_plus.dart';
import '../core/theme.dart';
import '../models/lacto_result.dart';

class ResultScreen extends StatelessWidget {
  final LactoResult result;
  const ResultScreen({super.key, required this.result});

  Color get _riskColor {
    switch (result.riskColor) {
      case 'safe':    return LactoGuardTheme.safe;
      case 'medium':  return LactoGuardTheme.warning;
      case 'warning': return Colors.deepOrange;
      default:        return LactoGuardTheme.danger;
    }
  }

  void _shareResult(BuildContext context) {
    final encodedProduct = Uri.encodeComponent(result.productName);
    final encodedIssues = Uri.encodeComponent(result.possibleIssues.join(', '));
    final encodedRisks = Uri.encodeComponent(result.healthRisks.join(', '));
    final encodedRec = Uri.encodeComponent(result.recommendation);

    final webReportUrl =
        'http://10.249.189.15:9090/#/report?p=$encodedProduct&s=${result.purityScore}&r=${result.riskLevel}&g=${result.grade}&i=$encodedIssues&h=$encodedRisks&rec=$encodedRec';

    final textReport =
        '🥛 LactoGuard AI Report\n'
        'Product: ${result.productName}\n'
        'Purity Score: ${result.purityScore}%  (Grade ${result.grade})\n'
        'Risk: ${result.riskLevel}\n'
        'Issues: ${result.possibleIssues.join(", ")}\n'
        'Health Risk: ${result.healthRisks.join(", ")}\n'
        'Recommendation: ${result.recommendation}\n\n'
        '🔗 Open Full Interactive Report:\n'
        '$webReportUrl\n\n'
        'Analyzed by LactoGuard AI — com.lactoguard.ai';

    Share.share(textReport, subject: 'LactoGuard AI – ${result.productName} Report');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF4F7FC),
      appBar: AppBar(
        title: const Text('LactoGuard Report'),
        backgroundColor: LactoGuardTheme.primary,
        actions: [
          IconButton(
            icon: const Icon(Icons.share),
            tooltip: 'Share Report',
            onPressed: () => _shareResult(context),
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 780),
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                // === PURITY GAUGE ===
                Card(
                  elevation: 2,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  child: Padding(
                    padding: const EdgeInsets.all(22),
                    child: Column(
                      children: [
                        Text(
                          result.productName,
                          textAlign: TextAlign.center,
                          style: const TextStyle(
                              fontSize: 18, fontWeight: FontWeight.w800),
                        ),
                        const SizedBox(height: 20),
                        SizedBox(
                          height: 180,
                          child: Stack(
                            alignment: Alignment.center,
                            children: [
                              PieChart(PieChartData(
                                startDegreeOffset: -90,
                                sections: [
                                  PieChartSectionData(
                                    value: result.purityScore.toDouble(),
                                    color: _riskColor,
                                    radius: 30,
                                    showTitle: false,
                                  ),
                                  PieChartSectionData(
                                    value: 100 - result.purityScore.toDouble(),
                                    color: Colors.grey.shade200,
                                    radius: 30,
                                    showTitle: false,
                                  ),
                                ],
                                centerSpaceRadius: 65,
                              )),
                              Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    '${result.purityScore}%',
                                    style: TextStyle(
                                        fontSize: 36,
                                        fontWeight: FontWeight.w900,
                                        color: _riskColor),
                                  ),
                                  Text(
                                    'Grade ${result.grade}',
                                    style: TextStyle(
                                        fontSize: 16,
                                        fontWeight: FontWeight.w700,
                                        color: _riskColor),
                                  ),
                                  Text(
                                    'Purity Score',
                                    style: TextStyle(
                                        fontSize: 12, color: Colors.grey[500]),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        // Risk badge
                        Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 20, vertical: 8),
                          decoration: BoxDecoration(
                            color: _riskColor,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Text(
                            '${result.riskLevel} Adulteration Risk',
                            style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 13),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // === POSSIBLE ISSUES ===
                _SectionCard(
                  icon: Icons.warning_amber,
                  iconColor: LactoGuardTheme.warning,
                  title: 'Detected Issues',
                  children: result.possibleIssues
                      .map((issue) => _BulletRow(
                            text: issue,
                            color: LactoGuardTheme.warning,
                          ))
                      .toList(),
                ),
                const SizedBox(height: 12),

                // === HEALTH RISKS ===
                _SectionCard(
                  icon: Icons.health_and_safety,
                  iconColor: LactoGuardTheme.danger,
                  title: 'Health Risks',
                  children: result.healthRisks
                      .map((risk) => _BulletRow(
                            text: risk,
                            color: LactoGuardTheme.danger,
                          ))
                      .toList(),
                ),
                const SizedBox(height: 12),

                // === HOME TEST METHOD ===
                _SectionCard(
                  icon: Icons.science,
                  iconColor: LactoGuardTheme.primary,
                  title: 'Home Test Method',
                  children: [
                    Text(
                      result.testMethod,
                      style: const TextStyle(fontSize: 14, height: 1.5),
                    ),
                  ],
                ),
                const SizedBox(height: 12),

                // === RECOMMENDATION ===
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: _riskColor.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: _riskColor.withOpacity(0.4)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(Icons.lightbulb, color: _riskColor, size: 22),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'LactoGuard Recommendation',
                              style: TextStyle(
                                  fontWeight: FontWeight.w800,
                                  color: _riskColor,
                                  fontSize: 13),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              result.recommendation,
                              style: const TextStyle(fontSize: 14, height: 1.4),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 20),

                // === LAB TEST BUTTON (if critical) ===
                if (result.requiresLabTest || result.purityScore < 55) ...[
                  ElevatedButton.icon(
                    onPressed: () => Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => NearbyLabsScreen())),
                    icon: const Icon(Icons.location_on),
                    label: const Text('Find Nearby Testing Lab'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: LactoGuardTheme.danger,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                    ),
                  ),
                  const SizedBox(height: 10),
                ],

                // Share button
                ElevatedButton.icon(
                  onPressed: () => _shareResult(context),
                  icon: const Icon(Icons.share),
                  label: const Text('Share This Report (With Anyone)'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: LactoGuardTheme.primary,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 20),

                // Footer
                const Center(
                  child: Text(
                    'LactoGuard AI — Protecting India\'s Milk Supply',
                    style: TextStyle(
                        color: Colors.grey,
                        fontSize: 11,
                        fontStyle: FontStyle.italic),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final List<Widget> children;

  const _SectionCard({
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.children,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 1.5,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(icon, color: iconColor, size: 20),
                const SizedBox(width: 8),
                Text(title,
                    style: const TextStyle(
                        fontWeight: FontWeight.w800, fontSize: 15)),
              ],
            ),
            const SizedBox(height: 12),
            ...children,
          ],
        ),
      ),
    );
  }
}

class _BulletRow extends StatelessWidget {
  final String text;
  final Color color;
  const _BulletRow({required this.text, required this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(Icons.circle, size: 7, color: color),
          const SizedBox(width: 10),
          Expanded(
              child: Text(text,
                  style: const TextStyle(fontSize: 14, height: 1.4))),
        ],
      ),
    );
  }
}
