<template>
<div id="form">
  <div class="card form clearfix">
    <h3 class="text-white">Create New Patient</h3>
    
    <form @submit.prevent="submit()">
      <h4 class="text-white">Patient Info</h4>
      
      <div class="row">
        <div class="col-md-4">
          <div class="form-group">
            <input v-model="patient.username" type="text" required class="form-control" placeholder="Username" />
          </div>
        </div>
        <div class="col-md-3">
          <div class="form-group">
            <input v-model="patient.dateOfBirth" type="date" required class="form-control" placeholder="Birthday" />
          </div>
        </div>
        <div class="col-md-5">
          <div class="form-group">
            <input v-model="patient.email" type="email" required class="form-control" placeholder="Email" />
          </div>
        </div>
      </div>
      
      <h4 class="text-white">Medical Recommendation Info</h4>
      <div class="medicalRecommendation">
        <div class="row">
          <div class="col-md-6">
            <div class="form-group">
              <input v-model="patient.medicalRecommendation.recNumber" type="text" class="form-control" placeholder="Rec Number" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <input v-model="patient.medicalRecommendation.issuer" type="text" class="form-control" placeholder="Issuer" />
            </div>
          </div>
        </div>
        
        <div class="row">
          <div class="col-md-4">
            <div class="form-group">
              <select v-model="patient.medicalRecommendation.state" >
                <option v-if="patient.medicalRecommendation.state == undefined" disabled :value="undefined">Select a State</option>
                <option v-else selected :value="patient.medicalRecommendation.state">{{ patient.medicalRecommendation.state }}</option>

                <option v-for="state in possibleStates" :key="state.id" :value="state.uspsAbbreviation">
                  {{ state.uspsAbbreviation }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <input v-model="patient.medicalRecommendation.expiresAt" type="date" class="form-control" placeholder="Expires At" />
            </div>
          </div>
          <div class="col-md-4">
            <div class="form-group">
              <input v-model="patient.medicalRecommendation.imagePath" type="text" class="form-control" placeholder="Image URI" />
            </div>
          </div>
        </div>
      </div>
      
      <h4 class="text-white">State ID Info</h4>
      <div class="stateLicense">
        <div class="row">  
          <div class="col-md-6">
            <div class="form-group">
              <input v-model="patient.stateLicense.number" type="text" class="form-control" placeholder="State ID Number" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <input v-model="patient.stateLicense.state" type="text" class="form-control" placeholder="State" />
            </div>
          </div>
        </div>
        <div class="row">  
          <div class="col-md-6">
            <div class="form-group">
              <input v-model="patient.stateLicense.expiresAt" type="date" class="form-control" placeholder="State ID Expires at" />
            </div>
          </div>
          <div class="col-md-6">
            <div class="form-group">
              <input v-model="patient.stateLicense.imagePath" type="text" class="form-control" placeholder="State ID image URL" />
            </div>
        </div>
        </div>
      </div>
      <button type="submit" class="float-right btn btn-primary">Submit</button>
    </form>

    <button v-on:click="destroy" type="button" class="float-leftt btn btn-danger">Delete</button>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import EventBus from "@/event-bus"
import { Patient, MedicalRecommendation, StateLicense, UsaState } from "@/models"

export default Vue.extend({
    created() {
        EventBus.$on('patient_selected', (patientId: string) => {
            this.loadPatient(patientId)
        })
        this.fetchUsaStates()
    },
    data: function () {
        let patient = new Patient({
            medicalRecommendation: new MedicalRecommendation({ issuer: "WA" })
            stateLicense: new StateLicense({ state: "WA" })
        })
        
        return {
          patient,
          possibleStates: [] as UsaState[]
        }
    },
    methods: {
        async loadPatient(patientId: string) {
            let { data } = await Patient
                .includes(["medical_recommendation","state_license"])
                .find(patientId)
            console.log(data)
            if (data) this.patient = data
        },
        async fetchUsaStates() {
            this.possibleStates = (await UsaState.select({usa_states: ["usps_abbreviation"]}).all()).data
        },
        async submit() {
            const success = await this.patient.save({ with: ["medicalRecommendation","stateLicense"] })
            if (success) EventBus.$emit("patient_save", this.patient)
        },
        async destroy() {
            if(this.patient.id == undefined) return

            const success = await this.patient.destroy()
            if (success) EventBus.$emit("patient_save", this.patient)
        }
    }
})
</script>

<style scope lang="scss">
select {
  width: 15rem;
}
button.btn-danger { width: 20%; }
</style>
