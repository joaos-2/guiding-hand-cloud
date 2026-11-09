import client from 'prom-client';

export const register = new client.Registry();

client.collectDefaultMetrics({ register, prefix: 'app_' });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duracao das requisicoes HTTP em segundos',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
});

export const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisicoes HTTP',
  labelNames: ['method', 'route', 'status_code']
});

register.registerMetric(httpRequestDuration);
register.registerMetric(httpRequestsTotal);

export function metricsMiddleware(req, res, next) {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    const route = req.route?.path || req.baseUrl || req.path || 'unknown';
    const labels = {
      method: req.method,
      route,
      status_code: String(res.statusCode)
    };
    end(labels);
    httpRequestsTotal.inc(labels);
  });
  next();
}
