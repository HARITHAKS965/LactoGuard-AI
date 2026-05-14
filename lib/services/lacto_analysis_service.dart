import 'dart:convert';
import 'package:hive/hive.dart';
import 'package:http/http.dart' as http;
import '../models/lacto_result.dart';
import '../models/scan_record.dart';
import '../core/constants.dart';

class LactoAnalysisService {
  // ---------- OFFLINE DATABASE ----------
  static const Map<String, Map<String, dynamic>> _offlineDB = {
    'milk powder': {
      'purityScore': 78,
      'riskLevel': 'Medium',
      'possibleIssues': ['Starch detected', 'Maltodextrin added'],
      'healthRisks': ['Digestive discomfort', 'Bloating'],
      'recommendation': 'Avoid regular use. Prefer FSSAI certified brands.',
      'testMethod':
          'Add iodine drops to dissolved sample. Blue-black = starch present.',
      'requiresLabTest': false,
    },
    'skimmed milk powder': {
      'purityScore': 62,
      'riskLevel': 'High',
      'possibleIssues': ['Melamine traces', 'Vegetable fat substitution'],
      'healthRisks': ['Kidney damage', 'Cardiovascular risk'],
      'recommendation': 'Do not use for infants. Get lab tested.',
      'testMethod':
          'Lab test required. HPLC method for melamine detection.',
      'requiresLabTest': true,
    },
    'full cream milk powder': {
      'purityScore': 85,
      'riskLevel': 'Low',
      'possibleIssues': ['Minor starch traces'],
      'healthRisks': ['Minimal risk'],
      'recommendation': 'Generally safe. Check expiry and seal.',
      'testMethod': 'Visual check: should dissolve completely without lumps.',
      'requiresLabTest': false,
    },
    'infant formula': {
      'purityScore': 45,
      'riskLevel': 'Critical',
      'possibleIssues': ['Melamine', 'Excess sugar', 'Substandard protein'],
      'healthRisks': [
        'Kidney failure in infants',
        'Malnutrition',
        'Development delay'
      ],
      'recommendation':
          'STOP using immediately. Report to FSSAI. Consult pediatrician.',
      'testMethod': 'Mandatory lab test. Do not self-test for infant products.',
      'requiresLabTest': true,
    },
    'dairy whitener': {
      'purityScore': 70,
      'riskLevel': 'Medium',
      'possibleIssues': ['Hydrogenated fat', 'Artificial emulsifiers'],
      'healthRisks': ['Trans fat risk', 'Heart disease'],
      'recommendation': 'Use sparingly. Not suitable for daily consumption.',
      'testMethod':
          'Rub between fingers. Greasy feel = vegetable fat present.',
      'requiresLabTest': false,
    },
  };

  Future<LactoResult> analyze(String productName) async {
    final key = productName.toLowerCase().trim();

    // 1. Try offline DB first
    if (_offlineDB.containsKey(key)) {
      final data = _offlineDB[key]!;
      return _buildResult(productName, data);
    }

    // 2. Try Hive cache
    final box = Hive.box('lactoguard_products');
    if (box.containsKey(key)) {
      final cached = Map<String, dynamic>.from(box.get(key));
      return _buildResult(productName, cached);
    }

    // 3. Try API (online)
    try {
      final response = await http
          .get(
            Uri.parse('${LactoGuardConstants.baseUrl}/analyze?product=$key'),
            headers: {'Content-Type': 'application/json'},
          )
          .timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        // Cache result offline
        box.put(key, data);
        return _buildResult(productName, data);
      }
    } catch (_) {
      // Network failed — fall through to generic result
    }

    // 4. Generic milk powder result as fallback
    return LactoResult(
      productName: productName,
      purityScore: 72,
      riskLevel: 'Medium',
      possibleIssues: ['Unknown additives', 'Unverified source'],
      healthRisks: ['Unknown risk — proceed with caution'],
      recommendation:
          'No specific data found. Buy from FSSAI-certified retailers only.',
      testMethod:
          'Dissolve in warm water. Pure milk powder dissolves completely.',
      requiresLabTest: false,
      analyzedAt: DateTime.now(),
    );
  }

  LactoResult _buildResult(String name, Map<String, dynamic> data) {
    final result = LactoResult(
      productName: name,
      purityScore: data['purityScore'] as int,
      riskLevel: data['riskLevel'] as String,
      possibleIssues: List<String>.from(data['possibleIssues']),
      healthRisks: List<String>.from(data['healthRisks']),
      recommendation: data['recommendation'] as String,
      testMethod: data['testMethod'] as String,
      requiresLabTest: data['requiresLabTest'] as bool,
      analyzedAt: DateTime.now(),
    );

    // Save to history
    _saveToHistory(result);
    return result;
  }

  Future<void> _saveToHistory(LactoResult result) async {
    final box = Hive.box<ScanRecord>('lactoguard_history');
    final record = ScanRecord(
      productName: result.productName,
      purityScore: result.purityScore,
      riskLevel: result.riskLevel,
      recommendation: result.recommendation,
      scannedAt: result.analyzedAt,
    );
    await box.add(record);
  }
}