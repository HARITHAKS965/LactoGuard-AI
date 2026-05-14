import 'package:hive/hive.dart';

part 'scan_record.g.dart';

@HiveType(typeId: 0)
class ScanRecord extends HiveObject {
  @HiveField(0)
  final String productName;

  @HiveField(1)
  final int purityScore;

  @HiveField(2)
  final String riskLevel;

  @HiveField(3)
  final String recommendation;

  @HiveField(4)
  final DateTime scannedAt;

  @HiveField(5)
  final String? barcode;

  ScanRecord({
    required this.productName,
    required this.purityScore,
    required this.riskLevel,
    required this.recommendation,
    required this.scannedAt,
    this.barcode,
  });
}