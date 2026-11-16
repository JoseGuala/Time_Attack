import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('game', () => {
  const nomJugador = ref('')
  const partides = ref([])

  function guardarNom(nom) {
    nomJugador.value = nom
  }

  function guardarPartida(errorTotal) {
    // unshift() en lloc de push(): les últimes partides apareixen primer
    partides.value.unshift({
      id: partides.value.length + 1,
      nom: nomJugador.value,
      errorTotal: errorTotal,
    })
  }

  // En un "setup store" no hi ha `this`: modifiquem el ref amb .value
  function esborrarPartides() {
    partides.value = []
  }

  return {
    nomJugador,
    partides,
    guardarNom,
    guardarPartida,
    esborrarPartides,
  }
})
