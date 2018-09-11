export const moduleSocket = {
    state: {
        isConnected: false,
        reconnectError: false,
        subs: {},
        ready: {},
        error: ''
    },
    mutations: { 
      SOCKET_ONOPEN (state) {
        state.isConnected = true
      },
      SOCKET_ONCLOSE (state)  {
        state.isConnected = false
      },
      SOCKET_ONERROR (state, event)  {
        state.error = event
      },
      SOCKET_ONMESSAGE (state, data)  {
        if(data.msg === 'initializing'){
            state.subs = {...state.subs, [data.id]: []}
            state.ready = {...state.ready, [data.id]: false}
        }
        else if(data.msg === 'ready'){
            state.ready = {...state.ready, [data.id]: true}
        }
        else if (['added', 'changed', 'removed'].includes(data.msg)) {            
            //if(state.subs[data.id] === undefined)
            //    state.subs[data.id] = []
            const sub = state.subs[data.id]
            if (data.msg === 'added') {
                state.subs = {...state.subs, [data.id]: [...sub, data.doc]}
            } else if (data.msg === 'changed') {
                const index = sub.findIndex(item => item.id === data.doc.id)
                const tmp = [
                    ...sub.slice(0, index),
                    data.doc,
                    ...sub.slice(index + 1)
                ]
                state.subs = {...state.subs, [data.table]: tmp}
            } else {                                
                const index = sub.findIndex(item => item.id === data.doc_id)
                let tmp = [
                    ...sub.slice(0, index),
                    ...sub.slice(index + 1)
                ]
                state.subs = {...state.subs, [data.table]: tmp}                
            }
        } else if (data.msg === 'error') { 
            state.error = data.error
        }
      }
    }
}
