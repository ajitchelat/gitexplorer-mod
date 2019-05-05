const options = [
  { value: 'xaxd', label: 'XenApp and XenDesktop' },
  { value: 'cvad', label: 'Citrix Virtual Apps and Desktops' }
];

export const primaryOptions = options.sort((x, y) => {
  if (x.value < y.value) {
    return -1;
  }
  if (x.value > y.value) {
    return 1;
  }
  return 0;
});
