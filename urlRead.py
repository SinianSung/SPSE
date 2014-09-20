import urllib.request

response = urllib.request.urlopen('http://www.ken.ch/%7elueg/informatik/python/movies.html')

html = response.read()

print(html.strip('</li><li>'))

a = input()
