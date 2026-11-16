<script setup>
import { computed } from 'vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()

// Com menys error, millor resultat
const millorMarca = computed(() => {
  if (store.partides.length === 0) return null
  return Math.min(...store.partides.map((p) => p.errorTotal))
})

// Classificació global ordenada de menor a major error.
// Fem una còpia amb [...] per no modificar directament les dades de Pinia.
const classificacioOrdenada = computed(() =>
  [...store.classificacio].sort((a, b) => a.errorTotal - b.errorTotal),
)
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

    <h2>CLASSIFICACIÓ GLOBAL</h2>

    <p v-if="store.classificacio.length === 0" class="buit">
      Encara no hi ha resultats. Sigues el primer a jugar!
    </p>

    <table v-else>
      <thead>
        <tr>
          <th>Posició</th>
          <th>Jugador</th>
          <th>Error total</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="(resultat, index) in classificacioOrdenada"
          :key="index"
          :class="{ millor: index === 0 }"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ resultat.nom }}</td>
          <td>{{ resultat.errorTotal }} s</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.scoreboard {
  margin-bottom: 24px;
}

.buit {
  color: var(--muted);
}

tr.millor td {
  background: #fff3bf;
  font-weight: 700;
}
</style>
