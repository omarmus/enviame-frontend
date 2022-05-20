<template>
  <div
    class="modal modal-lg fade"
    :class="{ show: showModal }"
    :style="{ display: showModal ? 'block' : 'none' }"
    :role="showModal ? 'dialog' : 'none'"
    :aria-modal="showModal"
    :aria-hidden="!showModal"
    id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel">
    <div
      v-if="props.character"
      class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
      <div class="modal-content modal-view">
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="close"></button>
        <div class="row">
          <div class="col-sm-12 col-md-5" :style="{ 'background-image': `url(${props.character.thumbnail.path + (props.character.thumbnail.path.indexOf('http://i.annihil.us') === -1 ? '' : ('.' + props.character.thumbnail.extension))})`}"></div>
          <div class="col-sm-12 col-md-7">
            <div class="modal-body">
              <h2>{{ props.character.name }}</h2>
              <small>Última modificación {{ format(props.character?.modified) }}</small>
              <p>{{ props.character.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="modal-backdrop fade show" v-if="showModal"></div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Character } from '../components/entities/Character'
import { format } from '../components/lib/date'

interface Props {
  character: Character
}

const props = defineProps<Props>()
const showModal = ref<boolean>(true)

const close = () => {
  showModal.value = false
}
</script>

<style lang="scss">
.modal-view {
  position: relative;
  height: 450px;

  h2 {
    padding-right: 40px;
    color: var(--bs-blue);
  }

  small {
    color: #aaa;
  }

  .btn-close {
    position: absolute;
    top: 15px;
    right: 15px;
    font-size: 1.4rem;
    z-index: 2;
  }
  .row {
    height: 100%;

    .col-md-5 {
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    }
    .col-md-7 {
      overflow-y: scroll;
    }
  }
}
@media (max-width: 768px) {
  .modal-view {
    height: 600px;

    .row {
      height: 350px;

      .col-md-5 {
        height: 100%;
      }
    }
  }
}
</style>
