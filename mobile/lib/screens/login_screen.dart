import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _identifierController = TextEditingController();
  final _passwordController = TextEditingController();
  String _loginType = 'phone';
  bool _isLoading = false;

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;
    
    setState(() => _isLoading = true);
    try {
      final response = await AuthService.login(
        phoneNumber: _loginType == 'phone' ? _identifierController.text : null,
        email: _loginType == 'email' ? _identifierController.text : null,
        password: _passwordController.text,
      );
      if (response.token != null) {
        ApiService.setToken(response.token);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Login successful!')),
          );
          Navigator.pushReplacementNamed(context, '/home');
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text(response.message ?? 'Login failed')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('An error occurred')),
        );
      }
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: Card(
              elevation: 2,
              child: Padding(
                padding: const EdgeInsets.all(32),
                child: Form(
                  key: _formKey,
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Text(
                        'Welcome back',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        'Login to your AyarFarm account',
                        style: TextStyle(color: Colors.grey[600]),
                      ),
                      const SizedBox(height: 32),
                      const Text('Login with', style: TextStyle(fontSize: 14, fontWeight: FontWeight.w500)),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => setState(() => _loginType = 'phone'),
                              style: OutlinedButton.styleFrom(
                                backgroundColor: _loginType == 'phone' ? const Color(0xFF41BE02) : null,
                                foregroundColor: _loginType == 'phone' ? Colors.white : null,
                              ),
                              child: const Text('Phone'),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => setState(() => _loginType = 'email'),
                              style: OutlinedButton.styleFrom(
                                backgroundColor: _loginType == 'email' ? const Color(0xFF41BE02) : null,
                                foregroundColor: _loginType == 'email' ? Colors.white : null,
                              ),
                              child: const Text('Email'),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _identifierController,
                        decoration: InputDecoration(
                          labelText: _loginType == 'phone' ? 'Phone Number' : 'Email',
                          hintText: _loginType == 'phone' ? '+959...' : 'm@example.com',
                          border: const OutlineInputBorder(),
                        ),
                        keyboardType: _loginType == 'phone' ? TextInputType.phone : TextInputType.emailAddress,
                        validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _passwordController,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          border: OutlineInputBorder(),
                        ),
                        obscureText: true,
                        validator: (v) => v?.isEmpty ?? true ? 'Required' : null,
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        height: 48,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF41BE02),
                          ),
                          child: _isLoading
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(strokeWidth: 2),
                                )
                              : const Text('Login', style: TextStyle(fontSize: 16)),
                        ),
                      ),
                      const SizedBox(height: 16),
                      GestureDetector(
                        onTap: () => Navigator.pushReplacementNamed(context, '/register'),
                        child: Text.rich(
                          TextSpan(
                            text: "Don't have an account? ",
                            style: TextStyle(color: Colors.grey[600]),
                            children: const [
                              TextSpan(
                                text: 'Sign up',
                                style: TextStyle(
                                  color: Color(0xFF41BE02),
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
