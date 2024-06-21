<template>
  <header
    class="flex justify-center align-middle py-20 bg-[url('/img/hero-bg.jpg')] bg-center"
  >
    <h1 class="text-4xl text-white bg-purple-500 p-10">
      What's your next adventure?
    </h1>
  </header>
  <main class="p-3 bg-blue-100 h-full">
    <div
      v-for="travel in data.travel"
      :key="travel.slug"
      class="flex justify-between p-4 border-purple-500 items-center rounded border-2 my-2 bg-purple-50 font-bold"
    >
      <div class="flex items-center">
        <span class="text-2xl text-stone-700 text-center">
          {{ travel.name }}
        </span>
        <span class="text-purple-400 ml-3">
          from {{ travel.startingDate.split("T")[0] }} to
          {{ travel.endingDate.split("T")[0] }}
        </span>
      </div>
      <div>
        <span class="mr-3">{{ travel.availableSeats }} seats left</span>
        <NuxtLink
          class="bg-amber-300 font-bold rounded p-4"
          :to="{ name: 'travel-slug', params: { slug: travel.slug } }"
        >
          Book for {{ travel.price / 100 }}€
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import allTravelQuery from "../travel/query/all-travel.gql";

const { data } = await useAsyncQuery<{
  travel: {
    name: string;
    slug: string;
    description: string;
    availableSeats: number;
    price: number;
  }[];
}>(allTravelQuery);
console.log(data.value);
</script>
