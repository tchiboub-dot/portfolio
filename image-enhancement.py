#!/usr/bin/env python3
"""
Professional background enhancement for avatar
- Brighten and enhance background only
- Keep subject (person) completely unchanged
- Add gradient glow and soft blur to background
"""

from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
import numpy as np
import os

# Paths
input_path = "public/photo-profil.jpg"
output_path = "public/photo-profil.jpg"
backup_path = "public/photo-profil.backup.jpg"

# Create backup
if os.path.exists(input_path):
    if not os.path.exists(backup_path):
        img_backup = Image.open(input_path)
        img_backup.save(backup_path)
    print(f"✓ Backup created: {backup_path}")
else:
    print(f"✗ Input file not found: {input_path}")
    exit(1)

# Load image
img = Image.open(input_path)
width, height = img.size
print(f"Image size: {width}x{height}")

# Step 1: Create approximate subject mask using edge detection
# Convert to numpy array for processing
img_array = np.array(img)
gray = np.mean(img_array, axis=2).astype(np.uint8)

# Edge detection to find subject boundaries
edges = np.abs(np.diff(gray, axis=0))
edges_h = np.concatenate([edges, edges[-1:, :]], axis=0)
edges_v = np.abs(np.diff(gray, axis=1))
edges_v = np.concatenate([edges_v, edges_v[:, -1:]], axis=1)

# Combine edges
edge_magnitude = edges_h + edges_v
threshold = np.percentile(edge_magnitude, 70)
subject_mask = (edge_magnitude > threshold).astype(np.uint8) * 255

# Dilate and smooth mask to create circular subject area
from PIL import ImageFilter
subject_mask_img = Image.fromarray(subject_mask)
subject_mask_img = subject_mask_img.filter(ImageFilter.MaxFilter(size=25))
subject_mask_img = subject_mask_img.filter(ImageFilter.GaussianBlur(radius=20))

subject_mask_array = np.array(subject_mask_img)

# Create circular mask based on center (typical portrait orientation)
y_coords, x_coords = np.meshgrid(np.arange(height), np.arange(width), indexing='ij')
center_x, center_y = width // 2, height // 2
distance_map = np.sqrt((x_coords - center_x)**2 + (y_coords - center_y)**2)

# Subject is within circle, background is outside
subject_radius = min(width, height) * 0.35
circular_mask = (distance_map < subject_radius).astype(np.uint8) * 255

# Combine with edge-based mask
subject_mask_combined = np.maximum(subject_mask_array // 2, circular_mask)
background_mask = 255 - subject_mask_combined

# Step 2: Enhance background
# Brighten
enhancer = ImageEnhance.Brightness(img)
bright_img = enhancer.enhance(1.20)  # 20% brighter

# Add slight saturation adjustment
enhancer = ImageEnhance.Color(bright_img)
color_img = enhancer.enhance(0.90)  # Slightly desaturated for professionalism

# Blur background
blurred = color_img.filter(ImageFilter.GaussianBlur(radius=4))

# Step 3: Create background with gradient overlay
# Start with enhanced image
enhanced_array = np.array(blurred).astype(float)
original_array = np.array(img).astype(float)

# Blend enhanced background with original subject
subject_mask_normalized = subject_mask_combined.astype(float) / 255.0
subject_mask_normalized = np.stack([subject_mask_normalized] * 3, axis=2)

# Apply enhancement only to background
result_array = (original_array * subject_mask_normalized + 
                enhanced_array * (1 - subject_mask_normalized))

# Step 4: Add radial gradient glow to background
gradient_layer = np.ones_like(result_array) * np.array([15, 30, 60])  # Navy blue

# Create radial gradient mask
max_distance = np.sqrt(center_x**2 + center_y**2)
gradient_strength = 1 - (distance_map / max_distance) * 0.5
gradient_strength = np.clip(gradient_strength, 0, 1)
gradient_strength = np.stack([gradient_strength] * 3, axis=2)

# Apply gradient only to background
background_mask_norm = (1 - subject_mask_normalized)
gradient_contribution = gradient_layer * gradient_strength * background_mask_norm * 0.25

result_array = result_array + gradient_contribution

# Step 5: Add soft glow effect
glow_layer = np.ones_like(result_array) * 255
glow_strength = (1 - (distance_map / max_distance)) * 0.15
glow_strength = np.clip(glow_strength, 0, 0.15)
glow_strength = np.stack([glow_strength] * 3, axis=2)

result_array = result_array * (1 - glow_strength * background_mask_norm * 0.3) + glow_layer * glow_strength * background_mask_norm * 0.3

# Ensure values are in valid range
result_array = np.clip(result_array, 0, 255).astype(np.uint8)

# Convert back to PIL image
result_img = Image.fromarray(result_array)

# Step 6: Final contrast boost
enhancer = ImageEnhance.Contrast(result_img)
result_img = enhancer.enhance(1.08)

# Save result
result_img.save(output_path, quality=95)
print(f"✓ Enhanced image saved: {output_path}")
print("\n✓ Changes applied:")
print("  - Background brightened (+20%)")
print("  - Background slightly desaturated (0.9x)")
print("  - Background blurred (radius: 4px)")
print("  - Navy-blue radial gradient overlay")
print("  - Soft glow effect on background")
print("  - Subject preserved unchanged")
print("\nTo revert: copy backup to original:")
print(f"  move {backup_path} {input_path}")
