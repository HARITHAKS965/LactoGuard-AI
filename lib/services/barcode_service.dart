import 'dart:convert';
import 'package:http/http.dart' as http;
import '../core/constants.dart';

class BarcodeService {
  Future<Map<String, dynamic>> lookupBarcode(String barcode) async {
    try {
      // Open Food Facts — free & works offline after first fetch
      final url =
          '${LactoGuardConstants.openFoodFactsUrl}/$barcode.json';
      final response =
          await http.get(Uri.parse(url)).timeout(const Duration(seconds: 8));

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['status'] == 1) {
          final product = data['product'];
          return {
            'found': true,
            'name': product['product_name'] ?? 'Unknown',
            'brand': product['brands'] ?? 'Unknown',
            'categories': product['categories'] ?? '',
            'nutriscore': product['nutriscore_grade'] ?? 'N/A',
            'ingredients': product['ingredients_text'] ?? '',
            'imageUrl': product['image_url'] ?? '',
            'fssaiStatus': _checkFSSAI(product),
            'adulterationRisk': _assessRisk(product),
          };
        }
      }
    } catch (_) {}

    return {
      'found': false,
      'name': 'Product not found',
      'brand': 'Unknown',
      'adulterationRisk': 'Cannot verify — buy from trusted source',
    };
  }

  String _checkFSSAI(Map product) {
    final ingredients = (product['ingredients_text'] ?? '').toLowerCase();
    if (ingredients.contains('fssai') ||
        (product['labels'] ?? '').contains('FSSAI')) {
      return 'FSSAI Certified ✓';
    }
    return 'FSSAI status not found — verify on pack';
  }

  String _assessRisk(Map product) {
    final ingredients = (product['ingredients_text'] ?? '').toLowerCase();
    final suspectIngredients = [
      'starch', 'maltodextrin', 'vegetable fat', 'palm oil',
      'glucose syrup', 'sugar', 'artificial'
    ];
    final found = suspectIngredients.where((s) => ingredients.contains(s));
    if (found.isEmpty) return 'Low Risk';
    if (found.length <= 2) return 'Medium Risk: ${found.join(", ")}';
    return 'High Risk: ${found.join(", ")}';
  }
}