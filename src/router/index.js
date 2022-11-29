import Vue from 'vue';
import Router from 'vue-router';
import Base from '@/components/Base';
import Chat from '@/components/Chat';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Base',
      component: Base,
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat,
    },
  ],
  /**
   * Smooth scrolling to element
   */
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      const headerHeight = window.innerWidth <= 768 ? 74 : 94;
      return {
        selector: to.hash,
        behavior: 'smooth',
        offset: { x: 0, y: headerHeight },
      };
    }
    return { x: 0, y: 0 };
  },
});
