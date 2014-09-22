__author__ = 'gregor.luedi'

import requests
from bs4 import BeautifulSoup


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


def getLinks():
   f = open('lena.html','r')

   soup = BeautifulSoup(f.read())
   for items in soup.findAll('label'):
       print(item.string)



def main():
    f = open('lena.html','r')

    soup = BeautifulSoup(f.read())
    for items in soup.findAll('label'):
        print(item.string)


#file = open('logbuch.txt', 'w')
# grundseite http://www.berufsberatung.ch/dyn/2455.aspx?countycode=zh

# buchstabe a  http://www.berufsberatung.ch/dyn/1235.aspx?searchsubmit=true&countycode=ZH&search=&searchabc=A&id_section=
# erster abschnitt
# http://www.berufsberatung.ch/dyn/1235.aspx?searchsubmit=true&countycode=ZH&search=&searchabc=&id_section=&swissdoc=0.130.32&swissdoc=0.554.2&swissdoc=0.580.46&swissdoc=0.420.4&swissdoc=0.722.46&swissdoc=0.723.5&swissdoc=0.555.3&swissdoc=0.555.8&swissdoc=0.570.53&swissdoc=0.570.52&swissdoc=0.570.51&swissdoc=0.210.50&swissdoc=0.210.4&swissdoc=0.570.1&swissdoc=0.430.51&swissdoc=0.430.34&swissdoc=0.320.16&swissdoc=0.450.2&swissdoc=0.510.2&swissdoc=0.510.14&swissdoc=0.613.1&swissdoc=0.826.12&swissdoc=0.611.85&swissdoc=0.570.3&swissdoc=0.570.15
#spx?searchsubmit=true&countycode=ZH&search=&searchabc=&id_section=&swissdoc=0.130.32&swissdoc=0.554.2&swissdoc=0.580.46&swissdoc=0.420.4&swissdoc=0.722.46&swissdoc=0.723.5&swissdoc=0.555.3&swissdoc=0.555.8&swissdoc=0.570.53&swissdoc=0.570.52&swissdoc=0.570.51&swissdoc=0.210.50&swissdoc=0.210.4&swissdoc=0.570.1&swissdoc=0.430.51&swissdoc=0.430.34&swissdoc=0.320.16&swissdoc=0.450.2&swissdoc=0.510.2&swissdoc=0.510.14&swissdoc=0.613.1&swissdoc=0.826.12&swissdoc=0.611.85&swissdoc=0.570.3&swissdoc=0.570.15&swissdoc=0.350.13&swissdoc=0.350.5&swissdoc=0.450.64&swissdoc=0.723.7&swissdoc=0.613.44&swissdoc=0.613.45&swissdoc=0.613.46&swissdoc=0.220.6&swissdoc=0.613.16&swissdoc=0.533.2&swissdoc=0.440.1&swissdoc=0.555.7&swissdoc=0.440.11&swissdoc=0.440.92&swissdoc=0.731.59&swissdoc=0.440.4&swissdoc=0.721.39&swissdoc=0.722.2&swissdoc=0.230.6&swissdoc=0.811.8&swissdoc=0.613.51&swissdoc=0.330.8&swissdoc=0.570.17&swissdoc=0.570.23&swissdoc=0.210.47&swissdoc=0.210.20&swissdoc=0.533.3&swissdoc=0.150.13&swissdoc=0.150.4&swissdoc=0.120.6&swissdoc=0.613.18&swissdoc=0.150.14&swissdoc=0.150.5&swissdoc=0.440.78&swissdoc=0.440.17&swissdoc=0.440.79&swissdoc=0.440.80&swissdoc=0.440.81&swissdoc=0.140.9&swissdoc=0.130.7&swissdoc=0.410.13&swissdoc=0.822.32&swissdoc=0.450.9&swissdoc=0.450.13&swissdoc=0.632.5&swissdoc=0.632.17&swissdoc=0.814.4&swissdoc=0.822.18&swissdoc=0.430.15&swissdoc=0.430.46&swissdoc=0.552.4&swissdoc=0.552.2&swissdoc=0.440.74&swissdoc=0.230.11&swissdoc=0.440.26&swissdoc=0.510.25&swissdoc=0.220.27&swissdoc=0.220.31&swissdoc=0.554.12&swissdoc=0.450.17&swissdoc=0.450.58&swissdoc=0.580.11&swissdoc=0.580.12&swissdoc=0.561.28&swissdoc=0.561.39&swissdoc=0.450.21&swissdoc=0.440.30&swissdoc=0.440.87&swissdoc=0.440.31&swissdoc=0.440.21&swissdoc=0.440.32&swissdoc=0.611.105&swissdoc=0.611.106&swissdoc=0.570.56&swissdoc=0.220.13&swissdoc=0.551.2&swissdoc=0.350.7&swissdoc=0.220.32&swissdoc=0.553.39&swissdoc=0.540.13&swissdoc=0.570.57&swissdoc=0.570.26&swissdoc=0.130.12&swissdoc=0.210.46&swissdoc=0.210.18&swissdoc=0.617.8&swissdoc=0.617.2&swissdoc=0.440.35&swissdoc=0.450.25&swissdoc=0.430.18&swissdoc=0.553.36&swissdoc=0.561.13&swissdoc=0.723.18&swissdoc=0.554.5&swissdoc=0.554.6&swissdoc=0.554.24&swissdoc=0.210.45&swissdoc=0.210.22&swissdoc=0.440.36&swissdoc=0.570.29&swissdoc=0.570.31&swissdoc=0.210.25&swissdoc=0.555.17&swissdoc=0.821.13&swissdoc=0.440.40&swissdoc=0.580.9&swissdoc=0.580.6&swissdoc=0.130.14&swissdoc=0.450.15&swissdoc=0.330.5&swissdoc=0.723.20&swissdoc=0.140.29&swissdoc=0.140.30&swissdoc=0.430.20&swissdoc=0.613.23&swissdoc=0.555.34&swissdoc=0.450.28&swissdoc=0.450.65&swissdoc=0.723.23&swissdoc=0.430.45&swissdoc=0.430.44&swissdoc=0.822.3&swissdoc=0.532.7&swissdoc=0.553.1&swissdoc=0.534.9&swissdoc=0.534.8&swissdoc=0.553.8&swissdoc=0.580.25&swissdoc=0.570.49&swissdoc=0.220.33&swissdoc=0.220.28&swissdoc=0.510.23&swissdoc=0.440.43&swissdoc=0.450.34&swissdoc=0.450.56&swissdoc=0.440.47&swissdoc=0.822.34&swissdoc=0.110.5&swissdoc=0.430.23&swissdoc=0.430.48&swissdoc=0.631.8&swissdoc=0.220.43&swissdoc=0.440.53&swissdoc=0.320.15&swissdoc=0.310.13&swissdoc=0.140.18&swissdoc=0.140.19&swissdoc=0.825.24&swissdoc=0.822.39&swissdoc=0.520.6&swissdoc=0.210.29&swissdoc=0.130.18&swissdoc=0.450.23&swissdoc=0.723.28&swissdoc=0.420.21&swissdoc=0.430.26
#  <input type="checkbox" id="swissdoc_0.580.46" name="swissdoc" value="0.580.46" style="float: left">
# http://www.berufsberatung.ch/dyn/1235.aspx?searchsubmit=true&countycode=ZH&search=&searchabc=&id_section=&swissdoc=0.580.46

#scanWeb('http://www.berufsberatung.ch/dyn/1235.aspx?searchsubmit=true&countycode=ZH&search=&searchabc=&id_section=&swissdoc=', 5)