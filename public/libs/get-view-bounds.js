const mainWindow = require('../windows/main');

const getViewBounds = (contentSize, findInPage = false, height, width) => {
  const showSidebar = global.sidebar;
  const isFullScreen = mainWindow.get() && mainWindow.get().isFullScreen();
  const showTitleBar = process.platform === 'darwin' ? (global.titleBar && !isFullScreen) : true;
  const showNavigationBar = (process.platform === 'linux'
    && global.attachToMenubar
    && !global.sidebar) || global.navigationBar;

  const sidebarWidth = process.platform === 'darwin' ? 68 : 48;
  const titlebarHeight = process.platform === 'darwin' ? 22 : 32;
  const offsetTitlebar = showTitleBar ? titlebarHeight : 0;
  const x = showSidebar ? sidebarWidth : 0;
  const y = showNavigationBar ? 36 + offsetTitlebar : 0 + offsetTitlebar;

  if (findInPage) {
    const FIND_IN_PAGE_HEIGHT = 42;
    return {
      x,
      y: y + FIND_IN_PAGE_HEIGHT,
      height: height != null ? height : contentSize[1] - y - FIND_IN_PAGE_HEIGHT,
      width: width != null ? width : contentSize[0] - x,
    };
  }

  return {
    x,
    y,
    height: height != null ? height : contentSize[1] - y,
    width: width != null ? width : contentSize[0] - x,
  };
};

module.exports = getViewBounds;
