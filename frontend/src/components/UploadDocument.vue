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
  <div id="alertBox"></div>
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
      <input type="file" ref="file" @change="onFileChange" class="form-control">
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
    document.title = "Upload Document"
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
        this.alertBox(`Document ${response.data.title} uploaded successfully`, 'success');
      } catch (error) {
        this.alertBox(`Error uploading Document: ${error}`, 'danger');
      }
    }, alertBox(text, type) {
      const alertBox = document.getElementById('alertBox');
      if (!alertBox) {
        console.error("Alert box element not found.");
        return;
      }
      alertBox.innerHTML = '';
      const alertText = document.createElement('p');
      alertText.textContent = text;
      alertBox.classList.add(type);
      alertBox.classList.add('active');
      alertBox.appendChild(alertText);
      console.log(`Alert text = "${text}" of type = "${type}"`);
      setTimeout(function() {
        alertBox.classList.remove('active');
      }, 4000);
    }

  }
};
</script>
  
<style>
.upload-form {
  max-width: 400px;
  margin: auto;
  margin-top: 3rem;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

#alertBox {
  background-color: #ddd;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 0 10px 0 black;
  position: absolute;
  z-index: 999;
  top: 10%;
  right: 10%;
  transform: translateX(600px);
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

#alertBox.active {
  align-items: center;
  justify-content: left;
  transform: translateX(100px);
}

#alertBox p {
  margin: 0;
}

#alertBox.warning {
  background-color: #F18F01;
  color: white;
}

#alertBox.danger {
  background-color: #BC2C1A;
  color: white;
}

#alertBox.success {
  background-color: #1abc25;
  color: white;
}

#alertBox.info {
  background-color: #5688C7;
  color: white;
}</style>
  