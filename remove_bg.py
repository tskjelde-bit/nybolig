import sys
from PIL import Image

def remove_green_bg(image_path):
    img = Image.open(image_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    new_data = []
    # Sample top-left pixel for background color
    bg_color = img.getpixel((0, 0))
    # Ensure bg_color is tuple of 3 or 4
    bg_r, bg_g, bg_b = bg_color[0:3]

    print(f"Detected background color: {bg_r}, {bg_g}, {bg_b}")

    tolerance = 60 

    for item in datas:
        r, g, b = item[0:3]
        # Check distance from bg color
        dist = abs(r - bg_r) + abs(g - bg_g) + abs(b - bg_b)
        
        if dist < tolerance:
            new_data.append((255, 255, 255, 0)) # Transparent
        else:
            new_data.append(item)

    img.putdata(new_data)
    img.save(image_path, "PNG")
    print(f"Processed {image_path}")

if __name__ == "__main__":
    remove_green_bg('red_car.png')
