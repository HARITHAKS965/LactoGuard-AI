import 'package:flutter/material.dart';
import '../core/theme.dart';
import 'analysis_screen.dart';

class BarcodeScreen extends StatefulWidget {
  const BarcodeScreen({super.key});
  @override
  State<BarcodeScreen> createState() => _BarcodeScreenState();
}

class _BarcodeScreenState extends State<BarcodeScreen> {
  final _barcodeController = TextEditingController();
  Map<String, dynamic>? _product;
  String? _error;

  static const Map<String, Map<String, dynamic>> _indianDB = {
    '8901058000424': {'name': 'Amul Gold Full Cream Milk', 'brand': 'Amul', 'fssai': '10016011002705', 'fat': '6g', 'protein': '3.5g', 'status': 'Trusted'},
    '8901058000417': {'name': 'Amul Taaza Toned Milk', 'brand': 'Amul', 'fssai': '10016011002705', 'fat': '3g', 'protein': '3g', 'status': 'Trusted'},
    '8906002490018': {'name': 'Mother Dairy Full Cream Milk', 'brand': 'Mother Dairy', 'fssai': '10016042000023', 'fat': '6g', 'protein': '3.5g', 'status': 'Trusted'},
    '8901030874941': {'name': 'Nestle NANGROW', 'brand': 'Nestle', 'fssai': '10016011000017', 'fat': '5.1g', 'protein': '16.5g', 'status': 'Trusted'},
    '8901719100018': {'name': 'Britannia Dairy Whitener', 'brand': 'Britannia', 'fssai': '10016011003283', 'fat': '1.5g', 'protein': '14g', 'status': 'Trusted'},
    '8906005570018': {'name': 'Patanjali Cow Ghee', 'brand': 'Patanjali', 'fssai': '10016042001456', 'fat': '99.7g', 'protein': '0g', 'status': 'Trusted'},
    '8901058853456': {'name': 'Amul Milk Powder', 'brand': 'Amul', 'fssai': '10016011002705', 'fat': '26g', 'protein': '25g', 'status': 'Trusted'},
  };

  static const _sampleBarcodes = [
    {'name': 'Amul Gold', 'barcode': '8901058000424'},
    {'name': 'Amul Taaza', 'barcode': '8901058000417'},
    {'name': 'Mother Dairy', 'barcode': '8906002490018'},
    {'name': 'Nestle NANGROW', 'barcode': '8901030874941'},
    {'name': 'Britannia', 'barcode': '8901719100018'},
    {'name': 'Patanjali Ghee', 'barcode': '8906005570018'},
  ];

  void _lookupBarcode(String barcode) {
    final key = barcode.trim();
    if (key.isEmpty) return;
    if (_indianDB.containsKey(key)) {
      setState(() { _product = Map<String, dynamic>.from(_indianDB[key]!); _error = null; });
    } else {
      setState(() { _product = null; _error = 'Product not in database. Try a quick scan chip below or analyze by name.'; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Barcode Verification')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(colors: [Color(0xFF1565C0), Color(0xFF0D47A1)]),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Column(
                children: [
                  Icon(Icons.qr_code_scanner, size: 56, color: Colors.white),
                  SizedBox(height: 12),
                  Text('Barcode Lookup', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w800)),
                  SizedBox(height: 4),
                  Text('Verify Indian milk products by barcode', style: TextStyle(color: Colors.white70, fontSize: 13)),
                ],
              ),
            ),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _barcodeController,
                    keyboardType: TextInputType.number,
                    decoration: const InputDecoration(
                      hintText: 'Enter barcode number...',
                      prefixIcon: Icon(Icons.barcode_reader),
                    ),
                    onSubmitted: _lookupBarcode,
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () => _lookupBarcode(_barcodeController.text),
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                  child: const Icon(Icons.search),
                ),
              ],
            ),
            const SizedBox(height: 16),
            const Text('Popular Indian brands:', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Colors.grey)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8, runSpacing: 6,
              children: _sampleBarcodes.map((item) => ActionChip(
                label: Text(item['name']!, style: const TextStyle(fontSize: 11)),
                backgroundColor: LactoGuardTheme.primary.withOpacity(0.08),
                onPressed: () {
                  _barcodeController.text = item['barcode']!;
                  _lookupBarcode(item['barcode']!);
                },
              )).toList(),
            ),
            const SizedBox(height: 24),
            if (_error != null) Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: LactoGuardTheme.warning.withOpacity(0.08),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: LactoGuardTheme.warning.withOpacity(0.3)),
              ),
              child: Text(_error!, style: const TextStyle(color: LactoGuardTheme.warning)),
            ),
            if (_product != null) Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          _product!['status'] == 'Trusted' ? Icons.verified : Icons.warning,
                          color: _product!['status'] == 'Trusted' ? LactoGuardTheme.safe : LactoGuardTheme.danger,
                        ),
                        const SizedBox(width: 8),
                        Text(
                          _product!['status'] == 'Trusted' ? 'Verified Product' : 'Suspicious Product',
                          style: TextStyle(
                            fontWeight: FontWeight.w800, fontSize: 16,
                            color: _product!['status'] == 'Trusted' ? LactoGuardTheme.safe : LactoGuardTheme.danger,
                          ),
                        ),
                      ],
                    ),
                    const Divider(height: 24),
                    _infoRow('Product', _product!['name'].toString()),
                    _infoRow('Brand', _product!['brand'].toString()),
                    _infoRow('FSSAI No', _product!['fssai'].toString()),
                    _infoRow('Fat', _product!['fat'].toString()),
                    _infoRow('Protein', _product!['protein'].toString()),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton.icon(
                        onPressed: () => Navigator.push(context, MaterialPageRoute(
                          builder: (_) => AnalysisScreen(productName: _product!['name'].toString()),
                        )),
                        icon: const Icon(Icons.biotech),
                        label: const Text('Analyze for Adulteration'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) => Padding(
    padding: const EdgeInsets.only(bottom: 8),
    child: Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SizedBox(width: 80, child: Text(label, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 12, color: Colors.grey))),
        Expanded(child: Text(value, style: const TextStyle(fontSize: 13))),
      ],
    ),
  );
}