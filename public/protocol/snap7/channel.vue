
<script setup>
import {inject} from "vue";

const formData = inject('plugin-form')

if (!('configuration' in formData)) {
  formData.configuration = {
    connect: false
  }
}

if (!('connect' in formData.configuration)) {
  formData.configuration = {
    connect: false
  }
}

</script>

