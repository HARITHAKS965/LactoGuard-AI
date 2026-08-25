import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../core/theme.dart';
import 'analysis_screen.dart';
import 'barcode_screen.dart';
import 'nearby_labs_screen.dart';
import 'history_screen.dart';
import 'brand_compare_screen.dart';
import 'settings_screen.dart';
import 'seed_screen.dart';
import 'login_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with SingleTickerProviderStateMixin {
  final _searchController = TextEditingController();
  late AnimationController _logoAnim;
  late Animation<double> _logoScale;

  static const _quickScans = [
    'Milk Powder',
    'Skimmed Milk Powder',
    'Full Cream Milk Powder',
    'Infant Formula',
    'Dairy Whitener',
  ];

  @override
  void initState() {
    super.initState();
    _logoAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..forward();
    _logoScale = CurvedAnimation(parent: _logoAnim, curve: Curves.elasticOut);
  }

  @override
  void dispose() {
    _logoAnim.dispose();
    _searchController.dispose();
    super.dispose();
  }

  void _analyze(String product) {
    if (product.trim().isEmpty) return;
    Navigator.push(context, MaterialPageRoute(
      builder: (_) => AnalysisScreen(productName: product.trim()),
    ));
  }

  void _logout() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text('Logout'),
        content: const Text('Are you sure you want to logout?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Logout', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (confirm == true) {
      await FirebaseAuth.instance.signOut();
      if (mounted) {
        Navigator.of(context).pushAndRemoveUntil(
          MaterialPageRoute(builder: (_) => const LoginScreen()),
          (route) => false,
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    return Scaffold(
      backgroundColor: const Color(0xFFF0F4FF),
      appBar: AppBar(
        backgroundColor: LactoGuardTheme.primary,
        titleSpacing: 12,
        title: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(Icons.water_drop, color: Color(0xFFFFB703), size: 20),
            SizedBox(width: 6),
            Text('LactoGuard AI', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 18)),
          ],
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.qr_code_scanner, color: Colors.white, size: 22),
            tooltip: 'Barcode Scan',
            onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const BarcodeScreen())),
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.more_vert, color: Colors.white, size: 22),
            onSelected: (val) {
              if (val == 'seed') {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SeedDatabase()));
              } else if (val == 'settings') {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen()));
              } else if (val == 'logout') {
                _logout();
              } else if (val.startsWith('lang_')) {
                context.setLocale(Locale(val.replaceFirst('lang_', '')));
              }
            },
            itemBuilder: (_) => const [
              PopupMenuItem(value: 'seed', child: Row(children: [Icon(Icons.dataset_linked, size: 18), SizedBox(width: 8), Text('Seed Database')])),
              PopupMenuItem(value: 'settings', child: Row(children: [Icon(Icons.settings, size: 18), SizedBox(width: 8), Text('Settings')])),
              PopupMenuItem(value: 'lang_en', child: Row(children: [Icon(Icons.language, size: 18), SizedBox(width: 8), Text('English')])),
              PopupMenuItem(value: 'lang_ta', child: Row(children: [Icon(Icons.language, size: 18), SizedBox(width: 8), Text('Tamil (தமிழ்)')])),
              PopupMenuItem(value: 'lang_hi', child: Row(children: [Icon(Icons.language, size: 18), SizedBox(width: 8), Text('Hindi (हिंदी)')])),
              PopupMenuItem(value: 'logout', child: Row(children: [Icon(Icons.logout, color: Colors.red, size: 18), SizedBox(width: 8), Text('Logout', style: TextStyle(color: Colors.red))])),
            ],
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            ScaleTransition(
              scale: _logoScale,
              child: Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(18, 18, 18, 22),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF0A2463), Color(0xFF1565C0)],
                  ),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(28),
                    bottomRight: Radius.circular(28),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: Colors.white24,
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Text(
                        user != null ? 'Welcome, ${user.displayName ?? user.email ?? 'User'}' : 'AI-Powered Milk Safety',
                        style: const TextStyle(color: Colors.white70, fontSize: 11, fontWeight: FontWeight.w600),
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Protect Your Family\'s Health',
                      style: TextStyle(color: Colors.white, fontSize: 22, fontWeight: FontWeight.w900),
                    ),
                    const SizedBox(height: 4),
                    const Text('Detect milk adulteration instantly', style: TextStyle(color: Colors.white70, fontSize: 13)),
                    const SizedBox(height: 16),
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(14),
                        boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 8, offset: Offset(0, 4))],
                      ),
                      child: Row(
                        children: [
                          const SizedBox(width: 12),
                          const Icon(Icons.search, color: Color(0xFF0A2463), size: 20),
                          const SizedBox(width: 8),
                          Expanded(
                            child: TextField(
                              controller: _searchController,
                              textInputAction: TextInputAction.search,
                              onSubmitted: _analyze,
                              decoration: const InputDecoration(
                                hintText: 'Enter milk product name...',
                                border: InputBorder.none,
                                enabledBorder: InputBorder.none,
                                focusedBorder: InputBorder.none,
                                filled: false,
                                contentPadding: EdgeInsets.symmetric(vertical: 12),
                              ),
                            ),
                          ),
                          GestureDetector(
                            onTap: () => _analyze(_searchController.text),
                            child: Container(
                              margin: const EdgeInsets.all(5),
                              padding: const EdgeInsets.all(10),
                              decoration: BoxDecoration(
                                color: const Color(0xFFFFB703),
                                borderRadius: BorderRadius.circular(10),
                              ),
                              child: const Icon(Icons.biotech, color: Colors.black87, size: 20),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(18),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Row(
                    children: [
                      SizedBox(width: 4, height: 16, child: ColoredBox(color: Color(0xFFFFB703))),
                      SizedBox(width: 8),
                      Text('Quick Scan', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0A2463))),
                    ],
                  ),
                  const SizedBox(height: 8),
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: _quickScans.map((p) => Padding(
                        padding: const EdgeInsets.only(right: 8),
                        child: ActionChip(
                          label: Text(p, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                          backgroundColor: Colors.white,
                          side: const BorderSide(color: Color(0xFF0A2463)),
                          onPressed: () => _analyze(p),
                          avatar: const Icon(Icons.science, size: 14, color: Color(0xFF0A2463)),
                        ),
                      )).toList(),
                    ),
                  ),
                  const SizedBox(height: 20),
                  const Row(
                    children: [
                      SizedBox(width: 4, height: 16, child: ColoredBox(color: Color(0xFFFFB703))),
                      SizedBox(width: 8),
                      Text('Smart Features', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0A2463))),
                    ],
                  ),
                  const SizedBox(height: 12),
                  GridView.count(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    childAspectRatio: 1.35,
                    children: [
                      _FeatureTile(
                        icon: Icons.qr_code_scanner,
                        title: 'Barcode Scan',
                        subtitle: 'Verify product',
                        colors: const [Color(0xFF0A2463), Color(0xFF1565C0)],
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const BarcodeScreen())),
                      ),
                      _FeatureTile(
                        icon: Icons.compare_arrows,
                        title: 'Brand Compare',
                        subtitle: 'Trusted vs fake',
                        colors: const [Color(0xFFFF6B35), Color(0xFFFFB703)],
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const BrandCompareScreen())),
                      ),
                      _FeatureTile(
                        icon: Icons.location_on,
                        title: 'Nearby Labs',
                        subtitle: 'Testing centers',
                        colors: const [Color(0xFF2DC653), Color(0xFF0E9C3C)],
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => NearbyLabsScreen())),
                      ),
                      _FeatureTile(
                        icon: Icons.history,
                        title: 'Scan History',
                        subtitle: 'Past analysis',
                        colors: const [Color(0xFF7B2FBE), Color(0xFF9B59B6)],
                        onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const HistoryScreen())),
                      ),
                    ],
                  ),
                  const SizedBox(height: 20),
                  Container(
                    padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 8)],
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _statItem('500+', 'Products\nAnalyzed'),
                        Container(width: 1, height: 36, color: Colors.grey[300]),
                        _statItem('99%', 'Accuracy\nRate'),
                        Container(width: 1, height: 36, color: Colors.grey[300]),
                        _statItem('Free', 'Always\nFree'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 14),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: const Color(0xFFE8F5E9),
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: const Color(0xFF2DC653)),
                    ),
                    child: const Row(
                      children: [
                        Icon(Icons.wifi_off, color: Color(0xFF2DC653), size: 20),
                        SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Works Offline', style: TextStyle(color: Color(0xFF2DC653), fontWeight: FontWeight.w800, fontSize: 13)),
                              Text('Built for rural areas - no internet needed', style: TextStyle(color: Color(0xFF2DC653), fontSize: 11)),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _statItem(String value, String label) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(value, style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: Color(0xFF0A2463))),
        const SizedBox(height: 2),
        Text(label, textAlign: TextAlign.center, style: TextStyle(fontSize: 10, color: Colors.grey[600], height: 1.2)),
      ],
    );
  }
}

class _FeatureTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final List<Color> colors;
  final VoidCallback onTap;

  const _FeatureTile({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.colors,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: colors,
          ),
          borderRadius: BorderRadius.circular(16),
          boxShadow: [BoxShadow(color: colors[0].withOpacity(0.3), blurRadius: 6, offset: const Offset(0, 3))],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: Colors.white24,
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(icon, color: Colors.white, size: 22),
            ),
            const SizedBox(height: 8),
            Text(
              title,
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 14),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              style: const TextStyle(color: Colors.white70, fontSize: 11),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}
