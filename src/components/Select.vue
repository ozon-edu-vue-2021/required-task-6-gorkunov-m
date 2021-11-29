<template functional>
  <select class="Select" :value="props.selected" @change="listeners.change($event.target.value)">
    <option v-for="option in props.options" :value="option.value" :key="option.value">
      {{ option.text }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'Select',
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: [Number, String, Boolean],
    },
  },
};
</script>

<style lang="scss">
.Select {
  padding: 9px 10px;
  color: var(--color-darkgrey);
  border: 1px solid var(--color-grey);
  background-color: var(--color-white);
  font-family: inherit;
  cursor: pointer;
  transition: ease 200ms border-color;

  &:hover {
    border: 1px solid var(--color-accent);
  }
}
</style>
