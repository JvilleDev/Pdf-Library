import { createRouter, createWebHistory } from 'vue-router';

import Home from './components/Home.vue';
import UploadDocument from './components/UploadDocument.vue';
import AllFiles from './components/Files.vue';

// No es necesario importar Vue ni usar Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/upload', component: UploadDocument },
  { path: '/files', component: AllFiles },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
