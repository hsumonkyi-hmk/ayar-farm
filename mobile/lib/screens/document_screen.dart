import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../constants/api_constants.dart';
import 'package:url_launcher/url_launcher.dart';

class DocumentScreen extends StatefulWidget {
  final String type;

  const DocumentScreen({super.key, required this.type});

  @override
  State<DocumentScreen> createState() => _DocumentScreenState();
}

class _DocumentScreenState extends State<DocumentScreen> {
  List<Map<String, dynamic>> _documents = [];
  bool _isLoading = true;
  String _selectedFilter = 'All';

  @override
  void initState() {
    super.initState();
    _fetchDocuments();
  }

  Future<void> _fetchDocuments() async {
    try {
      final response = await ApiService.get(
        ApiConstants.documents,
        queryParams: {'type': widget.type},
      );
      if (response['documents'] != null) {
        setState(() {
          _documents = List<Map<String, dynamic>>.from(response['documents']);
          _isLoading = false;
        });
      } else {
        setState(() {
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _isLoading = false;
      });
    }
  }

  String _getTitle() {
    switch (widget.type) {
      case 'crop':
        return 'Crop Documents';
      case 'fish':
        return 'Fish Documents';
      case 'livestock':
        return 'Livestock Documents';
      case 'machine':
        return 'Machine Documents';
      default:
        return 'Documents';
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    const primaryColor = Color(0xFF2BEE5B);
    final surfaceColor = isDark ? const Color(0xFF1A2C1E) : Colors.white;
    final textMainColor = isDark ? Colors.white : const Color(0xFF111813);
    final textMutedColor = isDark ? const Color(0xFF8BA892) : const Color(0xFF61896B);
    final backgroundColor = isDark ? const Color(0xFF102215) : const Color(0xFFF6F8F6);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Container(
              padding: const EdgeInsets.all(16),
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
                      child: const Icon(Icons.arrow_back, size: 24),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      _getTitle(),
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: textMainColor,
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
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
                      child: const Icon(Icons.search, size: 24),
                    ),
                  ),
                ],
              ),
            ),

            // Filters
            Container(
              height: 50,
              padding: const EdgeInsets.symmetric(vertical: 8),
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                children: [
                  _buildFilterChip('All', primaryColor, Colors.black, true),
                  const SizedBox(width: 8),
                  _buildFilterChip('Guides', surfaceColor, textMainColor, false, isDark),
                  const SizedBox(width: 8),
                  _buildFilterChip('Research', surfaceColor, textMainColor, false, isDark),
                  const SizedBox(width: 8),
                  _buildFilterChip('Schemes', surfaceColor, textMainColor, false, isDark),
                  const SizedBox(width: 8),
                  _buildFilterChip('Diseases', surfaceColor, textMainColor, false, isDark),
                ],
              ),
            ),

            // Documents List
            Expanded(
              child: _isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : _documents.isEmpty
                      ? Center(
                          child: Text(
                            'No documents available',
                            style: TextStyle(color: textMutedColor),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                          itemCount: _documents.length,
                          itemBuilder: (context, index) {
                            final doc = _documents[index];
                            return _buildDocumentCard(
                              doc,
                              surfaceColor,
                              textMainColor,
                              textMutedColor,
                              backgroundColor,
                              isDark,
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFilterChip(String label, Color bgColor, Color textColor, bool isSelected, [bool isDark = false]) {
    return GestureDetector(
      onTap: () {
        setState(() {
          _selectedFilter = label;
        });
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(20),
          border: !isSelected ? Border.all(color: isDark ? Colors.grey[800]! : Colors.grey[200]!) : null,
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

  Widget _buildDocumentCard(
    Map<String, dynamic> doc,
    Color surfaceColor,
    Color textMainColor,
    Color textMutedColor,
    Color backgroundColor,
    bool isDark,
  ) {
    final title = doc['title'] ?? 'Unknown';
    final fileUrls = doc['file_urls'] as List?;
    final fileUrl = fileUrls != null && fileUrls.isNotEmpty ? fileUrls[0] : '';
    
    // Determine icon and color based on file type
    final isPdf = fileUrl.toLowerCase().contains('.pdf');
    final icon = isPdf ? Icons.picture_as_pdf : Icons.article;
    final iconColor = isPdf ? Colors.red : Colors.blue;
    final iconBgColor = isPdf 
        ? (isDark ? Colors.red[900]!.withOpacity(0.2) : Colors.red[50]!) 
        : (isDark ? Colors.blue[900]!.withOpacity(0.2) : Colors.blue[50]!);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: surfaceColor,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.transparent),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 4,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () async {
            if (fileUrl.isNotEmpty) {
              final uri = Uri.parse(fileUrl);
              if (await canLaunchUrl(uri)) {
                await launchUrl(uri, mode: LaunchMode.externalApplication);
              }
            }
          },
          borderRadius: BorderRadius.circular(12),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Icon
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: iconBgColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: iconColor, size: 24),
                ),
                const SizedBox(width: 16),
                
                // Content
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          color: textMainColor,
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          height: 1.2,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              color: backgroundColor,
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              'Guide',
                              style: TextStyle(
                                color: textMutedColor,
                                fontSize: 10,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          Text(
                            '• 2.4 MB',
                            style: TextStyle(
                              color: textMutedColor,
                              fontSize: 11,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                
                // Download button
                InkWell(
                  onTap: () async {
                    if (fileUrl.isNotEmpty) {
                      final uri = Uri.parse(fileUrl);
                      if (await canLaunchUrl(uri)) {
                        await launchUrl(uri, mode: LaunchMode.externalApplication);
                      }
                    }
                  },
                  borderRadius: BorderRadius.circular(20),
                  child: Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: backgroundColor,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.download,
                      color: textMutedColor,
                      size: 20,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
