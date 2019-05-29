import csv
import requests
import codecs

def changeName(name):
    s = " !@#$%^&*()_+-=[]{};:,./<>?`~'"
    ctr = 0
    while ( ctr < len(s) ):
        name = name.replace(s[ctr], "_")
        ctr = ctr + 1
    return name

def search(search):
    with open('api_keys.csv') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row['Type'] == 'Ebay':
                use_key = row['API']
    api_url = "http://svcs.ebay.com/services/search/FindingService/v1?"
    payload = { 'OPERATION-NAME' : 'findItemsByKeywords',
                'SERVICE-VERSION' : '1.0.0',
                'SECURITY-APPNAME' : use_key,
                'RESPONSE-DATA-FORMAT' : "JSON",
                'keywords' : search}
    r = requests.get(api_url, params=payload)
    r = r.json()
    r = r['findItemsByKeywordsResponse'][0]['searchResult'][0]['item'][0]
    ret = {}
    ret['title'] = changeName(r['title'][0])
    ret['image'] = r['galleryURL'][0]
    ret['price'] = float(r['sellingStatus'][0]['currentPrice'][0]['__value__'])
    return ret
