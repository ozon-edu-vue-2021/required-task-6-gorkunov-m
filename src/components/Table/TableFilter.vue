<template>
  <div
    :class="['TableFilter', { '-active': value }]"
    v-click-outside="hideField"
    @keydown.esc="hideField"
  >
    <button class="TableFilter_button" @click="toggleField"></button>
    <div class="TableFilter_field" v-if="fieldVisible">
      <input class="TableFilter_input" v-model.trim="value" ref="input" @input="filter" />
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside';

export default {
  name: 'TableFilter',
  data() {
    return {
      value: '',
      fieldVisible: false,
    };
  },
  directives: {
    ClickOutside,
  },
  methods: {
    toggleField() {
      this.fieldVisible = !this.fieldVisible;

      if (this.fieldVisible) {
        this.setFocus();
      }
    },
    hideField() {
      this.fieldVisible = false;
    },
    filter() {
      this.$emit('filter', this.value);
    },
    setFocus() {
      this.$nextTick().then(() => {
        this.$refs.input.focus();
      });
    },
  },
};
</script>

<style lang="scss">
.TableFilter {
  $this: &;

  width: 100%;
  height: 100%;

  &.-active {
    #{$this}_button {
      &::after {
        opacity: 1;
      }
    }
  }

  &:focus-within {
    #{$this}_button {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }

  & {
    #{$this}_button {
      &:focus,
      &:hover {
        background-color: rgba(0, 0, 0, 0.25);
      }

      &:active {
        background-color: rgba(0, 0, 0, 0.35);
      }
    }
  }

  &_button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    border: none;
    background-color: transparent;
    cursor: pointer;
    outline: none;
    transition: ease background-color 200ms;

    &::after {
      content: '';
      display: block;
      width: 18px;
      height: 18px;
      background-image: url(/icons/filter.svg);
      background-repeat: no-repeat;
      background-position: 50% 50%;
      background-size: contain;
      opacity: 0.35;
      transition: ease opacity 200ms;
    }
  }

  &_field {
    display: flex;
    width: auto;
    height: 100%;
    padding: 12px;
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #333;
  }

  &_input {
    padding: 5px 8px;
    border: none;
    background-color: var(--color-white);
    outline: none;
  }
}
</style>
