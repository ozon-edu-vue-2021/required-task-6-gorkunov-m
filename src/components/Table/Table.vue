<template>
  <div :class="['Table', { '-loading': loading }]">
    <div class="Table_header" :style="headerStyle">
      <div
        class="Table_column"
        v-for="column in columns"
        :style="getColumnStyle(column)"
        :key="column.key"
      >
        <div
          :class="['Table_heading', getHeadingClasses(column)]"
          :tabindex="column.sortable ? 0 : null"
          @click="onSort(column)"
          @keydown.space.enter="onSort(column)"
        >
          <div class="Table_title">{{ column.title }}</div>
          <div class="Table_sort" v-if="column.sortable">
            <TableSort :direction="getSortDirection(column)" />
          </div>
        </div>
        <div class="Table_filter" v-if="column.withFilter">
          <TableFilter @filter="onFilter({ column, value: $event })" />
        </div>
      </div>
    </div>
    <div class="Table_body">
      <template v-if="data.length">
        <template v-if="virtualScroll">
          <DynamicScroller
            :items="data"
            :min-item-size="42"
            :emitUpdate="true"
            ref="scroller"
            @update="onScroll"
            @visible="onScrollerReady"
          >
            <template v-slot="{ item, active }">
              <DynamicScrollerItem class="Table_row" :item="item" :active="active">
                <div
                  class="Table_column"
                  v-for="column in columns"
                  :style="getColumnStyle(column)"
                  :key="column.key"
                >
                  <slot :name="column.key" :prop="item[column.property]">
                    {{ item[column.property] }}
                  </slot>
                </div>
              </DynamicScrollerItem>
            </template>
            <template #after>
              <div
                v-if="(isMixedMode || isInfinityScrollMode) && silentLoading"
                class="Table_preloader"
              >
                Загрузка...
              </div>
            </template>
          </DynamicScroller>
        </template>
        <template v-else>
          <div class="Table_row" v-for="item in data" :key="item.id">
            <div
              class="Table_column"
              v-for="column in columns"
              :style="getColumnStyle(column)"
              :key="column.key"
            >
              <slot :name="column.key" :prop="item[column.property]">
                {{ item[column.property] }}
              </slot>
            </div>
          </div>
        </template>
      </template>
      <template v-else>
        <div class="Table_empty">
          {{ loading ? 'Загрузка...' : 'Ничего не найдено' }}
        </div>
      </template>
    </div>
    <div class="Table_footer" v-if="data.length && (isMixedMode || isPaginationMode)">
      <div class="Table_select" v-if="isPaginationMode && perPageSelect">
        <Select :options="perPageSelect" :selected="pagination.perPage" @change="onPerPageChange" />
      </div>
      <div class="Table_pagination" v-if="(isMixedMode || isPaginationMode) && pagination">
        <Pagination
          :totalPages="pagination.totalPages"
          :currentPage="pagination.currentPage"
          @changePage="onPageChange"
        ></Pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils/debounce';
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';

import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import Pagination from '@/components/Pagination.vue';
import Select from '@/components/Select.vue';
import TableFilter from '@/components/Table/TableFilter.vue';
import TableSort from '@/components/Table/TableSort.vue';

export default {
  name: 'Table',
  components: {
    Pagination,
    Select,
    TableFilter,
    TableSort,
    DynamicScroller,
    DynamicScrollerItem,
  },
  props: {
    mode: {
      type: String,
      default: 'mixed',
    },
    columns: {
      type: Array,
      default: () => [],
    },
    dataHandler: {
      type: Function,
      required: true,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    perPage: {
      type: Number,
      default: 50,
    },
    perPageSelect: {
      type: Array,
      default: () => [],
    },
    virtualScroll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      data: [],
      filter: new Map(),
      scrollbarWidth: 0,
      loading: false,
      pagination: {
        currentPage: this.currentPage,
        perPage: this.perPage,
        totalItems: null,
        totalPages: null,
      },
      silentLoading: false,
      sort: new Map(),
    };
  },
  computed: {
    isPaginationMode() {
      return this.mode === 'pagination';
    },
    isInfinityScrollMode() {
      return this.mode === 'infinityScroll';
    },
    isMixedMode() {
      return this.mode === 'mixed';
    },
    headerStyle() {
      return {
        paddingRight: `${this.scrollbarWidth}px`,
      };
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData({
      currentPage = this.pagination.currentPage,
      perPage = this.pagination.perPage,
    } = {}) {
      if (!this.silentLoading) {
        this.loading = true;
      }

      try {
        const { data, pagination } = await this.dataHandler({
          sort: this.sort,
          filter: this.filter,
          currentPage,
          perPage,
        });

        this.data = data;
        this.pagination = pagination;

        if (this.$refs.scroller && !this.silentLoading) {
          this.$refs.scroller.$el.scrollTop = 0;
        }

        this.setScrollbarWidth();
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    onPerPageChange(perPage) {
      this.fetchData({
        perPage,
        currentPage: 1,
      });
    },
    onPageChange(currentPage) {
      this.fetchData({
        currentPage,
      });
    },
    onSort(column) {
      if (!column.sortable) {
        return;
      }

      const property = this.getPropertyWithKey(column.property, column.sortKey);

      if (this.sort.has(property)) {
        if (this.sort.get(property) === 'asc') {
          this.sort.set(property, 'desc');
        } else {
          this.sort.delete(property);
        }
      } else {
        this.sort.set(property, 'asc');
      }

      this.fetchData({
        currentPage: 1,
      });
    },
    onFilter: debounce(function ({ column, value }) {
      if (!column.withFilter) {
        return;
      }

      const property = `${this.getPropertyWithKey(column.property, column.filterKey)}_like`;

      if (this.filter.get(property) && !value) {
        this.filter.delete(property);
      }

      if (value) {
        this.filter.set(property, value);
      }

      this.fetchData({
        currentPage: 1,
      });
    }, 200),
    onScroll: debounce(function (startIndex, endIndex) {
      const { perPage, totalItems } = this.pagination;
      const isAvailableMode = this.isMixedMode || this.isInfinityScrollMode;

      if (endIndex >= perPage && perPage !== totalItems && isAvailableMode) {
        this.silentLoading = true;
        this.fetchData({
          perPage: perPage + 50,
          silent: true,
        }).finally(() => {
          this.silentLoading = false;
        });
      }
    }, 400),
    onScrollerReady() {
      this.setScrollbarWidth();
    },
    getSortDirection(column) {
      const property = this.getPropertyWithKey(column.property, column.sortKey);

      if (this.sort.has(property)) {
        return this.sort.get(property) === 'asc' ? 'asc' : 'desc';
      }

      return '';
    },
    getPropertyWithKey(property, key) {
      return key ? `${property}.${key}` : property;
    },
    getHeadingClasses(column) {
      return {
        [`-sortable`]: column.sortable,
        [`-filter`]: column.withFilter,
      };
    },
    getColumnStyle(column) {
      return { 'max-width': column.width ? `${column.width}%` : null };
    },
    setScrollbarWidth() {
      this.$nextTick().then(() => {
        const scrollerEl = this.$refs.scroller?.$el;

        if (scrollerEl) {
          const hasScrollBar = scrollerEl.scrollHeight > scrollerEl.clientHeight;
          const scrollbarWidth = hasScrollBar ? scrollerEl.offsetWidth - scrollerEl.clientWidth : 0;

          this.scrollbarWidth = scrollbarWidth;
        }
      });
    },
  },
};
</script>

<style src="./Table.scss" lang="scss"></style>
