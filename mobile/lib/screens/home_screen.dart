import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  Map<String, dynamic>? _weather;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchWeather();
  }

  Future<void> _fetchWeather() async {
    try {
      final permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied || permission == LocationPermission.deniedForever) {
        setState(() => _isLoading = false);
        return;
      }

      final position = await Geolocator.getCurrentPosition();
      final response = await http.get(
        Uri.parse('https://getweatherbycityapi.laziestant.tech/v2/weather?lat=${position.latitude}&lon=${position.longitude}'),
      );

      if (response.statusCode == 200) {
        setState(() {
          _weather = json.decode(response.body);
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[50],
      body: Column(
        children: [
          if (_weather != null)
            Container(
              width: double.infinity,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF41BE02), Color(0xFF4FC3F7)],
                ),
              ),
              child: SafeArea(
                bottom: false,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          const Icon(Icons.cloud, color: Colors.white, size: 32),
                          const SizedBox(width: 12),
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${_weather!['current']['temperature']}°${_weather!['current']['unit'] ?? 'C'}',
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              Text(
                                _weather!['current']['status'],
                                style: const TextStyle(
                                  color: Colors.white70,
                                  fontSize: 14,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                      Row(
                        children: [
                          Column(
                            children: [
                              const Icon(Icons.water_drop, color: Colors.white, size: 20),
                              Text(
                                _weather!['current']['humidity'],
                                style: const TextStyle(color: Colors.white, fontSize: 12),
                              ),
                            ],
                          ),
                          const SizedBox(width: 16),
                          Column(
                            children: [
                              const Icon(Icons.air, color: Colors.white, size: 20),
                              Text(
                                _weather!['current']['wind'],
                                style: const TextStyle(color: Colors.white, fontSize: 12),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          Expanded(
            child: _isLoading
                ? const Center(child: CircularProgressIndicator())
                : Center(
                    child: Text(
                      'Welcome to AyarFarm',
                      style: TextStyle(fontSize: 24, color: Colors.grey[600]),
                    ),
                  ),
          ),
        ],
      ),
    );
  }
}
