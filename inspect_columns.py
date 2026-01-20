
# Script to verify columns for specific projects
input_path = "/Users/torbjorntest/Downloads/data_med_finn_links_ferdigstillelse_aktiv.txt"
try:
    with open(input_path, "r", encoding="mac_roman") as f:
        for line in f:
            if "jordet" in line or "Fagerblom" in line or "Fryd" in line:
                parts = line.strip().split("\t")
                print(f"Project: {parts[0]}")
                for i, p in enumerate(parts):
                    print(f"  Col {i}: {p}")
except Exception as e:
    print(e)
