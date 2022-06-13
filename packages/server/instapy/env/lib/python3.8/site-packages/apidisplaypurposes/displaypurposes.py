# -*- coding: utf-8 -*-

import random
import hashlib
import requests

from json import JSONDecodeError

USER_AGENTS = {
  'chrome': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36',
  'firefox': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:83.0) Gecko/20100101 Firefox/83.0'
}

GET_HEADERS = {
  'chrome': {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'api-token': '',
    'origin': 'https://displaypurposes.com',
    'referer': 'https://displaypurposes.com/',
    'sec-ch-ua': '"Chromium";v="86", "\"Not\\A;Brand";v="99", "Google Chrome";v="86"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': '',
  },
  'firefox': {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.5',
    'api-token': '',
    'connecttion': 'keep-alive',
    'host': 'apidisplaypurposes.com',
    'origin': 'https://displaypurposes.com',
    'referer': 'https://displaypurposes.com/',
    'te': 'Trailers',
    'user-agent': '',
  }
}

OPTION_HEADERS = {
  'chrome': {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.9',
    'access-control-request-headers': 'api-token',
    'access-control-request-method': 'GET',
    'origin': 'https://displaypurposes.com',
    'referer': 'https://displaypurposes.com/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'cross-site',
    'user-agent': '',
  },
  'firefox': {
    'accept': '*/*',
    'accept-language': 'en-US,en;q=0.5',
    'access-control-request-headers': 'api-token',
    'access-control-request-method': 'GET',
    'connecttion': 'keep-alive',
    'host': 'apidisplaypurposes.com',
    'origin': 'https://displaypurposes.com',
    'referer': 'https://displaypurposes.com/',
    'user-agent': '',
  }
}

DEFAULT = 'function(d){var r = M(V(Y(X(d),8*d.length)));return r.toLowerCase()};function M(d){for(var _,m="0123456789ABCDEF",f="",r=0;r<d.length;r++)_=d.charCodeAt(r)'

def generate_api_token(tag: str,
                       user_agent: str) -> str:
  '''
  parameters:
    -- tag: str, specifies the tag to obtain similar tags from
    -- user_agent: str, specifies the user_agent being used when sending a GET request

  function:
    -- creates a valid api token to use when sending a GET request to https://apidisplaypurposes.com

  usage:
    -- api_token = generate_api_token(tag)

  returns:
    -- api_token: str, an encoded api token
  '''

  return hashlib.md5(f'{user_agent}|{tag}|{DEFAULT}'.encode('utf-8')).hexdigest()


def tags(tag: str,
         limit: int=-1,
         browser: str='chrome') -> list:
  '''
  parameters:
    -- tag: str, specifies the tag to obtain similar tags from
    -- limit: int, specifies how many similar tags should be obtained
        - default: -1, obtain all similar tags
    -- browser: str, the browser to emulate when sending https requests

  function:
    -- obtain hashtags similar to the inputted *tag* from https://apidisplaypurposes.com

  usage:
    -- hashtags = tags('dogs')

  returns:
    -- hashtags: list (of dict), the hashtags, and info about them, obtained from the GET request
        - dict keys:
            |> absRelevance: float,
            |> geo: None or tuple:
                              |> cooridnates of where the hashtag is used
            |> media_count: int, the number of posts that contain this hashtag and the inputted tag
            |> rank: int, the popularity of the hashtag
            |> relevance: int, how related this hashtag is compared to the inputted tag
            |> tag: str, a similar hashtag
  '''

  assert isinstance(tag, str), print(f'parameter error: tag must be of type str --> not {type(tag)}')
  assert browser in USER_AGENTS.keys(), print(f'parameter error: browser must be one of --> {USER_AGENTS.keys()}')

  # obtain a user_agent for the specified browser
  user_agent = USER_AGENTS[browser]

  # mimic the GET headers generated from displaypurposes
  header = GET_HEADERS[browser]
  header['user-agent'] = user_agent
  # generate an api_token off of the tag and user_agent
  header['api-token'] = generate_api_token(tag, user_agent)

  try:
    # send a GET request to apidisplaypurposes to obtain the similar hashtags
    hashtags = requests.get(f'https://apidisplaypurposes.com/tag/{tag}', headers=header).json()
  except JSONDecodeError:
    # there was an error with the Query
    # possible reasons:
    #   - tag encoding
    #   - user_agent not supported
    #   - default string was changed
    return None

  try:
    # only keep *limit* number of hashtags
    return hashtags['results'][:limit]
  except KeyError:
    # there was an error trying to access the 'results' key
    return None


