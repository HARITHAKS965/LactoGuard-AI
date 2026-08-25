import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:hive/hive.dart';
import 'package:http/http.dart' as http;
import '../models/lacto_result.dart';
import '../models/scan_record.dart';

class LactoAnalysisService {
  static const Map<String, Map<String, dynamic>> _offlineDB = {
    'dairy whitener': {
      'purityScore': 70,
      'riskLevel': 'Medium',
      'possibleIssues': ['Hydrogenated fat', 'Artificial emulsifiers'],
      'healthRisks': ['Trans fat risk', 'Heart disease'],
      'recommendation': 'Use sparingly. Not suitable for daily consumption.',
      'testMethod': 'Rub between fingers. Greasy feel = vegetable fat present.',
      'requiresLabTest': false,
    },
    'cadbury dairy milk': {
      'purityScore': 86,
      'riskLevel': 'Low',
      'possibleIssues': ['None detected'],
      'healthRisks': ['Minimal risk - contains sugar'],
      'recommendation': 'Safe for consumption. FSSAI certified confectionery product.',
      'testMethod': 'Visual check: should have smooth texture and melt evenly.',
      'requiresLabTest': false,
    },
    'milk powder': {
      'purityScore': 78,
      'riskLevel': 'Medium',
      'possibleIssues': ['Starch detected', 'Maltodextrin added'],
      'healthRisks': ['Digestive discomfort', 'Bloating'],
      'recommendation': 'Avoid regular use. Prefer FSSAI certified brands.',
      'testMethod': 'Add iodine drops to dissolved sample. Blue-black = starch present.',
      'requiresLabTest': false,
    },
    'skimmed milk powder': {
      'purityScore': 62,
      'riskLevel': 'High',
      'possibleIssues': ['Melamine traces', 'Vegetable fat substitution'],
      'healthRisks': ['Kidney damage', 'Cardiovascular risk'],
      'recommendation': 'Do not use for infants. Get lab tested.',
      'testMethod': 'Lab test required. HPLC method for melamine detection.',
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
      'healthRisks': ['Kidney failure in infants', 'Malnutrition', 'Development delay'],
      'recommendation': 'STOP using immediately. Report to FSSAI. Consult pediatrician.',
      'testMethod': 'Mandatory lab test. Do not self-test for infant products.',
      'requiresLabTest': true,
    },
    'amul gold': {
      'purityScore': 92,
      'riskLevel': 'Low',
      'possibleIssues': ['None detected'],
      'healthRisks': ['Minimal risk'],
      'recommendation': 'Safe for consumption. FSSAI certified product.',
      'testMethod': 'Check seal and expiry date. Should dissolve completely.',
      'requiresLabTest': false,
    },
    'amul taaza': {
      'purityScore': 90,
      'riskLevel': 'Low',
      'possibleIssues': ['None detected'],
      'healthRisks': ['Minimal risk'],
      'recommendation': 'Safe for consumption. FSSAI certified product.',
      'testMethod': 'Check seal and expiry date.',
      'requiresLabTest': false,
    },
    'mother dairy': {
      'purityScore': 91,
      'riskLevel': 'Low',
      'possibleIssues': ['None detected'],
      'healthRisks': ['Minimal risk'],
      'recommendation': 'Safe for consumption. FSSAI certified product.',
      'testMethod': 'Check seal and expiry date.',
      'requiresLabTest': false,
    },
    'nestle nangrow': {
      'purityScore': 88,
      'riskLevel': 'Low',
      'possibleIssues': ['Added sugars'],
      'healthRisks': ['Monitor sugar intake for children'],
      'recommendation': 'Safe for children above 2 years. Check sugar content.',
      'testMethod': 'Check ingredients list for added sugars.',
      'requiresLabTest': false,
    },
    'horlicks': {
      'purityScore': 75,
      'riskLevel': 'Medium',
      'possibleIssues': ['High sugar content', 'Artificial flavors'],
      'healthRisks': ['Obesity risk', 'Dental issues'],
      'recommendation': 'Use in moderation. Not recommended for diabetics.',
      'testMethod': 'Check sugar content on label.',
      'requiresLabTest': false,
    },
    'complan': {
      'purityScore': 73,
      'riskLevel': 'Medium',
      'possibleIssues': ['High sugar', 'Artificial additives'],
      'healthRisks': ['Sugar overload', 'Artificial preservatives'],
      'recommendation': 'Use in moderation. Prefer plain milk for children.',
      'testMethod': 'Check ingredients for artificial additives.',
      'requiresLabTest': false,
    },
    'bournvita': {
      'purityScore': 68,
      'riskLevel': 'Medium',
      'possibleIssues': ['Very high sugar', 'Cocoa adulterants'],
      'healthRisks': ['Obesity', 'Diabetes risk', 'Hyperactivity in children'],
      'recommendation': 'Limit consumption. High sugar content not suitable for daily use.',
      'testMethod': 'Check sugar content. Should be less than 15g per serving.',
      'requiresLabTest': false,
    },
    'amul milk powder': {
      'purityScore': 89,
      'riskLevel': 'Low',
      'possibleIssues': ['None detected'],
      'healthRisks': ['Minimal risk'],
      'recommendation': 'Safe for consumption. FSSAI certified product.',
      'testMethod': 'Dissolve in warm water. Should dissolve completely without lumps.',
      'requiresLabTest': false,
    },
    'patanjali': {
      'purityScore': 82,
      'riskLevel': 'Low',
      'possibleIssues': ['Minor quality variations'],
      'healthRisks': ['Minimal risk'],
      'recommendation': 'Generally safe. Check manufacturing date.',
      'testMethod': 'Check seal integrity and manufacturing date.',
      'requiresLabTest': false,
    },
  };

