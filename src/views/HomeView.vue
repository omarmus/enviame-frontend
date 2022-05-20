<template>
  <div class="home-info">
    <section class="py-5 text-center container">
      <div class="row py-lg-4">
        <div class="col-lg-6 col-md-8 mx-auto">
          <h1 class="text-white">PERSONAJES</h1>
        </div>
      </div>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-3">
        <div
          class="col"
          v-for="item in headers"
          :key="item.id">
          <div
            class="card card-header-item"
            :style="{ 'background-image': `url(${item.url})`}"
            @click="viewCharacter(item.slug)">
            <span>
              {{ item.name }}
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>
  <div class="characters py-4 bg-light">
    <div class="container">
      <div class="container-search">
        <form @submit.prevent="searchHandle" :class="{ 'search-fixed': fixed }">
          <div :class="{ 'container': fixed }">
            <div class="input-group">
              <input v-model="search" type="search" class="form-control" placeholder="Escriba el nombre de personaje a buscar" aria-label="Escriba un nombre de personaje" aria-describedby="button-search">
              <button class="cta-btn cta-btn--solid cta-btn--red" type="submit" id="button-search">
                <span class="innerFill">
                  <span>Buscar</span>
                </span>
              </button>
              <button v-if="search?.length" type="button" class="btn btn-secondary btn-all" data-bs-dismiss="modal" @click="clean">VER TODO</button>
            </div>
          </div>
        </form>
      </div>
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-6 g-3">
        <div
          v-for="item in characters"
          :key="item.id"
          class="col">
          <div class="card">
            <div
              class="card-image"
              :style="{ 'background-image': `url(${item.thumbnail.path}${item.thumbnail.extension ? ('/standard_fantastic.' + item.thumbnail.extension) : ''})`}"></div>
            <div class="card-body">
              <div class="card-body-container">
                <p class="card-text">
                  {{ item.name }}
                </p>
                <p class="card-description" v-if="item.description">{{ item.description }}</p>
                <small>Modificado el {{ format(item.modified) }}</small>
              </div>
              <div class="btn-actions">
                <button class="cta-btn cta-btn--solid cta-btn--red" @click="view(item)">
                  <span class="innerFill">
                    <span>Ver</span>
                  </span>
                </button>
                <button class="cta-btn cta-btn--solid cta-btn--red" @click="edit(item)">
                  <span class="innerFill">
                    <span>Editar</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="col" v-for="i in [0,1,2,3,4,5]" :key="i">
          <div v-if="loading" class="q-skeleton q-skeleton--light q-skeleton--type-rect q-skeleton--anim q-skeleton--anim-wave q-skeleton--square"></div>
        </div>
      </div>
      <div v-if="characters.length === 0 && search.length && !searchState" class="alert alert-danger" role="alert">
        No existen resultados para <strong>{{ search }}</strong>
      </div>
    </div>
  </div>
  <button class="btn btn-primary btn-add" @click="add">+</button>
  <EditModal
    v-if="editState && character"
    :character="character"
    v-model:characters="characters"
    v-model:show="editState" />
  <ViewModal
    v-if="viewState && character"
    :character="character"
    v-model:show="viewState" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { Character } from '../components/entities/Character'
import EditModal from '../components/EditModal.vue'
import ViewModal from '../components/ViewModal.vue'
import { format } from '../components/lib/date'

const headers = [
  {
    id: 1009368,
    name: 'Iron Man',
    url: 'http://i.annihil.us/u/prod/marvel/i/mg/9/c0/527bb7b37ff55.jpg',
    slug: 'iron man'
  },
  {
    id: 1017327,
    name: 'Capitán América',
    url: 'http://i.annihil.us/u/prod/marvel/i/mg/2/03/5239c005a4827.jpg',
    slug: 'captain america'
  },
  {
    id: 1009189,
    name: 'Black Widow',
    url: 'http://i.annihil.us/u/prod/marvel/i/mg/f/30/50fecad1f395b.jpg',
    slug: 'black widow'
  },
  {
    id: 1009610,
    name: 'Spider man',
    url: 'http://i.annihil.us/u/prod/marvel/i/mg/3/50/526548a343e4b.jpg',
    slug: 'spider-man'
  }
]

const limit = 18
const url = `${process.env.VUE_APP_API}?limit=${limit}`

