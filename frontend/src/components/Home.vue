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
              <p v-if="result.context" class="card-text">
                <strong>Text:</strong>
                <span v-html="highlightText(result.context, query)"></span>
              </p>
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
      const regex = new RegExp(`(${query})`, 'gi');
      return context.replace(regex, '<span class="highlighted">$1</span>');
    }, getDocumentURL(documentID) {
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
        this.results = await Promise.all(response.data.map(async (item) => {
          const infoResponse = await axios.get(`http://localhost:3000/info/${item.id}`);
          const { title, description, tags, filePath } = infoResponse.data;
          return {
            id: item.id,
            title: title,
            description: description,
            tags: tags,
            context: item.context,
            filePath: filePath
          };
        }));
      } catch (error) {
        console.error('Error en la solicitud fullSearch:', error);
      }
    }
  }
};
</script>

<style>
.highlighted {
  background-color: yellow;
  font-weight: bold;
}
</style>
