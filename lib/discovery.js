const { EventEmitter } = require('events')
const waterfall = require('async/waterfall')

const libp2p = require('libp2p')
const KadDHT = require('libp2p-kad-dht')
const TCP = require('libp2p-tcp')
const Mplex = require('libp2p-mplex')
const SECIO = require('libp2p-secio')
const KadDHT = require('libp2p-kad-dht')
const PeerInfo = require('peer-info')

class DiscoveryBundle extends libp2p {
  constructor (peerInfo) {
    const modules = {
      transport: [new TCP()],
      connection: {
        muxer: [Mplex],
        crypto: [SECIO]
      },
      // we add the DHT module that will enable Peer and Content Routing
      DHT: KadDHT
    }
    super(modules, peerInfo)
  }
}

class DiscoveryChannel extends EventEmitter {
  constructor() {

  }

  join(id, port, opts, callback) {
    let node
    
    waterfall([
      (cb) => PeerInfo.create(cb),
      (peerInfo, cb) => {
        peerInfo.multiaddrs.add(`/ip4/0.0.0.0/tcp/${port || 0}`)
        node = new DiscoveryBundle(peerInfo)
        node.start(cb)
      }
    ], (err) => callback(err, node))

    console.log('Created node', node)
  }

  leave(id, port) {

  }

  destroy(cb) {

  }
}