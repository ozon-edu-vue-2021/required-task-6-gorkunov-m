export const tableDataHandler = async ({ currentPage, perPage, sort, filter }) => {
  const params = new URLSearchParams({
    _page: currentPage,
    _limit: perPage,
    _sort: [...sort.keys()].join(','),
    _order: [...sort.values()].join(','),
    ...Object.fromEntries(filter),
  });

  const response = await fetch(`http://localhost:3000/users?${params}`);

  const {
    results,
    pagination: { totalPages, totalItems },
  } = await response.json();

  return {
    data: results,
    pagination: {
      currentPage,
      totalPages,
      totalItems,
      perPage,
    },
  };
};
