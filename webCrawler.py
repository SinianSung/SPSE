__author__ = 'gregor.luedi'

import requests
from bs4 import BeautifulSoup

def scanWeb(url):
    source_code = requests.get(url)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text)
    for item in soup.findAll('div', {'style': 'display: table; width: 100%'}):
        for link in item.findAll('a'):
            href = 'http://www.berufsberatung.ch/' + link.get('href')
            get_single_item(href)


def get_single_item(item_url):
    source_code = requests.get(item_url)
    plain_text = source_code.text
    soup = BeautifulSoup(plain_text)
    foundtext = soup.find('h2',text='Bewerbungsadresse') # Find the first <p> tag with the search text
    adresse = foundtext.findNext('div',{'class':'text'})
    adresse = cleanString(adresse)
    file = open('adressen.txt', 'a')
    file.write(str(adresse)+'\n')
    file.close()


def cleanString(adresse):
    adresse = str(adresse).replace('<div class="text">','')
    adresse = str(adresse).replace('<script>','')
    adresse = str(adresse).replace('<noscript>','')
    adresse = str(adresse).replace('<br/>','')
    adresse = str(adresse).replace(' <em>«at»</em> ','@')
    adresse = str(adresse).replace(' <em>«dot»</em> ','.')
    adresse = str(adresse).replace('<a>','.')
    adresse= str(adresse).replace('E-Mail: .','\n')
    adresse = adresse.partition('</noscript>')[0]
    return adresse


def getLinks():
    f = open('lenazh.htm','r')
    soup = BeautifulSoup(f.read())
    for items in soup.findAll('label'):
        if items.get('for').find('swiss')>=0:
            idswissdoc[items.string] =items.get('for')


def main():
    getLinks()
    file = open('adressen.txt', 'w')
    file.close()
    for value in idswissdoc:
        print('working ...')
        file=open('adressen.txt','a')
        file.write('\n-'*30)
        file.write('\n'+str(value).upper() +':\n')
        file.write('-'*30 + '\n')
        file.close()
        url = 'http://www.berufsberatung.ch/dyn/1235.aspx?searchsubmit=true&countycode=ZH&search=&searchabc=&id_section=&swissdoc=0.130.32&swissdoc=0.554.2&swissdoc=0.580.46&swissdoc=0.420.4&swissdoc=0.722.46&swissdoc=0.723.5&swissdoc=0.555.3&swissdoc=0.555.8&swissdoc=0.570.53&swissdoc=0.570.52&swissdoc=0.570.51&swissdoc=0.210.50&swissdoc=0.210.4&swissdoc=0.570.1&swissdoc=0.430.51&swissdoc=0.430.34&swissdoc=0.320.16&swissdoc=0.450.2&swissdoc=0.510.2&swissdoc=0.510.14&swissdoc=0.613.1&swissdoc=0.826.12&swissdoc=0.611.85&swissdoc=0.570.3&'+idswissdoc[value]
        scanWeb(url)
    print('done')

idswissdoc ={}
main()
