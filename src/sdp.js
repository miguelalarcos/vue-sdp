export function filter(c, f){
    if(c)
      return c.filter(f)
    else
      return []
  }

const reconnectInterval = 1000
class RWS{
    constructor(){
        this.ws = null
        this.components = []
    }
    add(component){
        this.components.push(component)
    }
    remove(component){
        this.components = this.components.filter((c) => c === component)
    }
    onData(data){
        if (data.msg === 'ready') {
            this.components.forEach(c => {
                if(Object.keys({...c._subs}).includes(data.id)){
                    c._subs = {...c._subs, [data.id]: true}
                }
            })           
        }
    }
}
const rws = new RWS()
let ws
let itemCounter = {}
export function connect(url, store) {
    ws = new WebSocket(url)
    rws.ws = ws
    ws.onopen = function() {
        console.log('socket open')
        Object.values(subs).forEach(item => {
            const {name, id, filter} = item
            sendSub(rws.ws, name, id, filter)            
        });
        store.commit('SOCKET_ONOPEN')
    }
    ws.onerror = function() {
        console.log('socket error')
    }
    ws.onclose = function() {
        console.log('socket close')
        store.commit('SOCKET_ONCLOSE')
        Object.values(deferreds).forEach(d => d.reject())
        deferreds = {}
        setTimeout(() => connect(url, store), reconnectInterval)
    }
    ws.onmessage = function(event) {
        console.log('raw message > ', event.data)
        const data = JSON.parse(event.data)
        rws.onData(data)
        if (data.msg === 'result') {
            const deferred = deferreds[data.id]
            deferred.resolve(data.result)
            delete deferreds[data.id]
        }else{
            if(data.msg === 'added'){
                let id = data.doc.id
                if(itemCounter[id]){
                    itemCounter[id] += 1
                } else {
                    itemCounter[id] = 1
                }
            }
            if(data.msg === 'removed'){
                itemCounter[data.doc_id] -= 1
                if(itemCounter[data.doc_id] === 0){
                    delete itemCounter[id]
                    store.commit('SOCKET_ONMESSAGE', data)
                }
                return    
            }
            store.commit('SOCKET_ONMESSAGE', data)
        }
    }
}
//connect()

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
                _subs: {}
            }
        },
        created(){
            this.rws = rws
            this.rws.add(this)
        },
        beforeDestroy() {
            Object.keys({...this._subs}).forEach(subId => {
                console.log('before destroy, send unsub')
                sendUnSub(this.rws.ws, subId)
            });
            this.rws.remove(this)
        },
        methods: {
            $subsReady(){
                console.log('$subsReady()', this.$store)
                if(!this.$store.state.sdp.isConnected)
                    return false
                Object.values({...this._subs}).forEach(ready => {
                    if(ready === false)
                        return false
                })
                return true
            },
        $sub(name, filter, subId) {
            console.log('sub', name, filter, subId)
            if(subId){
                delete subs[subId]
                // eslint-disable-next-line
                const { [subId]: value, ...tmp } = this._subs
                this._subs = tmp
                console.log('send unsub')
                sendUnSub(this.rws.ws, subId)    
            }
            id += 1
            subs[id] = {name, id: id+'', filter}
            this._subs  = {...this._subs, [id]: false}
            sendSub(this.rws.ws, name, id+'', filter)
            return id+''
        },

    /*Vue.prototype.$unsub = function (subId) {
        delete subs[subId]
        this.unsubs = this.unsubs.filter(value => value === subId)
        sendUnSub(this.$socket, subId)
    }*/
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
    console.log('=>', data)
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

