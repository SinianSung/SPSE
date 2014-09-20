#!/usr/bin/python3

# gregor Luedi
# 20.9.2014


import os


def recFiles(path,depth, max_depth):
    pref = ' '+depth*3*'-'
    sum =0
    if os.name == 'nt':
        sep='\\'
    else:
        sep='/'
    if path =='':
        path = os.getcwd()
    try:
        if depth >max_depth:
            return 0
        else:
            for item in os.listdir(path):
                if os.path.isfile(path +sep+item):
                    b = os.path.getsize(path +sep+item)
                    print('f'+pref + item+ ' ' +'\t'+ str(b)+ 'Bytes')
                elif os.path.isdir(path+sep+item):
                    print('d'+pref + item)
                    recFiles(path+sep+item, depth+1,max_depth)
                else:
                    print('strange thing...')
    except Exception as e:
        print(e)
        return 0

recFiles('C:\\Python33',0,0)

