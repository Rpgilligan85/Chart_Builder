<template>
  <v-app>
    <v-container>
    <v-layout row wrap>
      <v-flex sm2>
        <v-btn @click="onClick">Upload CSV</v-btn>
        <input id="hideInput" type="file" @change="loadFile($event.target.files)">
      </v-flex>
      <v-flex sm4>
        <v-select
          v-if="headers"
          :items="headers"
          label="Select Header"
          solo
          v-model="selectedHeader"
          height="50px"
        ></v-select>
      </v-flex>
    </v-layout>

    <v-layout row>
      <v-flex>
        <ul v-if="selectedValues">
          <li 
            v-for="(item, key) in selectedValues"
            :key="key"
          >
          {{ item }}
          </li>
        </ul>
      </v-flex>

    </v-layout>
    </v-container>
  </v-app>
</template>

<script>
const d3 = require("d3");
import { mapActions, mapState } from 'vuex'

export default {
  name: 'App',
  components: {
  },
  data () {
    return {
      selectedHeader: null,
      selectedValues: null
    }
  },
  methods: {
    loadFile: function(file) {
      this.$store.dispatch('loadCsv', file)
    },
    onClick: function() {
      document.getElementById('hideInput').click()
    }
  },
  computed: {
    ...mapActions(['loadCsv']),
    ...mapState(['headers','csvData'])
  },
  watch: {
    selectedHeader: function(val) {
      console.log([...new Set(this.csvData.map(item => item[val]))])
      this.selectedValues = [...new Set(this.csvData.map(item => item[val]))];
    }
  }
}
</script>
<style>

#hideInput {
  display: none;
}


</style>