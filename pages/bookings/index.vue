<template>
  <header class="flex justify-center items-center">
    <h1 class="text-3xl">Find my bookings</h1>
  </header>
  <main>
    <section class="flex justify-center mt-4 mb-10">
      <form action="#" @submit="searchBookings">
        <input
          type="email"
          class="p-4 rounded mr-2 outline-purple-500"
          v-model="email"
          placeholder="email"
        />
        <input type="submit" class="primaryButton" value="find my bookings" />
      </form>
    </section>
    <section v-if="loading" class="flex justify-center mt-4 spin">
      <div role="status">
        <svg
          aria-hidden="true"
          class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </section>
    <section v-if="error" class="text-red-600 flex justify-center">
      {{ error }}
    </section>
    <section>
      <div
        v-for="booking in bookings"
        class="mx-40 py-5 grid grid-cols-3 items-center border-b-2 border-b-purple-500"
      >
        <div class="text-2xl">
          {{ booking.travel.name }}
        </div>
        <div class="text-purple-400 text-center">
          from {{ booking.travel.startingDate.split("T")[0] }} to
          {{ booking.travel.endingDate.split("T")[0] }}
        </div>
        <a
          v-if="!booking.confirmed"
          class="primaryButton text-center"
          :href="`/payment/${booking.uuid}`"
        >
          Pay {{ (booking.seats * booking.travel.price) / 100 }}€
        </a>
        <a
          v-if="booking.confirmed"
          class="bg-green-500 rounded p-4 text-white text-center"
          :href="`/payment/${booking.uuid}`"
        >
          {{ booking.seats }} seats confirmed
        </a>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
interface Bookings {
  travel: {
    name: string;
    startingDate: string;
    endingDate: string;
    price: number;
  };
  seats: number;
  confirmed: boolean;
  uuid: string;
}

interface BookingsByEmail {
  bookingsByEmail: Bookings[];
}

const email = ref("");
const bookings = ref<Bookings[]>([]);
const loading = ref(false);
const error = ref("");

const searchBookingsQuery = gql`
  query findByMail($email: String!) {
    bookingsByEmail(email: $email) {
      travel {
        name
        startingDate
        endingDate
        price
      }
      confirmed
      seats
      uuid
    }
  }
`;
const searchBookings = async (event: Event) => {
  event.preventDefault();

  if (!email) return;
  loading.value = true;
  const response = useQuery<BookingsByEmail>(searchBookingsQuery, {
    email: email.value,
  });

  response.onResult((result) => {
    loading.value = false;
    bookings.value = result.data.bookingsByEmail;
    error.value = "";
  });

  response.onError((e) => {
    loading.value = false;
    error.value = e.message;
  });
};
</script>
