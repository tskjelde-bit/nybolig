import json
import re

input_path = "/Users/torbjorntest/Downloads/data_med_finn_links_ferdigstillelse_aktiv.txt"
output_path = "/Users/torbjorntest/Local/nybolig/data.js"

projects = []

def parse_price(val):
    try:
        return int(str(val).replace(" ", "").replace("\xa0", ""))
    except:
        return 0

try:
    with open(input_path, "r", encoding="mac_roman") as f:
        for line in f:
            if not line.strip(): continue
            parts = line.strip().split("\t")
            
            # Simple heuristic mapping based on observation
            # Only process lines that look like data (have enough columns)
            if len(parts) < 10: continue
            
            name = parts[0]
            
            # Find Link column (starts with http)
            link_idx = -1
            for i, p in enumerate(parts):
                if p.startswith("http"):
                    link_idx = i
                    break
            
            link = parts[link_idx] if link_idx != -1 else ""
            
            # Completion is usually after link
            description = parts[link_idx + 1] if link_idx != -1 and len(parts) > link_idx + 1 else "Ukjent"
            
            # Active is last column - STRIP IT
            active_raw = parts[-1].strip()
            active = active_raw.lower() == "ja" # Robust check
            
            # Units and Sold seem to be at index 3 and 4
            try:
                units = int(parts[3])
                sold = int(parts[4])
            except:
                units = 0
                sold = 0
                
            # Price seems to be at index 11 (Total Price) based on inspection
            # Index 12 is likely Sqm Price
            try:
                price_from = int(parts[11])
            except:
                price_from = 0

            projects.append({
                "name": name,
                "units": units,
                "sold": sold,
                "price_from": price_from,
                "link": link,
                "description": f"Salgsstart: {description}" if "Salgsstart" not in description else description, # Hack to fit existing parser?
                # Actually existing parser expects "Salgsstart: DD.MM.YYYY" for date parsing...
                # But the new data has "1. halvår 2028".
                # My `getCompletionDate` function will fail.
                # I should store the raw completion string and update script.js to handle it.
                "completion_text": description,
                "active": active,
                "area": "Oslo" # Default
            })

    # Write JS file
    js_content = "const projects = " + json.dumps(projects, indent=4) + ";\n\nexport default projects;"
    
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(js_content)
        
    print(f"Converted {len(projects)} projects.")

except Exception as e:
    print(f"Error: {e}")
