
from mintools import ormin

class ZZZ(ormin.Model):
    blob = ormin.TextField()

class YYY(ormin.Model):
    blob = ormin.TextField()

class Chaininfo(ormin.Model):
    bestblockhash = ormin.StringField()
    blocks = ormin.IntField()
    mediantime = ormin.IntField()

class Block(ormin.Model):
    height = ormin.IntField(index=True)
    blob = ormin.TextField()
    zzz = ormin.StringField(required=False)
    # yyy = ormin.StringField(required=False)

    xxx = ormin.StringField(required=False)
    # xxx = ormin.StringField(required=True)

class Tx(ormin.Model):
    blockhash = ormin.StringField(index=True)
    blob = ormin.TextField()

class Blockstats(ormin.Model):
    height = ormin.IntField(index=True)
    blob = ormin.TextField()

class Mempoolstats(ormin.Model):
    time = ormin.IntField(index=True)
    blob = ormin.TextField()

ORMIN_DOMAIN = ormin.Domain([
    Chaininfo,
    Block,
    Tx,
    Blockstats,
    Mempoolstats,
    ZZZ,
    # YYY,
])
