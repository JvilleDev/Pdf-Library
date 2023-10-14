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
                        <router-link to="/" class="nav-link">Home</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/upload" class="nav-link">Upload</router-link>
                    </li>
                    <li class="nav-item">
                        <router-link to="/files" class="nav-link active">All Files</router-link>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container mt-4">
        <h2 class="mb-4">Indexed Documents</h2>
        <div class="card-columns">
            <div v-for="document in indexedDocuments" :key="document.id" class="card">
                <div class="card-body">
                    <h5 class="card-title">{{ document.title }}</h5>
                    <p class="card-text"><strong>Description:</strong> {{ document.description }}</p>
                    <p class="card-text"><strong>Tags:</strong> {{ document.tags }}</p>
                    <a class="btn btn-primary" :href="getDocumentURL(document.filePath)" target="_blank">Open</a>
                </div>
            </div>

        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    name: "AllFiles",
    data() {
        return {
            indexedDocuments: []
        };
    },
    created() {
        this.fetchIndexedDocuments();
        document.title = "All Files"
    },
    methods: {
        async fetchIndexedDocuments() {
            try {
                const response = await axios.get('http://localhost:3000/indexed');
                this.indexedDocuments = response.data;
            } catch (error) {
                console.error('Error fetching indexed documents:', error);
            }
        }, getDocumentURL(documentID) {
            return `http://localhost:3000${documentID}`;
        },
    }
};
</script>
  
<style>
.card-columns {
    display: flex;
    flex-wrap: wrap;
    justify-content: left;
}

.card {
    flex-basis: calc(33.3% - 20px);
    margin-bottom: 20px;
    margin-left: 1rem;
}

@media (max-width: 992px) {
    .card {
        flex-basis: calc(50% - 20px);
    }
}

@media (max-width: 576px) {
    .card {
        flex-basis: 100%;
    }
}
</style>

