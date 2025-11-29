import 'package:flutter/material.dart';
import 'dart:ui';
import '../widgets/ui/feature_card.dart';

class WelcomeScreen extends StatelessWidget {
  const WelcomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FCF8),
      body: Stack(
        children: [
          Container(
            decoration: const BoxDecoration(
              image: DecorationImage(
                image: NetworkImage(
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuCY5WjMqXrq0OmpGtQm0woMmpsuN1K6F3Dzdd7boSde59GLC7E2nxr08m0jtOQxDFiu8WP18rtW-2KcZik2SQoIY4jPbpK4LDky2zHw8c9FM3HXqmVYr_5JVqOu3G4M--4UoolsHi7TNYEWmD7fAklrQ3iMAX_EnhbRCctlPMpJebMrPacS7b2OaS6ectkNA4tACuKEdFN_-heRFOslZ41u5s4RKHDcTjJZWimHXwoK1D9sOmJNzKaFd_UqxwZoh6WUTpTG5MiBrlA',
                ),
                fit: BoxFit.cover,
              ),
            ),
          ),
          BackdropFilter(
            filter: ImageFilter.blur(sigmaX: 3, sigmaY: 3),
            child: Container(color: Colors.black.withOpacity(0)),
          ),
          SafeArea(
            child: Center(
              child: SingleChildScrollView(
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      RichText(
                        textAlign: TextAlign.center,
                        text: const TextSpan(
                          children: [
                            TextSpan(
                              text: 'Ayar Farm\n',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 30,
                                fontWeight: FontWeight.bold,
                                height: 1.4,
                              ),
                            ),
                            TextSpan(
                              text: 'Cultivating\nConnections',
                              style: TextStyle(
                                color: Color(0xFF0d1b0f),
                                fontSize: 30,
                                fontWeight: FontWeight.w900,
                                height: 1.2,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Share your progress, exchange knowledge, and read the latest agricultural news.',
                        style: TextStyle(
                          color: Colors.black,
                          fontSize: 18,
                          height: 1.4,
                        ),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 40),
                      SizedBox(
                        width: double.infinity,
                        child: FeatureCard(
                          icon: Icons.camera_alt,
                          title: 'Post Updates',
                          subtitle: 'Share from your farm',
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: FeatureCard(
                          icon: Icons.forum,
                          title: 'Connect & Chat',
                          subtitle: 'Exchange knowledge',
                        ),
                      ),
                      const SizedBox(height: 12),
                      SizedBox(
                        width: double.infinity,
                        child: FeatureCard(
                          icon: Icons.article,
                          title: 'Learn & Grow',
                          subtitle: 'Read the latest blogs',
                        ),
                      ),
                      const SizedBox(height: 32),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: () {
                            Navigator.pushNamed(context, '/register');
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF4c9a52),
                            foregroundColor: Colors.white,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(24),
                            ),
                            elevation: 2,
                          ),
                          child: const Text(
                            'Create Account',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      GestureDetector(
                        onTap: () {
                          Navigator.pushNamed(context, '/login');
                        },
                        child: RichText(
                          text: TextSpan(
                            text: 'Already have an account? ',
                            style: TextStyle(color: Colors.white, fontSize: 18),
                            children: const [
                              TextSpan(
                                text: 'Log In',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(height: 32),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
