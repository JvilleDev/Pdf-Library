<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container">
      <a class="navbar-brand" href="#">Document Search</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/" class="nav-link active">Home</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/upload" class="nav-link">Upload</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/files" class="nav-link">All Files</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container mt-4">
    <h2 class="mb-4">Search Documents</h2>
    <div class="input-group mb-3">
      <input type="text" class="form-control" v-model="query" placeholder="Search...">
      <button class="btn btn-outline-secondary" @click="easySearch">Easy Search</button>
      <button class="btn btn-outline-secondary" @click="fullSearch">Full Search</button>
    </div>
    <div v-if="results.length > 0" class="mt-4">
      <h3>Results:</h3>
      <div class="row">
        <div v-for="result in results" :key="result.id" class="col-md-4 mb-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">{{ result.title }}</h5>
              <p class="card-text">{{ result.description }}</p>
              <p class="card-text"><strong>Tags:</strong> {{ result.tags }}</p>
              <ul v-if="result.context" class="list-group card-text" style="margin-bottom: 1rem;">
                <strong class="list-group-item active">Coincidences:</strong>
                <div style="max-height: 300px;overflow-y: auto;overflow-x: hidden;border: var(--bs-list-group-border-width) solid var(--bs-list-group-border-color);">
                  <li v-for="contextItem in result.context" :key="contextItem" class="list-group-item"
                    @click="copyToClipboard(contextItem)">
                    <span v-html="highlightText(contextItem, query)"></span>
                  </li>
                </div>
              </ul>
              <a :href="getDocumentURL(result.filePath)" class="btn btn-primary" target="_blank">Open Document</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="mt-4">
      <p>No results found.</p>
    </div>

  </div>
</template>


<script>
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      query: "",
      results: []
    };
  },
  created() {
    document.title = "Search";
  },
  methods: {
    highlightText(context, query) {
      if (!query) return context;
      const normalizedQuery = this.normalizeText(query);
      const normalizedContext = this.normalizeText(context);
      const regex = new RegExp(`(${normalizedQuery})`, 'giu');
      return normalizedContext.replace(regex, '<span class="highlighted">$1</span>');
    },
    normalizeText(text) {
      return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    ,
    getDocumentURL(documentID) {
      return `http://localhost:3000${documentID}`;
    },
    async easySearch() {
      try {
        const searchTerm = this.query;
        const response = await axios.get(`http://localhost:3000/easy-search/${searchTerm}`);
        this.results = response.data;
      } catch (error) {
        console.error('Error en la solicitud easySearch:', error);
      }
    },
    async fullSearch() {
      try {
        const searchTerm = this.query;
        const response = await axios.get(`http://localhost:3000/full-search/${searchTerm}`);

        if (response.data && response.data.Coincidencias) {
          const coincidencias = response.data.Coincidencias;
          this.results = await Promise.all(coincidencias.map(async (item) => {
            if (item.id) {
              const infoResponse = await axios.get(`http://localhost:3000/info/${item.id}`);
              const { title, description, tags, filePath } = infoResponse.data;
              return {
                id: item.id,
                title: title,
                description: description,
                tags: tags,
                context: item.matches,
                filePath: filePath
              };
            }
          }));
        }
      } catch (error) {
        console.error('Error en la solicitud fullSearch:', error);
      }
    }, copyToClipboard(text) {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Copied to clipboard')
    }
  }
};
</script>

<style>
body {
  overflow-x: hidden;
  overflow-y: scroll;
}

.highlighted {
  background-color: yellow;
  font-weight: bold;
}

.list-group-item {
  transition: background-color 0.2s ease-in-out;
}

.list-group-item:hover {
  background-color: #eee;
}

.card-columns {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
}

.card-text li {
  cursor: pointer;
}

.card {
  flex-basis: calc(33.3% - 20px);
  margin-bottom: 20px;
}

@media (max-width: 1200px) {
  .card {
    flex-basis: calc(25% - 10px);
  }
}

@media (max-width: 768px) {
  .card {
    flex-basis: calc(50% - 10px);
  }
}

@media (max-width: 576px) {
  .card {
    flex-basis: 100%;
  }
}

*::-webkit-scrollbar {
  width: 10px;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.3);
}

*::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.1);
}
</style>
