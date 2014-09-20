__author__ = 'gregor.luedi'

import requests
from bs4 import BeautifulSoup

file = open('logbuch.txt', 'w')


def scanWeb(url, pages):
    page = 0

    while page <= pages:
        source_code = requests.get(url + str(page))
        plain_text = source_code.text
        soup = BeautifulSoup(plain_text)

        for item in soup.findAll('span', {'class': 'field-content'}):
            for link in item.findAll('a'):
                href = 'http://www.ken.ch' + link.get('href')
                get_single_item(href)
        page += 1
    file.close()


def get_single_item(item_url):
    source_code = requests.get(item_url)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text)
    for news in soup.findAll('div', {'class': 'news node'}):
        file.write(news.find('span', {'class': 'date-display-single'}).string + ', ' + news.find('h1').string + ';\n')


scanWeb('http://www.ken.ch/aktuell/news/newsarchiv?page=', 5)