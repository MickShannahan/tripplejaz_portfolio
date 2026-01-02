<template>
  <div class="card">
    <img src="../assets/img/bg.jpg" alt="example" class="rounded-top">
    <div class="card-body">
      <div class="fs-4 fw-bold mb-3">
        Get in touch!
      </div>
      <form class="contact-form" @submit.prevent="submitForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input class="form-control" type="text" id="name" v-model="editable.name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input class="form-control" type="email" id="email" v-model="editable.email" required>
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea class="form-control" id="message" v-model="editable.message" required></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const editable = ref({
      name: '',
      email: '',
      message: ''
    })

    return {
      editable,
      handleSubmit() {
        // For a free Serverless option consider a google form 
        // follow this tutorial https://blog.webjeda.com/google-form-customize/ 
        // Easy Mode - https://stefano.brilli.me/google-forms-html-exporter/

        // Server: You can use an API or send an email using a service like Nodemailer
        // Example: axios.post('/api/contact', { name: this.name, email: this.email, message: this.message })

        // Then show a success message or redirect to a thank you page
      }
    };
  }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