const characters = ref<Character[]>([])
const character = ref<Character>()
const loading = ref<boolean>(false)
const offset = ref<number>(0)

const search = ref<string>('')
const searchState = ref<boolean>(false)
const editState = ref<boolean>(false)
const viewState = ref<boolean>(false)
const fixed = ref<boolean>(false)

const searchHandle = async () => {
  offset.value = 0
  characters.value = []
  searchState.value = true
  characters.value = await getCharacters(search.value)
  searchState.value = false
}

const handleScroll = async () => {
  if (!loading.value && (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 200)) {
    offset.value += limit
    const results = await getCharacters(search.value)
    characters.value = characters.value.concat(results)
  }
  fixed.value = window.scrollY > 548
}

const getCharacters = async (textSearch?: string) => {
  loading.value = true
  const response = await fetch(`${url}&offset=${offset.value}${textSearch ? `&nameStartsWith=${textSearch}` : ''}`)
  const { results } = await response.json()
  loading.value = false
  return results
}

const edit = (item: Character) => {
  character.value = undefined
  editState.value = false
  viewState.value = false
  nextTick(() => {
    character.value = JSON.parse(JSON.stringify(item))
    editState.value = true
  })
}

const view = (item: Character) => {
  character.value = undefined
  editState.value = false
  viewState.value = false
  nextTick(() => {
    character.value = item
    viewState.value = true
  })
}

const viewCharacter = async (slug: string) => {
  search.value = slug
  await searchHandle()
}

const add = () => {
  character.value = undefined
  editState.value = false
  viewState.value = false
  nextTick(() => {
    character.value = {
      name: '',
      description: '',
      modified: new Date(),
      thumbnail: {
        path: ''
      }
    }
    editState.value = true
  })
}

const clean = async () => {
  search.value = ''
  offset.value = 0
  characters.value = []
  characters.value = await getCharacters()
}

onMounted(async () => {
  characters.value = await getCharacters()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss">
.btn-add {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  font-size: 2rem;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.search-fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: #fff;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.container-search {
  height: 60px;
}

.card-image {
  background-color: var(--bs-blue);
  background-repeat: no-repeat;
  background-size: 125%;
  background-position: center;
  position: relative;
  height: 230px;
  transition: all 0.3s ease;
}
.card-description {
  font-size: .8rem;
  font-weight: 200;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.card-body-container {
  position: relative;
  z-index: 3;
}
.btn-actions {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  z-index: 3;
  opacity: 0;
  text-align: right;
  transition: all 0.3s ease;

  .btn {
    margin-left: 4px;
  }
}

.characters {
  .btn.btn-all {
    margin-left: 5px !important;
  }
  .card {
    border: 0;

    &:hover {
      .card-image {
        background-size: 132%;
        transition: all 0.3s ease;
      }

      .card-body {
        small {
          color: #fff;
        }

        &::after {
          height: 100%;
          transition: all 0.3s ease;
        }
      }

      .btn-actions {
        opacity: 1;
        transition: all 0.3s ease;
      }
    }
  }
  .card-body {
    background-color: #151515;
    color: white;
    height: 180px;
    position: relative;

    p {
      margin-bottom: 5px;
    }

    small {
      font-size: .7rem;
      display: block;
      margin-bottom: 5px;
      color: #aaa;
      font-style: italic;
    }

    .card-text {
      text-transform: uppercase;
      font-weight: bold;
    }

    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      right: 0;
      border: 10px solid #fff;
      border-top: 10px solid transparent;
      border-left: 10px solid transparent;
      z-index: 2;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 6px;
      background-color: var(--bs-blue);
      transition: all 0.3s ease;
      z-index: 1;
    }
  }
}

.card-header-item {
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  color: #fff;
  height: 150px;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  border: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: all 0.3s ease;
    background-color: rgba(0, 0, 0, 0.4);
  }

  &:hover {
    background-size: 107%;
    transition: all 0.3s ease;

    &::before {
      transition: all 0.3s ease;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  span {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 1.2rem;
    font-weight: bold;
    z-index: 2;
  }
}

.home-info {
  background-image: url(../assets/images/background.jpeg);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  position: relative;

  .lead {
    font-weight: 200;
    font-size: 1.1rem;
  }

  h1 {
    font-weight: 200;
    letter-spacing: 15px;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
  }

  & > .container {
    position: relative;
    z-index: 1;
  }
}
</style>
