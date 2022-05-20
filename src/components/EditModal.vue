<template>
  <div
    class="modal fade"
    :class="{ show: showModal }"
    :style="{ display: showModal ? 'block' : 'none' }"
    :role="showModal ? 'dialog' : 'none'"
    :aria-modal="showModal"
    :aria-hidden="!showModal"
    id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
    <div
      v-if="character"
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content">
        <form @submit.prevent="save">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">{{ character.id ? 'EDITAR' : 'AGREGAR' }} PERSONAJE</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
          </div>
          <div class="modal-body">
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>
            <div class="mb-3">
              <label for="nameFormControlInput1" class="form-label">Nombre</label>
              <input v-model="character.name" required type="text" class="form-control" id="nameFormControlInput1">
            </div>
            <div class="mb-3">
              <label for="descriptionFormControlInput1" class="form-label">Descripcion</label>
              <textarea v-model="character.description" class="form-control" id="descriptionFormControlInput1" rows="5"></textarea>
            </div>
            <div class="mb-3">
              <label for="urlFormControlInput1" class="form-label">URL Imagen</label>
              <input v-model="character.thumbnail.path" required type="url" class="form-control" id="urlFormControlInput1">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="close">Cancelar</button>
            <button type="submit" class="cta-btn cta-btn--solid cta-btn--red">
              <span class="innerFill">
                <span>Guardar</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showModal"></div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Character } from '../components/entities/Character'

interface Props {
  character: Character,
  characters: Character[]
}

const props = defineProps<Props>()
const emit = defineEmits(['characters'])

const character = ref<Character>(props.character)
const characters = ref<Character[]>(props.characters)
const showModal = ref<boolean>(true)
const error = ref<string>('')
const url = `${process.env.VUE_APP_API}?limit=10`

const save = async () => {
  if (character.value) {
    if (character.value.id) {
      for (const item of characters.value) {
        if (item.id === character.value.id) {
          item.name = character.value.name
          item.description = character.value.description
          item.modified = new Date()
          item.thumbnail = {
            path: character.value.thumbnail.path,
            extension: character.value.thumbnail.path?.indexOf('http://i.annihil.us/u/prod/marvel/') === -1 ? '' : character.value.thumbnail.extension
          }
          emit('characters', characters.value)
          break
        }
      }
    } else {
      const response = await fetch(`${url}&name=${character.value.name}`)
      const { results } = await response.json()
      if (results.length || characters.value.find(item => item.name === character.value?.name)) {
        error.value = 'Ya existe un personaje con ese nombre'
        return
      } else {
        character.value.id = new Date().getTime()
        character.value.modified = new Date()
        characters.value.unshift(character.value)
        emit('characters', characters.value)
      }
    }
  }
  close()
}

const close = () => {
  showModal.value = false
}
</script>
