import 'package:flutter/material.dart';

class CropScreen extends StatefulWidget {
  const CropScreen({super.key});

  @override
  State<CropScreen> createState() => _CropScreenState();
}

class _CropScreenState extends State<CropScreen> {
  String _selectedFilter = 'All';

  final List<Map<String, String>> _crops = [
    {
      'title': 'Rice',
      'subtitle': 'Paddy cultivation guide',
      'tag': 'Cereal',
      'image':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAKkI5k5sEnqMVPx9jq6Q2F55M2H2heVs9VaIBjGGlJ3T4hCFQOgXWQbj0d6j0J7J8Ey3ZP_GQOz5PntLuzQjf7sJ33fcgbWIr2NkoBJD0SiCpFTcNdROPypsmYf0e2nHRgrPrJpMcljoS0l2jkXx9871dLWpjwzdZuMb6ildUFfGnrcSsIVrvQZrchNlyCCEEE_jZaTwGhLt35mkjgqKuHiQt0aONVoYIsoIYtq__AiF7QEtnJQZ_NfXsHcAKnxQC0X61f0Jnx3VZU',
    },
    {
      'title': 'Wheat',
      'subtitle': 'Rabi season crop',
      'tag': 'Cereal',
      'image':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCH20CbQCtq0TvU-RvbRF-hPldLJFPtEYKW3ewrCbQ_yE7aDRn7WjXKtIbSCM4Ek1YFWR--1i2E-UwJrBz0QiNvRHO9NCtr_VCE_vxK2gbBt6ZkCChQdFx-5pIalH4wg-nPcP1ycZhqOaX21ZVHjrvrAj0H7u5LZPtbm8-6LvhHH3_X6XdxOo325PMeQKd-SGtf1v47ifJFA23rZvPpILNuGr61tmYY9Ii3PFdWU68prnJxfDIZvhKHP69caemkngLpT0jxeQ7oF1x0',
    },
    {
      'title': 'Maize',
      'subtitle': 'Corn farming techniques',
      'tag': 'Cereal',
      'image':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAGWTcpQ_jNZYx_f-H83H9CFMgQSdfh0Bre0Ch-rKBIKp35pDLmGi5ggTddMdXo7_yzXkXmnNFQCvLRKgUQqwqpbJ9eoP-UvhX4EWfMoadKNK7X6fGEcBsUoTWckQ3gQSjlvBm4NfrBwYf78OPGKzdGCSovKAKT7DLpKlsSrsJkzMWnba562U1QDMHRP-_pvbb12ESOInEixJcNRE5g8lbkvvUSK7SkpxEePLgyx_QkFAuYBM-E3n00V75E4X3DhYv4P4a89Bw9on9F',
    },
    {
      'title': 'Cotton',
      'subtitle': 'Pest control & harvest',
      'tag': 'Cash Crop',
      'image':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBnkyHZujXubZqcxb3D7x5VkPMX0n5WK7fOi-819GipPGZfroeH7Xl3utzuE9MnqOuVt96HAIx5bDA1ZrRf7ZvarydaGFowlmAn7KDGTKrnTvQRNj4SnSZU9TTk98EG78GB0TiPUkxA7Pc6-rKRMs3kZQF6pjoNWx_QhbOjiAM2gv3-VNSMvt0Hy4B9VY5lkQYCgaGo7U5o5SlTBsrc_x-GgABseL27_No6Z56nMjwa7-NpGmZ38ycQfgjlStmDnWRhedHQk5gaH65v',
    },
    {
      'title': 'Sugarcane',
      'subtitle': 'High yield varieties',
      'tag': 'Cash Crop',
      'image':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBJPbo1rUVLf4kwy3LtHVddBfl6sOCs3aSPpDAytJhR6Gnlov0uxubOrVo-Rvac8WNUm8MNrThW62g80Th13-kArESixbBLR5OAsYCvPcfcJveb2anm29YypaWG95MCJiJ2HPs1ZrA5iGJxdArVyNnTCCVXfLgTHOTF26d9lEPwSVPIdFhmM-_GmHMCbubXJ91wdWy8XkMfzUiR6bzpISGVjtvLqbqRQz934dPW2y7MTri_S6oBWMDRlMM_rsCpFMxP9KDbkZ2o9_8Y',
    },
    {
      'title': 'Soybean',
      'subtitle': 'Planting & maintenance',
      'tag': 'Oilseed',
      'image':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAccF-CoDKoKuMbtaQsWlMS8v0jHwM4hqLAMjbEiVHWPQ9ZReyZc7fLSbmsk4b3nzQXTfWeYNN_TSWZMNor21Br0pqqgu-Ue8HXAJzbZqJprmrsir3kiY0fOZfSdMP0nkz00VOX7c_0A9WzNwiSnwZq-oq_pb19rGVOzc_FRzcmBLTWG9-O1rV0_5sNcvqxZkDx_p7WRIr0pPfDUtbxXI1v1yUt2RszjbMuPbqzvbWKO8T3fdRwnbY3NYPpbgi94JooLBs1DuSK7N9L',
    },
    {
      'title': 'Chickpea',
      'subtitle': 'Soil preparation guide',
      'tag': 'Pulse',
      'image':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD6_QmE1qvtRTwGOvWmHTBtHqdAOzML1ATPvy4r33DoDVU1tCbNEMLh7ezUM9M_EAbavRDR0ig9HtO5K8qL0s7cdPV4bYzhIMpYCIZK5OcN-tSAlYSsYc32d3hPIDlDJ9H-SVqbU9TH3QUtP5kAz0gYvXffr74AN59NUAODtEUW2meykQh49NQ08khkdZ-mATOb2Y7-eTRGmzuV1zwgJgFFrdC22dpHVoGiTi0ZIVTdeYuxGyTwc1AJx2DFr-xQfE3VEDAd0J_fJaRW',
    },
    {
      'title': 'Potato',
      'subtitle': 'Tuber formation tips',
      'tag': 'Vegetable',
      'image':
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC2bUG9I0NH9Xmp1tmPnV9S-P3_AnouOqwKCygKcIBSopVDoRVjeYjRMUAC0I97ZqAvCki8xvmfYMFB8vrISVHXYYdjMvuqBmrVxAFGMUfeaqAT2aHS56rdtM8iLw7xJlFvs8mig5FCvbC5-NRnVT0bq-XILc1LzdzMJxcIfyVcwZ7W_X7WHgAvdslci5-G7yalbObEvkI7ltlbP8yIvqb5_3G--OapAXpLj5Uhm6BAHSH0l5CX1aKKH5X8az2c0KzbNpbTepDszyEZ',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    // Colors
    const primaryColor = Color(0xFF2BEE5B);
    final surfaceColor =
        isDark ? const Color(0xFF1A2C1E) : const Color(0xFFFFFFFF);
    final textMainColor =
        isDark ? const Color(0xFFFFFFFF) : const Color(0xFF111813);
    final textMutedColor =
        isDark ? const Color(0xFF8BA892) : const Color(0xFF61896B);
    final backgroundColor =
        isDark ? const Color(0xFF102215) : const Color(0xFFF6F8F6);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: Column(
        children: [
          // Header
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: surfaceColor.withOpacity(0.95),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                InkWell(
                  onTap: () => Navigator.pop(context),
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isDark ? Colors.grey[800] : Colors.grey[100],
                    ),
                    child: Icon(Icons.arrow_back, color: textMainColor),
                  ),
                ),
                Text(
                  'Crops & Pulses',
                  style: TextStyle(
                    color: textMainColor,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                InkWell(
                  onTap: () {},
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: isDark ? Colors.grey[800] : Colors.grey[100],
                    ),
                    child: Icon(Icons.search, color: textMainColor),
                  ),
                ),
              ],
            ),
          ),

          // Filters
          Container(
            height: 50,
            margin: const EdgeInsets.symmetric(vertical: 8),
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              children: [
                _buildFilterChip('All', primaryColor, Colors.black, true),
                const SizedBox(width: 8),
                _buildFilterChip(
                  'Cereals',
                  surfaceColor,
                  textMainColor,
                  false,
                  borderColor: isDark ? Colors.grey[800] : Colors.grey[200],
                ),
                const SizedBox(width: 8),
                _buildFilterChip(
                  'Pulses',
                  surfaceColor,
                  textMainColor,
                  false,
                  borderColor: isDark ? Colors.grey[800] : Colors.grey[200],
                ),
                const SizedBox(width: 8),
                _buildFilterChip(
                  'Cash Crops',
                  surfaceColor,
                  textMainColor,
                  false,
                  borderColor: isDark ? Colors.grey[800] : Colors.grey[200],
                ),
                const SizedBox(width: 8),
                _buildFilterChip(
                  'Oilseeds',
                  surfaceColor,
                  textMainColor,
                  false,
                  borderColor: isDark ? Colors.grey[800] : Colors.grey[200],
                ),
              ],
            ),
          ),

          // Grid
          Expanded(
            child: GridView.builder(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.75,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
              ),
              itemCount: _crops.length,
              itemBuilder: (context, index) {
                final crop = _crops[index];
                return _buildCropCard(
                  crop,
                  surfaceColor,
                  textMainColor,
                  textMutedColor,
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(
    String label,
    Color bgColor,
    Color textColor,
    bool isSelected, {
    Color? borderColor,
  }) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedFilter = label;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        alignment: Alignment.center,
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(20),
          border: borderColor != null ? Border.all(color: borderColor) : null,
        ),
        child: Text(
          label,
          style: TextStyle(
            color: textColor,
            fontSize: 14,
            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
          ),
        ),
      ),
    );
  }

  Widget _buildCropCard(
    Map<String, String> crop,
    Color surfaceColor,
    Color textMainColor,
    Color textMutedColor,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Expanded(
            child: Stack(
              children: [
                Container(
                  decoration: BoxDecoration(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(12),
                    ),
                    image: DecorationImage(
                      image: NetworkImage(crop['image']!),
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                Positioned(
                  top: 8,
                  right: 8,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 2,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      crop['tag']!,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 10,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(12),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  crop['title']!,
                  style: TextStyle(
                    color: textMainColor,
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  crop['subtitle']!,
                  style: TextStyle(color: textMutedColor, fontSize: 12),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
