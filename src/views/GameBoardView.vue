<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import KeyPad from '@/components/KeyPad.vue'
import ResultsTable from '@/components/ResultsTable.vue'
import ScoreBoard from '@/components/ScoreBoard.vue'
import { useGameStore } from '@/stores/game'

const store = useGameStore()

const tecles = ['A', 'S', 'D', 'F']

const tempsObjectiu = {
  A: 2,
  S: 4,
  D: 5,
  F: 7,
}

const jugant = ref(false)
const resultats = ref([])

let tempsInici = 0

// Nom introduït temporalment al formulari
const nom = ref('')

// El pare decideix quines tecles estan premudes; el fill només ho reflecteix
const premudes = computed(() => resultats.value.map((r) => r.tecla))

function entrar() {
  if (nom.value.trim() === '') return

  store.guardarNom(nom.value.trim())
}

function iniciarPartida() {
  resultats.value = []
  jugant.value = true
  tempsInici = performance.now()
}

function rebreTecla(tecla) {
  // 1. La partida ha d'estar activa
  if (!jugant.value) return

  // 2. Evitem registrar una tecla repetida
  if (premudes.value.includes(tecla)) return

  // 3. Temps transcorregut (en segons)
  const tempsReal = (performance.now() - tempsInici) / 1000

  // 4. Diferència respecte del temps objectiu
  const objectiu = tempsObjectiu[tecla]
  const error = tempsReal - objectiu

  // 5. Afegim el resultat
  resultats.value.push({
    tecla: tecla,
    objectiu: objectiu,
    tempsReal: Number(tempsReal.toFixed(2)),
    error: Number(error.toFixed(2)),
  })

  // Quan s'han premut totes les tecles, la partida finalitza
  if (resultats.value.length === tecles.length) {
    jugant.value = false

    let errorTotal = 0

    for (let index = 0; index < resultats.value.length; index++) {
      const element = resultats.value[index]

      errorTotal = errorTotal + Math.abs(element.error)
    }

    store.guardarPartida(Number(errorTotal.toFixed(2)))
  }
}

// Repte opcional: teclat físic
function teclaFisica(event) {
  // Ignorem les repeticions automàtiques d'una tecla mantinguda
  if (event.repeat) return

  // No interceptem l'escriptura dins d'un input (p. ex. el formulari del nom)
  if (event.target instanceof HTMLInputElement) return

  const tecla = event.key.toUpperCase()

  if (tecles.includes(tecla)) {
    rebreTecla(tecla)
  }
}

onMounted(() => {
  window.addEventListener('keydown', teclaFisica)
})

onUnmounted(() => {
  window.removeEventListener('keydown', teclaFisica)
})
</script>

<template>
  <main>
    <h1>TIME ATTACK</h1>

    <div v-if="!store.nomJugador" class="benvinguda">
      <h2>Benvingut a TIME ATTACK!</h2>

      <input v-model="nom" placeholder="Introdueix el teu nom" @keyup.enter="entrar" />

      <button @click="entrar">Entrar al joc</button>
    </div>

    <div v-else>
      <ScoreBoard />

      <h2>Hola, {{ store.nomJugador }}!</h2>

      <p class="instruccions">
        Prem <strong>A</strong> als 2 s, <strong>S</strong> als 4 s, <strong>D</strong> als 5 s i
        <strong>F</strong> als 7 s. No veuràs el cronòmetre!
      </p>

      <button v-if="!jugant" class="iniciar" @click="iniciarPartida">
        {{ resultats.length ? 'Tornar a jugar' : 'Iniciar partida' }}
      </button>
      <p v-else class="estat">Partida en marxa…</p>

      <KeyPad
        :tecles="tecles"
        :bloquejat="!jugant"
        :premudes="premudes"
        @premuda="rebreTecla"
      />

      <ResultsTable v-if="!jugant && resultats.length === tecles.length" :resultats="resultats" />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  letter-spacing: 0.1em;
}

.benvinguda {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.benvinguda h2 {
  width: 100%;
}

.instruccions {
  color: var(--muted);
}

.iniciar {
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.estat {
  font-weight: 600;
  color: var(--accent);
}
</style>
