// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'scan_record.dart';

// **************************************************************************
// TypeAdapterGenerator
// **************************************************************************

class ScanRecordAdapter extends TypeAdapter<ScanRecord> {
  @override
  final int typeId = 0;

  @override
  ScanRecord read(BinaryReader reader) {
    final numOfFields = reader.readByte();
    final fields = <int, dynamic>{
      for (int i = 0; i < numOfFields; i++) reader.readByte(): reader.read(),
    };
    return ScanRecord(
      productName: fields[0] as String,
      purityScore: fields[1] as int,
      riskLevel: fields[2] as String,
      recommendation: fields[3] as String,
      scannedAt: fields[4] as DateTime,
      barcode: fields[5] as String?,
    );
  }

  @override
  void write(BinaryWriter writer, ScanRecord obj) {
    writer
      ..writeByte(6)
      ..writeByte(0)
      ..write(obj.productName)
      ..writeByte(1)
      ..write(obj.purityScore)
      ..writeByte(2)
      ..write(obj.riskLevel)
      ..writeByte(3)
      ..write(obj.recommendation)
      ..writeByte(4)
      ..write(obj.scannedAt)
      ..writeByte(5)
      ..write(obj.barcode);
  }

  @override
  int get hashCode => typeId.hashCode;

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ScanRecordAdapter &&
          runtimeType == other.runtimeType &&
          typeId == other.typeId;
}
