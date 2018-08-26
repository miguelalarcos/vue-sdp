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

export const SDP_Mixin = {
        data: function(){
            return {
                _subs: {}
            }
        },
        /*if (data.msg === 'result') {
                    const deferred = deferreds[data.id];
                    deferred.resolve(data.result);
                }*/
        created(){
            this.$options.sockets.onmessage = (data) => {
                data = JSON.parse(data.data)
                if (data.msg === 'ready') {                    
                    if(Object.keys({...this._subs}).includes(data.id)){
                        console.log('******************************************')
                        this._subs = {...this._subs, [data.id]: true}
                    }
                }
            }
        },
        beforeDestroy() {
            Object.keys({...this._subs}).forEach(subId => {
                console.log('before destroy, send unsub')
                sendUnSub(this.$socket, subId)
            });
            delete this.$options.sockets.onmessage
        },
        methods: {
            $subsReady(){
                console.log('$subsReady()')
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
                sendUnSub(this.$socket, subId)    
            }
            id += 1
            subs[id] = {name, id: id+'', filter}
            this._subs  = {...this._subs, [id]: false}
            sendSub(this.$socket, name, id+'', filter)
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
          sendRPC(this.$socket, name, id+'', params)
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

