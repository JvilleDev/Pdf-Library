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
            <router-link to="/upload" class="nav-link active">Upload</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/files" class="nav-link">All Files</router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="upload-form">
    <h2>Upload Document</h2>
    <div class="form-group">
      <input type="text" v-model="title" class="form-control" placeholder="Title">
    </div>
    <br>
    <div class="form-group">
      <input type="text" v-model="description" class="form-control" placeholder="Description">
    </div>
    <br>
    <div class="form-group">
      <input type="text" v-model="tags" class="form-control" placeholder="Tags (comma separated)">
    </div>
    <br>
    <div class="custom-file">
      <input type="file" ref="file" @change="onFileChange" class="custom-file-input">
    </div>
    <br><br>
    <button @click="uploadDocument" class="btn btn-primary">Upload</button>
  </div>
</template>

  
<script>
import axios from "axios";

export default {
  name: "uploadDocument",
  data() {
    return {
      title: "",
      description: "",
      tags: "",
      file: null
    };
  }, created() {
    document.title = "Upload New"
  },
  methods: {
    onFileChange(event) {
      this.file = event.target.files[0];
    },
    async uploadDocument() {
      try {
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("title", this.title);
        formData.append("description", this.description);
        formData.append("tags", this.tags);

        const response = await axios.post("http://localhost:3000/new-document", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        console.log("Document uploaded:", response.data);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
</script>
  
<style>
.upload-form {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>
  