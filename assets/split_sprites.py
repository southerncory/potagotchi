#!/usr/bin/env python3
"""Split Potagotchi sprite sheets into individual sprites"""

from PIL import Image
import os

# Input files
INBOUND = "/home/ubuntu/.openclaw/media/inbound"
OUTPUT = "/home/ubuntu/clawd/loop/loop-app-native/assets/potagotchi"

# The complete labeled sheet (832x1248)
SHEET = f"{INBOUND}/6fbe9173-c37d-431b-8f9e-040924e48e6f.jpg"

# Cyberpunk neon version (784x1168)
CYBERPUNK = f"{INBOUND}/bf50348f-13c1-4579-8a53-0c56c4ceb899.jpg"

def ensure_dirs():
    dirs = ['baby', 'adult', 'golden', 'animation', 'accessories', 'states', 'cyberpunk']
    for d in dirs:
        os.makedirs(f"{OUTPUT}/{d}", exist_ok=True)

def split_main_sheet():
    """Split the main labeled sprite sheet"""
    img = Image.open(SHEET)
    w, h = img.size
    print(f"Main sheet: {w}x{h}")
    
    # Approximate grid based on visual inspection
    # Image is 832x1248, roughly 4 columns, 7 rows
    col_w = w // 4  # ~208px per sprite
    
    # Row heights vary - estimate based on content
    # Row 1 (baby): y=0-150, small sprites
    # Row 2 (adult): y=150-340, medium sprites  
    # Row 3 (golden): y=340-550, medium with glow
    # Row 4 (animation): y=550-720, labeled section
    # Row 5 (accessories): y=720-920, medium
    # Row 6 (wilted/sick): y=920-1248, 2 sprites
    
    crops = {
        # Baby row (4 sprites)
        'baby/happy': (0, 30, 200, 170),
        'baby/sad': (200, 30, 400, 170),
        'baby/angry': (400, 30, 600, 170),
        'baby/sleepy': (600, 30, 800, 170),
        
        # Adult row (4 sprites)
        'adult/happy': (0, 180, 210, 380),
        'adult/sad': (210, 180, 420, 380),
        'adult/angry': (420, 180, 630, 380),
        'adult/sleepy': (630, 180, 832, 380),
        
        # Golden row (4 sprites)
        'golden/happy': (0, 400, 210, 600),
        'golden/sad': (210, 400, 420, 600),
        'golden/angry': (420, 400, 630, 600),
        'golden/sleepy': (630, 400, 832, 600),
        
        # Animation frames (3 sprites)
        'animation/frame1': (100, 660, 300, 850),
        'animation/frame2': (320, 660, 520, 850),
        'animation/frame3': (540, 660, 740, 850),
        
        # Accessories (3 sprites)
        'accessories/hat': (50, 880, 280, 1080),
        'accessories/sunglasses': (300, 880, 530, 1080),
        'accessories/crown': (560, 880, 790, 1080),
        
        # Wilted/Sick (2 sprites)
        'states/wilted': (180, 1100, 420, 1248),
        'states/sick': (450, 1100, 700, 1248),
    }
    
    for name, box in crops.items():
        try:
            sprite = img.crop(box)
            # Convert to RGBA for transparency support
            if sprite.mode != 'RGBA':
                sprite = sprite.convert('RGBA')
            outpath = f"{OUTPUT}/{name}.png"
            sprite.save(outpath)
            print(f"  Saved: {name}.png")
        except Exception as e:
            print(f"  Error {name}: {e}")

def split_cyberpunk():
    """Split cyberpunk neon version (4 potatoes in a row)"""
    img = Image.open(CYBERPUNK)
    w, h = img.size
    print(f"Cyberpunk sheet: {w}x{h}")
    
    # 4 potatoes side by side, roughly equal spacing
    # Image is 784x1168, potatoes are in lower portion
    sprite_w = w // 4  # ~196px each
    
    # The potatoes appear to be in the middle-lower area
    top = 400
    bottom = 750
    
    emotions = ['happy', 'sad', 'angry', 'sleepy']
    for i, emotion in enumerate(emotions):
        left = i * sprite_w
        right = (i + 1) * sprite_w
        try:
            sprite = img.crop((left, top, right, bottom))
            if sprite.mode != 'RGBA':
                sprite = sprite.convert('RGBA')
            outpath = f"{OUTPUT}/cyberpunk/{emotion}.png"
            sprite.save(outpath)
            print(f"  Saved: cyberpunk/{emotion}.png")
        except Exception as e:
            print(f"  Error cyberpunk/{emotion}: {e}")

if __name__ == "__main__":
    ensure_dirs()
    print("\nSplitting main sprite sheet...")
    split_main_sheet()
    print("\nSplitting cyberpunk sheet...")
    split_cyberpunk()
    print("\nDone!")
