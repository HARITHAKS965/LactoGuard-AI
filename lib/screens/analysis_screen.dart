import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../services/lacto_analysis_service.dart';
import '../models/lacto_result.dart';
import 'result_screen.dart';

class AnalysisScreen extends StatefulWidget {
  final String productName;
  const AnalysisScreen({super.key, required this.productName});
  @override
  State<AnalysisScreen> createState() => _AnalysisScreenState();
}

class _AnalysisScreenState extends State<AnalysisScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _anim;
  bool _done = false;

  final _steps = [
    '🔬 Scanning product database...',
    '🧪 Checking adulteration patterns...',
    '⚗️  Analyzing chemical markers...',
    '🏷️  Verifying brand authenticity...',
    '📊 Calculating purity score...',
    '✅ Report ready!',
  ];
  int _currentStep = 0;

  @override
  void initState() {
    super.initState();
    _anim = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat();
    _runAnalysis();
  }

  Future<void> _runAnalysis() async {
    for (int i = 0; i < _steps.length - 1; i++) {
      await Future.delayed(const Duration(milliseconds: 600));
      if (mounted) setState(() => _currentStep = i + 1);
    }

    final result =
        await LactoAnalysisService().analyze(widget.productName);

    if (!mounted) return;
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => ResultScreen(result: result)),
    );
  }

  @override
  void dispose() {
    _anim.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: LactoGuardTheme.primary,
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              RotationTransition(
                turns: _anim,
                child: const Icon(Icons.biotech,
                    size: 72, color: Colors.white),
              ),
              const SizedBox(height: 32),
              Text(
                'Analyzing\n${widget.productName}',
                textAlign: TextAlign.center,
                style: const TextStyle(
                    color: Colors.white,
                    fontSize: 22,
                    fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 40),
              ...List.generate(_steps.length, (i) {
                final isDone = i < _currentStep;
                final isCurrent = i == _currentStep;
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: AnimatedOpacity(
                    opacity: isDone || isCurrent ? 1.0 : 0.3,
                    duration: const Duration(milliseconds: 300),
                    child: Row(
                      children: [
                        Icon(
                          isDone
                              ? Icons.check_circle
                              : isCurrent
                                  ? Icons.radio_button_checked
                                  : Icons.radio_button_off,
                          color: isDone
                              ? LactoGuardTheme.accent
                              : Colors.white70,
                          size: 18,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          _steps[i],
                          style: TextStyle(
                              color: isDone
                                  ? Colors.white
                                  : Colors.white70,
                              fontWeight: isDone
                                  ? FontWeight.w700
                                  : FontWeight.w400),
                        ),
                      ],
                    ),
                  ),
                );
              }),
            ],
          ),
        ),
      ),
    );
  }
}