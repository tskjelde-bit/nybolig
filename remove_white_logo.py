from PIL import Image

def remove_white_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    
    datas = img.getdata()
    
    newData = []
    
    # Threshold for "white"
    threshold = 240
    
    for item in datas:
        # Check if pixel is close to white (R, G, B all high)
        if item[0] > threshold and item[1] > threshold and item[2] > threshold:
            # Make it transparent
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)
    
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved transparent logo to {output_path}")

if __name__ == "__main__":
    remove_white_background("logo.png", "logo_trans.png")
