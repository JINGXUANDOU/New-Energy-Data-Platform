import request from '@/http/request';

export function getLogs(params) {
  return request.windGet('/apis/v1/log/query-for-page', params)
}

export function getLogTypes(params) {
  return request.windGet('/apis/v1/log/get-log-type', params)
}
