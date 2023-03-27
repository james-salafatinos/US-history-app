import requests
import argparse
import time
import json
import numpy as np
import re
import os
parser = argparse.ArgumentParser(
    description='A Wikipedia Scraper @james-salafatinos on Github.')
parser.add_argument("start_title", help="Starting wikipedia page title")
parser.add_argument(
    "--depth", help="Controls how many rounds link gathering (O^2N)", type=int, default=1)
parser.add_argument(
    "--pllimit", help="Controls how many links to return from a page (< = more API requests)", type=int, default=500)
parser.add_argument(
    "--write_to", help="Controls writing to GEXF", default='data.gexf')
args = parser.parse_args()

# Setup
baseURL = "https://en.wikipedia.org/w/api.php?"
num_requests = 0
db = {}
depth = args.depth
params = {
    'action': "query",
    'format': "json",
    'prop': 'links',
    'pllimit': args.pllimit,
    'plnamespace': 0,
    'ascii': 2,
    'titles': args.start_title,
}


def buildURL(params, baseURL, continue_token):
    """
    Takes API params and baseURL and concatenates to query string
    """
    url = baseURL

    if continue_token:
        params['plcontinue'] = continue_token

    for k in params:
        url += "&"+k+"="+str(params[k])
    print(f'⚙️  - Building URL... ', url)
    return url


def makeRequest(url):
    global num_requests
    """
    Makes simple JSON request to API
    https://www.mediawiki.org/wiki/API:Backlinks
    """

    print(
        f'📡 - Requesting... (Request: ({params["titles"]}), Total Requests So Far: {num_requests})')
    num_requests += 1

    # Request
    try:
        r = requests.get(url)
        res = r.json()
    except:
        print('probably server timeout...')
        res = json.dumps({})

    return res


def checkStop(json):
    """
    Checks if continue string is returned from wikipedia
    """
    stop = False

    try:
        if json['batchcomplete'] == '':
            print('🟢 - Batch Complete.')
            stop = True
    except:
        print("🟡 - Batch incomplete...")
    return stop


def getContinueToken(json):
    """
    Gets the continue token if it exists
    """
    token = ''
    try:
        token = json['continue']['plcontinue']
        print("➰ - Observing continue token...", token)
    except:
        "◼️ - Batch complete - No continue token"
    return token


def getTitles(json):
    """
    Pulls the link titles out into a list
    """
    titles = []
    self_pageID = list(json['query']['pages'].keys())[0]

    self_title = json['query']['pages'][self_pageID]['title']

    try:
        links = json['query']['pages'][self_pageID]['links']
    except:
        print("🔴 - Could not get links from getTitles(json)...")
        links = []
    for title in links:
        if ok(title):
            titles.append(title['title'])
        else:
            pass

    return self_title, titles


def ok(title):
    """
    Checks for stopwords to discard links
    """
    #write a regex for sentences similar to '1950 in ireland' to filter it out

    #A related page, e.g., 1950 in Irelend
    re_response = re.search('\w{4} in', str(title))
    if re_response:
        return False

    #Just a year e.g. 2020
    re_response = re.search('\A\d{4}\Z', str(title))
    if re_response:
        return False
    
    # returns true or false
    return "in the United States" not in str(title) and "List of" not in str(title) and "Wikipedia" not in str(title) and "Help" not in str(title) and "Template" not in str(title) and "Portal" not in str(title) and "Category" not in str(title) and "File" not in str(title) and "Template" not in str(title) and "Talk" not in str(title) and "Special" not in str(title) and "User" not in str(title) and "MediaWiki" not in str(title) and "Module" not in str(title) and "Book" not in str(title) and "Draft" not in str(title) and "TimedText" not in str(title) and "Module" not in str(title) and "Media" not in str(title) and "List of" not in str(title) and "Template talk" not in str(title) and "Category talk" not in str(title) and "File talk" not in str(title) and "Portal talk" not in str(title) and "Wikipedia talk" not in str(title) and "User talk" not in str(title) and "MediaWiki talk" not in str(title) and "Book talk" not in str(title) and "Draft talk" not in str(title) and "TimedText talk" not in str(title) and "Module talk" not in str(title) and "Media talk" not in str(title) and "List of" not in str(title) and "Template talk" not in str(title) and "Category talk" not in str(title) and "File talk" not in str(title) and "Portal talk" not in str(title) and "Wikipedia talk" not in str(title) and "User talk" not in str(title) and "MediaWiki talk" not in str(title) and "Book talk" not in str(title) and "Draft talk" not in str(title) and "TimedText talk" not in str(title) and "Module talk" not in str(title) and "Media talk" not in str(title) and "List of" not in str(title) and "Template talk" not in str(title) and "Category talk" not in str(title) and "File talk" not in str(title) and "Portal talk" not in str(title) and "Wikipedia talk" not in str(title) and "User talk" not in str(title)


def store(db, self_title, titles):
    """
    Store in a dictionary database
    """
    db[self_title] = titles
    return None


def merge(db, self_title, titles):
    """
    Merges titles in a dictionary database
    """
    db[self_title] = db[self_title] + titles
    return None


def dropDuplicates(db, self_title):
    """
    Drops duplicate titles in a dictionary database
    """
    db[self_title] = list(set(db[self_title]))
    return None


def extract(self_title, continue_token=0):
    """
    Recursively iterates through page continues to extract all links on a page
    """

    res = makeRequest(buildURL(params, baseURL, continue_token))
    continue_token = getContinueToken(res)
    titles = getTitles(res)  # self_title, titles
    self_title = titles[0]

    # print("DB KEYS", db.keys())

    if self_title in db.keys():
        print(f"📑 - Merging... ({self_title}), ({len(titles[1])} titles)")
        merge(db, *titles)
        # print("MERGED", db)
    else:
        print(f"💾 - Storing... ({self_title}), ({len(titles[1])} titles)")
        store(db, *titles)
        # print("STORED", db)

    dropDuplicates(db, self_title)

    if checkStop(res):
        return None

    print('-------------------------------')
    return extract(self_title, continue_token)


def timeout():
    time.sleep((np.random.randint(0,10)/10)*3.141592635897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870992)


def second_run():
    limit = 20 #2000
    counter = 0

    existing_db = db[list(db.keys())[0]]
    sorted_db = sorted(existing_db)
    for link in sorted_db:
        print('\n\n')
        print('🔁 - Second run...', link)
        params['titles'] = link
        if params.get('plcontinue') != None:
            del params['plcontinue']
        print(params)
        extract(link)

        if counter == limit:
            break
        else:
            counter += 1
            timeout()


def write_to_gexf(output_location):
    print('✏️  - Writing to .GEXF format...')
    global db
    import networkx as nx

    in_memory_tuples = []
    for entry in db:
        for value in db[entry]:
            in_memory_tuples.append((entry, value))

    G = nx.DiGraph()
    G.add_edges_from(in_memory_tuples)
    nx.write_gexf(G, output_location, encoding='utf-8', version='1.1draft')
    return None


if __name__ == "__main__":

    extract(args.start_title)
    # second_run()

    if args.write_to:
        if not os.path.exists("./data"):
            os.makedirs("./data")
        write_to_gexf("./data/" + args.write_to)
