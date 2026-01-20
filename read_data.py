
file_path = "/Users/torbjorntest/Downloads/data_med_finn_links_ferdigstillelse_aktiv.txt"
try:
    with open(file_path, "r", encoding="latin-1") as f:
        for i in range(5):
            print(f.readline())
except Exception as e:
    print(f"Error: {e}")
