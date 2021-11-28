const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('server/db.json');
const middlewares = jsonServer.defaults();

const getParams = (url) => {
  return url.includes('?') ? new URLSearchParams(url.split('?').pop()) : new Map();
};

const getTotalPages = (totalItems, limit) => {
  return Math.ceil(limit ? totalItems / limit : totalItems);
};

server.use(middlewares);
server.use(jsonServer.bodyParser);

router.render = (req, res) => {
  const params = getParams(req.originalUrl);
  const results = res.locals.data;
  const limit = Number(params.get('_limit'));
  const currentPage = Number(params.get('_page')) || 1;
  const totalItems = Number(`${res.getHeader('X-Total-Count')}`);
  const totalPages = getTotalPages(totalItems, limit);

  res.jsonp({
    results,
    pagination: {
      currentPage,
      totalItems,
      totalPages,
    },
  });
};

server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running');
});
