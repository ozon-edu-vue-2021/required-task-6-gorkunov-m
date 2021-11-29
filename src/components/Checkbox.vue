<template functional>
  <label class="Checkbox">
    <input
      class="Checkbox_field"
      type="checkbox"
      :checked="props.value"
      @input="listeners.input(!props.value)"
    />
    <span class="Checkbox_label">{{ props.label }}</span>
  </label>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    value: {
      type: [Boolean, Number],
    },
    label: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
.Checkbox {
  display: flex;
  align-items: center;

  &_field {
  }

  &_label {
    margin-left: 5px;
  }
}
</style>
