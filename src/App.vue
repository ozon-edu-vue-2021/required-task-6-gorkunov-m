<template>
  <div class="App" id="app">
    <div class="App_header">
      <div class="App_control">
        <Select :options="tableModesSelect" :selected="tableMode" @change="setTableMode" />
      </div>
      <div class="App_control">
        <Checkbox v-model="tableVirtualScroll" :label="'Virtual scroll'" />
      </div>
    </div>
    <div class="App_body">
      <Table
        :columns="columns"
        :dataHandler="tableDataHandler"
        :mode="tableMode"
        :perPage="50"
        :perPageSelect="perPageSelect"
        :virtualScroll="tableVirtualScroll"
      >
        <template #name="{ prop: { first, last } }">
          <span class="bold">{{ first }} {{ last }}</span>
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import { tableDataHandler, Table } from '@/components/Table';
import { default as Checkbox } from '@/components/Checkbox.vue';
import { default as Select } from '@/components/Select.vue';

export default {
  name: 'App',
  components: {
    Checkbox,
    Select,
    Table,
  },
  data() {
    return {
      columns: [
        {
          title: 'Имя',
          key: 'name',
          property: 'name',
          width: 28,
          sortable: true,
          sortKey: 'first',
          withFilter: true,
          filterKey: 'first',
        },
        {
          title: 'Пол',
          key: 'gender',
          property: 'gender',
          width: 14,
          sortable: true,
          withFilter: true,
        },
        {
          title: 'Email',
          key: 'email',
          property: 'email',
          sortable: true,
          withFilter: true,
        },
        {
          title: 'Телефон',
          key: 'phone',
          property: 'phone',
          width: 24,
        },
      ],
      perPageSelect: [
        { value: 10, text: 10 },
        { value: 50, text: 50 },
        { value: 100, text: 100 },
        { value: 200, text: 200 },
        { value: 500, text: 500 },
      ],
      tableDataHandler,
      tableMode: 'mixed',
      tableModesSelect: [
        { value: 'mixed', text: 'Mixed mode' },
        { value: 'pagination', text: 'Pagination mode' },
        { value: 'infinityScroll', text: 'Infinity scroll mode' },
      ],
      tableVirtualScroll: true,
    };
  },
  methods: {
    setTableMode(mode) {
      this.tableMode = mode;
    },
  },
};
</script>

<style lang="scss">
.App {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1020px;
  max-height: 100vh;
  margin: 0 auto;
  padding: 20px 0;

  &_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &_control {
    display: flex;
    align-items: center;

    & + & {
      margin-left: 10px;
    }
  }

  &_body {
    display: flex;
    flex-grow: 1;
    min-height: 0;
    margin-top: 20px;
  }
}
</style>
