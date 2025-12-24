import 'package:flutter/material.dart';
import '../widgets/common_header.dart';
import '../services/api_service.dart';
import '../constants/api_constants.dart';
import 'crop_screen.dart';

class CropTypeScreen extends StatefulWidget {
  const CropTypeScreen({super.key});

  @override
  State<CropTypeScreen> createState() => _CropTypeScreenState();
}

class _CropTypeScreenState extends State<CropTypeScreen> {
  List<Map<String, dynamic>> _cropTypes = [];
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _fetchCropTypes();
  }

  Future<void> _fetchCropTypes() async {
    try {
      final response = await ApiService.get(ApiConstants.cropTypes);
      if (response['data'] != null) {
        setState(() {
          _cropTypes = List<Map<String, dynamic>>.from(response['data']);
          _isLoading = false;
        });
      } else {
        // Handle error
        setState(() {
          _isLoading = false;
        });
        // Show error message
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Failed to load crop types: ${response['message'] ?? 'Unknown error'}',
            ),
          ),
        );
      }
    } catch (e) {
      // Handle error
      setState(() {
        _isLoading = false;
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text('Error loading crop types: $e')));
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // Colors from HTML design
    const primaryColor = Color(0xFF2BEE5B);
    const primaryContentColor = Color(0xFF052E11);
    final surfaceColor =
        isDark ? const Color(0xFF1A2C1E) : const Color(0xFFFFFFFF);
    final textMainColor =
        isDark ? const Color(0xFFFFFFFF) : const Color(0xFF111813);
    final textSubColor =
        isDark ? const Color(0xFF8BA892) : const Color(0xFF61896B);
    final borderColor =
        isDark ? Colors.white.withOpacity(0.1) : const Color(0xFFE5E7EB);

    return Column(
      children: [
        const CommonHeader(),
        Expanded(
          child: SingleChildScrollView(
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 100),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Section 1: Crop Types
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Crop Types',
                      style: TextStyle(
                        color: textMainColor,
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                _isLoading
                    ? const Center(child: CircularProgressIndicator())
                    : _cropTypes.isEmpty
                    ? const Center(child: Text('No crop types available'))
                    : GridView.count(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      crossAxisCount: 2,
                      mainAxisSpacing: 16,
                      crossAxisSpacing: 16,
                      childAspectRatio: 0.8,
                      children:
                          _cropTypes.map((cropType) {
                            return _buildCropTypeCard(
                              cropType['name'] ?? 'Unknown',
                              cropType['description'] ?? 'No description',
                              cropType['image_urls'] != null &&
                                      cropType['image_urls'].isNotEmpty
                                  ? cropType['image_urls'][0]
                                  : '',
                              surfaceColor,
                              textMainColor,
                              textSubColor,
                              onTap: () {
                                Navigator.push(
                                  context,
                                  MaterialPageRoute(
                                    builder:
                                        (context) => CropScreen(
                                          cropType: cropType['name'],
                                        ),
                                  ),
                                );
                              },
                            );
                          }).toList(),
                    ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildCropTypeCard(
    String title,
    String subtitle,
    String imageUrl,
    Color surface,
    Color textMain,
    Color textSub, {
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: surface,
          borderRadius: BorderRadius.circular(12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 4,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  image: DecorationImage(
                    image: NetworkImage(imageUrl),
                    fit: BoxFit.cover,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: TextStyle(
                color: textMain,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            Text(subtitle, style: TextStyle(color: textSub, fontSize: 12)),
          ],
        ),
      ),
    );
  }
}
