<template>
  <header class="flex justify-center flex-col items-center">
    <h1 class="text-3xl">{{ data?.travelBySlug.name }}</h1>
    <span>
      {{ data?.travelBySlug.startingDate.split("T")[0] }} /
      {{ data?.travelBySlug.endingDate.split("T")[0] }}
    </span>
    <span> {{ data?.travelBySlug.price / 100 }} € </span>
  </header>
  <section class="flex justify-center items-center my-4">
    <div class="border-green-500 border-4 rounded-full mx-3 p-2">
      nature: {{ data?.travelBySlug.moods?.nature }}
    </div>
    <div class="border-yellow-500 border-4 rounded-full mx-3 p-2">
      party: {{ data?.travelBySlug.moods.party }}
    </div>
    <div class="border-orange-500 border-4 rounded-full mx-3 p-2">
      history: {{ data?.travelBySlug.moods.history }}
    </div>
    <div class="border-blue-500 border-4 rounded-full mx-3 p-2">
      culture: {{ data?.travelBySlug.moods.culture }}
    </div>
    <div class="border-pink-500 border-4 rounded-full mx-3 p-2">
      relax: {{ data?.travelBySlug.moods.relax }}
    </div>
  </section>
  <section class="p-20 whitespace-line">
    {{ data?.travelBySlug.description }}
  </section>
  <section class="flex justify-center">
    <div
      v-if="data?.travelBySlug.availableSeats == 0"
      class="flex flex-col items-center justify-center bg-gray-200 rounded md:w-3/12 p-10 text-2xl text-red-600"
    >
      This adventure is full
    </div>
    <form
      v-if="data?.travelBySlug.availableSeats > 0"
      action="#"
      class="flex flex-col items-center justify-center bg-gray-200 rounded md:w-3/12 p-10"
      @submit="handleReservation($event)"
    >
      <h3 class="text-2xl underline mb-4">Book your spot now</h3>
      <div class="flex flex-col items-center justify-center">
        <label for="email">email</label>
        <input
          type="email"
          placeholder=""
          v-model="email"
          class="p-2 border-b-2 border-b-purple-500 focus:outline-purple-500 bg-transparent w-full"
        />
      </div>
      <div class="my-4 flex flex-col items-center justify-center">
        <label for="seats">Number of seats</label>
        <select
          name="seats"
          id="seats"
          v-model="seats"
          class="p-2 border-b-2 border-b-purple-500 focus:outline-purple-500 w-full"
        >
          <option
            v-for="seat in new Array(data?.travelBySlug.availableSeats)
              .fill(1)
              .map((_, idx) => idx + 1)"
            :value="seat"
          >
            {{ seat }}
          </option>
        </select>
      </div>
      <input
        type="submit"
        value="book and pay"
        class="bg-purple-500 p-3 rounded text-white mt-4"
      />
    </form>
  </section>
</template>

<script lang="ts" setup>
const route = useRoute();

interface TravelBySlug {
  uuid: string;
  name: string;
  description: string;
  price: number;
  availableSeats: number;
  endingDate: Date;
  startingDate: Date;
  moods: {
    relax: number;
    party: number;
    history: number;
    culture: number;
    nature: number;
  };
}

const { data } = await useAsyncQuery<{
  travelBySlug: TravelBySlug;
}>(
  gql`{
    travelBySlug(slug: "${route.params.slug}") {
        uuid,
        name,
        description,
        price,
        availableSeats,
        endingDate,
        startingDate,
        moods {
            relax,
            party,
            nature,
            history,
            culture
        }
    }
  }`,
);

const { mutate: createReservation } = useMutation(gql`
  mutation ($email: String!, $seats: Int!, $travelUuid: String!) {
    bookingReservation(
      bookingReservationInput: {
        email: $email
        seats: $seats
        travelUuid: $travelUuid
      }
    ) {
      uuid
    }
  }
`);

const email = ref("");
const seats = ref(1);

const handleReservation = async (event: Event) => {
  event.preventDefault();
  console.log("reservation", { email, seats: seats.value, data });

  try {
    const bookingResponse = await createReservation({
      email: email.value,
      seats: seats.value,
      travelUuid: data.value?.travelBySlug.uuid,
    });

    window.location.href = `/payment/${bookingResponse?.data.bookingReservation.uuid}`;
  } catch (error) {
    console.error(error);
  }
};
</script>