def graph(tag: str,
          depth: int=1,
          browser: str='chrome') -> list:
  '''
  parameters:
    -- tag: str, specifies the tag to optain nearby tags from
    -- depth: int, specifies the maximum length of an edge that connects hashtags to the inputted tag
        - default: 1, obtain all tags that share an edge of maximum depth 1 with the inputted tag
    -- browser: str, the browser to emulate when sending https requests

  function:
    -- obtain hashtags with an edge connected to the inputted tag from https://displaypurposes.com

  usage:
    -- edges = graph('dogs')

  returns:
    -- valid_edges: list (of dict), the hashtags, and info about them, obtained from the GET request
        - dict keys:
            |> absRelevance: float,
            |> geo: None or tuple:
                              |> cooridnates of where the hashtag is used
            |> media_count: int, the number of posts that contain this hashtag and the inputted tag
            |> rank: int, the popularity of the hashtag
            |> relevance: int, how related this hashtag is compared to the inputted tag
            |> tag: str, a similar hashtag
  '''

  assert isinstance(tag, str), print(f'parameter error: tag must be of type str --> not {type(tag)}')
  assert browser in USER_AGENTS.keys(), print(f'parameter error: browser must be one of --> {USER_AGENTS.keys()}')

  # obtain a user_agent for the specified browser
  user_agent = USER_AGENTS[browser]

  # mimic the GET headers generated from displaypurposes
  header = GET_HEADERS[browser]
  header['user-agent'] = user_agent
  # generate an api_token off of the tag and user_agent
  header['api-token'] = generate_api_token(tag, user_agent)

  try:
    # send a GET request to apidisplaypurposes to obtain the similar hashtags
    hashtags = requests.get(f'https://apidisplaypurposes.com/graph/{tag}', headers=header).json()
  except JSONDecodeError:
    # there was an error with the Query
    # possible reasons:
    #   - tag encoding
    #   - user_agent not supported
    #   - default string was changed
    return None

  try:
    # obtain the edges that were returned
    edges = hashtags['edges']
  except KeyError:
    return None

  # obtain all tags that share an edge with the inputted tag
  valid_edges = [
    edge for edge in edges if tag in [edge['a'], edge['b']]
  ]

  return valid_edges


def map(x1: float,
        y1: float,
        x2: float,
        y2: float,
        zoom: int=16,
        limit: int=-1,
        browser: str='chrome') -> list:
  '''
  parameters:
    -- x1: float, specifies the first x coordinate (top left)
    -- y1: float, specifies the first y coordinate (top left)
    -- x2: float, specifies the second x coordinate (bottom right)
    -- y2: float, specifies the second y coordinate (bottom right
    -- zoom: int, specifies the zoom associated with the bounding box
    -- limit: int, specifies how many similar tags should be obtained
        - default: -1, obtain all similar tags
    -- browser: str, the browser to emulate when sending https requests

  function:
    -- obtain hashtags similar to the inputted *tag* from https://apidisplaypurposes.com

  usage:
    -- hashtags = map(-118.77636909484865,
                      33.23850805662313,
                      -117.04052925109865,
                      35.10400554120783,
                      zoom=14,
                      limit=20)

  returns:
    -- hashtags: list (of dict), the hashtags, and info about them, obtained from the GET request
        - dict keys:
            |> absRelevance: float,
            |> geo: None or tuple:
                              |> cooridnates of where the hashtag is used
            |> media_count: int, the number of posts that contain this hashtag and the inputted tag
            |> rank: int, the popularity of the hashtag
            |> relevance: int, how related this hashtag is compared to the inputted tag
            |> tag: str, a similar hashtag
  '''

  assert isinstance(x1, (int, float)), print(f'parameter error: x1 must be of type int or float --> not {type(x1)}')
  assert isinstance(y1, (int, float)), print(f'parameter error: y1 must be of type int or float --> not {type(y1)}')
  assert isinstance(x2, (int, float)), print(f'parameter error: x2 must be of type int or float --> not {type(x2)}')
  assert isinstance(y2, (int, float)), print(f'parameter error: y2 must be of type int or float --> not {type(y2)}')
  assert isinstance(zoom, int) and zoom in range(2, 17), print(f'parameter error: zoom must be an integer in the range [2, 16]')
  assert browser in USER_AGENTS.keys(), print(f'parameter error: browser must be one of --> {USER_AGENTS.keys()}')

  # obtain a user_agent for the specified browser
  user_agent = USER_AGENTS[browser]

  # mimic the GET headers generated from displaypurposes
  header = GET_HEADERS[browser]
  header['user-agent'] = user_agent
  header['api-token'] = 'test'

  try:
    # send a GET request to apidisplaypurposes to obtain the similar hashtags
    hashtags = requests.get(f'https://apidisplaypurposes.com/local/?bbox={x1},{y1},{x2},{y2}&zoom={zoom}', headers=header).json()
  except JSONDecodeError:
    # there was an error with the Query
    # possible reasons:
    #   - tag encoding
    #   - user_agent not supported
    #   - default string was changed
    return None

  try:
    # obtain just the tags from the response
    hashtags = hashtags['tags']
  except KeyError:
    # there was an error trying to access the 'results' key
    return None

  return sorted(hashtags, key=lambda tag: tag['weight'], reverse=True)[:limit]
