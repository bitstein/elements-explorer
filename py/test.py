
#!/usr/bin/env python

if __name__ != '__main__':
    raise ImportError(u"%s may only be run as a script" % __file__)

print('aaaaa')

path = "/build_docker/lib/explorer/minql/schema.json"
import json
with open(path, 'r') as infile:
    schema = json.load(infile)

print(schema)
print('bbbbbb')

address = 'tcp://127.0.0.1:1984'
dbaddress = 'tcp://127.0.0.1:1984'
from lib import minql

c = minql.MinqlClientFactory('dummy')()
c.put_schema_from_file(path)

print('cccccc')

height = 2
try:
    json_result = c.get('stat', height)
    print(json_result)
except minql.NotFoundError:
    print('not found')

print('ddddd')

stat = {
    "id": 2,
    "height": 2,
    "txs": 0
}
json_result = c.put('stat', stat)
    
print('eeeeee')

height = 2
json_result = c.get('stat', height)
print(json_result)

print('ffffffff')

# ddb = minql.ZmqMinqlServer(
#     'dummy', 
#     single=True, 
#     address=address,
#     db_address=dbaddress,
#     worker_id='ZmqServer_test')
# ddb.start()

# c = minql.MinqlClient('zmq', address)

# import time
# time.sleep(10)

print('zzzzzz')
