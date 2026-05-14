class LactoResult {
  final String productName;
  final int purityScore;          // 0-100
  final String riskLevel;         // Low / Medium / High / Critical
  final List<String> possibleIssues;
  final List<String> healthRisks;
  final String recommendation;
  final String testMethod;        // how to test at home
  final bool requiresLabTest;
  final DateTime analyzedAt;

  const LactoResult({
    required this.productName,
    required this.purityScore,
    required this.riskLevel,
    required this.possibleIssues,
    required this.healthRisks,
    required this.recommendation,
    required this.testMethod,
    required this.requiresLabTest,
    required this.analyzedAt,
  });

  // Risk color
  String get riskColor {
    if (purityScore >= 85) return 'safe';
    if (purityScore >= 65) return 'medium';
    if (purityScore >= 45) return 'warning';
    return 'danger';
  }

  // Grade label
  String get grade {
    if (purityScore >= 85) return 'A';
    if (purityScore >= 70) return 'B';
    if (purityScore >= 55) return 'C';
    if (purityScore >= 40) return 'D';
    return 'F';
  }

  Map<String, dynamic> toMap() => {
    'productName':    productName,
    'purityScore':    purityScore,
    'riskLevel':      riskLevel,
    'possibleIssues': possibleIssues,
    'healthRisks':    healthRisks,
    'recommendation': recommendation,
    'testMethod':     testMethod,
    'requiresLabTest':requiresLabTest,
    'analyzedAt':     analyzedAt.toIso8601String(),
  };
}