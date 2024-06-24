<style>
table {
  @apply w-3/12 bg-white;
}
td {
  @apply py-4 px-6 border-b border-gray-200;
}
</style>

<template>
  <header class="flex items-center justify-center mb-5">
    <h2 v-if="data" class="text-3xl">{{ data.bookingByUuid.travel.name }}</h2>
  </header>
  <main class="flex flex-col justify-center items-center">
    <h3 class="text-2xl mb-5">Summary</h3>
    <table class="mb-5">
      <tr>
        <td>email</td>
        <td>
          {{ data?.bookingByUuid.client }}
        </td>
      </tr>
      <tr>
        <td>seats</td>
        <td v-if="data">
          {{ data.bookingByUuid.seats }}
        </td>
      </tr>
      <tr >
        <td>departure</td>
        <td>{{ data?.bookingByUuid.travel.startingDate.split("T")[0] }}</td>
      </tr>
      <tr>
        <td>return</td>
        <td>{{ data?.bookingByUuid.travel.endingDate.split("T")[0] }}</td>
      </tr>
    </table>
    <button
      v-if="
        !data?.bookingByUuid.expired && !paid && !data?.bookingByUuid.confirmed
      "
      class="bg-purple-500 rounded p-4 text-white"
      @click="handlePayment()"
    >
      Pay
      {{ ((data?.bookingByUuid.travel.price ?? 0) / 100) * (data?.bookingByUuid.seats ?? 0) }} €
    </button>
    <div v-if="paid || data?.bookingByUuid.confirmed">
      Pack your bag for your next adventure
    </div>
  </main>
</template>

<script setup lang="ts">
const route = useRoute();

interface Booking {
  bookingByUuid: {
    seats: number;
    confirmed: boolean;
    createdAt: Date;
    client: string;
    expired: boolean;
    travel: {
      name: string;
      price: number;
      startingDate: string;
      endingDate: string;
    };
  };
}
const { data } = useAsyncQuery<Booking>(gql`{
    bookingByUuid(uuid: "${route.params.uuid}") {
        seats,
        confirmed,
        createdAt,
        client,
        expired,
        travel {
            name,
            price,
            startingDate,
            endingDate
        }
    }
}`);

const paid = ref(false);

const { mutate: pay } = useMutation(gql`
  mutation ($uuid: String!) {
    bookingConfirmation(bookingConfirmationInput: { bookingUuid: $uuid }) {
      uuid
    }
  }
`);
const handlePayment = async () => {
  try {
    await pay({
      uuid: route.params.uuid,
    });

    paid.value = true;
  } catch (error) {
    console.log(error);
  }
};
</script>