  Future<LactoResult> analyze(String productName) async {
    final key = productName.toLowerCase().trim();
    LactoResult result;

    if (_offlineDB.containsKey(key)) {
      result = _buildResult(productName, _offlineDB[key]!);
    } else {
      bool foundPartial = false;
      Map<String, dynamic>? partialData;
      for (final dbKey in _offlineDB.keys) {
        if (key.contains(dbKey) || dbKey.contains(key)) {
          partialData = _offlineDB[dbKey];
          foundPartial = true;
          break;
        }
      }

      if (foundPartial && partialData != null) {
        result = _buildResult(productName, partialData);
      } else {
        result = LactoResult(
          productName: productName,
          purityScore: 72,
          riskLevel: 'Medium',
          possibleIssues: ['Unknown additives', 'Unverified source'],
          healthRisks: ['Unknown risk - proceed with caution'],
          recommendation: 'Buy from FSSAI-certified retailers only. Perform warm water dissolution test.',
          testMethod: 'Dissolve sample in warm water. Pure milk product dissolves smoothly without grease.',
          requiresLabTest: false,
          analyzedAt: DateTime.now(),
        );
      }
    }

    await _saveToHistory(result);
    return result;
  }

  LactoResult _buildResult(String name, Map<String, dynamic> data) {
    return LactoResult(
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
  }

  Future<void> _saveToHistory(LactoResult result) async {
    final record = ScanRecord(
      productName: result.productName,
      purityScore: result.purityScore,
      riskLevel: result.riskLevel,
      recommendation: result.recommendation,
      scannedAt: result.analyzedAt,
    );

    // 1. Save to local Hive box
    try {
      if (Hive.isBoxOpen('lactoguard_history')) {
        final box = Hive.box<ScanRecord>('lactoguard_history');
        await box.add(record);
      }
    } catch (e) {
      debugPrint('Hive history save error: $e');
    }

    // 2. Broadcast to Real-Time Sync Relay (Syncs Phone & Web instantly)
    final payload = json.encode({
      'productName': result.productName,
      'purityScore': result.purityScore,
      'riskLevel': result.riskLevel,
      'recommendation': result.recommendation,
      'scannedAt': result.analyzedAt.toIso8601String(),
    });

    final syncUrls = kIsWeb
        ? ['http://localhost:8088/api/scans', 'http://10.249.189.15:8088/api/scans']
        : ['http://10.249.189.15:8088/api/scans', 'http://10.0.2.2:8088/api/scans', 'http://localhost:8088/api/scans'];

    for (final url in syncUrls) {
      try {
        await http.post(
          Uri.parse(url),
          headers: {'Content-Type': 'application/json'},
          body: payload,
        ).timeout(const Duration(milliseconds: 1500));
        break;
      } catch (_) {}
    }
  }
}