import chromadb

# Connect to ChromaDB
client = chromadb.PersistentClient(path="./chroma_db")

# Load correct collection
collection = client.get_collection("dsa_books")

# -----------------------------------
# TOTAL CHUNKS
# -----------------------------------
print("\n===== TOTAL CHUNKS =====")
print(collection.count())

# -----------------------------------
# GET ALL DATA
# -----------------------------------
results = collection.get()

# -----------------------------------
# PRINT TOPICS
# -----------------------------------
topics = set()

for meta in results["metadatas"]:

    if "chapter" in meta:
        topics.add(meta["chapter"])

print("\n===== TOPICS IN OPEN DATA STRUCTURES =====\n")

for topic in sorted(topics):
    print(topic)

# -----------------------------------
# SAMPLE DOCUMENTS
# -----------------------------------
print("\n===== SAMPLE DOCUMENTS =====\n")

for doc in results["documents"][:3]:

    print(doc[:500])
    print("\n---------------------------\n")