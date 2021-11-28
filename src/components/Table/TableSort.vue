<template functional>
  <div :class="['TableSort', `-${props.direction}`]"></div>
</template>

<script>
export default {
  name: 'TableSort',
  props: {
    direction: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.TableSort {
  display: flex;
  flex-direction: column;

  &::before,
  &::after {
    content: '▲';
    order: 1;
    font-size: 9px;
    opacity: 0.5;
    transition: ease opacity 200ms;
  }

  &::after {
    content: '▼';
  }

  &.-asc {
    &::after {
      opacity: 1;
    }
  }

  &.-desc {
    &::before {
      opacity: 1;
    }
  }
}
</style>
