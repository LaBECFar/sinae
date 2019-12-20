<template>
  <div class="home">

    <h2 class="text-center">
      <v-icon style="width: 48px;" name="bar-chart"></v-icon>
      Dashboard
    </h2>

  </div>
</template>

<script>

// import {apiLocation} from './location/api'
// import {apiDevice} from './device/api'
// import {apiVms} from './vms/api'
// import {config} from '../config'

export default {
  name: 'home',
  data() {
      return {
          items: [],
          showMsg: false,
          devices: {
            total: 0,
            started: 0
          },
          vms: {
            total: 0,
            started: 0
          }
      }
  },  
  methods: {
    /* 
    bootstrap () {
      config.api.get(`/bootstrap`)
        .then(() => {
          this.showMsg = false;
          this.refresh()
        })
        .catch(e => {
          console.log(e)
        })
    },*/
    refresh() {
      /*
      apiDevice.getDevices()
        .then((data) => {
          this.devices.total = data.length
          data.forEach((value) => {
            if (value.dockerId != "") {
              this.devices.started++;
            }
          });
        })

      apiVms.getAllVms()
        .then((data) => {
          this.vms.started = data.length
        })

      apiVms.getStoppedVms()
        .then((data) => {
          this.vms.total = data.length
        })

      apiLocation.getLocations()
          .then((data) => {
              if (data.length == 0) {
                this.showMsg = true;
              }
          })
          .catch(e => {
              console.log(e)
          })
      */
    }
  },
  created() {
    //this.refresh();
  }  
}
</script>
