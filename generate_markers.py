#!/usr/bin/env python3
"""
生成宠物社区应用地图标记图标
使用纯Python生成PNG，不依赖外部库
"""

import zlib
import struct
import os

def create_png(width, height, pixels):
    """创建PNG文件"""
    def png_chunk(chunk_type, data):
        chunk_len = struct.pack('>I', len(data))
        chunk_crc = struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        return chunk_len + chunk_type + data + chunk_crc

    # PNG签名
    signature = b'\x89PNG\r\n\x1a\n'

    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)  # 8-bit RGBA
    ihdr = png_chunk(b'IHDR', ihdr_data)

    # IDAT chunk (图像数据)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00'  # Filter type: None
        for x in range(width):
            idx = (y * width + x) * 4
            raw_data += pixels[idx:idx+4]

    compressed_data = zlib.compress(raw_data, 9)
    idat = png_chunk(b'IDAT', compressed_data)

    # IEND chunk
    iend = png_chunk(b'IEND', b'')

    return signature + ihdr + idat + iend

def draw_circle(width, height, center_x, center_y, radius, color, bg_color):
    """绘制圆形"""
    pixels = []
    for y in range(height):
        row = []
        for x in range(width):
            dx = x - center_x
            dy = y - center_y
            dist_sq = dx * dx + dy * dy
            if dist_sq <= radius * radius:
                row.append(color)
            else:
                row.append(bg_color)
        pixels.append(b''.join(row))
    return pixels

def draw_rounded_rect(width, height, color, bg_color, radius_ratio=0.2):
    """绘制圆角矩形"""
    pixels = []
    radius = int(min(width, height) * radius_ratio)

    for y in range(height):
        row = []
        for x in range(width):
            # 计算到圆角边缘的距离
            in_rect = True
            if x < radius:
                if y < radius:
                    dist_sq = (radius - x) ** 2 + (radius - y) ** 2
                    if dist_sq > radius ** 2:
                        in_rect = False
                elif y >= height - radius:
                    dist_sq = (radius - x) ** 2 + (y - (height - radius - 1)) ** 2
                    if dist_sq > radius ** 2:
                        in_rect = False
            elif x >= width - radius:
                if y < radius:
                    dist_sq = (x - (width - radius - 1)) ** 2 + (radius - y) ** 2
                    if dist_sq > radius ** 2:
                        in_rect = False
                elif y >= height - radius:
                    dist_sq = (x - (width - radius - 1)) ** 2 + (y - (height - radius - 1)) ** 2
                    if dist_sq > radius ** 2:
                        in_rect = False

            if in_rect:
                row.append(color)
            else:
                row.append(bg_color)
        pixels.append(b''.join(row))
    return pixels

def create_marker_user(size):
    """创建用户标记图标（糯米）- 可爱的狗狗头像"""
    pixels = bytearray()

    # 颜色定义
    bg = b'\xff\xff\xff\x00'  # 白色透明
    main_color = b'\xff\xc1\xe9\xff'  # 粉色 #FFC1E9
    dark_color = b'\xff\x99\xd9\xff'  # 深粉色
    light_color = b'\xff\xe9\xf5\xff'  # 浅粉色

    # 中心
    cx, cy = size // 2, size // 2
    radius = size // 2 - 2

    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            dist_sq = dx * dx + dy * dy

            if dist_sq <= radius * radius:
                # 在圆内
                # 绘制简单的狗脸轮廓
                rel_x = dx / radius  # 相对位置 -1 to 1
                rel_y = dy / radius

                # 耳朵位置
                left_ear = (-0.7, -0.5)
                right_ear = (0.7, -0.5)
                ear_radius = 0.35

                # 检查是否在耳朵区域
                in_left_ear = ((rel_x - left_ear[0]) ** 2 + (rel_y - left_ear[1]) ** 2) <= ear_radius ** 2
                in_right_ear = ((rel_x - right_ear[0]) ** 2 + (rel_y - right_ear[1]) ** 2) <= ear_radius ** 2

                # 眼睛位置
                left_eye = (-0.25, -0.1)
                right_eye = (0.25, -0.1)
                eye_radius = 0.12

                in_left_eye = ((rel_x - left_eye[0]) ** 2 + (rel_y - left_eye[1]) ** 2) <= eye_radius ** 2
                in_right_eye = ((rel_x - right_eye[0]) ** 2 + (rel_y - right_eye[1]) ** 2) <= eye_radius ** 2

                # 鼻子位置
                nose_pos = (0, 0.15)
                nose_radius = 0.1

                in_nose = ((rel_x - nose_pos[0]) ** 2 + (rel_y - nose_pos[1]) ** 2) <= nose_radius ** 2

                # 嘴巴（微笑）
                mouth_y = 0.4
                if rel_y > 0.25 and rel_y < mouth_y:
                    if abs(rel_x) < rel_y * 0.5:
                        pixels.extend(dark_color)  # 嘴巴
                        continue

                if in_left_ear or in_right_ear:
                    pixels.extend(dark_color)  # 耳朵
                elif in_left_eye or in_right_eye:
                    pixels.extend(b'\xff\xff\xff\xff')  # 白色眼睛
                elif in_nose:
                    pixels.extend(b'\x33\x33\x33\xff')  # 深灰色鼻子
                else:
                    pixels.extend(main_color)  # 脸部主色
            else:
                pixels.extend(bg)  # 透明背景

    return bytes(pixels)

