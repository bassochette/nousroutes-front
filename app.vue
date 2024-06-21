<template>
  <h1 class="text-3xl font-bold underline">
    {{JSON.stringify(data)}}
  </h1>
</template>

<script setup lang="ts">
import allTravelQuery from './travel/query/all-travel.gql'

const { data } = useAsyncQuery(allTravelQuery)

</script>
