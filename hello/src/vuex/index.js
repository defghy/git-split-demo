import feedback from './modules/feedback';

const debug = process.env.NODE_ENV !== 'production';

export default {
  modules: {
    feedback
  },
  strict: debug,
  namespaced: true
};
