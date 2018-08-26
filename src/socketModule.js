export const moduleSocket = {
    state: {
        isConnected: false,
        reconnectError: false,
        collections: {}
    },
    mutations: { 
      // eslint-disable-next-line
      SOCKET_ONOPEN (state, event) {
        state.isConnected = true
      },
      // eslint-disable-next-line
      SOCKET_ONCLOSE (state, event)  {
        state.isConnected = false
      },
      SOCKET_ONERROR (state, event)  {
        console.error(state, event)
      },
      SOCKET_ONMESSAGE (state, message)  {
        console.log('raw->', message);
        const data = JSON.parse(message);
        
        if (['added', 'changed', 'removed'].includes(data.msg)) {
            const collection = state.collections[data.table]
            if (data.msg === 'added') {
                state.collections[data.table] = [...collection, data.doc]
            } else if (data.msg === 'changed') {
                const index = collection.findIndex(item => item._id === data.doc._id)
                state.collections[data.table] = [
                    ...collection.slice(0, index),
                    data.doc,
                    ...collection.slice(index + 1)
                ]
            } else {
                const index = collection.findIndex(item => item._id === data.doc._id)
                state.collections[data.table] = [
                    ...collection.slice(0, index),
                    ...collection.slice(index + 1)
                ]
            }
        } else if (data.msg === 'error') { 
            console.log('error', data.error);
        }
      },
      // mutations for reconnect methods
      SOCKET_RECONNECT(state, count) {
        console.info(state, count)
      },
      SOCKET_RECONNECT_ERROR(state) {
        state.reconnectError = true;
      }
  }
}
