let id = 0
let subs = {}
export let deferreds = {}

class Deferred{
    constructor() {
      this.promise = new Promise((resolve, reject)=> {
        this.reject = reject
        this.resolve = resolve
      })
    }
}

export const SDP = {}
SDP.install = function (Vue) {
    Vue.mixin({
        created(){
            this.unsubs = []
            this.$options.sockets.onmessage = (data) => {
                if (data.msg === 'result') {
                    const deferred = deferreds[data.id];
                    deferred.resolve(data.result);
                }
            }
        },
        beforeDestroy() {
            this.unsubs.forEach(subId => {
                sendUnSub(this.$socket, subId)
            });
            delete this.$options.sockets.onmessage
        }
    })

    Vue.prototype.$sub =  function (name, filter, subId) {  
        if(subId){
            delete subs[subId]
            this.unsubs = this.unsubs.filter(value => value === subId)
            sendUnSub(this.$socket, subId)    
        }
        id += 1
        subs[id] = {name, id, filter}
        this.unsubs.push(id)
        sendSub(this.$socket, name, id, filter)
        return id
    }

    /*Vue.prototype.$unsub = function (subId) {
        delete subs[subId]
        this.unsubs = this.unsubs.filter(value => value === subId)
        sendUnSub(this.$socket, subId)
    }*/

    Vue.prototype.$rpc = function (name, params) {
          id += 1;
          const deferred = new Deferred()
          deferreds[id] = deferred
          sendRPC(this.$socket, name, id, params)
          return deferred.promise
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

