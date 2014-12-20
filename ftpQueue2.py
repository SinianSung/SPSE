from ftplib import FTP
import Queue
from threading import Thread
import time

sites =['ftp.ceag.ch','ftp.astro.ch','ftp.fourmilab.ch','ftp.fastnet.ch','ftp.imp.ch','ftp.ifor.math.ethz.ch','ftp.inf.ethz.ch','ftp.math.ethz.ch','root.cern.ch','ftp.cc.ac.cn','ftp.aopen.com.cn','ftp.pku.edu.cn']
num_of_fetchthreads=2


def contactFTP(i,q):
    while True:
        url=q.get()
        ftp=FTP(url)
        ftp.login()
        print 40*'*'
        print url
        ftp.retrlines('LIST')
        print 40*'*'
        q.task_done()


ftpq = Queue.Queue()

for i in range(num_of_fetchthreads):
    worker = Thread(target=contactFTP,args=(i,ftpq))
    worker.setDaemon(True)
    worker.start()
    
for url in sites:
    ftpq.put(url)


ftpq.join()