def create_marker_place(size):
    """创建场所标记图标（宠物草坪）- 草地和爪印"""
    pixels = bytearray()

    # 颜色定义
    bg = b'\xff\xff\xff\x00'  # 白色透明
    main_color = b'\x52\xc4\x1a\xff'  # 绿色 #52c41a
    light_green = b'\x95\xde\x63\xff'  # 浅绿色
    dark_green = b'\x73\xd1\x1e\xff'  # 深绿色
    grass_color = b'\x28\x8d\x0a\xff'  # 草绿色

    # 中心
    cx, cy = size // 2, size // 2
    radius = size // 2 - 2

    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            dist_sq = dx * dx + dy * dy

            if dist_sq <= radius * radius:
                rel_x = dx / radius
                rel_y = dy / radius

                # 绘制草地（底部绿色弧形）
                if rel_y > 0.1:
                    # 爪子垫位置
                    paw_center = (0, 0.2)
                    paw_radius = 0.35

                    # 主肉垫
                    in_main_paw = ((rel_x - paw_center[0]) ** 2 + (rel_y - paw_center[1]) ** 2) <= (paw_radius * 0.6) ** 2

                    # 小肉垫
                    small_paw_radius = 0.15
                    small_paw_y = -0.35
                    in_small_paw_1 = ((rel_x + 0.2) ** 2 + (rel_y - small_paw_y) ** 2) <= small_paw_radius ** 2
                    in_small_paw_2 = ((rel_x - 0.2) ** 2 + (rel_y - small_paw_y) ** 2) <= small_paw_radius ** 2
                    in_small_paw_3 = (rel_x ** 2 + (rel_y - small_paw_y - 0.2) ** 2) <= small_paw_radius ** 2

                    if in_main_paw or in_small_paw_1 or in_small_paw_2 or in_small_paw_3:
                        pixels.extend(light_green)  # 肉垫
                    else:
                        pixels.extend(main_color)  # 草地
                else:
                    # 顶部草叶
                    if abs(rel_x) < 0.1 and rel_y < -0.5:
                        pixels.extend(grass_color)
                    elif abs(rel_x - 0.2) < 0.05 and rel_y < -0.4:
                        pixels.extend(grass_color)
                    elif abs(rel_x + 0.2) < 0.05 and rel_y < -0.4:
                        pixels.extend(grass_color)
                    else:
                        pixels.extend(main_color)
            else:
                pixels.extend(bg)

    return bytes(pixels)

def create_marker_store(size):
    """创建商店标记图标（汪汪门店）- 购物袋和骨头"""
    pixels = bytearray()

    # 颜色定义
    bg = b'\xff\xff\xff\x00'  # 白色透明
    main_color = b'\x18\x90\xff\xff'  # 蓝色 #1890ff
    light_blue = b'\x69\xc8\xff\xff'  # 浅蓝色
    dark_blue = b'\x00\x69\xd8\xff'  # 深蓝色

    # 中心
    cx, cy = size // 2, size // 2
    radius = size // 2 - 2

    for y in range(size):
        for x in range(size):
            dx = x - cx
            dy = y - cy
            dist_sq = dx * dx + dy * dy

            if dist_sq <= radius * radius:
                rel_x = dx / radius
                rel_y = dy / radius

                # 绘制骨头形状
                bone_width = 0.6
                bone_height = 0.15
                end_radius = 0.2

                # 骨头主干
                in_bone_main = abs(rel_x) < bone_width and abs(rel_y) < bone_height

                # 骨头两端
                in_left_end = ((rel_x + bone_width) ** 2 + rel_y ** 2) <= end_radius ** 2
                in_right_end = ((rel_x - bone_width) ** 2 + rel_y ** 2) <= end_radius ** 2

                # 骨头两端的突起
                bump_offset = 0.15
                in_left_bump1 = ((rel_x + bone_width + bump_offset) ** 2 + (rel_y + bump_offset) ** 2) <= (end_radius * 0.7) ** 2
                in_left_bump2 = ((rel_x + bone_width + bump_offset) ** 2 + (rel_y - bump_offset) ** 2) <= (end_radius * 0.7) ** 2
                in_right_bump1 = ((rel_x - bone_width - bump_offset) ** 2 + (rel_y + bump_offset) ** 2) <= (end_radius * 0.7) ** 2
                in_right_bump2 = ((rel_x - bone_width - bump_offset) ** 2 + (rel_y - bump_offset) ** 2) <= (end_radius * 0.7) ** 2

                if in_left_end or in_right_end or in_left_bump1 or in_left_bump2 or in_right_bump1 or in_right_bump2:
                    pixels.extend(dark_blue)
                elif in_bone_main:
                    pixels.extend(main_color)
                else:
                    pixels.extend(light_blue)  # 填充区域
            else:
                pixels.extend(bg)

    return bytes(pixels)

def save_png(filename, size, pixels):
    """保存PNG文件"""
    png_data = create_png(size, size, pixels)

    with open(filename, 'wb') as f:
        f.write(png_data)

    print(f"Created: {filename} ({size}x{size})")

def main():
    # 输出目录
    output_dir = '/Users/mac/Desktop/code/pet-community/app/src/static/images'

    # 确保目录存在
    os.makedirs(output_dir, exist_ok=True)

    # 创建图标
    print("Generating map marker icons...")

    # 1. 用户标记 (48x48)
    user_pixels = create_marker_user(48)
    save_png(os.path.join(output_dir, 'marker-user.png'), 48, user_pixels)

    # 2. 场所标记 (40x40)
    place_pixels = create_marker_place(40)
    save_png(os.path.join(output_dir, 'marker-place.png'), 40, place_pixels)

    # 3. 商店标记 (40x40)
    store_pixels = create_marker_store(40)
    save_png(os.path.join(output_dir, 'marker-store.png'), 40, store_pixels)

    print("\nAll icons generated successfully!")

if __name__ == '__main__':
    main()
