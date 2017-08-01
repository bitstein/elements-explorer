# rpc-explorer

A simple block explorer based on deamon's rpc calls.

# Using Docker:

## Dependencies:

Dependent on the OS distribution:

```
make python docker-ce docker-compose
```

Add your user to the docker group:

```
sudo usermod -a -G docker $USER
```

Restart for the last command to take effect.

Test docker installation:

```
docker run hello-world
```

## Build & development

To build and run:

```
make docker-up
```

Visit the web going to http://127.0.0.1:5000

Before closing down the whole docker project, close the bitcoin daemon manually:

```
docker ps
docker attach docker_bitcoin_1
Ctrl-c, Ctrl-c
```
Or just mind .bitcoin_data/lock if exiting improperly.

To detach without killing the container use Ctrl-p, Ctrl-q.

```
make docker-down
```

For a full docker clean:

```
make docker-clean
```

# Local, without docker (currently not working)

## Dependencies:

Dependent on the OS distribution:

```
make python pip virtualenv nodejs npm
```

## Installation

```
make
```

## Build & development

This needs a Bitcoin, Elements or compatible deamon running alongside
it in the same machine with at least the following in its
configuration file:

```
server=1
txindex=1
rpcuser=user1
rpcpassword=password1
```

Run the daemon, examples:
```
./betad -daemon -regtest -conf=betaregtest.conf
./betad -daemon -testnet -conf=betatestnet3.conf
./betad -daemon -conf=liquid.conf
./bitcoind -daemon -testnet -conf=testnet3.conf
./bitcoind -daemon -conf=explorer.conf -datadir=$BTCTXINDEX_DATADIR
```

Run the http server:

```
make run
```

Check the python server is properly running with:

```
curl  --data-binary '{"chain": "betaregtest", "jsonrpc": "1.0", "id":"curltest", "method": "getblockchaininfo", "params": [] }' -H 'content-type: text/plain;' http://127.0.0.1:5000/api/v0/rpc
```

Visit the web going to http://127.0.0.1:5000 (as noted by the python server).


## TODO

- [x] Whitelist rpc calls from python server (only the few needed ones)
- [x] Select chain
- [x] Hide non interesting things for coinbase inputs and their complement
- [x] Hide or show CT/non-CT values in a more beauty way
- [x] Hide non interesting things for betad chains (pow vs signblock, covered above besides the fields hidden in verbose)
- [x] Remove bower and grunt
- [ ] Not hardcoded rpcuser/rpcpassword:
- [ ] Hide non interesting things for bitcoind chains
- [ ] elements: Show -signblockscript and block.scriptSig
- [ ] elements: Show -fedpegscript
- [ ] Adapt to elementsd chains (both show/hide)
- [ ] Make sure we're not missing data from differences in chains
- [ ] Make sure there's nothing to rescue from 'verbose' even after supporting some other elements chain
- [ ] js: Cleanup error display
- [ ] Angular directive for both scriptSig and scriptPubKey
- [ ] Move from angular to React + redux, angular4, inferno.js or something ?
- [ ] Add some dev tool to watch changes (gulp?)
- [ ] Angular/Karma/Protractor/e2e Testing
- [ ] Use webpack ?

# License

MIT, see COPYRIGHT.md
