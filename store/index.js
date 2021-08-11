export const state = () => ({
    isLight: false
  })
  
  export const mutations = {
    setIsLight(state, payload) {
        console.log(payload, 'islighht')
        state.isLight = payload
        
      },
  }

  export const getters = {
    getIsLight: state => state.isLight
  }