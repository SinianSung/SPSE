#!/usr/bin/python

# or use /usr/bn/env python

#   author: gregor luedi
#   filename: creatingProcesses.py
#   date: 16.10.2014

import os

def child_process():
    print 'I am the child process and my PID is : %d'%os.getpid()

    print 'The child is exiting'

def parent_process():
    print 'I am the parent process and my PID is : %d'%os.getpid()

    childpid = os.fork()     #creates a new process, windows does not work

    if childpid == 0:
        # we are inside the child
        child_process()
    else:
        # we are inside the parent process
        print 'We are in the parent process'
        print ' Our child hat the PID: %d'%childpid

    while True:
        pass


parent_process()
