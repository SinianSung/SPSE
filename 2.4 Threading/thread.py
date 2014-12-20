#!/usr/bin/python

import thread
import time

def worker_thread(id):
    count=1
    print 'Thread ID %d is now alive \n'%id
    while True:
        print 'Thread with id %d has counter Value %d \n' %(id,count)
        count+=1
        time.sleep(2)

for i in range(5):
    thread.start_new_thread(worker_thread,(i,))

print 'Main thread oing for an infinite loop \n'


while True:
    pass
