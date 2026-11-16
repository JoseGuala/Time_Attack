<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()

// Com menys error, millor resultat
const millorMarca = computed(() => {
  if (store.partides.length === 0) return null
  return Math.min(...store.partides.map((p) => p.errorTotal))
})
</script>

<template>
  <div class="scoreboard">
    <h2>HISTORIAL DE PARTIDES</h2>

    <p v-if="store.partides.length === 0" class="buit">
      Encara no hi ha cap partida registrada.
    </p>

    <template v-else>
      <p class="millor">Millor marca: <strong>{{ millorMarca }} s</strong></p>

      <table>
        <thead>
          <tr>
            <th>Partida</th>
            <th>Jugador</th>
            <th>Error total</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="partida in store.partides" :key="partida.id">
            <td>{{ partida.id }}</td>
            <td>{{ partida.nom }}</td>
            <td>{{ partida.errorTotal }} s</td>
          </tr>
        </tbody>
      </table>

      <button @click="store.esborrarPartides()">Esborrar historial</button>
    </template>
  </div>
</template>

<style scoped>
.scoreboard {
  margin-bottom: 24px;
}

.buit {
  color: var(--muted);
}
</style>
