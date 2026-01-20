from PIL import Image

def process_logo(input_path, output_path):
    print(f"Opening {input_path}...")
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()
    
    newData = []
    
    # We want to change the BLACK text to WHITE.
    # We also want to keep the BLUE icon as is.
    # Assuming transparent background.
    
    # Black Text ranges (r,g,b low).
    # Blue Icon ranges (r low, g med, b high).
    
    for item in datas:
        r, g, b, a = item
        
        # Detect Black (Text): Low R, G, B.
        if r < 50 and g < 50 and b < 50 and a > 0:
            # Change to White
            newData.append((255, 255, 255, a))
        else:
            # Keep original (Blue icon, Transparent pixels, etc.)
            newData.append(item)
    
    img.putdata(newData)
    img.save(output_path, "PNG")
    print(f"Saved processed logo to {output_path}")

if __name__ == "__main__":
    process_logo("nybygg_logo_ny.png", "nybygg_logo_white_text.png")
