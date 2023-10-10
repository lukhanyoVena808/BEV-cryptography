import json

# Opening JSON file
f = open('Code\src\ids.json')
 
# returns JSON object as 
# a dictionary
data = json.load(f)
 
# Iterating through the json
# list
ids = data['data']
 
# Closing file
f.close()



aList = {"data":[]}
# jsonString = json.dumps(aList)
# jsonFile = open("data.json", "w")
# jsonFile.write(jsonString)
# jsonFile.close()