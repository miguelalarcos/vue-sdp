export const moduleSocket = {
    state: {
        isConnected: false,
        reconnectError: false,
        collections: {}
    },
    mutations: { 
      SOCKET_ONOPEN (state) {
        state.isConnected = true
      },
      SOCKET_ONCLOSE (state)  {
        state.isConnected = false
      },
      SOCKET_ONERROR (state, event)  {
        console.error(state, event)
      },
      SOCKET_ONMESSAGE (state, data)  {
        if(data.msg === 'initializing'){
            state.collections = {...state.collections, [data.table]: []}
        }
        else if (['added', 'changed', 'removed'].includes(data.msg)) {            
            if(state.collections[data.table] === undefined)
                state.collections[data.table] = []
            const collection = state.collections[data.table]
            if (data.msg === 'added') {
                state.collections = {...state.collections, [data.table]: [...collection, data.doc]}
            } else if (data.msg === 'changed') {
                const index = collection.findIndex(item => item.id === data.doc.id)
                const tmp = [
                    ...collection.slice(0, index),
                    data.doc,
                    ...collection.slice(index + 1)
                ]
                state.collections = {...state.collections, [data.table]: tmp}
            } else {                                
                const index = collection.findIndex(item => item.id === data.doc_id)
                let tmp = [
                    ...collection.slice(0, index),
                    ...collection.slice(index + 1)
                ]
                state.collections = {...state.collections, [data.table]: tmp}                
            }
        } else if (data.msg === 'error') { 
            console.log('error', data.error);
        }
      }
    }
}
