const reconnectInterval = 1000
class RWS{
    constructor(){
        this.ws = null
    }
}
const rws = new RWS()
let ws

export function connect(url, store) {
    ws = new WebSocket(url)
    rws.ws = ws
    ws.onopen = function() {
        Object.values(subs).forEach(item => {
            const {name, id, filter} = item
            sendSub(rws.ws, name, id, filter)            
        });
        store.commit('SOCKET_ONOPEN')
    }
    ws.onerror = function() {

    }
    ws.onclose = function() {
        store.commit('SOCKET_ONCLOSE')
        Object.values(deferreds).forEach(d => d.reject())
        deferreds = {}
        //itemCounter = {}
        setTimeout(() => connect(url, store), reconnectInterval)
    }
    ws.onmessage = function(event) {
        const data = JSON.parse(event.data)
        console.log('>', data)
        //rws.onData(data)
        if (data.msg === 'result') {
            const deferred = deferreds[data.id]
            deferred.resolve(data.result)
            delete deferreds[data.id]
        }else{
            store.commit('SOCKET_ONMESSAGE', data)
        }
    }
}

let id = 0
let subs = {}
let deferreds = {}

class Deferred{
    constructor() {
      this.promise = new Promise((resolve, reject)=> {
        this.reject = reject
        this.resolve = resolve
      })
    }
}

export const SDP_Mixin = {
    data: function(){
        return {
            subs_: []
        }
    },
    created(){
        this.rws = rws

    },
    beforeDestroy() {
        this.subs_.forEach(subId => {
            sendUnSub(this.rws.ws, subId)
        });
    },
    methods: {
        $subsReady(){
            /*if(!this.$store.state.sdp.isConnected)
                return false
            Object.values({...this.subs_}).forEach(ready => {
                if(ready === false)
                    return false
            })
            */
            return true
        },
        $sub(name, filter, subId) {
            if(!this.subs_.includes(subId)){
                this.subs_.push(subId)
            }
            sendUnSub(this.rws.ws, subId)  
            subs[id] = {name, id: subId, filter}
            sendSub(this.rws.ws, name, subId, filter)
        },
        $rpc(name, params){
        id += 1;
        const deferred = new Deferred()
        deferreds[id] = deferred
        sendRPC(this.rws.ws, name, id+'', params)
        return deferred.promise
        }
    }
}

function send(socket, data) {
    socket.send(JSON.stringify(data))
  }

function sendSub (socket, name, subId, params) {
    const data = {msg: 'sub', name: name, id: subId, params: params}
    send(socket, data)
}

function sendUnSub (socket, subId) {
    const data = {msg: 'unsub', id: subId}
    send(socket, data)
}

function sendRPC (socket, name, RPCId, params) {
    const data = {msg: 'method', method: name, id: RPCId, params: params}
    send(socket, data)
}

