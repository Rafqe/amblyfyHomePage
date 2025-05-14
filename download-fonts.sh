#!/bin/bash

# Create the fonts directory if it doesn't exist
mkdir -p assets/fonts/inter-tight

# Download the font files
cd assets/fonts/inter-tight

# Regular weights - WOFF2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0xCHh5QiK4.woff2 -o InterTight-Thin.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0zCHx5QiK4.woff2 -o InterTight-ExtraLight.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0wcHx5QiK4.woff2 -o InterTight-Light.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0xCHx5QiK4.woff2 -o InterTight-Regular.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0xwHx5QiK4.woff2 -o InterTight-Medium.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0ycGB5QiK4.woff2 -o InterTight-SemiBold.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0ylGB5QiK4.woff2 -o InterTight-Bold.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0zCGB5QiK4.woff2 -o InterTight-ExtraBold.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0zrGB5QiK4.woff2 -o InterTight-Black.woff2

# Italic weights - WOFF2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjDw6aWy5X.woff2 -o InterTight-ThinItalic.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjjw-aWy5X.woff2 -o InterTight-ExtraLightItalic.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjUQ-aWy5X.woff2 -o InterTight-LightItalic.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjDw-aWy5X.woff2 -o InterTight-Italic.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjPQ-aWy5X.woff2 -o InterTight-MediumItalic.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj0QiaWy5X.woff2 -o InterTight-SemiBoldItalic.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj6AiaWy5X.woff2 -o InterTight-BoldItalic.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjjwiaWy5X.woff2 -o InterTight-ExtraBoldItalic.woff2
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjpgiaWy5X.woff2 -o InterTight-BlackItalic.woff2

# Regular weights - WOFF
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0xCHh5QiK4.woff -o InterTight-Thin.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0zCHx5QiK4.woff -o InterTight-ExtraLight.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0wcHx5QiK4.woff -o InterTight-Light.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0xCHx5QiK4.woff -o InterTight-Regular.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0xwHx5QiK4.woff -o InterTight-Medium.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0ycGB5QiK4.woff -o InterTight-SemiBold.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0ylGB5QiK4.woff -o InterTight-Bold.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0zCGB5QiK4.woff -o InterTight-ExtraBold.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGShv5HMAFg6IuGlBNMjxLsC66ZMtb8hyW62x0zrGB5QiK4.woff -o InterTight-Black.woff

# Italic weights - WOFF
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjDw6aWy5X.woff -o InterTight-ThinItalic.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjjw-aWy5X.woff -o InterTight-ExtraLightItalic.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjUQ-aWy5X.woff -o InterTight-LightItalic.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjDw-aWy5X.woff -o InterTight-Italic.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjPQ-aWy5X.woff -o InterTight-MediumItalic.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj0QiaWy5X.woff -o InterTight-SemiBoldItalic.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mj6AiaWy5X.woff -o InterTight-BoldItalic.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjjwiaWy5X.woff -o InterTight-ExtraBoldItalic.woff
curl -O https://fonts.gstatic.com/s/intertight/v7/NGSnv5HMAFg6IuGlBNMjxJEL2VmU3NS7Z2mjpgiaWy5X.woff -o InterTight-BlackItalic.woff

cd ../../.. 