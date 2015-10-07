const getDisplayName = Component => (
  Component.displayName || Component.name || 'Component'
);

export default getDisplayName;
