import {
  WXResource,
  InvoiceCreateResource
} from './resources';

const baseData = {

}

export const applyMallTicket = (data = {}) => {
  return Object.assign({}, baseData, { _ENV_: {}}, data);
}

export default {
  initWXConfig: function(data) {
    return WXResource.save({action: 'config'}, applyMallTicket(data));
  },
  getInvoiceMonths: function(data) {
    return InvoiceCreateResource.save({ action: 'queryGroup' }, applyMallTicket(data));
  },
  getInvoiceOrderDetail: function(data) {
    return InvoiceCreateResource.save({ action: 'queryDetail' }, applyMallTicket(data));
  },
  generateInvoiceApplication: function(data) {
    return InvoiceCreateResource.save({ action: 'save' }, applyMallTicket(data));
  },
  fetchServiceLineConfig: function(data) {
    return WXResource.save({ action: 'getServiceLineConfig'}, applyMallTicket(data));
  },
};
