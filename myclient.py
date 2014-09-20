import socket
import sys

data = "Hello Network!" #.join(sys.argv[1:])

# Create a socket (SOCK_STREAM means a TCP socket)
sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
while True:
   
    try:
        # Connect to server and send data
        sock.connect(('localhost', 9999))
        sock.sendall(bytes(data + "\n", "utf-8"))

        # Receive data from the server and shut down
        received = str(sock.recv(1024), "utf-8")
    finally:
        sock.close()

    data = input("Send to Server:")

print("Sent:     {}".format(data))
print("Received: {}".format(received))
