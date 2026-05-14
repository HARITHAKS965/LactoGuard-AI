import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../core/theme.dart';

class Lab {
  final String name;
  final String address;
  final String phone;
  final String type;
  final double lat;
  final double lng;
  const Lab({required this.name, required this.address, required this.phone, required this.type, required this.lat, required this.lng});
}

class NearbyLabsScreen extends StatelessWidget {
  NearbyLabsScreen({super.key});

  final List<Lab> _labs = const [
    Lab(name: 'NABL Accredited Dairy Lab - Chennai', address: 'Madhavaram Milk Colony, Chennai - 600051', phone: '+91-44-25551234', type: 'Government', lat: 13.1543, lng: 80.2372),
    Lab(name: 'FSSAI Food Testing Lab', address: 'Anna Salai, Chennai - 600002', phone: '+91-44-28413937', type: 'Government', lat: 13.0569, lng: 80.2425),
    Lab(name: 'Tamil Nadu Veterinary Lab', address: 'Vepery, Chennai - 600007', phone: '+91-44-26411080', type: 'Government', lat: 13.0878, lng: 80.2785),
    Lab(name: 'SGS India Pvt Ltd', address: 'Ambattur Industrial Estate, Chennai', phone: '+91-44-26257801', type: 'Private', lat: 13.1145, lng: 80.1565),
    Lab(name: 'Intertek Testing Services', address: 'Guindy, Chennai - 600032', phone: '+91-44-22501234', type: 'Private', lat: 13.0067, lng: 80.2206),
    Lab(name: 'Bureau Veritas Lab', address: 'Perungudi, Chennai - 600096', phone: '+91-44-24961234', type: 'Private', lat: 12.9634, lng: 80.2376),
    Lab(name: 'District Milk Testing Lab - Coimbatore', address: 'Gandhipuram, Coimbatore - 641012', phone: '+91-422-2391234', type: 'Government', lat: 11.0168, lng: 76.9558),
    Lab(name: 'Madurai Dairy Testing Centre', address: 'KK Nagar, Madurai - 625020', phone: '+91-452-2581234', type: 'Government', lat: 9.9252, lng: 78.1198),
  ];

  void _openMap(Lab lab) async {
    final url = 'https://www.google.com/maps/search/?api=1&query=,';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }

  void _callLab(String phone) async {
    final url = 'tel:';
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Nearby Testing Labs')),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            color: LactoGuardTheme.primary.withOpacity(0.05),
            child: Row(
              children: [
                Icon(Icons.info_outline, color: LactoGuardTheme.primary, size: 18),
                const SizedBox(width: 8),
                const Expanded(
                  child: Text(
                    'NABL/FSSAI accredited labs for milk adulteration testing in Tamil Nadu',
                    style: TextStyle(fontSize: 12),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _labs.length,
              itemBuilder: (context, index) {
                final lab = _labs[index];
                final isGov = lab.type == 'Government';
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Expanded(
                              child: Text(lab.name, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: isGov ? LactoGuardTheme.safe.withOpacity(0.1) : LactoGuardTheme.primary.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Text(
                                lab.type,
                                style: TextStyle(
                                  fontSize: 10,
                                  fontWeight: FontWeight.w700,
                                  color: isGov ? LactoGuardTheme.safe : LactoGuardTheme.primary,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Icon(Icons.location_on, size: 14, color: Colors.grey[500]),
                            const SizedBox(width: 4),
                            Expanded(child: Text(lab.address, style: TextStyle(fontSize: 12, color: Colors.grey[600]))),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: OutlinedButton.icon(
                                onPressed: () => _callLab(lab.phone),
                                icon: const Icon(Icons.phone, size: 16),
                                label: const Text('Call', style: TextStyle(fontSize: 12)),
                                style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 8)),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Expanded(
                              child: ElevatedButton.icon(
                                onPressed: () => _openMap(lab),
                                icon: const Icon(Icons.map, size: 16),
                                label: const Text('Directions', style: TextStyle(fontSize: 12)),
                                style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 8)),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
