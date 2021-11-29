<template functional>
  <ul class="Pagination">
    <li class="Pagination_item">
      <button
        class="Pagination_control"
        :disabled="props.currentPage === 1"
        @click="listeners.changePage(1)"
      >
        Начало
      </button>
    </li>
    <li class="Pagination_item">
      <button
        class="Pagination_control"
        :disabled="props.currentPage === 1"
        @click="listeners.changePage(props.currentPage - 1)"
      >
        Назад
      </button>
    </li>
    <li
      class="Pagination_item"
      v-for="number in $options.methods.shownPagesNumbers(props)"
      :key="number"
    >
      <button
        :class="['Pagination_control', { '-active': props.currentPage === number }]"
        :disabled="props.currentPage === number"
        @click="listeners.changePage(number)"
      >
        {{ number }}
      </button>
    </li>
    <li class="Pagination_item">
      <button
        class="Pagination_control"
        :disabled="props.currentPage === props.totalPages"
        @click="listeners.changePage(props.currentPage + 1)"
      >
        Вперед
      </button>
    </li>
    <li class="Pagination_item">
      <button
        class="Pagination_control"
        :disabled="props.currentPage === props.totalPages"
        @click="listeners.changePage(props.totalPages)"
      >
        Конец
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    totalPages: {
      type: Number,
      default: 0,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
  },
  methods: {
    shownPagesNumbers(props) {
      const { currentPage, totalPages } = props;

      if (currentPage <= 3) {
        if (totalPages < 5) {
          return Array(totalPages)
            .fill(null)
            .map((n, index) => index + 1);
        }

        return [1, 2, 3, 4, 5];
      }

      if (currentPage >= totalPages - 2) {
        return [-4, -3, -2, -1, 0].map((n) => totalPages + n);
      }

      return [-2, -1, 0, 1, 2].map((n) => currentPage + n);
    },
  },
};
</script>

<style lang="scss">
.Pagination {
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;

  &_item {
    & + & {
      margin-left: 5px;
    }
  }

  &_control {
    min-width: 38px;
    padding: 10px 8px;
    border-radius: 0;
    color: var(--color-darkgrey);
    border: 1px solid var(--color-grey);
    background-color: var(--color-white);
    text-align: center;
    cursor: pointer;
    font-family: inherit;
    transition: ease 200ms color, ease 200ms border-color;

    &:hover {
      border: 1px solid var(--color-accent);
      color: var(--color-accent);
    }

    &[disabled]:not(.-active) {
      opacity: 0.6;
      pointer-events: none;
      user-select: none;
    }

    &.-active {
      border: 1px solid var(--color-accent);
      background-color: var(--color-accent);
      color: var(--color-white);
      pointer-events: none;
    }
  }
}
</style>
