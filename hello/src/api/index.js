let { FeedbackResource, NewGoodResource } = bapp.resources;
let { applyMallTicket } = bapp.util;

export default {
  getFeedbackType: function() {
    return FeedbackResource.save({ action: 'getclasslist' }, applyMallTicket({}));
  },
  createFeedback: function(data) {
    return FeedbackResource.save({ action: 'createfeedback' }, applyMallTicket(data));
  },
  getFeedList: function(data) {
    return FeedbackResource.save({ action: 'getfeedbacklist' }, applyMallTicket(data));
  },
  getFeedReport: function(data) {
    return FeedbackResource.save({ action: 'getfeedbackresultbyid' }, applyMallTicket(data));
  },
  getNewGoodReqList: function(data) {
    return NewGoodResource.save({ action: 'list' }, applyMallTicket(data));
  },
  getNewGoodReqDetail: function(data) {
    return NewGoodResource.save({ action: 'detail' }, applyMallTicket(data));
  },
  createNewGoodReq: function(data) {
    return NewGoodResource.save({ action: 'create' }, applyMallTicket(data));
  },
  getNewGoodReqSaleClass: function(data) {
    return NewGoodResource.save({ action: 'saleclass' }, applyMallTicket(data));
  }
};
