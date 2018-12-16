<template>
<div class="card search">
  <table class="table">
    <thead>
      <tr>
        <th><a @click="doSort('username')">Username</a></th>
        <th><a @click="doSort('email')">Email</a></th>
        <th><a @click="doSort('date_of_birth')">Birthday</a></th>
        <th><a @click="doSort('medical_recommendations_expired')">Medical Recommendation expired?</a></th>
        <th><a @click="doSort('state_licenses_expired')">State ID expired?</a></th>
      </tr>
    </thead>
    
    <tbody>
      <tr v-for="patient in patients" :key="patient.id">
        <td>
          <a @click="selectPatient(patient)">
            {{ patient.username }}
          </a>
        </td>
        <td>{{ patient.email }}</td>
        <td>{{ patient.dateOfBirth }}</td>
        <td>{{ patient.medicalRecommendation.expired }}</td>
        <td>{{ patient.stateLicense.expired }}</td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script lang="ts">
import Vue from "vue"
import EventBus from "@/event-bus"
import { Scope, SortScope } from "jsorm" 
import { Patient } from "@/models"

export default Vue.extend({
    data() {
        let sort : SortScope = {
            created_at: 'desc'
        }
        return {
            patients: [] as Patient[],
            sort
        }
    },
    created() {
        EventBus.$on('patient_save', (patient: Patient) => {
            this.search()
        })
        this.search()
    },
    computed: {
        scope(): Scope<typeof Patient> {
            return Patient
                .order(this.sort)
                .includes({ medical_recommendation: "", state_license: "" })
        }
    },
    methods: {
        async search() {
            this.patients = (await this.scope.all()).data
        },
        doSort(attribute: string) {
            if (this.sort[attribute] && this.sort[attribute] === "desc") {
                this.sort = {[attribute]: "asc"}
            } else {
                this.sort = {[attribute]: "desc"}
            }
            this.search()
        },
        selectPatient(patient: Patient): void {
            EventBus.$emit('patient_selected', patient.id)
        },
    }
})
</script>


<style lang="scss" scoped>
.meta {
  margin-top: 0.5rem;
}
.total {
  color: white;
}
.pagination {
  margin-left: 1rem;
  a {
    color: #90CAF9 !important;
    &:hover {
      color: lighten(#90CAF9, 10%) !important;
    }
    &:nth-child(2) {
      margin-left: 0.5rem;
    }
  }
}
</style>
