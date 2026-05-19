//dlab api examples
export default defineEventHandler((event) => {
  const config = useRuntimeConfig();

  const target = new URL(config.dlabApi + config.uriToken);

  return proxyRequest(event, target.toString(), {
    headers: {
      host: target.host,
      origin: target.origin,
    },
  });
});
