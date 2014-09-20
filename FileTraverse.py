#!/usr/bin/env python

import os
import glob

def showFiles(path, s):
    for item in os.listdir(path):
        if os.path.isfile(item):
            print(s + item)
        elif os.path.isdir(item):
            print(item)
            npath =path +'\\'+item
            showFiles(npath,s+'---')



def showSize(path):
    files=[]
    for item in os.listdir(path):
        if os.path.isfile(item):
            files.append((item,os.path.getsize(item)))
            print(item + " : \t" + str(os.path.getsize(item))+' Byte')
    print(files)
