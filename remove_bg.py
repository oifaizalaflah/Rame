from PIL import Image
import os

def remove_bg_screen(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = img.getdata()
    
    # We assume the background is very dark.
    # To extract the "glow" and make it transparent, we can use the maximum RGB component as the alpha channel,
    # and then un-premultiply the RGB values so they render correctly with the new alpha.
    
    new_data = []
    for item in data:
        r, g, b, a = item
        # The brightness of the pixel determines its opacity.
        alpha = max(r, g, b)
        
        if alpha == 0:
            new_data.append((0, 0, 0, 0))
        else:
            # Un-premultiply: scale RGB up so that when they are multiplied by alpha during rendering,
            # they produce the original color.
            r_new = int(min(255, (r * 255) / alpha))
            g_new = int(min(255, (g * 255) / alpha))
            b_new = int(min(255, (b * 255) / alpha))
            
            # Since the original image had a very dark blue/black background, 
            # if alpha is very low, we can just make it fully transparent to be safe.
            if alpha < 20:
                new_data.append((0, 0, 0, 0))
            else:
                new_data.append((r_new, g_new, b_new, alpha))
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

if __name__ == "__main__":
    remove_bg_screen("logo.png", "logo.png")
